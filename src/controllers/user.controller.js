const User = require("../models/user.model");
const Product = require('../models/product.model')
const Brand = require('../models/brand.model');
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

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
    message: 'Hello from User',
    data: req.body || {}
  });
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get all Users Controller
 * @route `/api/user/getusers`
 * @access Private
 * @type GET
 */
exports.getAll = catchAsync(async(req, res, next)=>{
  try {
    const data = await User.find().populate(["_brand", "_cartegory"])

    // Check if the users exists
    if(!data){
      return next(new AppError("Users not found", 404));
    }

    // Return data of list of all users
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
 * @description Get users profile Controller
 * @route `/api/user/getprofile/:id`
 * @access Private
 * @type GET
 */
exports.getProfile = catchAsync(async (req, res, next) => {
  try {
        // Get the user by id
    const data = await User.findById(req.params.id).populate(["_brand", "_cartegory"])

    // Check if the user exists
    if (!data) {
      return next(new AppError('Profile not found', 404));
    }

    // Return data after the user has gotten the profile
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
 * @description Get users by type Controller
 * @route `/api/user/admin/users`
 * @access Private
 * @type GET
 */
exports.getUsers = catchAsync(async (req, res, next) => {
  try {
    const { userType } = req.query;

    let query = {};
  
    // Check if userType is provided in the query
    if (userType) {
      query.userType = userType;
    }
  
    const users = await User.find(query);
  
    // Check if any users are found
    if (users.length === 0) {
      return next(new AppError('Users not found', 404));
    }
  
    res.status(200).json({
      success: true,
      len: users.length,
      data: users,
    });
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500)); 
  }
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Edit user profile Controller
 * @route `/api/user/editprofile/:id`
 * @access Private
 * @type PUT
 */
exports.editProfile = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
  
    // Find the user by ID
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
  
    // Check if the user exists
    if (!user) {
      return next(new AppError('User not found', 404));
    }
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500)); 
  }
});
/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get all activities Controller
 * @route `/api/user/activities`
 * @access Private
 * @type GET
 */
exports.getActivities = catchAsync(async (req, res, next) => {
  try {
    const activities = [];

    // Retrieve activities for Product
    const productActivities = await Product.find().sort({ createdAt: -1 });
    activities.push(...productActivities);

    // Retrieve activities for Brand
    const brandActivities = await Brand.find().sort({ createdAt: -1 });
    activities.push(...brandActivities);


    // Retrieve activities for User
    const userActivities = await User.find().sort({ createdAt: -1 });
    activities.push(...userActivities);

   

    // Shuffle the activities based on the newest sort order
    activities.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      len: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred, please try again.",
    });
  }
});



/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Delete a user Controller
 * @route `/api/user/deleteprofile/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteUser =  catchAsync(async (req, res, next) =>{
  try {
      //Get the user id
  const user = await User.findByIdAndDelete(req.params.id)

  // Check if the user exists
  if (!user) {
      return next(new AppError('No user found with that Id', 404));
    }

  // Return data after the user has been deleted
  res.status(200).json({
      success: true,
      data : {
          user: null
      }
  })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred, please try again.",
    });
  }
})
