const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

const createCart = async (req, res) => {
    const {id} = req.params

    const existingProduct = await Product.findOne({id})
    if(!existingProduct){
       return res.json({
            success: false,
            message: "Product not found"
        })
    }

    let cart = new Cart({
        product: id,
        quantity: 1
    })
    await cart.save()

    res.json({
        success: true,
        message: "Product added to cart"
    })
}

module.exports = { createCart }