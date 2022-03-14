import pug from "pug"
import _ from "lodash"
import { constants } from "./javascript/constants.js"

const pathToPug = "./system.pug";  // Substitute a different PUG file here

const render = pug.compileFile(pathToPug)
const html = render({
  _,
  constants,
  // Include any external javascript libraries here needed to compile the sheet here
})

console.log(html)