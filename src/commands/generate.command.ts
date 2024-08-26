import * as crypto from 'crypto';
import * as fs from 'fs';
import validatorService from './../service/validator.service';

/**
 * Command bootstrap.
 * Generates files to be validated in the services.
 */
export class GenerateCommand {
  constructor() {}

  /**
   * Bootstrap the command.
   * @param args The arguments of the command
   */
  async start(args: IGenerateCommandArgs | (IGenerateCommandArgs & IGenerateCommandPairsArgs)) {
    console.log(`Certification generation toolkit`);

    // Validating mode
    const modesMap = {
      'pair': this.generatePairMode.bind(this),
    };
    if (!modesMap[args.mode]) {
      console.log(`Unhandled mode "${args.mode}"`);
      process.exit(1);
    }

    modesMap[args.mode](args);
  }

  /**
   * Call for a "pair" generation mode.
   * @param args
   */
  private async generatePairMode(args: IGenerateCommandPairsArgs) {
    // Getting args
    const key: string|undefined = args.key;
    const certificate: string|undefined = args.certificate;

    // Validate args
    if (key == undefined) {
      console.log('"[k]ey" is required.');
      process.exit(1);
    }
    if (certificate == undefined) {
      console.log('"[c]ertificate" is required.');
      process.exit(1);
    }

    // Generating pair
    console.log('Generating pair...');
    const result = this.generatePair();

    // Validate pairs
    console.log('Passing challenge...');
    if(!validatorService.challenge(result.certificate, result.privateKey)) {
      console.log(`Pair doesn't pass the challenge.`);
      return;
    }
    
    // Write the ertificates
    fs.writeFileSync(key, result.privateKey);
    console.log(`Generated key in ${key}`);
    fs.writeFileSync(certificate, result.certificate);
    console.log(`Generated certificate in ${certificate}`);

    // ..and we're done!
    console.log(`done.`);
    process.exit();
  }

  /**
   * Generates a pair with crypto
   * @returns The generated pair
   */
  public generatePair(): IPair {
    const pair = crypto.generateKeyPairSync(
      'rsa',
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        }
      }
    );
    return {
      privateKey: pair.privateKey,
      certificate: pair.publicKey,
    }
  }
}

export interface IGenerateCommandArgs {
  mode: string|undefined;
}

export interface IGenerateCommandPairsArgs {
  key: string|undefined;
  certificate: string|undefined;
}

export interface IPair {
  certificate: string;
  privateKey: string;
}
