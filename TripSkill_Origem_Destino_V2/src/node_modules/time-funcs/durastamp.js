const duration = require('./duration')

module.exports = function(seconds, decimal, pad) {
  var data = duration(seconds, 's')
  if (data === undefined) return

  decimal = decimal === 1 || decimal === 2 || decimal === 3 ? decimal : 0
  pad = pad === true

  var str = ''
  var ok = false

  // days
  if (data.days > 0) {
    str += data.days + ':'
    ok = true
  }

  // hours
  if (data.hours > 0) {
    if (data.hours < 10 && (ok || pad)) {
      str += '0' + data.hours + ':'
    } else {
      str += data.hours + ':'
    }
    ok = true
  } else if (ok) {
    str += '00:'
  }

  // minutes
  if (data.minutes > 0) {
    if (data.minutes < 10 && (ok || pad)) {
      str += '0' + data.minutes + ':'
    } else {
      str += data.minutes + ':'
    }
    ok = true
  } else if (ok) {
    str += '00:'
  }

  // seconds
  if (data.seconds > 0) {
    if (!ok) {
      str += '0:'
    }
    if (data.seconds < 10) {
      str += '0' + data.seconds
    } else {
      str += data.seconds
    }
  } else if (ok) {
    str += '00'
  } else {
    str = '0:00'
  }

  // milliseconds
  if (decimal > 0) {
    var ms = '.000'
    if (data.milliseconds > 0) {
      var tmp = data.milliseconds.toString()
      while (tmp.length < 3) tmp = '0' + tmp
      ms = '.' + tmp
    }
    str += ms.substr(0, decimal + 1)
  }

  return str
}
