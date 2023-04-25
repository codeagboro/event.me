const uuid = require("uuid")

// Initialize the counter to 0
let counter = 0;

function generateSerialNumber() {
  // Generate a UUID for the prefix
  const uuidPrefix = uuid.v4();
  // Increment the counter
  counter++;
  // Generate the serial number by concatenating the UUID prefix and the counter value
  const serialNumber = `${uuidPrefix}-${counter}`;
  // Return the serial number
  return serialNumber;
}

module.exports = generateSerialNumber;
