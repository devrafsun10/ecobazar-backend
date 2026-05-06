const User = require("../models/userModels")

let existingData = async (res, findData) => {
    let existingUser = await User.findOne(findData);

    // if (existingUser){
    //     return true
    // }else{
    //     return false
    // }

    return existingUser
}

module.exports = { existingData }