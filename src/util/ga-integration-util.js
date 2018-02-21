
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

function createFoundStoreResponse(resp, customerAddress) {
  const { data } = resp;
  const responseText = `${data.AddressDescription}`;

  return {
    speech: responseText,
    displayText: responseText,
    followupEvent: {
      name: 'RequestPrice'
    },
    contextOut: [
      {
        name: 'store',
        parameters: {
          storeID: data.StoreID,
          customerAddress,
        }
      }
    ]
  };
}

function createLocationPermissionResponse(resp) {
  return {
    speech: 'PLACEHOLDER',
      data: {
        google: {
          expectUserResponse: true,
          isSsml: false,
          richResponse: {
            items: [{ simpleResponse: { textToSpeech: 'PLACEHOLDER' } }],
          },
          systemIntent: {
            intent: 'actions.intent.PERMISSION',
            data: {
              '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
              optContext: 'To deliver your order',
              permissions: [ 'DEVICE_PRECISE_LOCATION' ]
            }
          }
        }
      }
    };
}

exports.createDialogResponse = createDialogResponse;
exports.createOrderResponse = createOrderResponse;
exports.createFoundStoreResponse = createFoundStoreResponse;
exports.createLocationPermissionResponse = createLocationPermissionResponse;