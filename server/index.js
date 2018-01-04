var express = require('express');
var path = require('path')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 2018;
const cv = require('opencv');
const fs = require('fs-extra')
server.listen(port, function () {
    console.log('Server listening at port %d', port)
});

app.use(express.static(path.resolve('./')));
var i = 0;
io.on('connection', function (socket) {
    console.log('--Connection--')
    socket.on('image', function (data) {
        // 后台接收到图片
        if (i === 0) {
            console.log(data)
            i++
        }

    });
});

var serv_io = io.listen(server);

serv_io.sockets.on('connection', function (socket) {
    socket.emit('message', {'message': '连接成功'});
});