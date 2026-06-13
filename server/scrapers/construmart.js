const puppeteer = require('puppeteer-core');
const levenshtein = require('fast-levenshtein');

async function buscarConstrumart(nombreProducto) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // tu Chrome real
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://www.construmart.cl', { waitUntil: 'networkidle2' });

    await page.waitForSelector('input[placeholder="Buscar productos"]', { timeout: 7000 });
    await page.type('input[placeholder="Buscar productos"]', nombreProducto, { delay: 50 });

    await page.waitForSelector('.autocomplete-list li', { timeout: 7000 });

    const productos = await page.$$eval('.autocomplete-list li', items =>
      items.map(item => {
        const nombre = item.querySelector('.product-name')?.innerText.trim() || '';
        const precioTexto = item.querySelector('.price')?.innerText || '';
        const precio = Number(precioTexto.replace(/[^\d]/g, ''));
        return { nombre, precio };
      })
    );

    await browser.close();

    const ordenados = productos
      .map(p => ({
        ...p,
        distancia: levenshtein.get(nombreProducto.toLowerCase(), p.nombre.toLowerCase())
      }))
      .sort((a, b) => a.distancia - b.distancia);

    return ordenados.filter(p => p.distancia <= 12).slice(0, 3);
  } catch (err) {
    await browser.close();
    console.error('❌ Error al buscar producto en Construmart:', err.message);
    return [];
  }
}

module.exports = buscarConstrumart;
