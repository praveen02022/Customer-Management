
const router = require('express').Router();
const uuidv4 = require('uuid/v4');;
const multer = require('multer');
let Customer = require('../models/customers.model');
let CustomerDetail = require('../models/customerDetails.model');
let DIR = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/insertCustomer', upload.single("image"), (async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    const customer = new Customer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        dob: req.body.dob,
        gender: req.body.gender,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        image: url + '/uploads/' + req.file.filename
    });

    try {
        const newcustomer = await customer.save();
        const cId = newcustomer._id
        const customerDetails = new CustomerDetail({
            customerid: cId,
            address: req.body.address,
            landmark: req.body.landmark,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            zipcode: req.body.zipcode,
        });
        const newcustomerDetails = await customerDetails.save();
        return res.status(201).json({
            success: true,
            message: 'New Customer created successfully',
            new: newcustomer,
            details: newcustomerDetails
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
}))

router.route('/selectcustomers').get(async (req, res) => {
    Customer.find()
        .then((allCustomer) => {
            return res.status(200).json({
                success: true,
                message: 'A list of all allcustomer',
                data: allCustomer,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: err.message,
            });
        });
});
router.route("/updateCustomer/:customerid").put((req, res) => {
    const id = req.params.customerid;
    const updateObject = req.body;
    Customer.findByIdAndUpdate({ _id: id }, { $set: updateObject }).exec().then(() => {
        CustomerDetail.findOneAndUpdate({ customerid: id }, { $set: updateObject }).exec().then(() => {
            res.status(200).json({
                success: true,
                message: 'Customer is updated',
                updateDoc: updateObject,
            });
        })
    })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.'
            });
        });
})
router.route('/selectCustomerById/:id').get(async (req, res) => {
    const id = req.params.id
    CustomerDetail.findOne({ customerid: id })
        .then((address) => {
            res.status(200).json({
                success: true,
                message: "Select customer",
                data: address,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'This customer does not exist',
                error: err.message,
            })
        })
})

router.route("/deleteCustomer/:customerid").delete((req, res) => {

    const id = req.params.customerid;
    Customer.findByIdAndDelete({ _id: id }).exec().then(() => {
        CustomerDetail.findOneAndDelete({ customerid: id }).exec().then(() => {
            res.status(200).json({
                success: true,
                message: 'Customer is deleted',
            });
        })
    })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: err.message
            });
        });
})

module.exports = router;