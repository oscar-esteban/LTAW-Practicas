const electron = require('electron');
const ip = require('ip');

//-- Obtener elementos de la interfaz
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const usuarios = document.getElementById("usuarios");
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
//-- Versión de Node
info1.textContent = process.versions.node;
//-- Versión de Chrome
info2.textContent = process.versions.chrome;
//-- Versión electron
info3.textContent = process.versions.electron;

//-- Inicializar contador usuarios
usuarios.innerHTML = 0;

btn_test.onclick = () => {
    console.log("Botón ON!");
    const test = "Este mensaje es de prueba!!"
    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "Este mensaje es de prueba!!");
}

//-- Mensaje recibido del proceso MAIN para la ip
electron.ipcRenderer.on('ip', (event, msg) => {
    console.log("Recibida Ip: " + msg);
    info4.innerHTML = msg;
    //-- Generar el codigo qr de la url
});

//-- Mensaje recibido del proceso MAIN para el numero de usuarios
electron.ipcRenderer.on('usuarios', (event, msg) => {
    console.log("Recibido numero de usuarios: " + msg);
    usuarios.innerHTML = msg;
});
// Comunicacion con main
electron.ipcRenderer.on('print', (event, msg) => {
    console.log("Recibido: " + msg);
    display.innerHTML += msg + '</p>'; 
  });
//-- Mensaje recibido del proceso MAIN de los usuarios
electron.ipcRenderer.on('msg', (event, msg) => {
    console.log("Recibido numero de usuarios: " + msg);
    display.innerHTML += msg + "<br>";
    display.scrollTop = display.scrollHeight;
});