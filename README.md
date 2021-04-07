# Integrator

> An integration tool that loads data from a CSV file, schedules some email communications, and then executes automated tests to ensure all data and logic was executed correctly.

## 

## Prerequisites

- [Node.js](https://nodejs.org/dist/v14.16.0/) - 14.16.0 or above
- [NPM](https://docs.npmjs.com/getting-started/installing-node) - 7.7.6 or above
- [Mongo DB](https://www.mongodb.com/try/download/community) - 4.4.3 or above

-------------------
## Setup

Clone the repository and install the dependencies.

    $ git clone git@github.com:shashikhanal/integrator.git <application-name>
    $ cd <application-name>
    $ npm install

Make a copy of `.env.example` as `.env` and update your application details.

    $ cp .env.example .env
*Start MongoDB service and create new database if you have to.*

Create the log directory and log file

    $ mkdir logs
    $ touch logs/logs.txt

## Run
```
$ npm start
```
*Node.js and MongoDB should be already installed before running the above command. See [node.js](https://nodejs.org/en/download/package-manager/) and [MongoDB](https://www.mongodb.com/try/download/community) for their intallation.*


Check you collections in Mongo database to verify it's working.

That's it, setup is complete.

## Tests

    $ npm test

## License

[MIT License](https://opensource.org/licenses/MIT)