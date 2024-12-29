import Tour from '../models/Tour.js';

// create new tour
export const createTour = async (req, res) => {
    const newTour = new Tour(req.body);
    try {
        const savedTour = await newTour.save();
        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: savedTour,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create. Try again', error: err.message });
    }
};

// update tour
export const updateTour = async (req, res) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ success: false, message: 'Invalid tour ID' });
    }

    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!updatedTour) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedTour,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update', error: err.message });
    }
};

// delete tour
export const deleteTour = async (req, res) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ success: false, message: 'Invalid tour ID' });
    }

    try {
        const deletedTour = await Tour.findByIdAndDelete(id);
        if (!deletedTour) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }
        res.status(200).json({ success: true, message: 'Successfully deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete', error: err.message });
    }
};

// get single tour
export const getSingleTour = async (req, res) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ success: false, message: 'Invalid tour ID' });
    }

    try {
        const tour = await Tour.findById(id).populate('reviews');
        if (!tour) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Successfully found',
            data: tour,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve tour', error: err.message });
    }
};

// get all tours with pagination
export const getAllTour = async (req, res) => {
    const page = parseInt(req.query.page) || 0;  // default to page 0
    try {
        const tours = await Tour.find({})
            .populate('reviews')
            .skip(page * 8)
            .limit(8);

        res.status(200).json({
            success: true,
            count: tours.length,
            message: 'Successfully retrieved tours',
            data: tours,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve tours', error: err.message });
    }
};

// get tours by search
export const getTourBySearch = async (req, res) => {
    const { city, distance, maxGroupSize } = req.query;
    if (!city || !distance || !maxGroupSize) {
        return res.status(400).json({ success: false, message: 'Missing required search parameters' });
    }

    const cityRegex = new RegExp(city, 'i');
    try {
        const tours = await Tour.find({
            city: cityRegex,
            distance: { $gte: parseInt(distance) },
            maxGroupSize: { $gte: parseInt(maxGroupSize) },
        }).populate('reviews');

        if (tours.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Successfully found tours',
                data: tours,
            });
        } else {
            res.status(404).json({ success: false, message: 'No results found', data: tours });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to search tours', error: err.message });
    }
};

// get featured tours
export const getFeaturedTour = async (req, res) => {
    try {
        const tours = await Tour.find({ featured: true }).populate('reviews').limit(8);
        res.status(200).json({
            success: true,
            message: 'Successfully found featured tours',
            data: tours,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve featured tours', error: err.message });
    }
};

// get tour count
export const getTourCount = async (req, res) => {
    try {
        const tourCount = await Tour.estimatedDocumentCount();
        res.status(200).json({ success: true, data: tourCount });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch tour count', error: err.message });
    }
};
