const {emptyFeildValidation} = require('../utils/validation')
const Product = require('../models/productModel')

const createProductController = async (req,res) => {
    const{title,price,category} = req.body
    emptyFeildValidation(res,title,price,category)

    let sku = `${Date.now()}-${ new Date().getFullYear()}`

    let product = new Product({
        ...req.body,
        sku:sku
    })
    await product.save()

    res.json({
        success: true,
        message: "Product created successfully"
    })
}

//get all products
const getProductController = async (req,res) => {

    try {
        let product = await Product.find({})

        res.json( {
            success: true,
            product
        })
    }catch (error) {
        res.json( {
            success: false,
            message: "Server error"
        })
    }
}

//single product get
const getSingleProductController = async (req,res) => {
    try {
        const {id} =req.params

        const singleProduct = await Product.findOne({_id:id})

        res.json({
            success: true,
            singleProduct
        })
    }catch (error) {
        res.json( {
            success: false,
            message: "Server error"
        })
    }
}

//product delete
const productDeleteController = async (req, res) => {
    try {
        const {id} = req.params

        await Product.findByIdAndDelete({id})
        res.json({
            success: true,
            message: "Product deleted successfully"
        })
    }catch (error) {
        res.json( {
            success: false,
            message: "Server error"
        })
    }
}

const productUpdateController = async (req,res) => {
    try {
        const {id} = req.params

        const productUpdate = await Product.findByIdAndUpdate({_id:id},req.body)
        res.json({
            success: true,
            message: "Product updated successfully"
        })
    }catch (error) {
        res.json( {
            success: false,
            message: "Server error"
        })
    }
}

module.exports = {createProductController, getProductController, getSingleProductController, productDeleteController, productUpdateController}