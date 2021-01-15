const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    path: String,
    url: String,
    caption: String,
}, {timestamps: true});


schema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('File', schema);
