const Cartegory = require('../models/cartegory.model')
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
      message: 'Hello from Cartegorys',
      data: req.body || {}
    });
  });

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get all Cartegorys Controller
 * @route `/api/cartegory/getcartegorys`
 * @access Private
 * @type GET
 */
exports.getAll = catchAsync(async(req, res, next)=>{
  try {
    const data = await Cartegory.find().populate('_user')
  
    // Check if the cartegory exists
      if(!data){
        return next(new AppError("Cartegory not found", 404));
      }
  
      // Return data of list of all cartegorys
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
 * @description Get a Cartegory Controller
 * @route `/api/cartegory/getcartegory/:id`
 * @access Private
 * @type GET
 */
exports.getCartegory = catchAsync(async (req, res, next) => {
  try {
    // Get the Cartegory by id
    const data = await Cartegory.findById(req.params.id).populate("_user")

    // Check if the Cartegory exists
      if (!data) {
        return next(new AppError('Cartegory not found', 404));
      }

      // Return data after the Cartegory
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
 * @description Post a cartegory Controller
 * @route `/api/cartegory/postcartegory`
 * @access Private
 * @type POST
 */
exports.postCartegory = catchAsync(async(req, res, next)=>{
  try {

    const {Title, Description,image} = req.body;

    const user = await User.findById(req.user.id);

     // Create a new cartegory Object
    const cartegory = new Cartegory({
        Title, 
        Description, 
        image,
        _user:req.user.id, 
      
    })

    console.log(cartegory);
    

    if (!cartegory) {
        return next(new AppError('Please provide the required fields', 401));
    }

    // Save the cartegory object to the database
    await cartegory.save()
    user._cartegory.push(cartegory._id)
    

    await user.save()

    // const cartegoryLink = `http://localhost:30000/cartegory/${cartegory._id}`;

    res.status(200).json({
        success: true,
        message: 'Cartegory created successfully',
        data: cartegory
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
})

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Edit cartegory Controller
 * @route `/api/cartegory/editcartegory/:id`
 * @access Private
 * @type PUT
 */
exports.editCartegory = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
  
    // Find the user by ID
    const cartegory = await Cartegory.findByIdAndUpdate(id, updates, { new: true });
  
    // Check if the cartegory exists
    if (!cartegory) {
      return next(new AppError('Cartegory not found', 404));
    }
  
    res.status(200).json({
      success: true,
      message: 'Cartegory updated successfully',
      data: cartegory,
    });
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Delete a Cartegory Controller
 * @route `/api/cartegory/deletecartegory/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteCartegory =  catchAsync(async (req, res, next) =>{
  try {
    //Get the cartegory id
    const cartegory = await Cartegory.findByIdAndDelete(req.params.id)

    // Check if the cartegory exists
    if (!cartegory) {
        return next(new AppError('No cartegory found with that Id', 404));
      }
  
    // Return data after the cartegory has been deleted
    res.status(200).json({
        success: true,
        message: "Cartegory deleted successfully",
        data : {
          cartegory: null
        }
    })
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
})
  