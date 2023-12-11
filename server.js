let express = require('express');

let app = express();

let server = app.listen(3000);
//Puerto que utilizamos.

app.use(express.static('public'));

console.log('Funciona!');

//node server.js -> Levanta el servidor.
//CTRL C -> Deja de funcionar.

let socket = require('socket.io');

let io = socket(server);

//Elementos nativos de socket io.
io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("Nueva Conexión: " + socket.id);

    socket.on('disconnect', ()=> {
        console.log("Cliente Desconectado: " + socket.id);
    });

    let carac = {
        col: "#FFFFFF00",
        str: 2
    };

    socket.emit('asignarCarac', carac);
    
    socket.on('mouse', mouseMsg);

    function mouseMsg(data) {
        socket.broadcast.emit('mouse', data);
        console.log(data);
    }
}