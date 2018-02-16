const _ = require('lodash');
const gaUtil = require('../util/ga-integration-util');
const data = require('../data/customer');

const pizzaHelper = require('./pizza-helper');
const util = require('../util/util');

const requestPrice = function requestPrice(req, res) {
  const result = getResult(req);
  const params = result.parameters;
  const { 
    customer = _.assign({}, data.customer),
    storeID = '10310',
  } = params;

  const item = pizzaHelper.getPizzaItem(params);

  pizzaHelper.getPriceAsync({ items: [item], storeID, customer })
    .tap(util.prettyPrint)
    .then((priceResp) => {
      res.send(
        gaUtil.createDialogResponse(priceResp)
      );
    });
};

const placeOrder = function placeOrder(req, res) {
  const result = getResult(req);
  const params = _.assign({}, _.first(result.contexts).parameters, result.parameters);
  const { 
    customer = data.customer,
    storeID = '10310',
    phone,
  } = params;

  customer.phone = phone;
  
  const item = pizzaHelper.getPizzaItem(params);
  
  pizzaHelper
    .getPriceAsync({ items: [item], storeID, customer })
    .tap(util.prettyPrint)
    .then((resp) => pizzaHelper.placeOrderAsync(resp.order))
    .tap(util.prettyPrint)
    .then((orderResp) => {
      res.send(
        gaUtil.createOrderResponse(orderResp)
      );
    });
};

const findStore = function findStore(req, res) {
  try {
    const result = getResult(req);
    const { address } = result.parameters;

    pizzaHelper.findStoreAsync(address)
      .then((resp) => {
        res.send(createRawResponse(resp));
      });
  } catch (e) {
    res.status(500).send({ error: e });
  }
};


const getResult = function getResult(req) {
  return req.body.result;
}

exports.requestPrice = requestPrice;
exports.placeOrder = placeOrder;
exports.findStore = findStore;
exports.getResult = getResult;