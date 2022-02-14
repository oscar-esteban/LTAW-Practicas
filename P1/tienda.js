const http = require('http');
const fs = require('fs');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  //-- Crear el objeto URL del mensaje de solitud (req)
  //-- y coger el recurso (url)
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("URL solicitada: " + myURL.pathname);

  //-- Definir la variable fichero
  let filename = "";

  //-- Obtener la ruta (pathname)
  //-- Comprobar si la ruta es elemento raiz
  //-- Obtener fichero a devolver
  if (myURL.pathname == "/"){
    filename += "tienda.html";  //-- Abrir la pagina principal
  }else{
    filename += myURL.pathname.substr(1);  //-- Abrir el fichero solicitado
  }

  console.log("Página solicitada: " + filename
  )

  content = page.split(".").pop()
  console.log("Contenido de la página: " + content);

  fs.readFile(page, (err, data) => {
  let code = 200;
  let code_msg = "OK";
  let content_type = "text/html";

  if (err) { // Mostramos la página de error
      console.log('ha habido error')
      var HOME_HTML = fs.readFileSync('./error.html', 'utf-8');
      res.statusCode = 404;
      res.statusMessage = "Ha habido un error";
      res.setHeader('Content-Type', "text/html");
      res.write(HOME_HTML);
      return res.end();
  }
  switch (content) {
      case 'html':
          content_type = "text/html";
      case 'css':
          content_type = "text/css";
      default:
          content_type = content;
  } 
  res.statusCode = code;
  res.statusMessage = code_msg;
  res.setHeader('Content-Type', content_type);
  res.write(data);
  res.end();
  });  
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);
