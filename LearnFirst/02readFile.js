var fs = require('fs');
fs.readFile('text/helloWorld.html', function (err, data) {
    if (err) {
        console.log('404 is  Not Found')
    }
    console.log(data.toString());
})
