import {describe, expect, beforeEach, it} from '@jest/globals';
import { ValidatorService } from './validator.service';

// This value is used only for tests purposes
// It should not be used anywhere in working apps
const testKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCQ5VcjcCVHKqLt
cHIJIRR9yIZ5HaYTxidjzvJJ0fGt1BsRHsRI0V526MB9MI77AyhWbwAFG4YT1vvA
j2k7ePbXJ/YJl+kOHFBbt+PMKvFHxBQ+9yChCJalDprjOKbt4uFzNolor50cBUhE
/A1DsKmms4tPzfGKsqyBDA6tqmYqHh4pXTeNNKO5UBd5epZnnq3RyRHR6/rAdpFX
i7cbzMLX7SU5kKE4Ci42X08oW8RdIMCOkV/Q3cd9yYE1NTEvxGFZz5BoRoKqTa3t
awQC7XZ7wxeukGjAzqyQEoQxx2SKWiaFYyNSzcqOZes7JjvUWxSdGPVF3guAf0uU
Sg2QSH9bAgMBAAECggEAM8Ss0G2F9BpIodq184sNHi+h0+4C4ze95QwQRs2qsneA
wCok6Ptc69EWzOOngglLxS3dbPW7fqUlx1O1vljmoFKXti+/RZpaH5rg2ZZSJFjq
/uAemUpPQGOqdRpNkdqowBgxGeT8lgFRI8yGFLQuuO+XC4lCDlLuDSE4sVWbMNqO
PmxbVqYMjaZ9IAKOxCCaRAiWIbss5fgs/GRoywyrU7W7GsoMLGMVm8SBIvgyPK8Z
pINlc8aaIaJbHh+zV1TTmC1/8Prr6WyRkZI4wG5BR3kdxg+VNyWBlyBlRUMNpWZm
pQyGdb4x/JBPz1pKnI0piB+p83C2lG4v9CzapVUIyQKBgQDBLi8rXHnRyh37IhWO
qtkoYQTIirleFIB1inIIluREDp3WHJ4x1E/lCN/ekQ0OzGrojGbb8nWvUp7fQR4I
ODB8/o5DlYZSZlhOpJuXsjs0tF11VE4sMuroQl2o3h3RL8TwB0UP2uLxWYY1Z01y
d7jXWTV0upEhaNaU1kr1t+CwBQKBgQDAA5S2bjl9TdUuaJAsyEqE1QwdhScPSFDS
UCx2fh0XMMUKE01jdOw3uBXZLvUs4VPpcK2VDceH7424/AIQm4/3w0WsC7xijeIe
dc1w0ANOwnChWEPXN71Lv2DziVzQm34Wt0j+fBj9RxXTSP6a0jNVGKrxresjkQUK
ShiaJ9lv3wKBgFLVwPgw8TOaHX0AQooojHGaGHj9szq6Q9MjCH7SZRMhyWB0aQko
5xFo2sYPILBFy1noSnrp3rjNDr7gp0YTAge3B73HMg/HPvqJ7wX/MRAKf0C+Y77k
HoJ1Yr/0boiymRnrpBuGWmXvY3Mm1rjMyX/eCuQA1BalY83yjbYLoNcZAoGBALAq
mOZHerdcEZrilGSB3tzAGr16zLtYvc43gJO2YTpFpIH586asP41fd6wrSQZENZiX
qKp4Wfh98KknjT1vfEb1AZc3rT8+rZcEvdgjAOXhvzRIpvVuTl6Q14KZJG7AOo7c
2juh38uAzKVs8ytYb4BDgZL63iFjjBxEnw3QQc5BAoGBAIzRH+hCnrI7QMOWxqnV
ZP6p3PxGEPfeP6xKYiEnkjgkcAMVw8h9W8PP9CYUSqnMdqrd7wGT+cjvc7rfh6P6
J2Rl8/e5nOtueVBHRi9dRMV7TOvOl9jcaV5+CeDjxi5IW3C5IipGQ8G/dV5EqanY
g9gKXTtpjLEnYFN9smKYsbWA
-----END PRIVATE KEY-----
`;

// This value is used only for tests purposes
// It should not be used anywhere in working apps
const testCertificate = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkOVXI3AlRyqi7XByCSEU
fciGeR2mE8YnY87ySdHxrdQbER7ESNFedujAfTCO+wMoVm8ABRuGE9b7wI9pO3j2
1yf2CZfpDhxQW7fjzCrxR8QUPvcgoQiWpQ6a4zim7eLhczaJaK+dHAVIRPwNQ7Cp
prOLT83xirKsgQwOrapmKh4eKV03jTSjuVAXeXqWZ56t0ckR0ev6wHaRV4u3G8zC
1+0lOZChOAouNl9PKFvEXSDAjpFf0N3HfcmBNTUxL8RhWc+QaEaCqk2t7WsEAu12
e8MXrpBowM6skBKEMcdkilomhWMjUs3KjmXrOyY71FsUnRj1Rd4LgH9LlEoNkEh/
WwIDAQAB
-----END PUBLIC KEY-----
`

describe('ValidatorService', () => {
  let service: ValidatorService;

  beforeEach(async () => {
    service = new ValidatorService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test if a dummy pair is not returning dummy info', () => {
    expect(service.challenge('abc', 'def')).toBeFalsy();
  });

  it('test for a challenge', () => {
    expect(service.challenge(testCertificate, testKey)).toBeTruthy();
  });
});
