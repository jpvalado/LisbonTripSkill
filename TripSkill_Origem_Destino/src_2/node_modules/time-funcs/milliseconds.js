const isObject = require('is-funcs/is-object')

module.exports = function(data) {
  if (isObject(data, false) === false) return
  var res = 0
  if (typeof data.days=== 'number' && data.days > 0) {
    res += data.days * 86400000 // 1 d = 86400000 ms
  }
  if (typeof data.hours === 'number' && data.hours > 0) {
    res += data.hours * 3600000 // 1 h = 3600000 ms
  }
  if (typeof data.minutes === 'number' && data.minutes > 0) {
    res += data.minutes * 60000 // 1 m = 60000 ms
  }
  if (typeof data.seconds === 'number' && data.seconds > 0) {
    res += data.seconds * 1000 // 1 s = 1000 ms
  }
  if (typeof data.milliseconds === 'number' && data.milliseconds > 0) {
    res += data.milliseconds
  }
  return res
}
