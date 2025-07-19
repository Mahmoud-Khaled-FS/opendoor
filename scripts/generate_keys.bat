@echo off
setlocal

REM Check if 'keys' folder exists; if not, create it
if not exist keys (
    echo Creating 'keys' directory...
    mkdir keys
)

REM Generate a 2048-bit RSA private key
echo Generating private key...
openssl genpkey -algorithm RSA -out ./keys/private.key -pkeyopt rsa_keygen_bits:2048
if errorlevel 1 (
    echo Failed to generate private key.
    exit /b 1
)

REM Generate the public key from the private key
echo Generating public key...
openssl rsa -pubout -in ./keys/private.key -out ./keys/public.key
if errorlevel 1 (
    echo Failed to generate public key.
    exit /b 1
)

REM Set file permissions (Windows alternative: show a message)
echo Keys generated:
echo - keys/private.key
echo - keys/public.key

pause
