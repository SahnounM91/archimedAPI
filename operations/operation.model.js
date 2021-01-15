const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    audioFiles: [{
        type: Schema.Types.ObjectID,
        ref: 'File'
    }],
    textFiles: [{
        type: Schema.Types.ObjectID,
        ref: 'File'
    }],
}, {timestamps: true});


schema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Operation', schema);
