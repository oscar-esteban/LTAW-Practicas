const http = require('http');
const fs = require('fs');
const PUERTO = 9090;
console.log("Escuchando...");
//-- Crear el servidor
const server = http.createServer((req, res) => {
  console.log("Petición recibida!");
  //-- Crear el objeto URL del mensaje de solitud (req)
  //-- y coger el recurso (url)
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("URL solicitada: " + myURL.pathname);

  let filename = "";
  //-- Obtener la ruta (pathname)
  //-- Comprobar si la ruta es elemento raiz
  //-- Obtener fichero a devolver
  if (myURL.pathname == "/") { //-- Cuando lanzamos nuestra página web
    filename = './tienda.html'
  }else if(myURL.pathname == "/favicon.icon"){
    filename = './tulipan.jpg'
  }else{ // -- En cualquier otro caso
    filename = '.' + myURL.pathname;
  }

  content = filename.split(".").pop()
  console.log("Contenido de la página: " + content);

  fs.readFile(filename, (err, data) => {
    let code = 200;
    let code_msg = "OK";
    let content_type = "text/"+content;
    if (err) { // Mostramos la página de error
        console.log('ha habido error')
        var HOME_HTML = fs.readFileSync('./error.html', 'utf-8');
        res.statusCode = 404;
        res.statusMessage = "Ha habido un error";
        res.setHeader('Content-Type', "text/html");
        res.write(HOME_HTML);
        return res.end();
    }
    

    console.log(content_type)
    res.statusCode = code;
    res.statusMessage = code_msg;
    res.setHeader('Content-Type', content_type);
    res.write(data);
    res.end();
  });  
});
server.listen(PUERTO);
