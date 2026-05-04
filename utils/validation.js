

let emptyFeildValidation = (res,...fields)=>{

       if (fields.includes('') || fields.includes(undefined)) {
        return res.send({
            message: "All fields are required."
        })
    }
}

module.exports = {emptyFeildValidation}