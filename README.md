# bleh

A web framework using Browserify + Less + Express + Handlebars.

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
var bleh = require('bleh')

var app = bleh()
app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
  console.log([
    'My App',
    'Running: http://localhost:' + app.get('port'),
    'NODE_ENV: ' + process.env.NODE_ENV,
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

You may choose to *gitignore* `public/dist/` to prevent extra diffs in your commits. In this case you should add `"postinstall": "bleh build"` to your `package.json` to ensure your app is built after install, i.e. when deployed to production.

## Options

```js
var app = bleh({
  // default options
  helpers: {},
  home: 'home',
  https: false,
  log: console.log,
  root: __dirname,
  sessions: false
})
```

### helpers



### home


### https


### log


### root


### sessions

Specify a secret for encrypting cookie-based session data. If you change this key all user sessions will be erased (all users will get logged out).

```
bleh({
  sessions: {
    secret: 'my secret key'
  }
})
```