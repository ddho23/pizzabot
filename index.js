const _ = require('lodash');

const pizzaHelper = require('./src/pizza-helper');
const util = require('./src/util');

const actionHandlers = require('./src/action-handlers')

exports.pizzaWebhook = function pizzaWebhook(req, res) {
  try {
    const { action } = actionHandlers.getResult(req);

    if (action === 'RequestPrice') {
      actionHandlers.requestPrice(req, res);
    } else if (action === 'RequestPrice.OrderConfirm') {
      actionHandlers.placeOrder(req, res);
    } else if (action == 'FindStore') {
      actionHandlers.findStore(req, res);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({ err: `${err}` });
  }
};
