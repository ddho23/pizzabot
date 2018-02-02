const pizzaHelper = require('./src/pizzaHelper');
const util = require('./src/util');
const data = require('./src/data/customer');
const _ = require('lodash');

exports.pizzaWebhook = function pizzawebHook(req, res) {
  try {
    const result = getResult(req);
    const { action } = result;

    if (action === 'RequestPrice') {
      requestPrice(req, res);
    } else if (action === 'RequestPrice.OrderConfirm') {
      placeOrder(req, res);
    } else if (action == 'FindStore') {
      findStore(req, res);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({ err: `${err}` });
  }
};

const requestPrice = function requestPrice(req, res) {
  const result = getResult(req);
  const params = result.parameters;
  const { 
    customer = data.customer,
    storeID = '10310',
  } = params;

  const item = pizzaHelper.getPizzaItem(params);

  pizzaHelper.getPriceAsync({ items: [item], storeID, customer })
    .tap(util.prettyPrint)
    .then((priceResp) => {
      res.send(
        createDialogResponse(priceResp)
      );
    });
};

exports.requestPrice = requestPrice;

const placeOrder = function placeOrder(req, res) {
  const result = getResult(req);
  const params = _.assign({}, _.first(result.contexts).parameters, result.parameters);
  const { 
    customer = data.customer,
    storeID = '10310'
  } = params;

  const item = pizzaHelper.getPizzaItem(params);

  pizzaHelper
    .getPriceAsync({ items: [item], storeID, customer })
    .tap(util.prettyPrint)
    .then((resp) => pizzaHelper.placeOrderAsync(resp.order))
    .tap(util.prettyPrint)
    .then((orderResp) => {
      res.send(
        createOrderResponse(orderResp)
      );
    });
};

exports.placeOrder = placeOrder;

const findStore = function findStore(req, res) {
  try {
    const result = getResult(req);
    const { address } = result;

    pizzaHelper.findStoreAsync(address)
      .then((resp) => {
        res.send(createStoreResponse(resp));
      });
  } catch (e) {
    res.status(500).send({ error: e});
  }
};

exports.findStore = findStore;

function getResult(req) {
  return req.body.result;
}

function createDialogResponse(resp) {
  const { data } = resp;
  const priceDeliveryText = `The pizza order will be $${data.price}, delivering to ${data.address.Street}.`;
  const waitText = `The wait time is around ${data.waitTimeMins} minutes.`;
  const actionText = ` Do you want to place the order now?`;
  const responseText = `${priceDeliveryText} ${waitText} ${actionText}`;
  
  return {
    speech: responseText,
    displayText: responseText,
  };
};

function createOrderResponse(resp) {
  const { data } = resp;
  const priceDeliveryText = `The total is $${data.price}, delivering to ${data.address.Street}.`;
  const waitText = `The order should arrive in ${data.waitTimeMins} minutes.`;
  const actionText = `Order sent!`;
  const responseText = `${actionText} ${priceDeliveryText} ${waitText}`;
  
  return {
    speech: responseText,
    displayText: responseText,
  };
};

function createRawResponse(resp) {
  const { data } = resp;
  const responseText = `${data}`;

  return {
    speech: responseText,
    displayText: responseText,
  };
}