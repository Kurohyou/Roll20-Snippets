# The K-Scaffold
This is the first public release of the character sheet scaffold that I use to build my sheets. The scaffold allows sheets and sheetworkers to be written in a more seamless fashion by writing the listeners and connections between attributes directly in the PUG for the sheet.
- [The K-Scaffold](#the-k-scaffold)
  - [Using the scaffold](#using-the-scaffold)
  - [K-scaffold PUG](#k-scaffold-pug)
  - [K-scaffold Javascript](#k-scaffold-javascript)
  - [Contributing to the K-scaffold](#contributing-to-the-k-scaffold)
      
Want to support the scaffold? Buy me a cup of coffee at the [Kurohyou Studios Patreon Page](https://www.patreon.com/kurohyoustudios?fan_landing=true).
## Using the scaffold
To use the scaffold, simply download the scaffold folder from the template v2 directory. Put this scaffold folder in the working directory of your sheet project at the same level as your sheet's main pug file. Then, simply include `scaffold/_kpug.pug` as the first includes of your sheet's pug file. To use the scaffold's javascript library, use the `kscript` mixin to generate your script block. This looks like so:
```js
include scaffold/_kpug.pug
#main.my-main-div
  section.some-section
+kscript.
  const calcAttribute = function({attributes}){
    //Calculate an attribute
  };
```
You can include your javascript files or write them directly in the block of the `kscript` mixin. For more information, see the readme docs for the [pug](readme_docs/k_scaffold_pug_documentation.md) and [javascript](readme_docs/k_scaffold_js_documentation.md) libraries.
## K-scaffold PUG
To use the K-scaffold to write the html of your sheet, you will write normal PUG, but using a comprehensive library of components that are frequently used on character sheets. These range from simple mixin versions of standard html elements inputs, textareas, and selects to more complex constructions that generate Roll20 elements or workarounds for limitations of Roll20 character sheets. See the [K-scaffold PUG documentation](readme_docs/k_scaffold_pug_documentation.md) for full details on the mixins available.
## K-scaffold Javascript
To use the K-scaffold to write your sheetworkers, you will write normal sheetworkers, but using a library of utility functions and sheetworker aliases supercharge the standard sheetworkers. See the [K-scaffold Javascript documentation](readme_docs/k_scaffold_js_documentation.md) for full details on the functions and variables available.
## Contributing to the K-scaffold
Got an suggestion for a feature? Submit an issue on the Roll20-snippets repository and I'll take a look at what you've got.
