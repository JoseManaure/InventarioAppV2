const axios = require("axios");
const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");
const ENDPOINTS = require("../endpoints");

async function obtenerToken(xmlFirmado) {

    const soap = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">

    <soapenv:Body>

        <getToken>

            <pszXml>${xmlFirmado
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        }
            

            </pszXml>

        </getToken>

    </soapenv:Body>

</soapenv:Envelope>`;


    console.log("===== SOAP ENVIADO =====");
    console.log(soap);

    fs.writeFileSync("SOAP_TOKEN.xml", soap, "utf8");

    const response = await axios.post(

        ENDPOINTS.TOKEN,

        soap,

        {

            headers: {

                "Content-Type": "text/xml;charset=UTF-8",

                SOAPAction: ""

            },

            timeout: 30000

        }

    );

    console.log("===== TOKEN RAW =====");
    console.log(response.data);

    const parser = new XMLParser({

        ignoreAttributes: false,

        trimValues: true

    });

    return parser.parse(response.data);

}

module.exports = obtenerToken;