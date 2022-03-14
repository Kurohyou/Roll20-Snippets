import pug from "pug"
import _ from "lodash"
import { constants } from "./javascript/constants.js" 

const render = pug.compileFile("./system.pug")
const html = render({
  _,
  constants,
  // Include any external javascript libraries here needed to compile the sheet here
})

console.log(html)