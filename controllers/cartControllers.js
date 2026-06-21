const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

const createCart = async (req, res) => {
    const {proid, userid} = req.body

    const existingProduct = await Product.findOne({_id:proid})
    if(!existingProduct){
       return res.json({
            success: false,
            message: "Product not found"
        })
    }

    const existingProductOnCart = await Cart.findOne({product: proid, user: userid})
    if(existingProductOnCart){
        existingProductOnCart.quantity += 1
        existingProductOnCart.totalPrice = existingProductOnCart.totalPrice + existingProduct.price
        await existingProductOnCart.save()
        return res.json({
            success: true,
            message: "Product quantity updated"
        })
    }else{
        let cart = new Cart({
        product: proid,
        quantity: 1,
        totalPrice: existingProduct.price,
        user: userid
    })
    await cart.save()
    }

    

    res.json({
        success: true,
        message: "Product added to cart"
    })
}

const increDecre = async (req,res) => {
    const {id} = req.params
    const { type} = req.body

    const cart = await Cart.findOne({ product : id})
    const product = await Product.findOne({ _id: id })

    if( type === "plus") {
        cart.quantity += 1
        cart.totalPrice = cart.totalPrice + product.price

        await cart.save()
    }else{
        cart.quantity -= 1
        cart.totalPrice = cart.totalPrice - product.price
        await cart.save()
    }
    console.log("type: ", type)

    res.json({
        success: true,
        message: "Product quantity updated"
    })
}

const proDelete = async (req,res) => {

    const {id} = req.params
    await Cart.findByIdAndDelete({ _id: id })

    res.json({
        success: true,
        message: "Product deleted from cart"
    })
}

const getCart = async (req,res) => {
    const {userId} = req.params

    const cart = await Cart.find({user : userId}).populate("product")

    let totalPrice = 0

    cart.map(item => {
        console.log(item.product.price);
        
        totalPrice += item.product.price
    })

    res.json({
        cart,
        totalPrice
    })
}

module.exports = { createCart, increDecre, proDelete, getCart }