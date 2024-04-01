const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    nft: { type: String, required: true }, //tokenid
    nft_image: { type: String, required: true },//image link
    name: { type: String, required: true },//image name
    type: { type: String, required: true },//nft type
    price: { type: String, required: true },//nft price
    owner: { type: String },
    isSold: { type: Boolean, default: false },
});
const nftModel = mongoose.model('Nft', nftSchema);

module.exports = nftModel;