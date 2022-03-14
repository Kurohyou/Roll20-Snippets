import { constants } from "./javascript/constants.js";
import _ from "lodash"
import fs from "fs"

let translation = {}

// Dynamic json generation
constants.attributes.forEach(attr => {
  translation[attr] = _.capitalize(attr)
})

// Add additional dynamic translation code here



// Translation file overrides.
const translationFilePaths = [
  "./override.json",
  // Add external translation files here. They will override values generated below
]

translationFilePaths.forEach(filePath => {
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  translation = {
    ...translation,
    ...jsonData,
  }
})

console.log(JSON.stringify(translation))  