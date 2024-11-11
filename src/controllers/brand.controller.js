const Brand = require('../models/brand.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/sendEmail');


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
      message: 'Hello from Brand',
      data: req.body || {}
    });
  });


/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get all Brand Controller
 * @route `/api/brand/getbrands`
 * @access Private
 * @type GET
 */
exports.getAll = catchAsync(async(req, res, next)=>{
  try {
    const data = await Brand.find().populate('_user')
  
    // Check if the Brand exists
      if(!data){
          return next(new AppError("Brand not found", 404));
      }
  
      // Return data of list of all Brand
      res.status(200).json({
          success: true,
          len: data.length,
          data
      })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while Getting brands',
    });
  }
  })

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get a brand Controller
 * @route `/api/brand/getbrand/:id`
 * @access Private
 * @type GET
 */
exports.getBrand = catchAsync(async (req, res, next) => {
  try {
      // Get the brand by id
      const data = await Brand.findById(req.params.id).populate("_user")

      // Check if the brand exists
      if (!data) {
        return next(new AppError('brand not found', 404));
      }

      // Return data after the brand
      res.status(200).json({
        success: true,
        data,
      });
  } catch (error) {
   next(new AppError("An error occurred. Please try again")) 
  }
});



/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Post a Brand Controller
 * @route `/api/brand/postbrand`
 * @access Private
 * @type POST
 */
exports.postBrand = catchAsync(async (req, res, next) => {

  const {
    title,
    description,
    image, // New field to determine if the brand should be saved as a draft
  } = req.body;

  const user = await User.findById(req.user.id); // Retrieve user ID from req.user

  // Create a new brand Object
  const brand = new Brand({
    title,
    _user: user._id, // Assign user ID to _user
    description,
    image,
  });

  if (!brand) {
    return next(new AppError('Please provide the required fields', 401));
  }

  // Save the brand object to the database
  await brand.save();

  user._brand.push(brand._id);
  await user.save();

  res.status(200).json({
    success: true,
    message:  'Brand created successfully',
    data: brand,
  });
});





/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description  Query Brand based on time controller
 * @route `/api/brand/brands`
 * @access Private
 * @type GET
 */
exports.getBasedOnTime = catchAsync(async (req, res, next) => {
  const { interval } = req.query;

  let startDate, endDate;

  // Calculate the start and end dates based on the interval
  if (interval === 'weekly') {
    startDate = startOfWeek(new Date());
    endDate = endOfWeek(new Date());
  } else if (interval === 'monthly') {
    startDate = startOfMonth(new Date());
    endDate = endOfMonth(new Date());
  }

  // Create the query object with the date range
  const query = startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {};

  // Get the Brand that match the query
  const brand = await Brand.find(query).populate('user');
  
  // Check if any Brand match the query
  if (!brand || brand.length === 0) {
    const errorMessage = startDate && endDate
      ? `No Brands found within the ${interval} interval`
      : 'Brands not found';
    return next(new AppError(errorMessage, 404));
  }
  
  // Return the list of Brand
  res.status(200).json({
    success: true,
    len: brand.length,
    brand,
  });
});




/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Edit brand Controller
 * @route `/api/brand/editbrand/:id`
 * @access Private
 * @type PUT
 */
exports.editBrand = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
  
    // Find the user by ID
    const brand = await Brand.findByIdAndUpdate(id, updates, { new: true });
  
    // Check if the brand exists
    if (!brand) {
      return next(new AppError('Brand not found', 404));
    }
  
    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: brand,
    });
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Delete a brand Controller
 * @route `/api/brand/deletebrand/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteBrand =  catchAsync(async (req, res, next) =>{
    //Get the user id
    const brand = await Brand.findByIdAndDelete(req.params.id)
  
    // Check if the Brand exists
    if (!brand) {
        return next(new AppError('No Brand found with that Id', 404));
      }
  
    // Return data after the brand has been deleted
    res.status(200).json({
        success: true,
        message: "Brand deleted successfully",
        data : {
            brand: null
        }
    })
  })
  