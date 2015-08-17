# bleh

A micro-framework using Browserify + Less + Express + Handlebars.

[![bleh](bleh.gif)](https://github.com/will123195/bleh)

- **Browserify** is automatic
- **Less** compilation is automatic
- **Express** routing is automatic
- **Handlebars** precompilation is automatic for server and browser
- Serves static files
- Secure sessions stored in cookies

## Install

```
npm install -s bleh browserify less express handlebars
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

#### File structure

```
├─ node_modules/
├─ pages/
│  ├─ home/
│  │  ├─ home.browserify.js
│  │  ├─ home.less
│  │  ├─ home.node.js
│  │  └─ home.html
│  └─ $name/
│     └─ $name.node.js
├─ public/
│  ├─ dist/
│  └─ robots.txt
├─ index.js
└─ package.json
```

See also the [sample app](test/sample-app).

## Build

The build happens automatically at runtime, except in the `production` environment. Production-ready files are created in the `public/dist/` folder by default.

In the `production` environment, it is assumed that `public/dist/` has already been generated so there is no brief delay starting the app.

While developing, it's useful to run the app with a watch script like this to restart the app when any source file changes:

```
nodemon -e js,html,css,less,json,txt --ignore public/dist/
```

You may choose to *gitignore* `public/dist/` to prevent extra diffs in your commits. In this case you should add `"postinstall": "bleh build"` to your `package.json` to ensure your app is rebuilt after install, i.e. when deployed to production.

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
