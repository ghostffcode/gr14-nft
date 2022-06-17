//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

error notInitialized();
error alreadyInitialized();
error alreadyClaimed();
error invalidSignature();

contract GR14 is ERC721, Ownable, EIP712 {
    address public approvedSigner;
    uint256 public totalClaimed;
    string public uri;

    mapping(address => bool) public claimed;

    constructor() ERC721("GR14 Donors", "GR14") EIP712("GR14 NFT", "1.0.0") {}

    function initialize(string memory _uri, address _approvedSigner)
        public
        onlyOwner
        returns (bool)
    {
        if (approvedSigner != address(0)) {
            revert alreadyInitialized();
        }
        approvedSigner = _approvedSigner;
        uri = _uri;

        return true;
    }

    function claim(bytes memory signature) public returns (uint256) {
        if (approvedSigner == address(0)) {
            revert notInitialized();
        }

        if (claimed[msg.sender]) {
            revert alreadyClaimed();
        }

        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(keccak256("Donor(address donor)"), msg.sender))
        );
        address signer = ECDSA.recover(digest, signature);

        if (signer != approvedSigner) {
            revert invalidSignature();
        }

        claimed[msg.sender] = true;

        totalClaimed += 1;

        _mint(msg.sender, totalClaimed);

        return totalClaimed;
    }

    function hasClaimed(address user) public view returns (bool) {
        return claimed[user];
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return uri;
    }

    // to support receiving ETH by default
    receive() external payable {}

    fallback() external payable {}
}
