var bleh = require('..')
var app = bleh({
  sessions: {
    secret: 'some unique random key with plenty of entropy'
  }
})
app.set('port', (process.env.PORT || 5000))
module.exports = app
