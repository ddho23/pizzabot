
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

exports.createDialogResponse = createDialogResponse;
exports.createOrderResponse = createOrderResponse;
exports.createRawResponse = createRawResponse;