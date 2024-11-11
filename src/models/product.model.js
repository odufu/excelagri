const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    _user: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    Name: {
      type: String,
    },
    Description: {
      type: String,
    },
    images:[]

  },
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
