# Portfolio Transfer Tests

Pruebas automatizadas con [Playwright](https://playwright.dev/) para `https://smart-dev.allianz.com/portfolio-transfer`.

## Estructura

```
.
├── certs/              Certificado cliente (PFX) para mTLS — generado localmente, NO se versiona
├── scripts/
│   └── export-cert.ps1 Exporta el certificado cliente desde el almacén de Windows
├── tests/
│   └── login.test.js   Casos de prueba (login, dashboard, configuración de transferencia)
├── playwright.config.js
├── package.json
└── .gitignore
```

Carpetas generadas al ejecutar las pruebas (ignoradas por Git): `node_modules/`, `screenshots/`, `test-results/`, `playwright-report/`.

## Requisitos previos

- Node.js
- Certificado cliente válido en el almacén `Cert:\CurrentUser\My` (Windows) para autenticación mTLS

## Configuración inicial

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Exportar el certificado cliente:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\export-cert.ps1
   ```
3. Definir la passphrase del certificado como variable de entorno antes de correr las pruebas:
   ```powershell
   $env:CERT_PASSPHRASE = "<tu-passphrase>"
   ```

## Ejecutar las pruebas

```bash
npm test              # ejecución headless
npm run test:headed   # con navegador visible
npm run test:debug    # modo debug
npm run test:report   # abrir el último reporte HTML
```

## Notas

- El navegador usado por defecto es Microsoft Edge (`channel: 'msedge'`), ver `playwright.config.js`.
- `certs/` nunca debe subirse al repositorio: contiene material de clave privada.
