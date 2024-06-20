[<img src="web\resources\svg\haxor_no-white.svg" width="250" style="display:inline-block"/>](web\resources\svg\haxor_no-white.svg)
This is my personal tech blog, where I write to learn, test out web technology, and show off personal projects.

- Built with Craft CMS 5

## DDev Installation
My preferred method of developing this project is using [DDev](https://ddev.com/). DDev is Docker-based and makes it a blast to develop on both Unix-based systems (Linux/Mac) and Windows (using WSL).

Install DDev on your system, and run the following commands to get started:

```bash
# Clone the repository
git clone git@github.com:mEsUsah/haxor.no.git
cd haxor.no

# Install backend dependencies.
ddev start
ddev composer install

# Install and build frontend dependencies
npm install
npm run prod

# Build Database
ddev craft install
```

## Credits
- Design and code by me, Stanley Skarshaug <br>
- Site logo © Skarshaug Solutions, designed by Erik Bersås <br>
- Icons by Iconpharm

## Development highlights
- Launched December 2020
- Launched free zero-login Norwegian micro:bit lessons for kids, December 2021
- Open-sourced the project, April 2022

## TODO:
- Track error pages
- GDPR Compliance
- Correct error page CSS
- Fix BEM errors