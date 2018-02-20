'use strict';
const Promise = require('bluebird');
const _ = require('lodash');
const pizzapi = require('dominos-canada');
//const pizzapi = require('../../node-dominos-pizza-api/dominos-pizza-api');

const customerData = require('../data/customer');
const util = require('../util/util.js');
const menuCodes = require('../data/menu-codes');

Promise.promisifyAll(
  pizzapi.Order.prototype,
  { 
    filter: (name) => ['price', 'validate', 'place'].includes(name),
    promisifier: util.promisifier,
  }
);

exports.getPriceAsync = function getPriceAsync({ items = [], storeID, customer = {} }) {
  var order = new pizzapi.Order({
    customer: new pizzapi.Customer(customer),
    storeID: storeID,
    deliveryMethod: 'Delivery',
  });

  items.forEach((item) => order.addItem(item));

  return order.priceAsync()
    .then((resp) => {
      const data = extractRespData(resp);

      return {
        data,
        order,
        raw: resp,
      };
    });
}

exports.placeOrderAsync = function placeOrderAsync(order) {
  order.Payments = [
    {
      Type: 'DoorCredit',
      Amount: order.Amounts.Payments,
    }
  ];

  // Mock response instead of actually placing the order
  const fakeResp = { result: { Order: order }}

  return { data: extractRespData(fakeResp), order: order };

  /*
  // uncomment to enable real ordering
  return order.placeAsync()
    .then((resp) => {
      const data = extractRespData(resp);

      return {
        data,
        order,
        raw: resp
      };
    })
  */
};

exports.getPizzaItem = function getPizzaItem(pizzaOpts) {
  const { size, crust, toppings, quantity = 1 } = pizzaOpts;
  const toppingCodes = _(toppings)
    .map((t) => toppingMap[t])
    .filter()
    .value();

  return new pizzapi.Item({
    code: getPizzaCode(pizzaOpts),
    options: toppingCodes,
    quantity: quantity || 1,
  });
}

function extractRespData(resp) {
  const price = _(resp).get('result.Order.Amounts.Payment');
  const address = _(resp).get('result.Order.Address');
  const phone = _(resp).get('result.Order.Phone');
  const waitTimeMins = _(resp).get('result.Order.EstimatedWaitMinutes');

  return {
    price,
    address,
    phone,
    waitTimeMins,
  };
}

exports.findStoreAsync = function findStoreAsync(address) {
  return new Promise((resolve, reject) => {
    pizzapi.Util.findNearbyStores(
      address,
      'Delivery',
      (resp) => {
        resolve({
          data: _.chain(resp.result.Stores).first().value(),
        });
      }
    );
  });
}

const toppingMap = menuCodes.toppings;

function getToppingCode(topping) {
  return toppingMap[topping];
}

function getSizeCode(size) {
  switch(size) {
    case 'Small':
      return '10';
    case 'Medium':
      return '12';
    case 'Large':
      return '14';
    case 'XLarge':
      return '16';
    default:
      throw new Error(`Invalid Pizza Size: [${size}]`);
  }
}

function getPizzaCode({ size, crust }) {
  const crustCode = crust === 'Thin' ? 'THIN' : 'SCREEN';
  const pizzaCode =  getSizeCode(size) + crustCode;

  if (menuCodes.pizzaCodes.includes(pizzaCode)) {
    return pizzaCode
  } else {
    throw new Error('Invalid pizza type: ', arguments);
  }
}