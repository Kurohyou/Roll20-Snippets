const k = require('k-scaffold');

(async ()=>{
  const html = await k.pug({
    source:'./script_error.pug',
    destination:'./roll20code/gen.html'
  });
  // const css = await k.scss({
  //   source:'./basic.scss',
  //   destination: './roll20code/gen.css'
  // });
})();