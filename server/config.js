const nconf = require('nconf');

// Default Settings
nconf.set('PORT','COM1');
nconf.set('BAUDRATE',57600);

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
nconf
    .argv()
    .env(['PORT','BAUDRATE'])

const mandatory  = ['PORT'];

mandatory.map((key)=> {
    if(nconf.get(key) === undefined)
        throw "You must to set config key " + key;
    else
        console.info(key + ` :: ` + nconf.get(key))
});

module.exports = nconf;