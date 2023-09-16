
# [<img src="web/resources/svg/haxor-logo-only-black.svg" width="40" style="display:inline-block"/>](web/resources/svg/haxor-logo-only-black.svg) Haxor.no #
My personal tech blog that act as an ongoing experiment where i write to learn, test out web technology, and show of personal projects.

- Built with Craft CMS 4.x.

## DDev Installation
My prefered method of developing this project is using [DDev](https://ddev.com/). DDev is Docker-based and makes it a blast to develop on both Unix-based systems (Linux/Mac) and Windows (using WSL).

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
- Incons by Iconpharm

## Development highlights
- Lauched December 2020
- Launched free zero-login norwegian micro:bit lessons for kids, December 2021
- Open sourced project, April 2022

## TODO:
- Track error pages
- GDPR compliance
- Correct error page CSS
- Fix BEM errors