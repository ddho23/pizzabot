const pizzaHelper = require('./src/pizzaHelper');
const util = require('./src/util');
const data = require('./src/data/customer');

exports.calculatePriceHttp = function calculatePriceHttp(req, res) {
  try {
    const payload = getBodyJson(req);
    const { 
      customer = data.customer,
      storeID = '10310',
      pizza
    } = payload;

    const item = pizzaHelper.getPizzaItem(pizza);

    pizzaHelper.getPriceAsync({ items: [item], storeID, customer })
      .tap(util.prettyPrint)
      .then((priceResp) => {
        res.send(priceResp);
      });

  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err + '' });
  }
};

exports.placeOrderHttp = function placeOrderHttp(req, res) {
  try {
    const payload = getBodyJson(req);
    const { 
      customer = data.customer,
      storeID = '10310',
      pizza
    } = payload;

    const item = pizzaHelper.getPizzaItem(pizza);

    pizzaHelper
      .getPriceAsync({ items: [item], storeID, customer })
      .tap(util.prettyPrint)
      .then((resp) => {
        return pizzaHelper.placeOrderAsync(resp.order);
      });

  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.findStoreHttp = function(req, res) {
  try {
    const payload = getBodyJson(req);
    const { address } = payload;

    pizzaHelper.findStoreAsync(address)
      .then((resp) => {
        res.send(resp);
      });
  } catch (e) {
    res.status(500).send({ error: e});
  }
};

function getBodyJson(req) {
  if (req.get('content-type') === 'application/json') {
    return req.body;
  } else {
    return JSON.parse(req.body);
  }
}
