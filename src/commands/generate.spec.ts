import {describe, expect, beforeEach, it} from '@jest/globals';
import {GenerateCommand} from './generate.command';
import { ValidatorService } from '../service/validator.service';

describe('GenerateCommand', () => {
  let command: GenerateCommand;
  let service: ValidatorService;

  beforeEach(async () => {
    command = new GenerateCommand();
    service = new ValidatorService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(command).toBeDefined();
  });

  it('generates & test pair', () => {
    const pair = command.generatePair();
    expect(service.challenge(pair.certificate, pair.privateKey)).toBeTruthy();
  });
});
