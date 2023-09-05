import { Config } from "./types";


const pj = require('../../package.json');
const version = parseInt(process.env.REACT_APP_VERSION || '100');
const name = pj.name;

let config: Config = {
    name: name,
    version: version,
    api:
    {
        url: process.env.REACT_APP_API_URL || ''
    },
    trackingId: process.env.REACT_APP_TRACKING_ID || '',
    appNames: {    
        "RP": "Rappi",
        "PY": "Pedidos Ya",
        "WB": "Wabi",
        "UE": "Uber eats",
        "JU": "Justo",
        "DD": "Didi",
        "IF": "iFood",
        "MP": "Mercado pago",
        "DW": "Darwin"
    },
    environment: process.env.REACT_APP_ENV || "",
    imageUrl: process.env.REACT_APP_IMAGE_URL || "",
    productCategorySortingPosition: [ 
        'entradas', 
        'principales', 
        'acompañamientos', 
        'extras y adicionales', 
        'postres', 
        'bebidas sin alcohol', 
        'bebidas con alcohol' ,
    ],
    whatsappNumber: process.env.REACT_APP_WHATSAPP || "",
    hotjarId: parseInt(process.env.REACT_APP_HOTJAR_ID || "0"),
    hotjarSnipperVersion: parseInt(process.env.REACT_APP_HOTJAR_SNIPPER_VERSION || "0"),
    printerServerUrl: process.env.REACT_APP_PRINTER_SERVER || "http://127.0.0.1:9001/",
    electronServerUrl: process.env.REACT_APP_ELECTRON_SERVER || "http://127.0.0.1:8999/"
}

export default config;
