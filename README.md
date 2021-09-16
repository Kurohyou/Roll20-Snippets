[Repository Organization](https://github.com/Kurohyou/Roll20-Snippets#repository-organization) | [Submitting a snippet](https://github.com/Kurohyou/Roll20-Snippets#submitting-a-snippet) | [Available Snippets](https://github.com/Kurohyou/Roll20-Snippets#available-snippets)
# Roll20-Snippets
A repository for storing and sharing useful snippets of code for use in Roll20 API scripts and Character Sheets.

Got a template for making cool sections on a character sheet, or a function that automates some repetitive task in your coding? Share them here and help the Roll20 community tackle those problems.

## Repository Organization
The repo is organized into two subsections; **HTML & CSS Snippets** and **JS Snippets**.

**HTML & CSS Snippets**

Share clever ways of handling the unique layout needs of Roll20 character sheets. The files in this directory could be HTML, CSS, or a templating language like PUG/SCSS. JS may be included here for character sheet snippets that rely on sheetworkers to properly function.

**JS Snippets**
Share your favorite javascript functions to simplify common tasks in the Roll20 API and Sheetworkers.

### What is a snippet?
A snippet is a small piece of reusable code. They should not be overly long, likely less than 100 lines of code.

## Submitting a snippet
Snippets should be located in their own subdirectory of the appropriate main directory. The subdirectory should contain any files needed to use the snippet.
Include a sumary of how to use your snippet as a comment at the top of the snippet's file. If using the snippet is more complex, a readme.md file can be included as well to elaborate on the summary.
- Fork the repo and make a new branch to add your snippet(s) to.
- Submit a PR with your snippet(s) from your branch and fork to the main branch of the repo.
- PR's will be reviewed at least once a week on Tuesdays

# Available Snippets
## JS Snippets
[parseRepeatname](https://github.com/Kurohyou/Roll20-Snippets/tree/main/JS%20Snippets/parseRepeatName): This snippet extracts information about the repeating section, row ID, and field from a sheetworker change event object or repeating section attribute name.
## HTML/CSS Snippets
[Radios; fill to left using in-range](https://github.com/Kurohyou/Roll20-Snippets/tree/main/HTML%20%26%20CSS%20Snippets/Fill%20to%20left%20using%20in-range): This snippet provides an easy way to fill radio buttons to the left of a checked radio button without needing sheetworkers or complex html/css.
