const pizzaHelper = require('./src/pizzaHelper');
const util = require('./src/util');
const data = require('./src/data/customer');

exports.requestPrice = function requestPrice(req, res) {
  try {
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

  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err + '' });
  }
};

exports.placeOrder = function placeOrder(req, res) {
  try {
    const result = getResult(req);
    const { 
      customer = data.customer,
      storeID = '10310',
      pizza
    } = result;

    const item = pizzaHelper.getPizzaItem(pizza);

    pizzaHelper
      .getPriceAsync({ items: [item], storeID, customer })
      .tap(util.prettyPrint)
      .then((resp) => pizzaHelper.placeOrderAsync(resp.order))
      .then((placeResp) => {
        res.send(
          createDialogResponse(placeResp)
        );
      });

  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.findStore = function findStore(req, res) {
  try {
    const result = getResult(req);
    const { address } = result;

    pizzaHelper.findStoreAsync(address)
      .then((resp) => {
        res.send(resp);
      });
  } catch (e) {
    res.status(500).send({ error: e});
  }
};

function getResult(req) {
  return req.body.result;
}

function createDialogResponse(resp) {
  const { data } = resp;
  const responseText = `The pizza order will be $${data.price}, delivering to ${data.address.Street}. The wait time is around ${data.waitTimeMins} minutes.`;
  return {
    speech: responseText,
    displayText: responseText,
  };
};