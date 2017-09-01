const isObject = require('is-funcs/is-object')

module.exports = function(data) {
  if (isObject(data, false) === false) return
  var res = 0
  if (typeof data.days === 'number' && data.days > 0) {
    res += data.days
  }
  if (typeof data.hours === 'number' && data.hours > 0) {
    res += data.hours * 1/24 // 1 h = .041666 d
  }
  if (typeof data.minutes === 'number' && data.minutes > 0) {
    res += data.minutes * 1/1440 // 1 m = .000694444 d
  }
  if (typeof data.seconds === 'number' && data.seconds > 0) {
    res += data.seconds * 1/86400 // 1 s = .000011574 d
  }
  if (typeof data.milliseconds === 'number' && data.milliseconds > 0) {
    res += data.milliseconds * 1/86400000 // 1 ms = .000000012 d
  }
  return res
}
