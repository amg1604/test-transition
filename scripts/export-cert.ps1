# export-cert.ps1
# Exports the Allianz client certificate (with private key) from the Windows
# Certificate Store as a PFX file, ready for use with Playwright.
#
# Run once before executing the tests:
#   powershell -ExecutionPolicy Bypass -File scripts\export-cert.ps1

param(
    [string]$OutputPath = "$PSScriptRoot\..\certs\allianz-client.pfx",
    [string]$Serial     = "171DE0"
)

$cert = Get-ChildItem Cert:\CurrentUser\My |
        Where-Object { $_.SerialNumber -eq $Serial }

if (-not $cert) {
    Write-Error "Certificate with serial $Serial not found in CurrentUser\My store."
    exit 1
}

Write-Host "Found certificate:"
Write-Host "  Subject : $($cert.Subject)"
Write-Host "  Issuer  : $($cert.Issuer)"
Write-Host "  Serial  : $($cert.SerialNumber)"
Write-Host "  Expires : $($cert.NotAfter)"

$passphrase = Read-Host -AsSecureString "Enter a passphrase to protect the PFX file"

$outputFile = [System.IO.Path]::GetFullPath($OutputPath)
New-Item -ItemType Directory -Force -Path (Split-Path $outputFile) | Out-Null

$cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pfx, $passphrase) |
    Set-Content -Path $outputFile -Encoding Byte

Write-Host "`nCertificate exported to: $outputFile"
Write-Host "Set the passphrase as an environment variable before running tests:"
Write-Host '  $env:CERT_PASSPHRASE = "<your-passphrase>"'
Write-Host '  npx playwright test'
