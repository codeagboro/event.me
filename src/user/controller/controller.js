/** @format */
//const cors = require("cors");
const axios = require("axios");
const Booking = require("../models/booking.model");
const Transaction = require("../models/payment.model");
const User = require("../models/user.model");
const uuid = require("uuid");
const Event = require("../../auth/models/event.model");

exports.booking = async (req, res) => {
  try {
    const { email, name, numberOfTickets } = req.body;

    const event = await Event.findOne ({ name });

    const totalAmount = parseFloat(event.ticketAmount) * parseInt(numberOfTickets);

    const newBooking = await Booking.create({
      email,
      name,
      numberOfTickets,
      totalAmount,
    });

    return res.status(200).json({
      message: "Booking successful",
      data: newBooking,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

// get all events from the database with pagination
exports.getEvents = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const events = await Event.paginate({}, options);
    return res.status(200).json({
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.payment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({bookingId});
    
    console.log({booking});

    const ref = uuid.v4();

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: ref, // Generate a UUID for the transaction reference
        amount: booking.totalAmount.toString(), // Convert the amount to a string
        currency: "NGN",
        redirect_url:
          "https://webhook.site/70af7eea-88a5-4c99-985b-3186e2f9281c",
        meta: {
          consumer_id: uuid.v4(),
          consumer_mac: "92a3-912ba-1192a",
        },
        customer: {
          email: booking.email,
          name: booking.name,
        },
        customizations: {
          title: "Flutterwave",
          logo: "http://www.w3.org/2000/svg",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const tx_ref = req.params.tx_ref;
    const transaction = await Transaction.findOne({ tx_ref });

    if (transaction) {
      return res.status(409).json({
        message: "This transaction has already been processed",
      });
    }

    if (response.data.status === "successful") {
      const newTransaction = await Transaction.create({
        tx_ref,
        transaction_id,
      });

      return res.status(200).json({
        message: "Payment successful",
        data: newTransaction,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.confirmpayment =  async (req, res) => {
  if (req.query.status === 'successful') {
      const transactionDetails = await Transaction.find({ref: req.query.tx_ref});
      const response = await flw.Transaction.verify({id: req.query.transaction_id});
      if (
          response.data.status === "successful"
          && response.data.amount === transactionDetails.amount
          && response.data.currency === "NGN") {
            const newTransaction = await Transaction.create({
              tx_ref,
              transaction_id,
            })
      } else {
          // Inform the customer their payment was unsuccessful
      }
  }
};
