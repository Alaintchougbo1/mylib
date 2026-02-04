# JWT Keys

This directory contains the private and public keys used for JWT token generation and validation.

## Generating Keys

The keys are NOT included in the repository for security reasons. You need to generate them locally:

### Without passphrase (recommended for development):
```bash
openssl genrsa -out private.pem 4096
openssl rsa -in private.pem -pubout -out public.pem
```

### With passphrase (recommended for production):
```bash
openssl genrsa -aes256 -out private.pem 4096
openssl rsa -in private.pem -pubout -out public.pem
```

If you use a passphrase, update the `JWT_PASSPHRASE` variable in your `.env` file.

## Docker Setup

When using Docker, you can generate the keys inside the container:
```bash
docker-compose exec backend bash -c "cd config/jwt && openssl genrsa -out private.pem 4096 && openssl rsa -in private.pem -pubout -out public.pem"
```

## Files
- `private.pem` - Private key (used to sign tokens) - **NEVER commit this file**
- `public.pem` - Public key (used to verify tokens) - **NEVER commit this file**
- `README.md` - This file

Both keys are automatically excluded from Git via `.gitignore`.
