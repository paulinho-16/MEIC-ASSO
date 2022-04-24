import express from 'express'

import controller from '../controller/notifications.controller'

const router = express.Router()

// Route to create notification
router.post('/:client', controller.createNotification)

// Route to update notification to seen
router.put('/:notification', controller.updateNotification)

// Route to get all unseen notifications
router.get('/:client/allunseen', controller.getAllUnseenNotifications)

// Route to get all notifications
router.get('/:client/all', controller.getAllNotifications)

// Route to create a notification topic
router.post('/topic/:topic', controller.createTopic)

// Route to delete a notification topic
router.delete('/topic/:topic', controller.deleteTopic)


export default router