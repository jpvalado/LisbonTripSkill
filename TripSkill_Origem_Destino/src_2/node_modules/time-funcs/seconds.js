const isObject = require('is-funcs/is-object')

module.exports = function(data) {
  if (isObject(data, false) === false) return
  var res = 0
  if (typeof data.days === 'number' && data.days > 0) {
    res += data.days * 86400 // 1 d = 86400 s
  }
  if (typeof data.hours === 'number' && data.hours > 0) {
    res += data.hours * 3600 // 1 h = 3600 s
  }
  if (typeof data.minutes === 'number' && data.minutes > 0) {
    res += data.minutes * 60 // 1 m = 60 s
  }
  if (typeof data.seconds === 'number' && data.seconds > 0) {
    res += data.seconds
  }
  if (typeof data.milliseconds === 'number' && data.milliseconds > 0) {
    res += data.milliseconds * .001 // 1 ms = .001 s
  }
  return res
}
