# bleh

Micro-framework for the BLEH stack

- Browserify is automatic
- Less compilation is automatic
- Express routes are automatic
- Handlebars precompilation for both server and browser is automatic

Also:
- Cookie-based sesssions
- Serves static files

## Install

```
npm install bleh --save
```

## Usage

#### index.js
```js
var express = require('express')
var bleh = require('bleh')

var app = express()
app.set('port', (process.env.PORT || 5000))

app.use('/', bleh({
  // default options
  pages: __dirname + '/pages',
  public: __dirname + '/public',
  home: '/home',
  ext: {
    browserify: '.browserify.js',
    less: '.less',
    express: '.express.js',
    handlebars: '.html'
  }
}))

app.listen(app.get('port'), function() {
  console.log([
    'Bleh.',
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