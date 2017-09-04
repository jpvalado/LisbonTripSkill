const isObject = require('is-funcs/is-object')

module.exports = function(data) {
  if (isObject(data, false) === false) return
  var res = 0
  if (typeof data.days=== 'number' && data.days > 0) {
    res += data.days * 1440 // 1 d = 1440 m
  }
  if (typeof data.hours === 'number' && data.hours > 0) {
    res += data.hours * 60 // 1 h = 60 m
  }
  if (typeof data.minutes === 'number' && data.minutes > 0) {
    res += data.minutes
  }
  if (typeof data.seconds === 'number' && data.seconds > 0) {
    res += data.seconds * 1/60 // 1 s = .01666 m
  }
  if (typeof data.milliseconds === 'number' && data.milliseconds > 0) {
    res += data.milliseconds * 1/60000 // 1 ms = .00001666 m
  }
  return res
}
