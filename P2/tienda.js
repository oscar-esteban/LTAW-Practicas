//-- Imprimir información sobre la solicitud recibida

const http = require('http');
const fs = require('fs');
const PUERTO = 8080;

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"
//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);
//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

const tienda2 = "tienda2.json"

//-- Cargar pagina web del formulario
const FORMULARIO = fs.readFileSync('form1.html','utf-8');
//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('form1-resp.html', 'utf-8');


//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

  //-- Construir el objeto url con la url de la solicitud
  const myURL = new URL(req.url, 'http://' + req.headers['host']); 
  let nombre = myURL.searchParams.get('nombre'); 
  let correo = myURL.searchParams.get('correo'); 
  console.log("");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("  Ruta: " + myURL.pathname);
  console.log("  Parametros: " + myURL.searchParams);
  
    if (nombre == tienda.usuarios[0].nombre || nombre == tienda.usuarios[1].nombre){//comprobar si esta en lista
      console.log("Usuario aceptado");
    }
      //tienda.usuarios.push({nombre,correo});
  
  console.log(tienda["usuarios"]);
  let myJSON = JSON.stringify(tienda);
  fs.writeFileSync(tienda2, myJSON);
  //-- Por defecto entregar formulario
  let content_type = "text/html";
  let content = FORMULARIO;

  if (myURL.pathname == '/procesar') {
      content_type = "text/html";
      content = RESPUESTA;
  }

  //-- Si hay datos en el cuerpo, se imprimen
  req.on('data', (cuerpo) => {

    //-- Los datos del cuerpo son caracteres
    req.setEncoding('utf8');
    console.log(`Cuerpo (${cuerpo.length} bytes)`)
    console.log(` ${cuerpo}`);
  });

  //-- Esto solo se ejecuta cuando llega el final del mensaje de solicitud
  req.on('end', ()=> {
    //-- Generar respuesta
    res.setHeader('Content-Type', content_type);
    res.write(content);
    res.end()
  });

});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);