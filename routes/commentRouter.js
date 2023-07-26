const router = require('express').Router()
const commentControl = require('../controllers/commentControl')
const auth = require('../middleware/auth')

router.post('/comment', auth, commentControl.createComment)
router.patch('/comment/:id', auth, commentControl.updateComment)
router.patch('/comment/:id/like', auth, commentControl.likeComment)
router.patch('/comment/:id/unlike', auth, commentControl.unLikeComment)
router.delete('/comment/:id', auth, commentControl.deleteComment)

module.exports = router