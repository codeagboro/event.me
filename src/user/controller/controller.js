/** @format */
//const cors = require("cors");
const axios = require("axios");
const Booking = require("../models/booking.model");
const Transaction = require("../models/payment.model");
const User = require("../models/user.model");
const uuid = require("uuid");
const Event = require("../../auth/models/event.model");
const nodemailer = require("nodemailer");

exports.booking = async (req, res) => {
  try {
    const { email, name, numberOfTickets } = req.body;

    const event = await Event.findOne({ name });

    const totalAmount =
      parseFloat(event.ticketAmount) * parseInt(numberOfTickets);

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
    const booking = await Booking.findOne({ bookingId });

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
    console.log(response);

    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

// use axios to make a post request to the flutterwave api to confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    if (!signature || signature !== secretHash) {
      // This request isn't from Flutterwave; discard
      res.status(401).end();
    }

    const payload = req.body;

    if (payload.status === "successful") {
      const newTransaction = await Transaction.create({
        tx_ref: payload.tx_ref,
        amount: payload.amount,
        currency: payload.currency,
        status: payload.status,
        payment_type: payload.payment_type,
        email: payload.customer.email,
        name: payload.customer.fullName,
      });

      Booking.find({ email: payload.customer.email }).then((bookings) => {
        const doc = new jsPDF();

        bookings.forEach((booking, index) => {
          doc.text(`Booking ${index + 1}:`, 10, 10 + index * 20);
          doc.text(`Name: ${booking.email}`, 10, 20 + index * 20);
          doc.text(`Check-in: ${booking.numberOfTickets}`, 10, 30 + index * 20);
          doc.text(`Check-out: ${booking.totalAmount}`, 10, 40 + index * 20);
        });

        const pdfBuffer = doc.output();

        const transporter = nodemailer.createTransport({
          service: process.env.SMTP_HOST,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const mailOptions = {
          from: "events.me <events.me@gmail.com>",
          to: payload.customer.email,
          subject: "Booking successful",
          html: `<h1>Hello ${payload.customer.fullName},</h1><p>Attached to this email are details of the event you booked</p>`,
          attachments: [
            {
              filename: "bookings.pdf",
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        };

        transporter.sendMail(mailOptions);

        res.status(200).json({
          message: "Payment successful",
          data: newTransaction,
        });
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
