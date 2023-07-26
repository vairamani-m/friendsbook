const Posts = require('../models/postModel')
const Users = require('../models/userModel')
const Comments = require('../models/commentModel')

class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

const postControl = {
    createPost: async (req, res) => {
        try {
            const { content, images } = req.body;
            if(images.length == 0)
            return res.status(400).json({ message: 'Please add your photo' })
            const newPost =  new Posts({
                content, images, user: req.user._id
            })
            await newPost.save()
            res.json({
                message:'Create Post!',
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                user: [...req.user.following, req.user._id]
            }), req.query).paginating()
            const posts = await features.query.sort('-createdAt')
            .populate("user likes", "avatar username fullname followers")
            .populate({
                path:"comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })
            res.json({
                message:'Success!',
                result:posts.length,
                posts
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    updatePost: async (req, res) => {
        try {
            const { content, images } = req.body;
            const post = await Posts.findOneAndUpdate({ _id: req.params.id}, {
                content, images
            }).populate("user likes", "avatar username fullname")
            .populate({
                path:"comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })
            res.json({
                message:"Updated Post!",
                newPost: {
                    ...post._doc,
                    content,
                    images
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    likePost: async (req, res) => {
        try {
            const post = await Posts.find({ _id: req.params.id, likes: req.user._id })
            if(post.length > 0) return res.status(400).json({ message: "You liked this post"})

            const like = await Posts.findOneAndUpdate({ _id: req.params.id}, {
                $push: { likes: req.user._id}
            }, {new: true })

            if(!like) return res.status(400).json({ message: 'This post does not exist.'})

            res.json({ message:"Liked Post!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    unLikePost: async (req, res) => {
        try {
            const like = await Posts.findOneAndUpdate({ _id: req.params.id}, {
                $pull: { likes: req.user._id}
            }, {new: true })
            if(!like) return res.status(400).json({ message: 'This post does not exist.'})
            res.json({ message:"Unliked Post!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({ user : req.params.id }), req.query).paginating()
           const posts =  await features.query.sort("-createdAt")
            res.json({ 
                posts, 
                result: posts.length 
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getPost: async (req, res) => {
        try {
           const post =  await Posts.findById(req.params.id)
           .populate("user likes", "avatar username fullname followers")
           .populate({
               path:"comments",
               populate: {
                   path: "user likes",
                   select: "-password"
               }
           })
           if(!post) return res.status(400).json({ message: 'This post does not exist.'})
            res.json({ post })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getPostsDiscover: async (req, res) => {
        try {
            // const features = new APIfeatures(Posts.find({
            //     user: {$nin: [...req.user.following, req.user._id]}
            // }), req.query).paginating()
            // const posts = await features.query.sort('-createdAt')

            const newArr = [...req.user.following, req.user._id]
            const num = req.query.num || 9

            const posts = await Posts.aggregate([
                { $match: { user : { $nin: newArr }}},
                { $sample: { size: Number(num) }}  
            ])

            res.json({
                message:'Success!',
                result:posts.length,
                posts
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deletePost: async(req, res) => {
        try {
            const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id })
            await Comments.deleteMany({_id: {$in: post.comments}})
            res.json({
                message: 'Deleted Post!',
                newPost: {
                    ...post,
                    user: req.user
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    savePost: async (req, res) => {
        try {
            const user = await Users.find({ _id: req.user._id, saved: req.params.id })
            if(user.length > 0) return res.status(400).json({ message: "You saved this post"})

            const save = await Users.findOneAndUpdate({ _id: req.user._id}, {
                $push: { saved: req.params.id }
            }, {new: true })

            if(!save) return res.status(400).json({ message: 'This user does not exist.'})

            res.json({ message:"Saved Post!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    unSavePost: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({ _id: req.user._id}, {
                $pull: { saved: req.params.id }
            }, {new: true })

            if(!save) return res.status(400).json({ message: 'This user does not exist.'})

            res.json({ message:"UnSaved Post!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                _id: {$in: req.user.saved}
            }), req.query).paginating()

            const savePosts = await features.query.sort("-createdAt")

            res.json({ 
                savePosts, 
                result: savePosts.length 
            })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = postControl