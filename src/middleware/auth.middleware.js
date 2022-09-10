const { bad } = require("../utility/response")
const jwt = require('jsonwebtoken')
const userModel = require("../model/user.model")
require('dotenv').config()

module.exports.auth_o = async (req, res, next) => {
    try {
        const token = req.headers.token

        if (!token) return bad(res, 400, 'token is required in header!')

        return jwt.verify(token, process.env.SECRET, async (err, decode) => {
            if (err) return bad(res, 401, err.message)
            // console.log(decode)
            let usersData = await userModel.findById(decode.uid).select({ followers: 0, following: 0 })
            if (!usersData) return bad(res, 403, "user info unavalabel")
            req.user = usersData
            next()
        })
    } catch (e) {
        return bad(res, 500, e.message)
    }
}