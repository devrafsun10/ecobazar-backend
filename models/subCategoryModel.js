// const mongoose = require( 'mongoose');
// const { Schema } = mongoose;

// const subCategorySchema = new schema( {

//     title: {
//         type : String,
//         required : true,
//         unique : true 
//     },
//     status : {
//         type : String,
//         enum : [ "pending", "approved" , "rejected"],
//         default : "pending"
//     },
//     category : {
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "Category",
//     }
// }, { Timestamps : true})

// module.exports = mongoose.model('SubCategory', subCategorySchema)