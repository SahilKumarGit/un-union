const userModel = require("../model/user.model")
const jwt = require('jsonwebtoken')
const { bad, good } = require("../utility/response")
require('dotenv').config()
const { emptyObject, emptyString, invalidEmail, invalidPassword } = require("../utility/validations")

const login_user = async (req, res) => {
    try {
        // login user require email and password as input , in output jwt token will be send
        const body = req.body
        if (emptyObject(body)) return bad(res, 400, 'post body is required!')
        let { email, password } = body;

        // validation
        if (emptyString(email)) return bad(res, 400, 'email address must be required!')
        if (emptyString(password)) return bad(res, 400, 'password address must be required!')
        if (invalidEmail(email)) return bad(res, 400, 'please enter a valid email address!')
        if (invalidPassword(password)) return bad(res, 400, 'please enter a valid password like A-Z, a-z, 0-9 and specal charecters!')

        // db validation
        const user = await userModel.findOne({ email, password }).select({ _id: 1 })
        if (!user) return bad(res, 401, 'wrong email or password')

        // generate jwt token
        const payload = {
            uid: user._id,
            message: 'basic assignment'
        }
        const token = jwt.sign(payload, process.env.SECRET)
        return good(res, 200, { token }, 'loggined successfully!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}


const follow_some_one = async (req, res) => {
    try {
        // login user require email and password as input , in output jwt token will be send
        const id = req.params.id.trim()
        const myId = req.user._id

        if (id == myId) return bad(res, 400, 'you can\'t follow your self!')

        // add my id to there follers
        const user = await userModel.findById(id).select({ followers: 1 })
        if (!user) return bad(res, 404, 'users info unavailable!')
        if (user.followers.includes(myId)) return bad(res, 400, 'you are already followed this persion!')
        user.followers.push(myId)
        await user.save()

        // add there id to my follers
        const my = await userModel.findById(myId).select({ following: 1 })
        if (!my) return bad(res, 404, 'users info unavailable!')
        if (!my.following.includes(id)) my.following.push(id)
        await my.save()

        return good(res, 200, undefined, 'following successfully!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}


const unfollow_some_one = async (req, res) => {
    try {
        // login user require email and password as input , in output jwt token will be send
        const id = req.params.id.trim()
        const myId = req.user._id

        if (id == myId) return bad(res, 400, 'you can\'t unfollow your self!')

        // add my id to there follers
        const user = await userModel.findById(id).select({ followers: 1 })
        if (!user) return bad(res, 404, 'users info unavailable!')
        let index1 = user.followers.indexOf(myId)
        if (index1 <= -1) return bad(res, 400, 'you didn\'t follow this persion yet, so you can not unfollow!')
        user.followers.splice(index1, 1)
        await user.save()

        // add there id to my follers
        const my = await userModel.findById(myId).select({ following: 1 })
        if (!my) return bad(res, 404, 'users info unavailable!')
        let index2 = my.following.indexOf(id)
        if (index2 >= 0) my.following.splice(index2, 1)
        await my.save()

        return good(res, 200, undefined, 'unfollowing successfully!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}


const user = async (req, res) => {
    try {
        // login user require email and password as input , in output jwt token will be send
        const myId = req.user._id


        // add my id to there follers
        const user = await userModel.aggregate([
            {
                $match: {
                    _id: myId
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    followers: {
                        $cond: {
                            if: { $isArray: "$followers" },
                            then: { $size: "$followers" },
                            else: 0
                        }
                    },
                    following: {
                        $cond: {
                            if: { $isArray: "$following" },
                            then: { $size: "$following" },
                            else: 0
                        }
                    }
                }
            },

        ])
        if (!user) return bad(res, 404, 'users info unavailable!')

        return good(res, 200, user, 'profile info!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}





module.exports = { login_user, follow_some_one, unfollow_some_one, user }