# bleh

[![Build Status](https://travis-ci.org/will123195/bleh.svg)](https://travis-ci.org/will123195/bleh)

A web framework using Browserify + Less + Express + Handlebars.

[![bleh](bleh.gif)](https://github.com/will123195/bleh)

- **Browserify** is automatic
- **Less** compilation is automatic
- **Express** routing is automatic
- **Handlebars** precompilation is automatic for both server and browser
- Serves static files
- Secure cookie-based sessions

## Install

```
npm install --save bleh browserify less express handlebars
```

## Quick start

```
npm install -g bleh
mkdir my-app
cd my-app
npm init
bleh init --jquery
npm start
```

## Usage

#### server.js
```js
var bleh = require('bleh')
var app = bleh()
var port = process.env.PORT || 8080
app.on('ready', function () {
  app.listen(port, function () {
    console.log([
      'My App',
      'Running: http://localhost:' + port,
      'NODE_ENV: ' + process.env.NODE_ENV,
    ].join('\n'))
  })
})
```

## File structure

```
├─ layouts/
├─ node_modules/
├─ pages/
│  ├─ home/
│  │  ├─ home.browserify.js
│  │  ├─ home.less
│  │  ├─ home.node.js
│  │  └─ home.html
│  └─ $name/
│     └─ $name.node.js
├─ partials/
├─ public/
│  ├─ dist/
│  └─ robots.txt
├─ server.js
└─ package.json
```

See also the [sample app](sample-app).

#### pages/

Routes are generated automatically based on the `pages/` folder structure. Each page has a [controller](#controllers) (`.node.js` file) and pages normally have `.html`, `.less` and `.browserify.js` files located together in that page's folder.

The page's corresponding `js` and `css` are linked onto the html of the page automatically if the page is using the `html5` layout.

#### layouts/

Layouts can be invoked by pages or other layouts with the [`layout`](#layout) method. Layouts are just like [pages](#pages) except layout templates have a `{{{main}}}` expression--which is where the inner html is rendered. Also, unlike pages, layouts do not generate routes.

#### partials/

Partials can be included in other templates.

```html
<div>
  {{> partials/hello}}
</div>
```

#### public/

All files in the `public` folder are served as static files.

## Build

The build process generates the `public/dist/` folder containing the `js` and `css` for your app.

The build is generated at runtime (except in `production`) and the app's `ready` event fires when the build is complete.

In the `production` environment, the build step is skipped and the `ready` event fires immediately to avoid a brief delay starting the app.

If you choose not to commit your `public/dist/` to version control, then you need to run `bleh build` prior to deploying your app to production (i.e. add `"postinstall": "bleh build"` to your `package.json`).

While developing, it's useful to run the app with a watch script to restart the app when any source file changes (which automatically rebuilds). For example:

```
nodemon -e js,html,css,less,json,txt --ignore public/dist/
```

#### Browserify

If you add your commonly used client-side npm modules to the [`browserifyCommonDependencies`](sample-app/package.json) array in your `package.json`, then an [external browserify bundle](https://github.com/substack/node-browserify#multiple-bundles) will be used. This will reduce the size of your page-specific `js` bundles.

#### Less

You can [reference](http://lesscss.org/features/#import-options-reference) any other `.less` file to gain access to its variables/classes/mixins. For example, the [`html5`](shared/layouts/html5) layout provides a `.clearfix` style for convenience.

```less
@import (reference) 'layouts/html5/html5.less';
.something {
  .clearfix;
}
```

#### Handlebars

Your handlebars helpers will work on both the server and client if you specify them in `lib/handlebars-helpers.js` (assuming you're using the `html5` layout).

For example: [`handlebars-helpers.js`](sample-app/lib/handlebars-helpers.js)

Also, if you're using the `html5` layout, a global `render()` function is available to render any of your `.html` templates on the client.

```js
var html = render('partials/hello', data)
```

## Options

All options are optional.

```js
var app = bleh({
  // default options
  helpers: {},
  home: '/home',
  https: false,
  log: console.log,
  root: __dirname,
  sessions: false
})
```

#### helpers

The `helpers` object gets merged into the context of the [controller](#controllers).

#### home

The page uri to be used as the homepage. By default, `/home` redirects to `/`.

#### https

This option forces a redirect to `https` only in production.

#### log

Defaults to `console.log`.

#### root

The path to the root folder of your app should contain the above [file structure](#file-structure).

#### sessions

Specify a secret for encrypting cookie-based session data. If you change this key all user sessions will be erased (all users will get logged out).

```js
bleh({
  sessions: {
    secret: 'my secret key'
  }
})
```

## Controllers

The [build](#build) automatically creates routes for `.node.js` files (controllers) that exist in the [`pages/`](#pages) folder.

For example:

##### pages/beep.json.node.js
```js
// uri: /beep.json
module.exports = function () {
  this.send({
    beep: 'boop'
  })
}
```

##### pages/hello/hello.node.js
```js
// uri: /hello
module.exports = function ($) {
  $.title = 'Hello' // set data to be rendered
  // add additional css or js to the page
  $.css.push('//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css')
  $.layout('website') // specify the layout and call its controller function
  $.render() // send the rendered html
}
```

##### pages/$user/$user.node.js
```js
// uri: /will123195
module.exports = function () {
  console.log(this.$user) // will123195
  this.render()
}
```

##### layouts/website/website.node.js
```js
module.exports = function ($) {
  $.now = Date.now()  // set data for all pages using this layout
  $.layout('html5')   // html5 boilerplate + link css & js
}
```
Each layout has a controller that runs when the [`layout`](#layout) method is invoked. A generic [`html5`](shared/layouts/html5) layout is provided that magically links the corresponding `css` and `js` onto the page if invoked.

#### Controller helpers

- [`accessDenied()`](#accessDenied) - sends 403 response
- [`body`](#body) - the request body (i.e. POST data)
- [`error(err)`](#error) - sends 400 response
- [`get(fn)`](#get) - calls `fn` if request method is GET
- [`layout(name)`](#layout) - invokes a layout
- [`notFound()`](#notFound) - sends 404 response
- [`post(fn)`](#post) - calls `fn` if request method is POST
- [`query`](#query) - the parsed querystring
- [`redirect([301|302], uri)`](#redirect) - sends redirect response
- [`render()`](#render) - sends rendered html
- [`req`](#req) - the http request object
- [`res`](#res) - the http response object
- [`send(obj|str)`](#send) - sends a text or json response
- [`session`](#session) - the values encrypted in a cookie
- [`set(helpers)`](#set) - merges new properties into this context
- [`templates`](#templates) - the array of precompiled template functions
- [`view(name)`](#view) - changes the default template to be `render()`ed

Additional `helpers` specified in the [options](#options) are merged into the controllers' context. For example, adding your `db` as a helper will make it easily accessible in all controllers.

Note: `req`, `res` and `templates` are hidden for convenience so you can `console.log(this)` without so much noise.
