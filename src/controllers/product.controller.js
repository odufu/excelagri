const Product = require('../models/product.model')
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Ping the Route `test`
 * @route `@any`
 * @access Public
 * @type POST
 */
exports.ping = catchAsync(async (req, res, next) => {
    res.status(200).json({
      success: true,
      status: 'success',
      message: 'Hello from Products',
      data: req.body || {}
    });
  });

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get all Products Controller
 * @route `/api/product/getproducts`
 * @access Private
 * @type GET
 */
exports.getAll = catchAsync(async(req, res, next)=>{
  try {
    const data = await Product.find().populate('_user')
  
    // Check if the product exists
      if(!data){
        return next(new AppError("Product not found", 404));
      }
  
      // Return data of list of all products
      res.status(200).json({
          success: true,
          len: data.length,
          data
      })
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
})

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get a Product Controller
 * @route `/api/product/getproduct/:id`
 * @access Private
 * @type GET
 */
exports.getProduct = catchAsync(async (req, res, next) => {
  try {
    // Get the Product by id
    const data = await Product.findById(req.params.id).populate("_user")

    // Check if the Product exists
      if (!data) {
        return next(new AppError('Product not found', 404));
      }

      // Return data after the Product
      res.status(200).json({
        success: true,
        data,
      });
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
});


/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Post a product Controller
 * @route `/api/product/postproduct`
 * @access Private
 * @type POST
 */
exports.postProduct = catchAsync(async(req, res, next)=>{
  try {
    const {Name, Description,images, _user} = req.body;

    const user = await User.findById(_user);

     // Create a new product Object
    const product = new Product({
        Name, 
        Description, 
        images,
        _user, 
      
    })

    if (!product) {
        return next(new AppError('Please provide the required fields', 401));
    }

    // Save the product object to the database
    await product.save()
    user._product.push(product._id)

    await user.save()

    // const productLink = `http://localhost:30000/product/${product._id}`;

    res.status(200).json({
        success: true,
        message: 'Product created successfully',
        data: product
    });
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
})

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Edit product Controller
 * @route `/api/product/editproduct/:id`
 * @access Private
 * @type PUT
 */
exports.editProduct = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
  
    // Find the user by ID
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
  
    // Check if the product exists
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
  
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Delete a Product Controller
 * @route `/api/product/deleteproduct/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteProduct =  catchAsync(async (req, res, next) =>{
  try {
    //Get the product id
    const product = await Product.findByIdAndDelete(req.params.id)

    // Check if the product exists
    if (!product) {
        return next(new AppError('No product found with that Id', 404));
      }
  
    // Return data after the product has been deleted
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data : {
          product: null
        }
    })
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
})
  