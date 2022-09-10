const express = require('express')
const { create_post, delete_post, like_post, dislike_post, comment_post, viewEach_post, view_all_post } = require('../controller/post.controller')
const { login_user, follow_some_one, unfollow_some_one, user } = require('../controller/user.controller')
const { auth_o } = require('../middleware/auth.middleware')
const route = express.Router()


// NOTE: Use dummy email & password for authentication. No need to create endpoint for registering new user.
// as per the documentation i did't create the create user api



route.post('/authenticate', login_user)

route.get('/user', auth_o, user)


route.post('/follow/:id', auth_o, follow_some_one)
route.post('/unfollow/:id', auth_o, unfollow_some_one)


route.post('/posts', auth_o, create_post)
route.delete('/posts/:id', auth_o, delete_post)
route.get('/posts/:id', auth_o, viewEach_post)
route.get('/all_posts', auth_o, view_all_post)

route.post('/like/:id', auth_o, like_post)
route.post('/unlike/:id', auth_o, dislike_post)
route.post('/comment/:id', auth_o, comment_post)






module.exports = route