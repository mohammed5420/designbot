
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dailydesign.cjs.production.min.js')
} else {
  module.exports = require('./dailydesign.cjs.development.js')
}
