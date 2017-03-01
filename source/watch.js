var x = require('xtend')
var http = require('http')
var fsp = require('fs-promise')
var ss = require('serve-static')
var fh = require('finalhandler')
var cd = require('chokidar')
var ok = require('object-keys')
var np = require('path')
var promise = require('any-promise')

var entry = require('./entry')

function serve (opts) {
  var o = x({
    port: 3000,
    directory: ''
  }, opts)

  var json = process.cwd() + '/data.json'
  var watcher = undefined

  var serve = ss(process.cwd(), {
    'index': ['index.html']
  })
   
  var server = http.createServer((req, res) => {
    serve(req, res, fh(req, res))
  })

  fsp
    .stat(json)
    .then(data => fsp.readJson(json))
    .then(data => {
      var entries = ok(data)
      watcher = cd
        .watch(entries, {
          ignored: /[\/\\]\./,
          persistent: true
        })
        .on('change', path => entry.save(np.dirname(path))) 
    })
   
  server.listen(o.port)
  return console.log('serving: http://localhost:' + o.port) 
}

module.exports = serve