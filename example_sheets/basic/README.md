<div id="top"></div>
<span align="center">

 [![Patreon][patreon-shield]][patreon-url]

</span>
<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">Basic Sheet Generation</h3>
<p align="center">

An Example of a basic sheet setup

<a href="https://github.com/kurohyou/"><strong>Explore the docs »</strong></a>
</p>
</div>
<!-- TABLE OF CONTENTS -->
<details>
<summary>Table of Contents</summary>
<ol>
<li>
<a href="#about-the-project">About The Project</a>
</li>
<li><a href="#contributing">Contributing</a></li>
<li><a href="#acknowledgments">Acknowledgments</a></li>
</ol>
</details>
<!-- ABOUT THE PROJECT -->

## About The Project
This directory demonstrates a very basic project setup. It has the following files and directories:
- `package.json`
The json file that tells npm what dependencies are required for our sheet. Note that this is the dependencies to build the sheet. The final sheet code has no dependencies.
- `generator.js`
Our generator file that nodemon will run whenever a pug, scss, or json file changes
- `nodemon.json`
The json file that tells nodemon how to behave
- `basic.pug`
Our very basic pug file
- `basic.scss`
Our (extremely) basic style file
- `roll20code/`
The directory that our generator outputs html, css, and translation files to
- `roll20code/basic.html`
The generated html code
- `roll20code/basic.css`
The generated CSS code
- `roll20code/translation.json`
The generated translation.json file
- `node_modules/`
The folder that NPM stores all the required files in. You won't directly interact with this folder.

We've used NPM to install the K-scaffold for this sheet. See the [install instructions](TODO: Add URL) for more information on how to do that. Once the K-scaffold is installed we can simply write our [pug](https://pugjs.org/api/getting-started.html) and [SCSSS](https://sass-lang.com/) as normal using the K-scaffold's mixins where we need them.

In order to generate our html, css, and translation files we use the K-scaffold's built in generation functions in a javascript file, `generator.js` for this project.
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/kurohyou/.svg?style=flat
[contributors-url]: https://github.com/kurohyou//graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kurohyou/.svg?style=flat
[forks-url]: https://github.com/kurohyou//network/members
[stars-shield]: https://img.shields.io/github/stars/kurohyou/.svg?style=flat
[stars-url]: https://github.com/kurohyou//stargazers
[issues-shield]: https://img.shields.io/github/issues/kurohyou/.svg?style=flat
[issues-url]: https://github.com/kurohyou//issues
[patreon-shield]: https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dkurohyoustudios%26type%3Dpatrons&style=flat
[patreon-url]: https://patreon.com/kurohyoustudios
[product-screenshot]: assets/images/screenshot.png