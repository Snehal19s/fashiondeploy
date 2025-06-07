const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true }, // Denormalize user name for easier display
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, { timestamps: true });

// Calculate average rating on Product model after saving a review
ReviewSchema.statics.calculateAverageRating = async function(productId) {
    const stats = await this.aggregate([
        { $match: { productId: productId } },
        {
            $group: {
                _id: '$productId',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        if (stats.length > 0) {
            await mongoose.model('Product').findByIdAndUpdate(productId, {
                ratings: stats[0].avgRating.toFixed(1),
                numOfReviews: stats[0].nRating
            });
        } else {
             await mongoose.model('Product').findByIdAndUpdate(productId, {
                ratings: 0,
                numOfReviews: 0
            });
        }
    } catch (err) {
        console.error(err);
    }
};

ReviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.productId);
});
ReviewSchema.post('remove', function() { // if you implement review deletion
    this.constructor.calculateAverageRating(this.productId);
});


module.exports = mongoose.model('Review', ReviewSchema);