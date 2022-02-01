# A Sheet Author's Journey - 1
Got a system you want to play on Roll20, but it doesn’t have a character sheet already created? Then this is the blog series for you! If you're just curious what the heck the K-scaffold is, then this series is for you too! We’ll be going through the process of creating a character sheet by making a sheet for use on Roll20 from scratch.

Over the next several weeks we’ll be creating a character sheet for [The Hero’s Journey, 2nd edition](https://www.drivethrurpg.com/product/295279/The-Heros-Journey-Second-Edition), which does not currently have a sheet on Roll20. Each week we’ll cover a different aspect of creating the sheet, from setting up the project to coding the sheetworkers that will power it, and even how to submit it to Roll20 so everyone can use it.

## What is a character sheet?
So, what is a character sheet on Roll20? Just like a paper character sheet, a Roll20 character sheet template is a graphical interface for updating the attributes of a character. Unlike that paper character sheet, we need to use computer code to create the template. This includes HTML to create the actual elements that we’ll interact with, CSS to style those elements so that they look nice, and javascript to power and automate the sheet.

## How do you make a Roll20 character sheet?
You can make a character sheet with just raw HTML and CSS, but there are some great tools to make the process easier. For this project we're going to use these additional tools:
- [PUG](https://pugjs.org/api/getting-started.html): PUG is a templating language for HTML. This will let us write less actual code than if we were to write the sheet in pure HTML. Additionally, our code will look cleaner and be easier to read and understand.
- [SCSS](https://sass-lang.com/): Just like PUG allows us to write less HTML, SCSS allows us to write less CSS and make our styling easier to understand.
- [The K-scaffold](https://github.com/Kurohyou/Roll20-Snippets/tree/main/K_Scaffold): The K-scaffold is a library of PUG and Javascript functions that allow us to write Roll20 specific code easier. Don't worry, it doesn't require learning a new language or have an onerous syntax.
- A Code editor: A code editor helps when writing code because it gives us syntax highlighting and other code based abilities. For this project, I'll be writing my code in [Visual Studio code](https://code.visualstudio.com/), which is a powerful and free code editor.
- [Prepros](https://prepros.io/): Prepros is a program that automates parsing our PUG and SCSS into HTML and CSS. You can do without Prepros, but will need to use the command line interface to generate HTML and CSS from PUG.

With these five tools, we'll make a stylish and powerful sheet for *Hero's Journey*.
## Let's get Started
Ok, we've got our tools and we know what system we're making a sheet for. How do we start? The two things that I do at the start of every project are sketch out a design for the sheet and setup my project's folder structure.

### Sketch a design
The best place to start when tackling a new sheet is to figure out the design for the sheet. This can be as in depth as you want it to be. I typically spend an hour or so sketching out a wireframe of how the sheet is going to be layed out. Here's what I'm thinking of for the Hero's Journey sheet:

[Hero's Journey Wireframe Sketch](../assets/wireframe.png)

This sketch will be my guide for how to structure the code of the sheet. The final layout and design of the sheet will almost certainly change from this, but this gives us a roadmap of things that we need to create and prepare for. So, what have I thought about while making this sketch?

We are making a sheet in a different medium from the original paper character sheet. The Roll20 character sheet doesn't have a maximum (or minimum) height since a user can scroll if needed. The width of the sheet is dynamic as well and might be enlarged to cover an ultra-wide monitor or pulled up on one side of a small laptop screen. Our design should be able to adapt to any width across this spectrum. This means making a responsive design. I've found that the easiest way to do a responsive design is to build your sheet in columns when possible. Then elements can collapse into a neighboring column if the sheet is too narrow, or expand into additional columns if it is very wide. We can make this more dynamic by using media queries to create more complex layouts at given widths, but this should be kept to a minimum as trying to program in a style for all possible usecases is an excellent way to fail your sanity check!

In addition to the responsiveness of the design we need to consider why the sections on the paper sheet take up the space that they do. Paper sheets frequently provide lots of space for areas where a character might need a range of things. Sections like weapons, abilities, equipment, and spells can be turned into a repeating section on a Roll20 sheet. We’ll cover how to do this when we get to actual code, but for now a repeating section is just a section of the sheet that users can dynamically add content to. This means that these areas will initially take up much less room on our sheet than they do on the paper sheet, but could grow to be much larger than they are on the paper sheet.

The final consideration isn't a layout one at all. It's a stylistic problem. This paper sheet has lots of nice graphical elements to it to make it look like each section is a scrap of parchment. We’ll need to keep in mind that copying that aesthetic on a digital sheet with sections that can grow and shrink dynamically is difficult, so we may need to find a different styling option for our digital sheet, but that's something we'll tackle when we get to the SCSS.

### Setup Project Structure
This probably seems like a minor thing, and in terms of time spent it is! But, making sure that we know where our code is going to reside while we work on it and how it's going to be organized can save us time down the road when we're hunting for bugs or even just trying to remember where a file that we haven't looked at in a month is. Here's how I'm going to setup my folder structure for the Hero's Journey sheet:
- thj2ee `folder`
  - scaffold `folder`: This will hold the code of the K-scaffold.
  - javascript `folder`: This will hold all of the sheetworkers that we're going to write to power the sheet
  - mixins `folder`: This will hold our project specific PUG and SCSS mixins that we'll inevitably create to automate some of our code generation
  - articles `folder`: We'll divide our sheet code up into sections that will get stored in here with each one in it's own folder
  - system.pug: Our master SCSS file that will assemble our full sheet's html for us
  - system.scss: Our master SCSS file
  - sheet.json: The JSON file that will tell the Roll20 Repo what to do with our sheet files when we finally upload them to the repository
  - translation.json: The JSON file that will store all of our translation keys and values for crowdin to generate the language specific files from.
  - system.html: The sheet's HTML that PUG will generate for us. We may never actually look at the raw code in ths file
  - system.css: The sheet's CSS that SCSS will generate for us. We may never actually look at the raw code in ths file

## What's next?
We obviously haven't done any coding yet. We'll start with writing the first bit of PUG for the sheet next week and see where that takes us.

Want to support this blog series? Drop by the [Kurohyou Studios Patreon](https://patreon.com/kurohyoustudios)!

[See the previous Blog post about the K-scaffold](https://app.roll20.net/forum/post/10646215/introducing-the-k-scaffold-for-building-character-sheets)