const restify = require('restify');
const SerialPort = require('serialport');


const otto = new SerialPort("COM1",{
    baudRate: 57600
});

// Open errors will be emitted as an error event
otto.on('error', function(err) {
    throw err.message
});

const server = restify.createServer({
    name: 'Otto DIY Server',
    version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/ping', function (req, res, next) {
    otto.write('ping', function(err) {
        if (err) { return console.log('Error on write: ', err.message);}
        console.log('message written, listening...');
        const Readline = SerialPort.parsers.Readline;
        const parser = new Readline();
        otto.pipe(parser);
        parser.on('data', (message) => {
            if(message === 'pong') {
                console.log(message);
                res.send(200,message);
            } else {
                console.error(message);
                res.send(500,message);
            }
        });
    });
    return next();
});

server.post('/do', function (req, res, next) {
    console.log("sending", req.body);
    otto.write(req.body, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message written');
        res.send('hola');
    });
    return next();
});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
