const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    }, 
    description: {
        type: String
    }, 
    publishedDate: {
        type: Date, 
        required: true
    }, 
    pageCount: {
        type: Number, 
        required: true
    }, 
    createAt: {
        type: Date, 
        required: true,
        default: Date.now
    }, 
    coverImage: {
        type: Buffer, 
        required: true
    }, 
    coverImageType: {
        type: String, 
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Author'
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null) {
       return `data:${this.coverImageType};charset=utf8;base64,${this.coverImage.toString('base64')}`
    }
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;