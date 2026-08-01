const axios = require('axios')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')

const paymentControllers = async (req, res) => {

    const { userId, amount, cus_name, cus_email, cus_add1, cus_add2, cus_city, cus_state, cus_postcode, cus_phone } = req.body;

    try {

        const cart = await Cart.find({ user: userId }).populate('product')
        let totalPrice = 0

        let pro = []

        cart.map(item => {
            
            pro.push({
                title : item.product.title,
                price : item.product.price,
                sku   : item.product.sku,
                discountPrice: item.product.discountPrice,
                 stock: item.product.stock,
                category: item.product.category,
                tag: item.product.tag,
                status: item.product.status,
                images: item.product.images,
                quantity: item.quantity,
                totalPrice: item.totalPrice
            });
            
            totalPrice += item.totalPrice
        })
    //    res.send({
    //     products: pro,
    //     totalPrice: totalPrice
    //    })

        const response = await axios.post(
            "https://sandbox.aamarpay.com/jsonpost.php",
            {
                store_id: "aamarpaytest",
                tran_id: Date.now().toString(),
                success_url: "http://www.merchantdomain.com/successpage.html",
                fail_url: "http://www.merchantdomain.com/failedpage.html",
                cancel_url: "http://www.merchantdomain.com/cancelpage.html",
                amount: totalPrice,
                currency: "BDT",
                signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
                desc: "Merchant Registration Payment",
                cus_name: cus_name,
                cus_email: cus_email,
                cus_add1: cus_add1,
                cus_add2: cus_add2,
                cus_city: cus_city,
                cus_state: cus_state,
                cus_postcode: cus_postcode,
                cus_country: "Bangladesh",
                cus_phone: cus_phone,
                type: "json",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const order = new Order({
            user: userId,
            products: pro,
            totalPrice: totalPrice,
            tranid: "8675644"
        });

        await order.save();

        res.json(response.data);
    } catch (error) {
        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: error.response?.data || error.message,
        });
    }
};

const getAllOrdersController = async (req,res) => {
    const {userid} = req.params

    let data = await Order.find({user: userid})

    if (!data.length) {
        return res.json({
            success: false,
            message: 'Order Not Found'
        })
    }

    res.send({
        success: true,
        data
    })
}

module.exports = { paymentControllers, getAllOrdersController }
