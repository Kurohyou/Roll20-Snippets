const pugDoc = require('pug-doc');
console.log('Generating Pug Docs');
pugDoc({
  input: '/k-scaffold/**/*.pug',
  output: '/docs/data/pug.json',
  complete:()=>console.log('Pug Docs generated')
});