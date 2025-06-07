const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String }, // Main image for quick view in order history
            size: { type: String }
        }
    ],
    totalPrice: { type: Number, required: true },
    shippingAddress: { // Example, can be more detailed
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    paymentStatus: { type: String, default: 'Pending' }, // "Pending", "Paid", "Failed"
    orderStatus: { type: String, default: 'Processing' }, // "Processing", "Shipped", "Delivered", "Cancelled"
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);