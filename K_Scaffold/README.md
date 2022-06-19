<div id="top"></div>
<span align="center">

[![Contributors][contributors-shield]][contributors-url] [![Forks][forks-shield]][forks-url] [![Stargazers][stars-shield]][stars-url] [![Issues][issues-shield]][issues-url] [![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url] [![Patreon][patreon-shield]][patreon-url]

</span>
<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">K-Scaffold Framework for Roll20 Character Sheets</h3>
<p align="center">
This is the first public release of the character sheet scaffold that I use to build my sheets. The scaffold allows sheets and sheetworkers to be written in a more seamless fashion by writing the listeners and connections between attributes directly in the PUG for the sheet.

Want to support the scaffold? Buy me a cup of coffee at the [Kurohyou Studios Patreon Page](https://www.patreon.com/kurohyoustudios?fan_landing=true).

<br/>
<a href="https://kurohyou.github.io/Roll20-Snippets/"><strong>Explore the docs »</strong></a>
<br/>
<br/>
<a href="https://github.com/Kurohyou/Roll20-Snippets">View Demo</a>
·
<a href="https://github.com/Kurohyou/Roll20-Snippets/issues">Report Bug</a>
·
<a href="https://github.com/Kurohyou/Roll20-Snippets/issues">Request Feature</a>
</p>
</div>
<!-- TABLE OF CONTENTS -->
<details>
<summary>Table of Contents</summary>
<ol>
<li><a href="#built-with">Built With</a></li>-
<li>
<a href="#getting-started">Getting Started</a>
<ul>
  <li>
    <a href="#k-scaffold-pug">K-Scaffold Pug</a>
  </li>
  <li>
    <a href="#k-scaffold-javascript">K-Scaffold Javascript</a>
  </li>
</ul>
<ul>
<li><a href="#prerequisites">Prerequisites</a></li>
</ul>
</li>
<li><a href="#contributing">Contributing</a></li>
<li><a href="#license">License</a></li>
<li><a href="#contact">Contact</a></li>
</ol>
</details>

## Built With
- PUG
- Javascript
<p align="right">(<a href="#top">back to top</a>)</p>
<!-- GETTING STARTED -->

## Getting Started
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
<p align="right">(<a href="#top">back to top</a>)</p>

### K-scaffold PUG
To use the K-scaffold to write the html of your sheet, you will write normal PUG, but using a comprehensive library of components that are frequently used on character sheets. These range from simple mixin versions of standard html elements inputs, textareas, and selects to more complex constructions that generate Roll20 elements or workarounds for limitations of Roll20 character sheets. See the [K-scaffold PUG documentation](https://kurohyou.github.io/Roll20-Snippets/pug.html) for full details on the mixins available.
<p align="right">(<a href="#top">back to top</a>)</p>

### K-scaffold Javascript
To use the K-scaffold to write your sheetworkers, you will write normal sheetworkers, but using a library of utility functions and sheetworker aliases supercharge the standard sheetworkers. See the [K-scaffold Javascript documentation](https://kurohyou.github.io/Roll20-Snippets/js.html) for full details on the functions and variables available.
<p align="right">(<a href="#top">back to top</a>)</p>

### Prerequisites
The K-scaffold uses the [PUG html templating engine](https://pugjs.org/api/getting-started.html) and Roll20 sheetworker syntax.
<p align="right">(<a href="#top">back to top</a>)</p>
<!-- CONTRIBUTING -->

## Contributing
Got an suggestion for a feature? Submit an issue on the Roll20-snippets repository and I'll take a look at what you've got.
<p align="right">(<a href="#top">back to top</a>)</p>
<!-- LICENSE -->

## License
Distributed under the MIT License. See [LICENSE.txt](LICENSE.txt) for more information.
<p align="right">(<a href="#top">back to top</a>)</p>
<!-- CONTACT -->

## Contact
Scott Casey - [@Kurohyou](https://twitter.com/Kurohyou) - email@example.com
Project Link: [https://github.com/Kurohyou/Roll20-Snippets](https://github.com/Kurohyou/Roll20-Snippets)
<p align="right">(<a href="#top">back to top</a>)</p>
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Kurohyou/Roll20-Snippets.svg?style=flat
[contributors-url]: https://github.com/Kurohyou/Roll20-Snippets/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Kurohyou/Roll20-Snippets.svg?style=flat
[forks-url]: https://github.com/Kurohyou/Roll20-Snippets/network/members
[stars-shield]: https://img.shields.io/github/stars/Kurohyou/Roll20-Snippets.svg?style=flat
[stars-url]: https://github.com/Kurohyou/Roll20-Snippets/stargazers
[issues-shield]: https://img.shields.io/github/issues/Kurohyou/Roll20-Snippets.svg?style=flat
[issues-url]: https://github.com/Kurohyou/Roll20-Snippets/issues
[license-shield]: https://img.shields.io/github/license/Kurohyou/Roll20-Snippets.svg?style=flat
[license-url]: https://github.com/Kurohyou/Roll20-Snippets/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/Kurohyou
[patreon-shield]: https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dkurohyoustudios%26type%3Dpatrons&style=flat
[patreon-url]: https://patreon.com/kurohyoustudios