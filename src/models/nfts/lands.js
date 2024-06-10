const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
    x1: { type: String, required: true },
    x2: { type: String, required: true },
    x3: { type: String, required: true },
    x4: { type: String, required: true },
    name: { type: String, required: true },
    landType: { type: String, required: true },
    price: { type: String, required: true },
    owner: { type: String },
    isSold: { type: Boolean, default: false },
    description:{type: String, required: true},   
});
const landModel = mongoose.model('Land', landSchema);

module.exports = landModel;