const _ = require('lodash');
const Promise = require('bluebird');

const pizzaHelper = require('./pizza/pizza-helper');
const util = require('./util/util');
const actionHandlers = require('./pizza/action-handlers')

exports.pizzaWebhook = function pizzaWebhook(req, res) {
  try {
    const params = actionHandlers.getResult(req);
    const { action } = params;

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
