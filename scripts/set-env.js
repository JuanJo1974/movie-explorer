const fs = require('fs');
const path = require('path');

const tmdbToken = process.env.TMDB_TOKEN;
if (!tmdbToken) {
  console.error('ERROR: La variable de entorno TMDB_TOKEN no está definida.');
  process.exit(1);
}

const content = `export const environment = {
  production: true,
  tmdbToken: '${tmdbToken}'
};
`;

const dest = path.join(__dirname, '../src/environments/environment.prod.ts');
fs.writeFileSync(dest, content);
console.log('environment.prod.ts generado correctamente.');
