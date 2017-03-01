#! /usr/bin/env node
var argv = require('yargs').argv

var entry = require('./entry')
var watch = require('./watch')

function method (name, cb) {
  var mod = argv._[1]
  return argv._[0] === name
    ? typeof cb === 'function'
      ? cb(mod)
      : false
    : false
}

method('add', mod => mod
  ? entry.save(mod)
  : console.log('please provide a directory to add')
)

method('remove', mod => mod
  ? entry.remove(mod)
  : console.log('please provide a directory to remove')
)

method('watch', watch)

