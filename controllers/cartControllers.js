const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

const createCart = async (req, res) => {
    const {proid, userid} = req.params

    const existingProduct = await Product.findOne({proid})
    if(!existingProduct){
       return res.json({
            success: false,
            message: "Product not found"
        })
    }

    let cart = new Cart({
        product: id,
        quantity: 1,
        userid : userid
    })
    await cart.save()

    res.json({
        success: true,
        message: "Product added to cart"
    })
}

const increDecre = async (req,res) => {
    const {id} = req.params
    const { type} = req.params

    const product = await Product.findOne({id})

    if( type === "plus") {
        product.quantity = product.quantity + 1
    }else{
        product.quantity = product.quantity - 1
    }
    await product.save()

    res.json({
        success: true,
        message: "Product quantity updated"
    })
}

const proDelete = async (req,res) => {

    const {id} = req.params
    await Cart.findByIdAndDelete({id})

    res.json({
        success: true,
        message: "Product deleted from cart"
    })
}

const getCart = async (req,res) => {
    const {userId} = req.params

    const cart = await Cart.find({_id: userId})

    let totalPrice = 0

    cart.map(item => {
        totalPrice += item.price
    })

    res.json({
        cart,
        totalPrice
    })
}

module.exports = { createCart, increDecre, proDelete, getCart }