const express = require("express");

const router = express.Router();

const PaymentController =
    require("../Controller/payment.js");

const { isLoggedIn } =
    require("../middleware.js");


router.post(
    "/payment/verify",
    isLoggedIn,
    PaymentController.verifyPayment
);


module.exports = router;