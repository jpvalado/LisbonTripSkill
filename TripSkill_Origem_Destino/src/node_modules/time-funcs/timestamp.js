/*
Y: the year with the century
y: the year without the century (00-99)
z: the year without the century, padded with a leading space for single digit values (1-9)

O: the month, padded to 2 digits (01-12)
o: the month
p: the month, padded with a leading space for single digit values (1-9)

D: day of the month, padded to 2 digits (01-31)
d: day of the month
e: day of the month, padded with a leading space for single digit values (1-9)

H: the hour (24-hour clock), padded to 2 digits (00-23)
h: the hour (24-hour clock)
i: the hour (24-hour clock), padded with a leading space for single digit values (0-9)

M: the minute, padded to 2 digits (00-59)
m: the minute
n: the minute, padded with a leading space for single digit values (0-9)

S: the second, padded to 2 digits (00-60)
s: the second
t: the second, padded with a leading space for single digit values (0-9)

L: the milliseconds, padded to 3 digits
l: the milliseconds (only the first digit)
*/

const isString = require('is-funcs/is-string')
const isDate = require('is-funcs/is-date')

module.exports = function(pattern, date) {
  if (isString(pattern) === false) pattern = 'H:M:S.L'
  if (isDate(date) === false) date = new Date()

  var str = ''
  var c
  var t
  for (var i = 0, n = pattern.length; i < n; i++) {
    c = pattern.charCodeAt(i)

    // H or i
    if (c === 72 || c === 105) {
      t = date.getHours()
      if (t > 9) str += t
      else str += (c === 72 ? '0' : ' ') + t
    }
    // h
    else if (c === 104) {
      str += date.getHours()
    }
    // M or n
    else if (c === 77 || c === 110) {
      t = date.getMinutes()
      if (t > 9) str += t
      else str += (c === 77 ? '0' : ' ') + t
    }
    // m
    else if (c === 109) {
      str += date.getMinutes()
    }
    // S or t
    else if (c === 83 || c === 116) {
      t = date.getSeconds()
      if (t > 9) str += t
      else str += (c === 83 ? '0' : ' ') + t
    }
    // s
    else if (c === 115) {
      str += date.getSeconds()
    }
    // L
    else if (c === 76) {
      t = date.getMilliseconds().toString()
      while (t.length < 3) t = '0' + t
      str += t
    }
    // l
    else if (c === 108) {
      t = date.getMilliseconds()
      if (t < 100) str += '0'
      else str += t.toString().charAt(0)
    }
    // Y
    else if (c === 89) {
      str += date.getFullYear()
    }
    // y or z
    else if (c === 121 || c === 122) {
      t = date.getFullYear().toString().substr(2)
      if (c === 122 && t.charAt(0) === '0') str += ' ' + t.substr(1)
      else str += t
    }
    // O or p
    else if (c === 79 || c === 112) {
      t = date.getMonth() + 1//)/.toString()
      if (t > 9) str += t
      else str += (c === 79 ? '0' : ' ') + t
    }
    // o
    else if (c === 111) {
      str += (date.getMonth() + 1)
    }
    // D or e
    else if (c === 68 || c === 101) {
      t = date.getDate()
      if (t > 9) str += t
      else str += (c === 68 ? '0' : ' ') + t
    }
    // d
    else if (c === 100) {
      str += date.getDate()
    }
    else {
      str += pattern.charAt(i)
    }
  }
  return str
}
