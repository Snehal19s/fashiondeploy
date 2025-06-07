const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// --- Cart ---
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.cart);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.addToCart = async (req, res) => {
    const { productId, quantity, size } = req.body;
    try {
        const user = await User.findById(req.user._id);
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId && item.size === size);
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += quantity || 1;
        } else {
            user.cart.push({ product: productId, quantity: quantity || 1, size });
        }
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('cart.product');
        res.status(200).json(updatedUser.cart);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateCartItem = async (req, res) => {
    const { cartItemId } = req.params; // This should be the _id of the cart item subdocument
    const { quantity } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const cartItem = user.cart.id(cartItemId); // Mongoose subdocument id getter
        if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

        if (quantity <= 0) { // Remove item if quantity is 0 or less
             user.cart.pull({ _id: cartItemId });
        } else {
            cartItem.quantity = quantity;
        }

        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('cart.product');
        res.json(updatedUser.cart);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.removeFromCart = async (req, res) => {
    const { cartItemId } = req.params; // This should be the _id of the cart item subdocument
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.cart.pull({ _id: cartItemId }); // Mongoose subdocument removal
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('cart.product');
        res.json(updatedUser.cart);
    } catch (error) { res.status(500).json({ message: error.message }); }
};


// --- Wishlist ---
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.wishlist);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.addToWishlist = async (req, res) => {
    const { productId } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.status(200).json(updatedUser.wishlist);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.wishlist.pull(productId);
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// --- Order History ---
exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};