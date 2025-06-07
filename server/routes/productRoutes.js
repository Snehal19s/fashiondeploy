// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    getRecommendedProducts,
    searchAutocomplete
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware'); // 'protect' for routes like recommendations

// @route   GET /api/products
// @desc    Fetch all products with optional filters (category, keyword, pagination, price, rating, size)
// @access  Public
router.route('/').get(getProducts);

// @route   GET /api/products/recommendations
// @desc    Get product recommendations for the logged-in user
// @access  Private (needs user to be logged in to get profile data)
router.route('/recommendations').get(protect, getRecommendedProducts);

// @route   GET /api/products/search/autocomplete
// @desc    Get product suggestions for search autocomplete
// @access  Public
router.route('/search/autocomplete').get(searchAutocomplete);

// @route   GET /api/products/:id
// @desc    Fetch a single product by its ID
// @access  Public
router.route('/:id').get(getProductById);


// Note: Product CReate, Update, Delete (CRUD) operations are handled in adminRoutes.js
// as they are admin-specific functionalities and often involve image uploads (multer).

module.exports = router;