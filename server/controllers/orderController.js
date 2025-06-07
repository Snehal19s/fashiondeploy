const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product'); // To update stock if needed

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    const { shippingAddress } = req.body; // Add other fields like paymentMethod if needed

    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        if (!user || user.cart.length === 0) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        const orderItems = user.cart.map(item => ({
            productId: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            image: item.product.images[0], // First image as primary
            size: item.size
        }));

        const totalPrice = orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

        const order = new Order({
            userId: req.user._id,
            products: orderItems,
            totalPrice,
            shippingAddress, // Assuming a simple address for now
            paymentStatus: 'Paid', // Dummy payment success
            orderStatus: 'Processing'
        });

        const createdOrder = await order.save();

        // Add order to user's orderHistory
        user.orderHistory.push(createdOrder._id);
        // Clear cart
        user.cart = [];
        await user.save();

        // Optional: Update product stock (implement carefully with transactions if possible)
        // for (const item of orderItems) {
        //     await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        // }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email');
        if (order && (order.userId._id.toString() === req.user._id.toString() || req.user.isAdmin)) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};