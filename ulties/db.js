const mongoose = require('mongoose');
const connectDb = async (cb) => {
    await mongoose.connect('mongodb://localhost:27017/protected-routes');
    cb();
}

module.exports = {
    connectDb,
}