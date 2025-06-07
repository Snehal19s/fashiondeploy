// server/config/index.js
require('dotenv').config(); // to load .env variables

module.exports = {
    PORT: process.env.PORT || 5001,
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://snehal:snehal@fashionsta-cluster.lmwv0ps.mongodb.net/?retryWrites=true&w=majority&appName=fashionsta-cluster',
    JWT_SECRET: process.env.JWT_SECRET || 'yourjwtsecretkey'
};
