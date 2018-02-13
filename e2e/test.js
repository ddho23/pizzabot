'use strict';
const pizzaHelper = require('../src/pizza-helper');
const util = require('../src/util');
const data = require('../src/data/customer');

const pizza = { 
  size: 'Large',
  crust: 'Regular',
  toppings: ['Pepperoni', 'Ham', 'Bacon', 'Green Pepper', 'Chicken'],
  quantity: 1,
};
const item = pizzaHelper.getPizzaItem(pizza);

const storeID = '10310';
const customer = data.customer;

pizzaHelper.getPriceAsync({ items: [item], storeID, customer })
  .tap((resp) => util.prettyPrint(resp.data));

const cloudFn = require('../index.js');

let req = {
  body: require('../testrequests/requestPrice'),
};

const resMock = { send: util.prettyPrint, status: () => resMock };

cloudFn.pizzaWebhook(req, resMock);

req = {
  body: require('../testrequests/orderConfirmPhone'),
};

cloudFn.pizzaWebhook(req, resMock);