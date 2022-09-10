const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('User', schema);