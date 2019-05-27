var fs = require('fs');
var http = require('http');
var url = require('url');
var template = require('art-template');
http.createServer(function (req, res) {
    var pathName = url.parse(req.url, true);
    console.log(pathName.query);
    fs.readFile('template.html', function (err, data) {
        if (err) {
            console.log('404 Not Found')
        }

        // console.log(data);
        var tem = template.render(data.toString(), {
            title: '我是标题',
            comments: [{
                name: '张三',
                age: 18
            }]
        })
        res.end(tem)
    })
})
    .listen(4000, function () {
        console.log('runding.....')
    })