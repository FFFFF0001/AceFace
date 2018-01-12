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
            checkPhoto(data)
            i++
        }

    });
});

var serv_io = io.listen(server);

serv_io.sockets.on('connection', function (socket) {
    socket.emit('message', {'message': '连接成功'});
});


const checkPhoto = (d) =>{
    cv.readImage(d, function(err, im){
        console.log(err)
        console.log(im)
        if (err) throw err;
        if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

        im.detectObject("./data/haarcascade_frontalface_alt.xml", {}, function(err, faces){
            if (err) throw err;

            for (var i = 0; i < faces.length; i++){
                var face = faces[i];
                im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
            }

            im.save('./tmp/face-detection.png');
            console.log('Image saved to ./tmp/face-detection.png');
        });
    });
}