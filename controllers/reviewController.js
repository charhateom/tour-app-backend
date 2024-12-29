import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

export const createReview = async (req, res) => {
    const { tourId } = req.params;
    const { rating, comment } = req.body;

    // Input validation
    if (!rating || !comment) {
        return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    try {
        // Check if tour exists
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }

        // Create new review
        const newReview = new Review({ rating, comment, tour: tourId });
        const savedReview = await newReview.save();

        // Update the tour's reviews array
        await Tour.findByIdAndUpdate(tourId, {
            $push: { reviews: savedReview._id }
        });

        res.status(200).json({ success: true, message: 'Review added to tour', data: savedReview });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while submitting the review' });
    }
};
