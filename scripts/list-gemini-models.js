/**
 * List available Gemini API models for this API key.
 * Prints models that support generateContent.
 *
 * Usage:
 *   node scripts/list-gemini-models.js
 */

const https = require('https');

function getEnvKey() {
  const key = String(process.env.GEMINI_API_KEY || '').trim();
  if (!key) {
    throw new Error('Missing GEMINI_API_KEY in environment.');
  }
  return key;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const status = Number(res.statusCode) || 0;
          if (status < 200 || status >= 300) {
            return reject(new Error(`HTTP ${status}: ${body.slice(0, 500)}`));
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error(`Invalid JSON: ${String(e?.message || e)}`));
          }
        });
      })
      .on('error', reject);
  });
}

async function main() {
  const key = getEnvKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
  const data = await fetchJson(url);
  const models = Array.isArray(data?.models) ? data.models : [];

  const canGenerate = models
    .filter((m) => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
    .map((m) => m?.name)
    .filter(Boolean)
    .sort();

  process.stdout.write('Models that support generateContent:\n');
  canGenerate.forEach((name) => process.stdout.write(`- ${name}\n`));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err?.message || err);
  process.exitCode = 1;
});

