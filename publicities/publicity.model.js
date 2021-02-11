const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
});

module.exports = mongoose.model('Publicity', schema);
