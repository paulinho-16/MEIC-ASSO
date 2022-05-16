import express from 'express'

import controller from '../controller/notifications.controller'

const router = express.Router()

router.post("/user/:deviceToken",controller.addDeviceToken)
router.delete("/user/:deviceToken",controller.removeDeviceToken)

// Route to create a notification topic
router.post('/topic/:topic', controller.createTopic)

// Route to delete a notification topic
router.delete('/topic/:topic', controller.deleteTopic)

// Route to create notification
router.post('/:client', controller.createNotification)

// Route to get all notifications
router.get('/:client/all', controller.getAllNotifications)


export default router
