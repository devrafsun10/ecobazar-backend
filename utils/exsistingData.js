const User = require("../models/userModels")

let existingData = async (res, findData) => {
    let existingUser = await User.findOne(findData);

    if (existingUser) {
        res.send({ message: "User already exist." })
        return true
    }

    return false
}

module.exports = { existingData }