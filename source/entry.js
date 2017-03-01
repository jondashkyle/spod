var fse = require('fs-promise')
var pj = require('path.join')
var x = require('xtend')
var promise = require('any-promise')

function getDirName (dir) {
  return dir
    ? dir.replace(/\//g, '')
    : false
}

function getData (dir) {
  var entry = pj(process.cwd(), dir)
  return dir ? {
    json: pj(entry, 'data.json'),
    md: pj(entry, 'text.md')
  } : false
}

function entryExists (json, md) {
  return new promise((resolve, reject) => {
    return promise
      .all([
        fse.stat(json),
        fse.stat(md)
      ])
      .then(resolve)
      .catch(err => reject('data/text does not exist'))
  })
}

function loadEntry (dir, json, md) {
  return new promise((resolve, reject) => {
    return promise
      .all([
        fse.readJson(json),
        fse.readFile(md, 'utf8')
      ])
      .then(data => {
        return resolve(x({
          path: dir,
          text: data[1]
        }, data[0]))
      })
      .catch(() => reject('unable to load data/text'))
  })
}

function mergeData (_dir, _data) {
  return new promise((resolve, reject) => {
    var file = process.cwd() + '/data.json'
    return fse.stat(file)
      .then(() => fse.readJson(file))
      .then(json => resolve(x(json, {
        [_dir] : _data
      })))
      .catch(() => reject('api json does not exist'))
  })
}

function writeData (data) {
  return new promise((resolve, reject) => {
    var file = process.cwd() + '/data.json'
    return fse.stat(file)
      .then(() => fse.readJson(file))
      .then(json => fse
        .outputJson( file, data, err => err
          ? reject('can not write data')
          : resolve('success')
        )
      )
      .catch(() => reject('api json does not exist'))
  })
}

function saveEntry (mod) {
  var dir = getDirName(mod)
  var data = getData(dir)

  return entryExists(data.json, data.md)
    .then(() => loadEntry(dir, data.json, data.md))
    .then(data => mergeData(dir, data))
    .then(data => writeData(data))
    .catch(data => console.warn(data))
}

function removeEntry (mod) {
  var dir = getDirName(mod)

  return new promise((resolve, reject) => {
    var file = process.cwd() + '/data.json'
    return fse.stat(file)
      .then(() => fse.readJson(file))
      .then(json => {
        delete json[_dir]
        return resolve(json)
      })
      .catch(() => reject('api json does not exist'))
  })
  .then(data => writeData(data))
  .then('removed ' + dir)
  .catch('can not remove ' + dir)
}

module.exports = {
  save: saveEntry,
  load: loadEntry,
  remove: removeEntry,
  exists: entryExists,
  getData: getData,
  mergeData: mergeData,
  writeData: writeData
}
