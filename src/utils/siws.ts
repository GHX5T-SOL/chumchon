import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";

export function verifySIWS(
  input: SolanaSignInInput,
  output: SolanaSignInOutput
): boolean {
  const accountFixed = {
    ...output.account,
    publicKey: new Uint8Array(output.account.publicKey),
  };
  const serialisedOutput: SolanaSignInOutput = {
    account: accountFixed as any,
    signature: new Uint8Array(output.signature),
    signedMessage: new Uint8Array(output.signedMessage),
  };
  return verifySignIn(input, serialisedOutput);
}

export const SIWS_PAYLOAD = {
  domain: 'chumchon.app',
  statement: 'Sign into Chumchon - Decentralized Social App',
  uri: 'https://chumchon.app',
}; 