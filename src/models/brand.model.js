const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
   
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image:{
      type: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);





const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
