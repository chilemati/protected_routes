let mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');

let adminSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        validate: [isEmail, 'not a valid email'],
        unique: true,
    }
}, { timestamps: true });

let Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;