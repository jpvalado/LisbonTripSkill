const isObject = require('is-funcs/is-object')

module.exports = function(data) {
  if (isObject(data, false) === false) return
  var res = 0
  if (typeof data.days === 'number' && data.days > 0) {
    res += data.days * 24 // 1 d = 24 h
  }
  if (typeof data.hours === 'number' && data.hours > 0) {
    res += data.hours
  }
  if (typeof data.minutes === 'number' && data.minutes > 0) {
    res += data.minutes * 1/60 // 1 m = .016666 h
  }
  if (typeof data.seconds === 'number' && data.seconds > 0) {
    res += data.seconds * 1/3600 // 1 s = .0002777 h
  }
  if (typeof data.milliseconds === 'number' && data.milliseconds > 0) {
    res += data.milliseconds * 1/3600000 // 1 ms = .00000277 h
  }
  return res
}
