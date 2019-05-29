var http = require('http'); // NodeJs Http服务器API

//聊天室客户端使用html文件,在下面会用到

var clientui = require('fs').readFileSync('chartClient.html');

var emulation = require('fs').readFileSync('EventSourceEmulation.js');

//ServerResponse 对象数组, 用于介绍发送的事件
var clients = [];

//每20秒发送一条注释到客户端
//这样他们就不会关闭连接在重连
setInterval(function () {
    clients.forEach(function (client) {
        client.write(':ping?n')
    })
}, 2000);

//创建一个服务器

var server = new http.Server();

//当服务器获取取到一个新的请求,运行回调函数
server.on('request', function (request, response) {
    //解析请求的uul
    var url = require('url').parse(request.url);

    //如果发送到'/，服务器就发送客户端聊天室UL
    if (url.pathname === '/') {  //聊天客户端的UI请求
        response.writeHead(200, { 'Content-type': 'text/html' });
        response.write('<script>' + emulation + '</script>');
        response.write(clientui);
        response.end();
        return;
    }
    //如果请求发送到'/chat'之外的地址,则返回404
    else if (url.pathname !== '/chat') {
        response.writeHead(404);
        response.end();
        return;
    }
    //如果请求类型时post,那么就有一个客户端发送了一条新的消息
    if (request.method === "POST") {
        request.setEncoding('utf-8');
        var body = "";

        //在获取到数据之后,将其添加到请求主题中

        request.on('data', function (chunk) { body + chunk });

        //当请求完成时,发送一个空响应
        //并将消息传播到所有用于监听状态的客户端中
        request.on('end', function () {
            response.writeHead(200); // 响应改请求
            response.end();

            //将消息转换为文本/事件流格式
            //确保每一行的前缀都是'data:'
            //并以两个换行符结束
            message = 'data' + body.replace('\n', '\ndata:' + '\r\n\r\n');
            //发送消息给所有监听的客户端
            clients.forEach(function (client) { client.write(message) })
        });
    } else {
        //如果不是post 类型的请求,则客户端正在请求一组信息
        response.writeHead(200, { 'Content-type': 'text/event-stream' });
        response.write('data:Connected\n\n');

        //如果客户端关闭了连接
        //从活动客户端数组中删除对应的响应对象
        request.connection.on('end', function () {
            clients.splice(clients.indexOf(response), 1);
            response.end();
        })
        //记下响应对象,这样就可以向他发送未来的消息
        clients.push(response)
    }
});
server.listen(4000, function () {
    console.log('running.....')
})
