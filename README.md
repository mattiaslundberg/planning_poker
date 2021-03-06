# Planning Poker 

Simple planning poker application.

Backend using [Django](https://www.djangoproject.com) & Django Channels.

Frontend in vanilla JS, bundled with [Parcel](https://parceljs.org).

Both backend and frontend needs to be running to use the application.

## Getting started (backend)

Recommended installation with pyenv:

1. Install Python 3.9 with [pyenv](https://github.com/pyenv/pyenv#installation) `pyenv install 3.9.2`
2. Install [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv#installation)
3. Create new virtualenv with pyenv-virtualenv `pyenv virtualenv 3.9.2 planning_poker`
4. Activate the virtualenv when in the project folder `pyenv local planning_poker`
5. Install dependencies `pip install -r requirements.txt`
6. Run server `./manage.py runserver`
7. Run tests using `./manage.py test`

Installation with homebrew python (assuming MacOS and Posix-compatible shell such as bash or zsh):

1. Install [homebrew](https://brew.sh)
2. Install python `brew install python@3.9`
3. Create virtualenv `python -m venv venv`
4. Activate virtualenv `. venv/bin/activate`
5. Install dependencies `pip install -r requirements.txt`
6. Run server `./manage.py runserver`
7. Run tests using `./manage.py test`

## Getting started (frontend)

Install [nodejs](https://nodejs.org/en/), instructions follow for MacOS and homebrew but any other installation would work. Tested with current release 15.11.0:

1. Install [homebrew](https://brew.sh)
2. Install nodejs `brew install nodejs`
3. Install dependencies `npm i`
4. Start development server `npx parcel index.html`
