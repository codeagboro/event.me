const cloudinary = require("cloudinary");
const Event = require("../models/event.model");
const generateSerialNumber = require("../../helper/serial");

const createEvent = async (req, res) => {
    const { name } = req.body;
    const { location } = req.body;
    const { ticketAmount } = req.body;
    const image = req.file.path;
    
    try {
        const eventExists = await Event.findOne({ name });
        if (eventExists) {
            return res.status(409).json({
                message: "This event name is already in use, please choose another name",
            });
        }
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        let images;
        try {
            const result = await cloudinary.uploader.upload(image);
            images = result.secure_url;
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Error uploading image to Cloudinary.",
            });
        }

        const newEvent = await Event.create({
            name,
            location,
            ticketAmount,
            image: images,
            eventSerial: generateSerialNumber()
        });

        return res.status(201).json({
            message: "New Event has been created",
            newEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error.",
        });
    }
};

module.exports = createEvent;
