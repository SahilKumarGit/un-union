
const { default: mongoose } = require("mongoose")
const postsModel = require("../model/posts.model")
const { bad, good } = require("../utility/response")
require('dotenv').config()
const { emptyObject, emptyString } = require("../utility/validations")

const create_post = async (req, res) => {
    try {

        const body = req.body
        const myId = req.user._id
        if (emptyObject(body)) return bad(res, 400, 'post body is required!')
        let { title, description } = body;

        // validation
        if (emptyString(title)) return bad(res, 400, 'title address must be required!')
        if (emptyString(description)) return bad(res, 400, 'description address must be required!')

        const createPost = await postsModel.create({
            postBy: myId,
            title,
            description
        })
        const output = {
            post_id: createPost._id,
            title: createPost.title,
            description: createPost.description,
            createdAt: createPost.createdAt
        }
        return good(res, 200, output, 'post info!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}


// ⚠️ Because data is more precious thing for a company so it's good pratic to hide data from users and can't delete permanently

const delete_post = async (req, res) => {
    try {

        const postId = req.params.id
        const myId = req.user._id
        // console.log(myId)
        const applyDelete = await postsModel.findById(postId)
        if (!applyDelete || applyDelete.isDeleted) return bad(res, 404, 'post unavalable!')

        if (applyDelete.postBy.toString() != myId) return bad(res, 403, 'you don\'t have access to delete this post!')

        applyDelete.isDeleted = true
        await applyDelete.save()
        return good(res, 200, undefined, 'post deleted successfully!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}



const like_post = async (req, res) => {
    try {

        const postId = req.params.id
        const myId = req.user._id
        // console.log(myId)
        const post = await postsModel.findById(postId)
        if (!post || post.isDeleted) return bad(res, 404, 'post unavalable!')

        if (post.likes.includes(myId)) return bad(res, 400, 'you already liked this post!')
        post.likes.push(myId)

        await post.save()
        return good(res, 200, undefined, 'post liked successfully!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}



const dislike_post = async (req, res) => {
    try {

        const postId = req.params.id
        const myId = req.user._id
        // console.log(myId)
        const post = await postsModel.findById(postId)
        if (!post || post.isDeleted) return bad(res, 404, 'post unavalable!')

        const index = post.likes.indexOf(myId)
        if (index <= -1) return bad(res, 400, 'you didn\'t liked this post yet!')
        post.likes.splice(index, 1)

        await post.save()
        return good(res, 200, undefined, 'post disliked successfully!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}




const comment_post = async (req, res) => {
    try {

        const postId = req.params.id
        const body = req.body
        const myId = req.user._id
        // console.log(myId)

        if (emptyObject(body)) return bad(res, 400, 'post body is required!')
        let { comment } = body;

        // validation
        if (emptyString(comment)) return bad(res, 400, 'comment address must be required!')

        const post = await postsModel.findById(postId)
        if (!post || post.isDeleted) return bad(res, 404, 'post unavalable!')

        post.comment.push({
            message: comment,
            createdAt: new Date(),
            commentBy: myId
        })

        await post.save()
        return good(res, 200, undefined, 'comment added successfully!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}




const viewEach_post = async (req, res) => {
    try {

        const postId = req.params.id
        // console.log(myId)

        const post = await postsModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(postId),
                    isDeleted: false
                }
            },
            {
                $project: {
                    _id: 1,
                    postBy: 1,
                    title: 1,
                    description: 1,
                    likes: 1,
                    comment: 1,
                    createdAt: 1,
                    like_count: {
                        $cond: {
                            if: { $isArray: "$likes" },
                            then: { $size: "$likes" },
                            else: 0
                        }
                    },
                    comment_count: {
                        $cond: {
                            if: { $isArray: "$comment" },
                            then: { $size: "$comment" },
                            else: 0
                        }
                    }
                }
            }
        ])
        if (!post[0] || post[0].isDeleted) return bad(res, 404, 'post unavalable!')

        return good(res, 200, post[0], 'post details!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}




const view_all_post = async (req, res) => {
    try {

        const myId = req.user._id
        // console.log(myId)

        const post = await postsModel.aggregate([
            {
                $match: {
                    postBy: mongoose.Types.ObjectId(myId),
                    isDeleted: false
                }
            },
            {
                $project: {
                    _id: 1,
                    postBy: 1,
                    title: 1,
                    description: 1,
                    likes: 1,
                    createdAt: 1,
                    comment: 1,
                    like_count: {
                        $cond: {
                            if: { $isArray: "$likes" },
                            then: { $size: "$likes" },
                            else: 0
                        }
                    },
                    comment_count: {
                        $cond: {
                            if: { $isArray: "$comment" },
                            then: { $size: "$comment" },
                            else: 0
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } }
        ])
        if (post.length <= 0) return bad(res, 404, 'post unavalable!')

        return good(res, 200, post, 'post list!')
    } catch (e) {
        return bad(res, 500, e.message)
    }
}










module.exports = { create_post, delete_post, like_post, dislike_post, comment_post, viewEach_post, view_all_post }