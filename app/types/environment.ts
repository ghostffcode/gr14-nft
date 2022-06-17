declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_BLOCKNATIVE_DAPPID: string
      CHAINID: string
      CHAINNAME: string
      SIGNER: string
    }
  }
}

export {}
