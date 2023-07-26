const router = require('express').Router()
const postControl = require('../controllers/postControl')
const auth = require('../middleware/auth')

router.route('/posts')
        .post(auth, postControl.createPost)
        .get(auth, postControl.getPosts)

router.route('/post/:id')
        .patch(auth, postControl.updatePost)
        .get(auth, postControl.getPost)
        .delete(auth, postControl.deletePost)

router.patch('/post/:id/like', auth, postControl.likePost)
router.patch('/post/:id/unlike', auth, postControl.unLikePost) 

// router.route('/post/:id/like')
// .patch(auth, postControl.likePost)

// router.route('/post/:id/unlike')
// .patch(auth, postControl.unLikePost)

router.get('/user_posts/:id', auth, postControl.getUserPosts)
router.get('/post_discover', auth, postControl.getPostsDiscover)
router.patch('/savePost/:id', auth, postControl.savePost) 
router.patch('/unSavePost/:id', auth, postControl.unSavePost) 
router.get('/getSavePosts', auth, postControl.getSavePosts) 

module.exports = router