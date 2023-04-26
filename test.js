const mongoose = require('mongoose');
const faker = require('faker');
const Event = require('./src/auth/models/event.model');
const connectDB = require('./src/database/db');
// Generate random user data
const generateUserData = () => {
  const name = faker.internet.findName();
  const location = faker.internet.location();
  const ticketAmount = faker.internet.ticketAmount();
  const image = faker.internet.image();
  return { name, location, ticketAmount, image };
};

// Insert the random user data into your database
const insertRandomUsers = async (count) => {
  const event = Array.from({ length: count }, generateUserData);
  try {
    await Event.insertMany(event);
    console.log(`Inserted ${count} random users`);
  } catch (err) {
    console.error(err);
}
};

// Call the insertRandomUsers function with the desired number of users to insert
insertRandomUsers(18);
