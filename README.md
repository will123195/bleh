# bleh

[![Build Status](https://travis-ci.org/will123195/bleh.svg)](https://travis-ci.org/will123195/bleh)

A web framework with automatic Browserify + Less + Express + Handlebars.

[![bleh](bleh.gif)](https://github.com/will123195/bleh)

- **Browserify** is automatic
- **Less** compilation is automatic
- **Express** routing is automatic
- **Handlebars** precompilation is automatic for both server and browser
- Serves static files
- Secure cookie-based sessions

## Quick start

```
npm install -g bleh
mkdir my-app && cd my-app
npm init
bleh init
npm run dev
```

## Usage

```js
const bleh = require('bleh')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
app.use('/', bleh())
app.on('ready', () => {
  app.listen(port, () => {
    console.log([
      'My App',
      `Running: http://localhost:${port}`,
      `NODE_ENV: ${process.env.NODE_ENV}`,
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
├─ test/
├─ server.js
└─ package.json
```

See also the [sample app](sample-app).

#### pages/

Routes are generated automatically based on the `pages/` folder structure. Each page has a [controller](#controllers) (`.node.js` file) and normally has `.html`, `.less` and `.browserify.js` files located together in that page's folder.

The page's `js` and `css` files are automatically embedded via the `html5` *layout*.

Words beginning with `$` in the page name are URL params. See [example](#pagesuserusernodejs).

#### layouts/

You can set the layout for the page by calling [`$.layout(name)`](#controller-methods-and-properties). Layouts have automatic Browserify, LESS and Handlebars compilation just like [pages](#pages) but the layout's `.html` file must contain `{{{main}}}`.

#### partials/

Partials can be included in other templates. Partials are just plain ol' handlebars templates. Put your Handlebars helper methods in `lib/handlebars-helpers.js`.

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

When deploying to production, `bleh build` will run automatically after `npm install` (i.e. you should have `"postinstall": "bleh build"` in `package.json`).

Use `npm run dev` for development so your app restarts and rebuilds when a source file changes.

#### Browserify

If you add your commonly used client-side npm modules to the [`browserifyCommonDependencies`](sample-app/package.json) array in your `package.json`, then an [external browserify bundle](https://github.com/substack/node-browserify#multiple-bundles) will be used. This will reduce the size of your page-specific `js` bundles.

#### Less

You can [reference](http://lesscss.org/features/#import-options-reference) any other `.less` file to gain access to its variables/classes/mixins. For example, the [`html5`](shared/layouts/html5) layout provides a `.clearfix` style for convenience.

```less
@import (reference) 'layouts/html5/html5.less';
.something {
  .clearfix;
  color: @black;
}
```

#### Handlebars

Your handlebars helpers will work on both the server and client if you specify them in `lib/handlebars-helpers.js` (assuming you're using the `html5` layout).

For example: [`handlebars-helpers.js`](sample-app/lib/handlebars-helpers.js)

Also, if you're using the `html5` layout, you can use `window.render()`  to render any of your `.html` templates on the client side. You can see the templates you have available with `console.log(Handlebars.templates)`.

```js
var html = window.render('partials/hello', data)
```

## Options

All options are optional.

```js
var app = bleh({
  // default options
  dist: 'public/dist',
  helpers: {},
  home: '/home',
  https: false,
  log: console.log,
  root: __dirname,
  sessions: false // {secret: 'My EncRypT10n k3Y'}
})
```

- **dist** - The folder to contain the build files.
- **helpers** - This object gets merged into the context of the [controller](#controllers).
- **home** - The page (uri) to be used as the homepage. By default, `/home` redirects to `/`.
- **https** - This option forces a redirect to `https` only in production.
- **log** - The function for log output. Defaults to `console.log`.
- **root** - The path to the root folder of your app (which contains `pages/`). See [file structure](#file-structure).
- **sessions** - Configuration for cookie-based sessions. To enable sessions, you need a `secret` value. See [client-sessions](https://www.npmjs.com/package/client-sessions).

## Controllers

The [build](#build) automatically creates routes for `.node.js` files (controllers) that exist in the [`pages/`](#pages) folder.

For example:

##### pages/beep.json.node.js
```js
// uri: /beep.json
module.exports = function ($) {
  $.send({
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
module.exports = function ($) {
  console.log($.$user) // will123195
  $.render()
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

#### Controller methods and properties

- `accessDenied()` - sends 403 response
- `body` - the request body (i.e. POST data)
- `error(err)` - sends 400 response
- `get(fn)` - calls `fn` if request method is GET
- `layout(name)` - invokes a layout
- `notFound()` - sends 404 response
- `post(fn)` - calls `fn` if request method is POST
- `query` - the parsed querystring
- `redirect([301|302], uri)` - sends redirect response
- `render()` - sends rendered html using `this` data
- `req` - the http request object
- `res` - the http response object
- `send(obj|str)` - sends a text or json response
- `session` - the values encrypted in a cookie
- `set(helpers)` - merges new properties into this context
- `templates` - the array of precompiled template functions
- `view(name)` - changes the default template to be `render()`ed

Additional `helpers` specified in the [options](#options) are merged into the controllers' context. For example, adding your `db` as a helper will make it accessible in all controllers as `this.db`.

Note: `req`, `res` and `templates` are hidden for convenience so you can `console.log(this)` without so much noise.
