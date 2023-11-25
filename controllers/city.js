const city = require('../models/city');

const restaurantList = require('../models/Restaurant');

exports.getCityList = (req , res) => {
    city.find().then(result => {
      
        res.status(200).json({
            message: "City List Fetched",
            cities: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error
        });
    });

}



exports.getRestaurantsByCity = (req, res) => {
    console.log(req.params.city.toString())
    restaurantList.find({ 
     city: req.params.city.toString()
 }).then(result => {
        res.status(200).json({
           restaurants:  result,
           message: "Success"
       });
    }).catch(error => {
        res.status(500).json({
            message: error
       });
    });
}