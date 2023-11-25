const Orders = require('../models/Orders');

exports.getOrdersForUser = (req, res) => {
    Orders.find({ 
        username: req.params.username
    }).then(result => {
        res.status(200).json({
            orders:  result,
            message: "Success"
        });
    }).catch(error => {
        res.status(500).json({
            message: error
        });
    });
}

exports.saveOrderForUser = (req, res) => {

    const username = req.body.username;
    const  mobileNumber = req.body. mobileNumber;
    const address = req.body.address;
    const items = req.body.items;
    const total = req.body.total;


    const saveOrderForUsers = new User({
        username: username,
        mobileNumber:  mobileNumber,
        address: address,
        items: items,
        total: total
    });

    saveOrderForUsers.save().then(
        result => {
            res.status(200).json({
                message: "User's order saved successfully !",
                user: result
            });
        }
    ).catch(
        error => {
            res.status(500).json({
                message: error
            });
        }
    );
}