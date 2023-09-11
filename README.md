# certificate-authority // @thefirstspine/certificate-authority

Self-signed certificate authority to automate & check secure layer for protected endpoints.

## Install

```bash
npm i @thefirstspine/certificate-authority
```

## Philosophy

Here in TFS we strongly believe that services calls must be verified through private / public key pairs to ensure that the calls are from the good service: IPs are not sufficient for distributed service and DNS can be compromised.

Here's a model of what we engourage:

```
INCOMING REQUEST                               REQUEST GUARD                         PROTECTED RESOURCE
+---------------------------------+            +-----------------------+             +---------------------+
|                                 | +------->  |                       | +-------->  |                     |
| x-client-cert: dXAgdXAgZG93...  |            | Request validation    |             | Accessing protected |
| x-client-cert-encoding: base64  |            | against a private key |             | resources           |
|                                 | +------->  |                       | +-------->  |                     |
+---------------------------------+            +-----------------------+             +---------------------+
INCOMING REQUEST                               REQUEST GUARD                         PROTECTED RESOURCE
```

## Configuration

As part of TFS Platform, the validation service will use environment variable.

| Environement key | Summary |
|-|-|
| PRIVATE_KEY | The pivate key to use to validate incoming requests |

## Service documentation

### ValidatorService

Global service to validate incoming requests. This service will use the environment variable `PRIVATE_KEY` to fetch the private key.

#### challenge

Challenge the certificate against the private key.

**Synopsis:** `challenge(certificate: string): boolean`

**Params:**

- `certificate: string` The decoded certificate provided by the request.

## CLI documentation

In order to use the CLI, the dependency should be installed globally.

### tfs-ca-generate

Generates files to be validated in the services.

Example: `-m=pair -k=private.key -c=public.cert`

**Options:**

- `-m` Defines what's to be generated. `"ask"` or `"pair"`. If not provided, a prompt will be displayed.
- `-k` The private key path. If not provided, a prompt will be displayed. If the file already exists, a confirmation will be asked.
- `-c` The public certificate path. If not provided, a prompt will be displayed. If the file already exists, a confirmation will be asked.

## How to use

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Publish on NPM

```bash
npm publish
```

# How it is used in the TFS Platform?

In TFS we use GCP buckets along with Secret Manager to store these generated certificates:

```bash
for SERVICE in arena bots
do
  tfs-ca-generate --mode=pair --key=private.key --certificate=public.cert --force
  gsutil cp public.cert gs://bucket-artefacts-eu/$SERVICE.cert
  gcloud secrets versions add "secret-$SERVICE-private-key-eu" --data-file=private.key
done
```

These generated pairs are copied & loaded during the build to ensure that there is no human access to these credentials. Moreover, all the credentials are updated in the Appengines every day at 2:00 AM UTC and stored in environement variables.
