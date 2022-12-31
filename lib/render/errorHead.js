const colors = require('colors');

const kErrorHead = (string) => {
  const borderForString = [...Array(string.length).keys()].map(()=>'=').join('');
  console.log(`==========${borderForString}\n==== ${string} ====\n==========${borderForString}`.bgRed);
}

module.exports = kErrorHead;