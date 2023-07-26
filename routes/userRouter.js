const router = require('express').Router()
const auth = require('../middleware/auth')
const userControl = require('../controllers/userControl')

router.get('/search', auth, userControl.searchUser)
router.get('/user/:id', auth, userControl.getUser)
router.patch('/user', auth, userControl.updateUser)
router.patch('/user/:id/follow', auth, userControl.followUser)
router.patch('/user/:id/unfollow', auth, userControl.unfollowUser)
router.get('/suggestionsUser', auth, userControl.suggestionsUser)


module.exports = router;