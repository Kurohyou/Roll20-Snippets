const fs = require('fs/promises');

const getTemplate = (filePath) => fs.readFile(filePath,'utf8')
.then(text => {
  return text.replace(/include k-scaffold/g,'include /node_modules/@kurohyou/k-scaffold/_k.pug')
});

module.exports = getTemplate;