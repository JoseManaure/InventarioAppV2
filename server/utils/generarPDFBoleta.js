const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function generarPDFBoleta(dte) {

    return new Promise(async (resolve, reject) => {

        try {

            const folder =
                path.join(__dirname, '../uploads/boletas');

            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            const fileName =
                `boleta-${dte.folio}.pdf`;

            const filePath =
                path.join(folder, fileName);

            const doc = new PDFDocument({
                margin: 40,
                size: 'A4'
            });

            const stream =
                fs.createWriteStream(filePath);

            doc.pipe(stream);

            // =========================
            // LOGO
            // =========================

            const logoPath =
                path.join(__dirname,
                    '../uploads/assets/logo.png');

            if (fs.existsSync(logoPath)) {

                doc.image(
                    logoPath,
                    40,
                    35,
                    { width: 120 }
                );

            }

            // =========================
            // EMPRESA
            // =========================

            doc
                .fontSize(11)
                .fillColor('#444')
                .text('MMD SPA', 350, 40);

            doc.text('RUT: XX.XXX.XXX-X');

            doc.text('Peñaflor, Chile');

            doc.text('+56 9 3758 9348');

            // =========================
            // CAJA BOLETA
            // =========================

            doc
                .roundedRect(350, 120, 180, 90, 8)
                .stroke('#E2E8F0');

            doc
                .fontSize(18)
                .fillColor('#111')
                .text('BOLETA ELECTRÓNICA', 365, 140);

            doc
                .fontSize(22)
                .fillColor('#D97706')
                .text(dte.folioVisible, 395, 170);

            // =========================
            // CLIENTE
            // =========================

            doc
                .fillColor('#111')
                .fontSize(13)
                .text('Cliente', 40, 160);

            doc
                .fontSize(11)
                .fillColor('#555')
                .text(dte.cliente, 40, 185);

            doc.text(
                dte.direccion || '-',
                40,
                205
            );

            // =========================
            // FECHA
            // =========================

            doc
                .fontSize(11)
                .fillColor('#555')
                .text(
                    `Fecha: ${new Date().toLocaleDateString('es-CL')
                    }`,
                    40,
                    235
                );

            // =========================
            // TABLA
            // =========================

            const startY = 300;

            doc
                .rect(40, startY, 515, 28)
                .fill('#111827');

            doc
                .fillColor('white')
                .fontSize(10);

            doc.text('Código', 55, startY + 9);

            doc.text('Producto', 55, startY + 9);

            doc.text('Cant.', 290, startY + 9);

            doc.text('Precio', 360, startY + 9);

            doc.text('Subtotal', 460, startY + 9);

            let currentY = startY + 35;

            doc.fillColor('#111');

            dte.productos.forEach((item, index) => {

                if (index % 2 === 0) {

                    doc
                        .rect(40, currentY - 5, 515, 28)
                        .fill('#F8FAFC');

                }

                doc.fillColor('#111');

                doc.text(item.codigo || '-', 55, currentY);

                doc.text(item.nombre, 55, currentY);

                doc.text(
                    item.cantidad.toString(),
                    300,
                    currentY
                );

                doc.text(
                    `$${item.precio.toLocaleString('es-CL')}`,
                    350,
                    currentY
                );

                doc.text(
                    `$${item.subtotal.toLocaleString('es-CL')}`,
                    455,
                    currentY
                );

                currentY += 30;

            });

            // =========================
            // TOTALES
            // =========================

            const neto =
                Math.round(dte.total / 1.19);

            const iva =
                dte.total - neto;

            currentY += 30;

            doc
                .fontSize(12)
                .fillColor('#444');

            doc.text(
                `NETO: $${neto.toLocaleString('es-CL')}`,
                350,
                currentY
            );

            currentY += 22;

            doc.text(
                `IVA (19%): $${iva.toLocaleString('es-CL')}`,
                350,
                currentY
            );

            currentY += 30;

            doc
                .fontSize(18)
                .fillColor('#111');

            doc.text(
                `TOTAL: $${dte.total.toLocaleString('es-CL')}`,
                350,
                currentY
            );

            // =========================
            // QR
            // =========================

            const qrData = `
        Folio: ${dte.folioVisible}
        Cliente: ${dte.cliente}
        Total: ${dte.total}
      `;

            const qrImage =
                await QRCode.toDataURL(qrData);

            doc.image(
                qrImage,
                40,
                currentY - 20,
                { width: 90 }
            );

            // =========================
            // FOOTER
            // =========================

            doc
                .fontSize(9)
                .fillColor('#999')
                .text(
                    'Documento generado automáticamente',
                    40,
                    760,
                    {
                        align: 'center'
                    }
                );

            doc.end();

            stream.on('finish', () => {

                resolve({
                    fileName,
                    filePath,
                    url: `/uploads/boletas/${fileName}`
                });

            });

            stream.on('error', reject);

        } catch (error) {

            reject(error);

        }

    });

}

module.exports = generarPDFBoleta;