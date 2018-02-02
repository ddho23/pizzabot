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
    customer = _.assign({}, data.customer),
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
      createOrderResponse(orderResp)
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

exports.requestPrice = requestPrice;
exports.placeOrder = placeOrder;
exports.findStore = findStore;


function getResult(req) {
  return req.body.result;
}

function createDialogResponse(resp) {
  const { data } = resp;
  const priceDeliveryText = `The total price will be $${data.price}, delivering to ${data.address.Street}.`;
  const waitText = `The wait time is around ${data.waitTimeMins} minutes.`;
  const actionText = ` Do you want to place the order?`;
  const responseText = `${priceDeliveryText} ${waitText} ${actionText}`;
  
  return {
    speech: responseText,
    displayText: responseText,
  };
};

function createOrderResponse(resp) {
  const { data } = resp;
  const actionText = `Order sent!`;
  const phoneText = `The delivery driver call you at ${data.phone} on arrival.`;
  const waitText = `The order should arrive in ${data.waitTimeMins} minutes.`;
  const responseText = `${actionText} ${waitText} ${phoneText}`;
  
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