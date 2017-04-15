module.exports = function () {
  var error = new Error('Error!')
  error.statusCode = 400
  throw error
}