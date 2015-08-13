# bleh

A micro-framework using Browserify + Less + Express + Handlebars.

[![bleh](bleh.gif)](https://github.com/will123195/bleh)

- *Browserify* is automatic
- *Less* compilation is automatic
- *Express* routing is automatic
- *Handlebars* precompilation is automatic for server and browser
- Serves static files
- Secure sessions stored in cookies

## Install

```
npm install --save bleh browserify less express handlebars
```

## Usage

#### index.js
```js
var express = require('express')
var bleh = require('bleh')

var app = express()
app.set('port', (process.env.PORT || 5000))

app.use('/', bleh())

app.listen(app.get('port'), function () {
  console.log([
    'My Bleh App',
    'Running: http://localhost:' + app.get('port'),
    'process.env.NODE_ENV: ' + process.env.NODE_ENV,
  ].join('\n'))
})
```

## Getting started

```
├─ node_modules/
├─ pages/
│  ├─ home/
│  │  ├─ home.browserify.js
│  │  ├─ home.less
│  │  ├─ home.express.js
│  │  └─ home.html
│  └─ $name/
│     └─ $name.express.js
├─ public/
│  ├─ dist/
│  └─ robots.txt
├─ index.js
└─ package.json
```

## Build

The client distribution build happens automatically at runtime, except in the `production` environment. The build process creates production-ready files in the `public/dist/` folder by default.

In the `production` environment, it is assumed that `public/dist/` has already been generated so there is no delay starting the app.

For this reason, you will need to add `"postinstall": "bleh build"` to your `package.json` (or simply commit `public/dist/` to version control if you don't mind the extra diffs).

## Options

```js
bleh({
  // default options
  pages: [__dirname + '/pages'],
  layouts: [
    __dirname + '/layouts',
    __dirname + '/node_modules/bleh/test/sample-app/layouts'
  ],
  partials: [__dirname + '/partials'],
  public: [__dirname + '/public'],
  dist: [__dirname + '/public/dist'],
  home: 'home',
  ext: {
    browserify: '.browserify.js',
    less: '.less',
    node: '.node.js',
    handlebars: '.html'
  },
  helpers: {},
  sessions: false
})
```
