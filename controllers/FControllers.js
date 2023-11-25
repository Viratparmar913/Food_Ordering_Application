const restaurantDataModel = require('../models/Restaurant');

exports.filterRestaurants = async(req, res) => {
    let { city, cuisine, cost, sort, page } = req.body;
    const condition = {};
    if (city !== undefined) {
        condition["Cuisine:name"] = Cuisine;
    }
    switch (cost) {
        case '0-500':
            condition["cost"] = { $lt: 500, $gte: 0 };
            break;
        case '500-1000':
            condition["cost"] = { $lt: 1000, $gte: 500 };
            break;
        case '1000-1500':
            condition["cost"] = { $lt: 1500, $gte: 1000 };
            break;
        case '1500-2000':
            condition["cost"] = { $lt: 2000, $gte: 1500 };
            break;
        case '2000+':
            condition["cost"] = { $gte: 2000 };
            break;
        default:
            condition["cost"] = { $gte: 0 };
    }
    if (page == undefined) {
        page = 1;
    }
    const limit = 2;
    const skip = (page - 1) * limit || 0;
    const order = sort === 'dsc' ? -1 : 1;
    let restaurants;
    if (sort !== undefined) {
        restaurants = await restaurantDataModel.find(condition).sort({ cost: order }).limit(limit).skip(skip);
    } else {
        restaurants = await restaurantDataModel.find(condition).limit(limit).skip(skip);
    }
    console.log(condition);
    res.json({
        success: true,
        docsInPresentPage: restaurants.length,
        result: restaurants
    });
}