# barkbaud-ui

Sample Angular application built with SKY UX.

## Introduction

This project may be built as a stand-alone [SKY UX](http://skyux.developer.blackbaud.com/) application. To view sample code that interacts with [SKY API](https://developer.sky.blackbaud.com/), go to the [barkbaud](https://github.com/blackbaud/barkbaud) repo, which implements the [Authorization Code Flow](https://apidocs.sky.blackbaud.com/docs/authorization/auth-code-flow/) for various endpoints, built on a Node.js/Express server. (The barkbaud repo consumes this repo for its front-end.)

## Build instructions

These instructions assume you know how to use Git, NPM and Bower.

- Clone the repo using `git clone https://github.com/blackbaud/barkbaud-ui.git`
- Run `npm install`, `bower install`, and `grunt build` from the directory where you cloned the repo
- Launch the sample site from a web server (the NPM package [http-server](https://www.npmjs.com/package/http-server) makes it easy to launch a web server from any location on your local drive; see below).
    - Type: `npm install http-server -g`.
    - To run the server on a specific port, type: `http-server -p 5000 -a localhost` (port 8080 should also work).
    - Navigate to [http://localhost:5000/build/](http://localhost:5000/build/) to test it out.
- Start adding your own features using the patterns established in the samples.
