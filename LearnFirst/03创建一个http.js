var http = require('http');
http.createServer(function (req, res) {
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.end('hello 你好');
})
    .listen(3000, function (err, data) {
        console.log('is running ...')
    })