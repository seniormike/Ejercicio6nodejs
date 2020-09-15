const fs = require("fs");
const axios = require("axios");
const http = require("http");
const url = require("url");

//Urls
let urlProveedores = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json"
let urlClientes = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json"



//Referencias de mapeo
let proveedores;
let clientes;

// Muestra la lista de clientes en la tabla
let showClientes = (callback) => {
    fs.readFile("index.html", (err, data) => {
        let cuerpo = ''
        clientes.map(obj => {
            cuerpo +=  `<tr><th>${obj.idCliente}</th><td>${obj.NombreCompania}</td><td>${obj.NombreContacto}</td></tr>`;
        })
        let contPagina = data.toString();
        contPagina = contPagina.replace("{{title}}", "Clientes");
        contPagina = contPagina.replace("{{body}}", cuerpo);
        callback(contPagina);

    });
}

// Muestra la lista de proveedores en la tabla
let showProveedores = (callback) => {
    fs.readFile("index.html", (err, data) => {
        let cuerpo = '';
        proveedores.map(obj => {
            cuerpo +=`<tr><th>${obj.idproveedor}</th><td>${obj.nombrecompania}</td><td>${obj.nombrecontacto}</td></tr>`;
        });
        let contPagina = data.toString();
        contPagina = contPagina.replace("{{title}}", "Proveedores");
        contPagina = contPagina.replace("{{body}}", cuerpo);
        callback(contPagina);
    })
}
// Obtiene la información de los clientes e invoca showClientes
let getClientes = (callback) => {
    axios.get(urlClientes).then( response => {
        clientes = response.data;
        showClientes( (data) => {
            callback(data.toString());
        });
    });
}
// Obtiene la información de los proveedores e invoca showProveedores
let getProveedores = (callback) => {
    axios.get(urlProveedores).then( response => {
        proveedores = response.data;
        showProveedores( (data) => {
            callback(data.toString());
        });
    });
}
// Crea el server
http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    if(url.parse(req.url, true).path === "/api/proveedores"){
        getProveedores((data) => {
            res.end(data.toString());
        });
    }else if(url.parse(req.url, true).path === "/api/clientes"){
        getClientes((data) => {
            res.end(data.toString());
        });
    }
}).listen(8081);