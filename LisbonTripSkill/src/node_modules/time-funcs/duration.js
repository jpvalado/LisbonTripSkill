module.exports = function(data, unit) {
  if (typeof data !== 'number' || data < 0 || data !== data) return
  var d = 86400000 // 1 d = 86400000 ms
  var h = 3600000  // 1 h = 3600000 ms
  var m = 60000    // 1 m = 60000 ms
  var s = 1000     // 1 s = 1000 ms

  var ms
  if (unit === undefined || unit === 'ms') ms = data
  else if (unit === 's') ms = data * s
  else if (unit === 'm') ms = data * m
  else if (unit === 'h') ms = data * h
  else if (unit === 'd') ms = data * d
  else return

  ms = Math.round(Math.round(ms * 10000000000) / 10000000000)

  // days
  var days = 0
  var tmp = ms / d
  if (tmp >= 1) {
    days = Math.floor(tmp)
    ms -= days * d
  }
  // hours
  var hours = 0
  var tmp = ms / h
  if (tmp >= 1) {
    hours = Math.floor(tmp)
    ms -= hours * h
  }
  // minutes
  var minutes = 0
  tmp = ms / m
  if (tmp >= 1) {
    minutes = Math.floor(tmp)
    ms -= minutes * m
  }
  // seconds
  var seconds = 0
  tmp = ms / s
  if (tmp >= 1) {
    seconds = Math.floor(tmp)
    ms -= seconds * s
  }
  // milliseconds
  if (ms >= 999) {
    ms = 999
  }
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: ms
  }
}
