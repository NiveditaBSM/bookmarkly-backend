const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'is required']
    },
    author: {
        type: String, 
        required: false
    },
    url: {
        type: String,
        required: [true, 'is required']
    },
    summary: {
        type: String, 
        required: false
    },
    tags:  {
        type: [String],
        set: tags => [...new Set(tags.map(tag => tag.toLowerCase().trim()))]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
})

bookmarkSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)
module.exports = Bookmark