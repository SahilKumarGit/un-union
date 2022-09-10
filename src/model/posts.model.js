const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    comment: [{
        message: {
            type: String,
            trim: true,
            required: true
        },
        createdAt: {
            type: Date,
            required: true
        },
        commentBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', schema);