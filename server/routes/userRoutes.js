const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart,
        getWishlist, addToWishlist, removeFromWishlist,
        getOrderHistory } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// All these routes are protected
router.use(protect);

// Cart routes
router.route('/cart').get(getCart).post(addToCart);
router.route('/cart/:cartItemId').put(updateCartItem).delete(removeFromCart);

// Wishlist routes
router.route('/wishlist').get(getWishlist).post(addToWishlist);
router.route('/wishlist/:productId').delete(removeFromWishlist);

// Order History
router.get('/orders', getOrderHistory);

module.exports = router;