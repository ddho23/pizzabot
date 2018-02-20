const NodeGeocoder = require('node-geocoder');
// Set specific http request headers:

const HttpsAdapter = require('node-geocoder/lib/httpadapter/httpsadapter.js')
const httpAdapter = new HttpsAdapter(null, {
  headers: {
    'user-agent': 'Pizza API Google Assistant v1',
  }
});

const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
  httpAdapter: httpAdapter,
  formatter: 'string',
  formatterPattern: '%n %S, %c, %T, %z',
});

module.exports = geocoder;

