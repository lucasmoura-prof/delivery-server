var http = require('http');
var express = require('express');
var app = express();

const server = http.createServer(app); // a biblioteca http entra exatamente aqui
var io = require('socket.io').listen(server); // associando a instância do socketio com o seu servidor

// Rota de teste
app.get('/', (req, res) => res.json({ hello: 'world!' }));

function prepareOrder(socket) {
    console.log('Preparando o pedido');
    socket.emit('status', 2); 
    setTimeout(() => sendOrder(socket), 5000);
}

function sendOrder(socket) {
    console.log('Enviando o pedido');
    socket.emit('status', 3); 
    setTimeout(() => finish(socket), 80000);
}

function finish(socket) {
    console.log('Entregando o pedido');
    socket.emit('status', 4); 
}

io.on('connection', (socket) => {
    console.log('Alguém conectou!')
    socket.on('new_order', (data) => {
        socket.emit('status', 1); 
        console.log('Recebeu um novo pedido!');
        setTimeout(() => prepareOrder(socket), 5000);
    });
}); // imprimindo no console caso alguém entre

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`[x] Magic happens on port: ${port}`));
