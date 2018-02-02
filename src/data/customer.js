var addressKingston = {  
  "Street": "25 Union St",
  "AddressLine2": "GOODWIN HALL #10",
  "City": "KINGSTON",
  "Region": "ON",
  "PostalCode": "K7L2N8",
  "Type": "Campus",
  "BuildingID": "2934",
  "CampusID": "264",
  "AddressLine3": "QUEEN'S UNIVERSITY - MAIN CAMPUS",
  "StreetName": "UNION ST",
  "UnitNumber": "210",
  "OrganizationName": "210 GOODWIN HALL #10 QUEEN'S UNIVERSITY - MAIN CAMPUS"
};

exports.addressKingston = addressKingston;

exports.kingstonStoreID = '10310';

var addressToronto = {
  "Street": "36 TORONTO ST",
  "StreetName": "TORONTO ST",
  "UnitNumber": "UNIT 3rd Floor",
  "City": "TORONTO",
  "Region": "ONTARIO",
  "PostalCode": "M5C2C5",
  "Type": "House",
  "StreetNumber": "36"
};

var torontoStoreID = '10518';

const customer = {
  firstName: 'Derek',
  lastName: 'Ho',
  address: addressKingston,
  email: 'john@myemail.com',
  phone: '1234567891',
};

exports.customer = customer;
