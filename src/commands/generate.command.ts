import inquirer from 'inquirer';
import chalk from 'chalk';
import * as crypto from 'crypto';
import * as fs from 'fs';
import validatorService from './../service/validator.service';

/**
 * Command bootstrap.
 * Generates files to be validated in the services.
 */
export class GenerateCommand {

  /**
   * Force mode.
   */
  protected force: boolean = false;

  /**
   * The mode of generation to use.
   */
  protected mode: string = 'ask';

  constructor() {}

  /**
   * Bootstrap the command.
   * @param args The arguments of the command
   */
  async start(args: IGenerateCommandArgs | (IGenerateCommandArgs & IGenerateCommandPairsArgs)) {
    console.log(chalk.blue(`Certification generation toolkit`));

    // Validate arguments
    if (args.force) {
      console.log(chalk.yellowBright('Using `force` mode. Hope you know what you are doing.'));
      this.force = true;
    }
    this.mode = args.mode;

    // Getting mode
    if (this.mode === 'ask') {
      const menuResponses = await inquirer.prompt([
        {
          type: 'list',
          name: 'menu',
          message: 'What do you want to do?',
          choices: [
            'Generate a new pair',
          ],
        }
      ]);
      if (menuResponses.menu === 'Generate a new pair') {
        this.mode = 'pair';
      } else if (menuResponses.menu === 'Generate a new certificate from a private key') {
      }
    }

    // Validating mode
    const modesMap = {
      'pair': this.generatePair.bind(this),
    };
    if (!modesMap[this.mode]) {
      console.log(chalk.redBright(`Unhandled mode "${this.mode}"`));
      process.exit(1);
    }

    modesMap[this.mode](args);
  }

  /**
   * Call for a "pair" generation mode.
   * @param args
   */
  async generatePair(args: IGenerateCommandPairsArgs) {
    // Getting key
    const key: string = await this.promptForValue('Where should be located your PRIVATE key file?', args, 'key');
    if (fs.existsSync(key)) {
      const responses = this.force ? {overwrite: true} : await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `${key} already exists. Overwrite?`,
        }
      ]);
      if (!responses.overwrite) {
        process.exit(1);
      }
      fs.unlinkSync(key);
    }

    // Getting certificate
    const certificate: string = await this.promptForValue('Where should be located your PUBLIC certificate file?', args, 'certificate');
    if (fs.existsSync(certificate)) {
      const responses = this.force ? {overwrite: true} : await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `${certificate} already exists. Overwrite?`,
        }
      ]);
      if (!responses.overwrite) {
        process.exit(1);
      }
      fs.unlinkSync(certificate);
    }

    // Generating pair
    console.log(chalk.blueBright('Generating pair...'));
    const result = crypto.generateKeyPairSync(
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

    // We have to test against our validation service
    // This will prevent to have false certificates to block the services
    console.log(chalk.blueBright('Testing pair...'));
    process.env.PRIVATE_KEY = result.privateKey;
    const challengeResult = validatorService.challenge(result.publicKey);
    if (!challengeResult) {
      console.log(chalk.redBright(`Challenge failed.`));
      process.exit(1);
    }
    console.log(chalk.greenBright('Challenge succeed.'));
    
    // Write the ertificates
    fs.writeFileSync(key, result.privateKey);
    console.log(chalk.greenBright(`Generated key in ${key}`));
    fs.writeFileSync(certificate, result.publicKey);
    console.log(chalk.greenBright(`Generated certificate in ${certificate}`));

    // ..and we're done!
    console.log(chalk.greenBright(`done.`));
    process.exit();
  }

  /**
   * Ask for the user some input according to a key in an arguments list.
   * @param message
   * @param args
   * @param key
   */
  protected async promptForValue(message: string, args: any, key: string): Promise<string> {
    const response = args[key] ? {[key]: args[key]} : await inquirer.prompt([
      {
        type: 'input',
        name: key,
        message,
      }
    ]);
    return response[key];
  }

}

export interface IGenerateCommandArgs {
  force: boolean|undefined;
  mode: string|undefined;
}

export interface IGenerateCommandPairsArgs {
  key: string|undefined;
  certificate: string|undefined;
}
