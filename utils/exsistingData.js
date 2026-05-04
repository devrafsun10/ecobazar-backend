const User = require("../models/userModels")

let existingData = async (res, findData) => {
    const { email } = findData; //extract email
    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
        res.send({ message: "User already exist." })
        return true
    }
}

module.exports = { existingData }