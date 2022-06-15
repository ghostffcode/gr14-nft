//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

error alreadyInitialized();
error alreadyClaimed();
error invalidClaim();

contract GR14 is ERC721, Ownable {
    bytes32 public merkleRoot;
    bool public initialized = false;
    uint256 totalClaimed;
    string uri;

    mapping(address => bool) public claimed;

    constructor() ERC721("GR14 Donors", "GR14") {}

    function initialize(bytes32 _merkleRoot, string memory _uri)
        public
        onlyOwner
        returns (bool)
    {
        if (initialized) {
            revert alreadyInitialized();
        }
        initialized = true;
        merkleRoot = _merkleRoot;
        uri = _uri;

        return true;
    }

    function claim(bytes32[] calldata merkleProof) public returns (uint256) {
        if (claimed[msg.sender]) {
            revert alreadyClaimed();
        }

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        if (!MerkleProof.verify(merkleProof, merkleRoot, leaf)) {
            revert invalidClaim();
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
