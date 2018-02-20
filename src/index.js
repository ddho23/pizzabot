const _ = require('lodash');
const Promise = require('bluebird');

const pizzaHelper = require('./pizza/pizza-helper');
const util = require('./util/util');
const actionHandlers = require('./pizza/action-handlers')

exports.pizzaWebhook = function pizzaWebhook(req, res) {
  return Promise
    .try(() => {
      const result = actionHandlers.getResult(req);
      const { action } = result;

      if (action === 'RequestPrice') {
        return actionHandlers.requestPrice(result);
      } else if (action === 'RequestPrice.OrderConfirm') {
        return actionHandlers.placeOrder(result);
      } else if (action == 'FindLocation') {
        return actionHandlers.findLocation();
      } else if (action == 'FindStore') {
        return actionHandlers.findStore(result);
      }
    })
    .then((result) => res.send(result))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ err: `${err}` });
    });
};
