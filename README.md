# bleh

[![Build Status](https://travis-ci.org/will123195/bleh.svg)](https://travis-ci.org/will123195/bleh)

A web framework using Browserify + Less + Express + Handlebars.

[![bleh](bleh.gif)](https://github.com/will123195/bleh)

- **Browserify** is automatic
- **Less** compilation is automatic
- **Express** routing is automatic
- **Handlebars** precompilation is automatic for server and browser
- Serves static files
- Secure cookie-based sessions

## Install

```
npm install -s bleh browserify less express handlebars
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

### pages/

Routes are generated automatically based on the `pages/` folder structure. Each page has a [controller](#controllers) (`.node.js` file) and pages normally have `.html`, `.less` and `.browserify.js` files located together in that page's folder.

The page's corresponding `js` and `css` are linked onto the html of the page automatically if the page is using the `html5` layout.

### layouts/

Layouts can be invoked by pages or other layouts with the [`layout`](#layout) method. Layouts are just like [pages](#pages) except layout templates have a `{{{main}}}` expression--which is where the inner html is rendered. Also, unlike pages, layouts do not generate routes.

### partials/

Partials can be included in other templates.

```html
<div>
  {{> partials/hello}}
</div>
```

### public/

All files in the `public` folder are served as static files.

## Build

Production-ready files get created at runtime in the `public/dist/` folder by default. The app's `ready` event fires when the build is complete.

However, in the `production` environment, it is assumed that the `dist` files have already been generated and the `ready` event fires immediately so there is no brief delay starting the app.

While developing, it's useful to run the app with a watch script to restart the app when any source file changes, for example:

```
nodemon -e js,html,css,less,json,txt --ignore public/dist/
```

You can also run `bleh build` on the command line to build the production-ready `dist` files.

You may choose to gitignore `public/dist/` to prevent extra diffs in your commits. In this case you need to run `bleh build` prior to deploying your app to production (or add `"postinstall": "bleh build"` to your `package.json`).

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

The `helpers` object gets merged into the context of the controller. See [pages](#pages).

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

### Examples

The [build](#build) automatically creates routes for `.node.js` files that exist in the `pages/` folder.

#### pages/beep.json.node.js

```js
// uri: /beep.json
module.exports = function () {
  this.send({
    beep: 'boop'
  })
}
```

#### pages/hello/hello.node.js

```js
// uri: /hello
module.exports = function ($) {
  // set data to be rendered
  $.title = 'Hello'
  // add additional css or js to the page
  $.css.push('//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css')
  // specify the layout and run it's controller
  $.layout('website')
  // send the rendered html
  $.render()
}
```

#### pages/$user/$user.node.js

```js
// uri: /will123195
module.exports = function () {
  console.log(this.$user) // will123195
  this.render()
}
```

#### layouts/website/website.node.js

Each layout has a controller that runs when the [layout](#layout) method is invoked. Bleh provides a generic [`html5`](shared/layouts/html5) layout that does the `css` and `js` magic.

```js
module.exports = function ($) {
  $.now = Date.now()  // set data needed for all pages using this layout
  $.layout('html5')   // html5 boilerplate + autolink css & js
}
```

### Default helpers

- [`accessDenied()`](#accessDenied)
- [`body`](#body)
- ['error(err)`](#error)
- ['get(fn)`](#get)
- ['layout(name)`](#layout)
- ['notFound()`](#notFound)
- ['post(fn)`](#post)
- ['query`](#query)
- ['redirect([301|302], uri)`](#redirect)
- ['render()`](#render)
- ['req`](#req)
- ['res`](#res)
- ['send(obj|str)`](#send)
- ['session`](#session)
- ['set(helpers)`](#set)
- ['view(name)`](#view)

Any additional `helpers` specified in the [options](#options) are also available in all controllers.

Note: `req` and `res` are hidden for convenience so you can `console.log(this)` without so much noise.
