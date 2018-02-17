describe('Pizza bot Cloud functions', () => {
  const pizzaHelper = require('../src/pizza/pizza-helper');
  const util = require('../src/util/util');
  const data = require('../src/data/customer');
  
  const pizza = { 
    size: 'Large',
    crust: 'Regular',
    toppings: ['Pepperoni', 'Ham', 'Bacon', 'Green Pepper', 'Chicken'],
    quantity: 1,
  };

  it('Should run the cloud functions', async () => {
    const item = pizzaHelper.getPizzaItem(pizza);
  
    const storeID = '10310';
    const customer = data.customer;
    
    await pizzaHelper.getPriceAsync({ items: [item], storeID, customer })
      .tap((resp) => util.prettyPrint(resp.data));
    
    const cloudFn = require('../src/index.js');
    
    let req = {
      body: require('../testrequests/requestPrice'),
    };
    
    const resMock = { send: util.prettyPrint, status: () => resMock };
    
    await cloudFn.pizzaWebhook(req, resMock);
    
    req = {
      body: require('../testrequests/orderConfirmPhone'),
    };
    
    await cloudFn.pizzaWebhook(req, resMock);
  });
});
