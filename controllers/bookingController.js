import Booking from '../models/Booking.js'

// create new booking
export const createBooking = async (req, res) => {
    const { userId, tourId, date, ...rest } = req.body;

    // Input validation
    if (!userId || !tourId || !date) {
        return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    const newBooking = new Booking(req.body);

    try {
        const savedBooking = await newBooking.save();
        res.status(201).json({ success: true, message: 'Your tour is booked', data: savedBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// get single booking
export const getBooking = async (req, res) => {
    const { id } = req.params;

    // Validate the ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ success: false, message: 'Invalid booking ID format' });
    }

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, message: 'Booking found', data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// get all bookings
export const getAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({ success: true, message: 'Bookings retrieved successfully', data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
