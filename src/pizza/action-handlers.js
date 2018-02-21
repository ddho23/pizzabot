const _ = require('lodash');
const gaUtil = require('../util/ga-integration-util');
const data = require('../data/customer');

const pizzaHelper = require('./pizza-helper');
const util = require('../util/util');

const geocodeUtil = require('../util/geocode-util');

const requestPrice = function requestPrice({ contexts, parameters }) {
  const contextParams = _.map(contexts, 'parameters');
  const combinedParams = _.assign({}, ...contextParams, parameters);

  const { 
    customer = _.assign({}, data.customer), // TODO: add customer address from params
    storeID = '10310',
  } = combinedParams;

  const item = pizzaHelper.getPizzaItem(parameters);

  return pizzaHelper
    .getPriceAsync({ items: [item], storeID, customer })
    .then((priceResp) => gaUtil.createDialogResponse(priceResp))
    .tap(util.prettyPrint);
};

const placeOrder = function placeOrder({ contexts, parameters}) {
  const contextParams = _.map(contexts, 'parameters');
  const combinedParams = _.assign({}, ...contextParams, parameters);
  const {
    customer = data.customer,
    storeID = '10310',
    phone,
  } = combinedParams;

  customer.phone = phone;
  
  const item = pizzaHelper.getPizzaItem(combinedParams);
  
  return pizzaHelper
    .getPriceAsync({ items: [item], storeID, customer })
    .then((resp) => pizzaHelper.placeOrderAsync(resp.order))
    .then((orderResp) => gaUtil.createOrderResponse(orderResp))
    .tap(util.prettyPrint);
};

const findLocation = function findLocation() {
  return gaUtil.createLocationPermissionResponse();
};

const findStore = function findStore({ originalRequest }) {
  const location = originalRequest.data.device.location;
  const coords = _.get(originalRequest, 'data.device.location.coordinates');

  if (coords) {
    return geocodeUtil
      .reverse({ lat: coords.latitude, lon: coords.longitude })
      .then((resp) => {
        const address = _.first(resp);

        return pizzaHelper
          .findStoreAsync(address)
          .then((store) => gaUtil.createFoundStoreResponse(store, address))
          .tap(util.prettyPrint);
      });
  } else {
    throw 'No location coords';
  }
};


const getResult = function getResult(req) {
  return req.body.result;
}

exports.requestPrice = requestPrice;
exports.placeOrder = placeOrder;
exports.findStore = findStore;
exports.getResult = getResult;
exports.findLocation = findLocation;