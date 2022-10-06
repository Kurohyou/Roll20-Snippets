const {k} = require('../sheetworkers');
describe('test',()=>{
  it('Should pass',()=>{
    k.getAllAttrs({
      callback(attributes,sections,casc){
        console.warn(attributes.prefixed_test_for_pre);
      }
    })
  });
})