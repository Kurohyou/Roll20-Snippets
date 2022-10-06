const k = require('@kurohyou/k-scaffold');//Require the K-scaffold that we installed via NPM
console.log('=====__dirname=====',__dirname);
k.all({destination:'./roll20code/',testDestination:'./js',pugOptions:{suppressStack:false}});// Invoke the all method of the K-scaffold npm package to process all pug and scss files that are in the same directory as this file.
// We've set our output directory as roll20code, located directly in this same directory.