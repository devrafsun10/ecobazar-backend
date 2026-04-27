const jwt = require('jsonwebtoken');

let secureMiddleware = (req, res, next) => {

    let token = req.headers.authorization;//token is coming from the client side in the header
    
    //for verifying the token
    // let data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if(err){
            res.send({
                message: "Unauthorized"
            })
        } else {
            next();
        }
});
}

module.exports = secureMiddleware;