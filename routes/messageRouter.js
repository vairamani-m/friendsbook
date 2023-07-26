const router = require('express').Router()
const messageControl = require('../controllers/messageControl')
const auth = require('../middleware/auth')

router.post('/message', auth, messageControl.createMessage)
router.get('/conversations', auth, messageControl.getConversations)
router.get('/message/:id', auth, messageControl.getMessages)
router.delete('/message/:id', auth, messageControl.deleteMessages)
router.delete('/conversation/:id', auth, messageControl.deleteConversation)

module.exports = router