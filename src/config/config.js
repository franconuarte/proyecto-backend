const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI,
    secretKey: process.env.SECRET_KEY,
};
