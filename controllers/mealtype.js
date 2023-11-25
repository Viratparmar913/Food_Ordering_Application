const meal = require('../models/mealtype');

exports.getMeals = (req , res) => {
    meal.find().then(result => {
      
        res.status(200).json({
            message: "Meal List Fetched",
            meals: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error
        });
    });

}

