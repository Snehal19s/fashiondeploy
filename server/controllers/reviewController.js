const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order'); // To check if user purchased the product

// @desc    Create a new review
// @route   POST /api/reviews/:productId
// @access  Private
exports.createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Optional: Check if user has purchased this product
        const hasPurchased = await Order.findOne({
            userId: req.user._id,
            'products.productId': productId,
            // paymentStatus: 'Paid' // If you want to be strict
        });
        // if (!hasPurchased) {
        //     return res.status(403).json({ message: 'You can only review products you have purchased.' });
        // }

        const alreadyReviewed = await Review.findOne({ productId, userId: req.user._id });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed by you' });
        }

        const review = new Review({
            productId,
            userId: req.user._id,
            userName: req.user.name,
            rating: Number(rating),
            comment,
        });
        await review.save();
        // The static method in Review model will update product ratings

        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};