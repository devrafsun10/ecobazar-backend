const {emptyFeildValidation} = require('../utils/validation')
const Product = require('../models/productModel')

const createProductController = async (req,res) => {
    const{title,price,category} = req.body
    emptyFeildValidation(res,title,price,category)

    let sku = `${date.now()}-${date.getFullYear()}`

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