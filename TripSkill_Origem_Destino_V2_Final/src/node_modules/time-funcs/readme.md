# time-funcs

> A very limited subset of time functions I use every day

## Install

```bash
npm i time-funcs
```

Package [on npm](https://www.npmjs.com/package/time-funcs)

## API

* [days](#daysdata)
* [hours](#hoursdata)
* [minutes](#minutesdata)
* [seconds](#secondsdata)
* [milliseconds](#millisecondsdata)
* [duration](#durationdata-unit)
* [timestamp](#timestamppattern-date)
* [durastamp](#durastampseconds-decimal-pad)

#### days(data)

Convert a `data` time object to a duration *in days*

```js
const days = require('time-funcs/days')

// 2
days({hours:48})

// 0.5
days({hours:12})

// 0.041666666666666664
days({hours:1})

// 0.041666666666666664
days({minutes:60})

// 0.999999988425926
days({hours:23, minutes:59, seconds:59, milliseconds:999})
```

#### hours(data)

Convert a `data` time object to a duration *in hours*

```js
const hours = require('time-funcs/hours')

// 24
hours({days:1})

// 2
hours({minutes:120})

// 0.5
hours({minutes:30})

// 0.9999997222222222
hours({minutes:59, seconds:59, milliseconds:999})
```

#### minutes(data)

Convert a `data` time object to a duration *in minutes*

```js
const minutes = require('time-funcs/minutes')

// 120
minutes({hours:2})

// 2
minutes({seconds:120})

// 0.5
minutes({seconds:30})

// 0.9999833333333333
minutes({seconds:59, milliseconds:999})
```

#### seconds(data)

Convert a `data` time object to a duration *in seconds*

```js
const seconds = require('time-funcs/seconds')

// 120
seconds({minutes:2})

// 1
seconds({milliseconds:1000})

// 0.5
seconds({seconds:30})

// 60.999
seconds({minutes:1, milliseconds:999})
```

#### milliseconds(data)

Convert a `data` time object to a duration *in milliseconds*

```js
const milliseconds = require('time-funcs/milliseconds')

// 60000
milliseconds({minutes:1})

// 1000
milliseconds({seconds:1})

// 61001
milliseconds({minutes:1, seconds:1, milliseconds:1})
```

#### duration(data, [unit])

Convert a duration into a time objet

| Argument | Action |
| :------ | :------- |
| **data** | the duration |
| **unit** | optional `unit`, default to `ms` |

Valid unit values

| Unit | Action |
| :------ | :------- |
| **ms** | `data` as milliseconds |
| **s** | `data` as seconds |
| **m** | `data` as minutes |
| **h** | `data` as hours |
| **d** | `data` as days |

```js
const duration = require('time-funcs/duration')

// {seconds: 2}
duration(2000, 'ms')

// {minutes: 1}
duration(60000, 'ms')

// {seconds: 59, milliseconds: 900}
duration(59.9, 's')

// {minutes: 1, milliseconds: 1}
duration(60.001, 's')

// {hours: 1}
duration(3600, 's')

// {days: 1}
duration(86400, 's')

// {hours: 1, minutes: 6}
duration(1.1, 'h')
```

#### timestamp(pattern, [date])

Timestamp formated by a string pattern and some special chars

| Argument | Action |
| :------ | :------- |
| **pattern** | the string `pattern`, default to `H:M:S.L` |
| **date** | optional `date`, default to `now` |

Pattern special chars

| Char | Action |
| :------ | :------- |
| **Y** | the year with the century |
| **y** | the year without the century (00-99) |
| **z** | the year without the century, padded with a leading space for single digit values (1-9) |
| **O** | the month, padded to 2 digits (01-12) |
| **o** | the month |
| **p** | the month, padded with a leading space for single digit values (1-9) |
| **D** | day of the month, padded to 2 digits (01-31) |
| **d** | day of the month |
| **e** | day of the month, padded with a leading space for single digit values (1-9) |
| **H** | the hour (24-hour clock), padded to 2 digits (00-23) |
| **h** | the hour (24-hour clock) |
| **i** | the hour (24-hour clock), padded with a leading space for single digit values (0-9) |
| **M** | the minute, padded to 2 digits (00-59) |
| **m** | the minute |
| **n** | the minute, padded with a leading space for single digit values (0-9) |
| **S** | the second, padded to 2 digits (00-60) |
| **s** | the second |
| **t** | the second, padded with a leading space for single digit values (0-9) |
| **L** | the milliseconds, padded to 3 digits |
| **l** | the milliseconds (only the first digit) |

```js
const timestamp = require('time-funcs/timestamp')

// 09 nov 2014 09:27:01.002
var d = new Date(2014, 10, 9, 9, 27, 1, 20)

// [2014-11-09]
timestamp('[Y-O-D]', d)

// 09/11/2014
timestamp('D/O/Y', d)

// 09:27:01.020
timestamp(null, d)
```

#### durastamp(seconds, [decimal], [pad])

Convert a duration in seconds in a formated like a video player timestamp

| Argument | Action |
| :------ | :------- |
| **seconds** | the duration to format |
| **decimal** | optional `decimal` count of milliseconds, default to `0`. `0` to `3` accepted |
| **pad** | optional `0` padding for leading hours of minutes, default to `false` |

```js
const durastamp = require('time-funcs/durastamp')

// 0:01
durastamp(1)

// 1:01
durastamp(61)

// 10:00
durastamp(600)

// 1:00:00
durastamp(3600)

// 1:00.2
durastamp(60.234, 1)

// 1:00.234
durastamp(60.234, 3)

// 01:01
durastamp(61, 0, true)
```

## License

MIT
