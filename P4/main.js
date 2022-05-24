// chat del server js

//-- Cargar el módulo de electron
const electron = require('electron');

const { createSocket } = require('dgram');
const express = require('express');
const fs = require('fs');
// app web vacía
const app = express()
const http = require('http').Server(app);
//-- Crear el servidor de websockets, asociado al servidor http
const io = require('socket.io')(http);

const ip = require('ip');

//-- Contador de usuarios
let cont_user = 0;

//ficher¡
const Fichero_Usuarios = "chat.json";
let Usuarios = [];
//-- Definir el puerto a utilizar
const PUERTO = 8080;

//-- Function fecha
function date(){
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1; //si no le sumo 1 sale un mes menos idk
    var yyyy = hoy.getFullYear();
    var h = hoy.getHours();
    var m = hoy.getMinutes();
    return dd+'/'+mm+'/'+yyyy+' --> '+ h+':'+m;
}

io.on('connect', (socket) => {
    console.log('conectado');
});


//-- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Defino el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
    let path = __dirname + '/chat.html';
    res.sendFile(path);
    console.log("Acceso a " + path);
  });


//-- El resto de peticiones como ficheros estáticos
app.use('/', express.static(__dirname +'/'));


io.on('connection', function(socket){
    //-- Usuario conectado. Imprimir el identificador de su socket
    console.log('--> Usuario conectado!. Socket id: ' + socket.id);

    //-- Sumamos uno al contador 
    cont_user += 1;

    //-- enviar numero usuarios conectados
    win.webContents.send('usuarios', cont_user);

    //-- Usuario conectado. Imprimir el identificador de su socket
    console.log('--> Usuario conectado!. Socket id: ' + socket.id);
    //-- Mostrar cunado se conecta un usuario
    io.emit('conect', '--> Usuario conectado!. Número: ' + cont_user);

    let datos = {
      id_usuario: socket.id,
      numero_usuario: cont_user.toString(),
    }

    Usuarios.push(datos);
    let data = JSON.stringify(Usuarios);
    fs.writeFileSync(Fichero_Usuarios, data);
    
    socket.emit('hello', "Eres el usuario numero: " + cont_user);

    //-- Retrollamada de mensaje recibido del cliente
    socket.on('msg', (msg) => {
      console.log("Cliente: " + socket.id + ': ' + msg);

      for (let  i= 0; i < Usuarios.length; i++){
        if (Usuarios[i]["id_usuario"].includes(socket.id)){
          numero = Usuarios[i]["numero_usuario"];
        }
      }

      //-- Enviar el mensaje a clientes conectados
      if (msg.value == ' '){
        console.log("entra?")
        msg.value = "";
      }else{
        io.emit('msg', numero + ": " + msg);
        win.webContents.send('print', numero + ": " + msg);
      }
 
    });

    //-- Usuario desconectado. Imprimir el identificador de su socket
    socket.on('disconnect', function(){
        console.log('--> Usuario Desconectado. Socket id: ' + socket.id);
        for (let  i= 0; i < Usuarios.length; i++){
          if (Usuarios[i]["id_usuario"].includes(socket.id)){
            numero = Usuarios[i]["numero_usuario"];
          }
        }
        io.emit('desconecto', "--> Usuario numero " + numero + " desconectado!");
        //Restamos uno al contador de usuarios
        if (cont_user > 0){
            cont_user = cont_user - 1;
            console.log("--> Número de usuarios: " + cont_user);
        };
    }); 
    

    socket.on('cmd', (msg) => {
        console.log("Cliente: " + socket.id + ': ' + msg);
    
        if(msg =='/help'){
          socket.emit('cmd', " Comandos posibles: /help , /list, /hello, /date ");
        }else if (msg =='/list') {
          console.log(Usuarios);
          socket.emit('cmd', " Tenemos " + cont_user + " usuarios conectados en el chat "  );
        }else if (msg =='/hello') {
          socket.emit('cmd', "Hola compañero, espero que todo te vaya genial :)");
        }else if (msg =='/date') {
            socket.emit('cmd', 'Hoy es: ' + date());
        }else {
          socket.emit('cmd', " Comando Erroneo: ejecute /help para ver los comandos permitidos ");
        }
      })
});

console.log("Arrancando electron...");
console.log(ip.address());


//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento Ready!");   
  
    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
      width: 700,  //-- Anchura 
      height: 400,  //-- Altura

       //-- Permitir que la ventana tenga ACCESO AL SISTEMA
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }

    });

     //-- Para quitar menu por defecto de la parte superior 
    //win.setMenuBarVisibility(false)

    //-- Cargar contenido web en la ventana
    //-- La ventana es en realidad.... ¡un navegador!
    win.loadFile("index.html");

    win.on('ready-to-show', () => {
      win.webContents.send('ip', 'http://' + ip.address() + ':' + PUERTO);
    });
  });

  //-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
  //-- renderizado. Al recibirlos se escribe una cadena en la consola
  electron.ipcMain.handle('test', async(event, msg) => {
    console.log("-> Mensaje: " + msg);
    //-- Enviar mensaje de prueba
    io.emit('testRecived', msg);
    win.webContents.send('msg', 'Este mensaje es de prueba!!');

  });

//-- Lanzar servidor
http.listen(PUERTO, function(){
  console.log('Servidor lanzado en puerto ' + PUERTO);
});
//-- Mensaje de arranque
console.log("Arrancando servidor...");