const _ = require('lodash');
const gaUtil = require('../util/ga-integration-util');
const data = require('../data/customer');

const pizzaHelper = require('./pizza-helper');
const util = require('../util/util');

const requestPrice = function requestPrice({ parameters }) {
  const { 
    customer = _.assign({}, data.customer),
    storeID = '10310',
  } = parameters;

  const item = pizzaHelper.getPizzaItem(parameters);

  return pizzaHelper
    .getPriceAsync({ items: [item], storeID, customer })
    .then((priceResp) => gaUtil.createDialogResponse(priceResp))
    .tap(util.prettyPrint);
};

const placeOrder = function placeOrder({ contexts, parameters}) {
  const combinedParams = _.assign({}, _.first(contexts).parameters, parameters);
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

const findStore = function findStore({ parameters }) {
  const { address } = parameters;

  return pizzaHelper
    .findStoreAsync(address)
    .then((resp) => createRawResponse(resp));
};


const getResult = function getResult(req) {
  return req.body.result;
}

exports.requestPrice = requestPrice;
exports.placeOrder = placeOrder;
exports.findStore = findStore;
exports.getResult = getResult;