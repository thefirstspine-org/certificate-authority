import * as crypto from 'crypto';

/**
 * Global service to validate incoming requests.
 * This service will use the environment variable `PRIVATE_KEY` to fetch the private key.
 */
export class ValidatorService {

  /**
   * Challenge the certificate against the private key.
   * @param certificate The decoded certificate provided by the request
   * @param privateKey The private key - if not provided, uses the process.env.PRIVATE_KEY value
   */
  challenge(certificate: string, privateKey: string | undefined = undefined): boolean {
    // Checking if the private key is set
    const privateKeyInput = privateKey != undefined ? privateKey : process.env.PRIVATE_KEY;
    if (typeof privateKeyInput !== 'string') {
      console.log('Invalid private key provided. Please ensure the "PRIVATE_KEY" environment variable or the private key argument is a string.');
      return false;
    }

    // Here we ensure that we do not have any escaped '\n' character left
    const publicKeyStr: string = this.sanatize(certificate);
    const privateKeyStr: string = this.sanatize(privateKeyInput);

    try {
      // Create the challenge
      const challenge: string = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(10);

      // Encrypt / decrypt the challenge
      const encryptedBuffer: Buffer = crypto.publicEncrypt(publicKeyStr, Buffer.from(challenge));
      const decryptedBuffer: Buffer = crypto.privateDecrypt(privateKeyStr, encryptedBuffer);

      // Return challenge result
      return decryptedBuffer.toString() === challenge;
    } catch (exception) {}

    return false;
  }

  private sanatize(input: string): string {
    return input.replace(/\\n/gm, '\n');
  }

}

export default new ValidatorService();
