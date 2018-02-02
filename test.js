'use strict';
const pizzaHelper = require('./src/pizzaHelper');
const util = require('./src/util');
const data = require('./src/data/customer');

const pizza = { 
  size: 'Large',
  crust: 'Regular',
  toppings: ['Pepperoni', 'Ham', 'Bacon', 'Green Pepper', 'Chicken'],
  quantity: 1,
};
const item = pizzaHelper.getPizzaItem(pizza);

const storeID = '10310';
const customer = require('./src/data/customer').customer;

//pizzaHelper.getPriceAsync({ items: [item], storeID, customer })
//  .tap((resp) => util.prettyPrint(resp.data));

const cloudFn = require('./index.js');

const req = {
  body: require('./samples/request.json'),
};

cloudFn.requestPrice(req, { send: util.prettyPrint });