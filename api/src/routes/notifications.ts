import express from 'express'

import controller from '../controller/notifications.controller'

const router = express.Router()


/**
 * @swagger
 * paths:
 *
 *
 *   /notification/{user}:
 *     post:
 *       tags:
 *         - Notifications
 *       summary: Creates a notification for a user
 *       operationId: createNotification
 *       description: Adds a notification to the system
 *       parameters:
 *         - in: path
 *           name: user
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the client that is supposed to receive the notification
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 topic_identification_token:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *               required:
 *                 - topic_identification_token
 *                 - title
 *                 - content
 *         description: Parameters to create the notification and topic token for security reasons
 *       responses:
 *         '200':
 *           description: If status not OK, returns error message
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Status message
 *                   error:
 *                     type: string
 *                     description: Error description message
 *               examples:
 *                 success:
 *                     summary: Example of a successful response
 *                     value:
 *                       status: "ok"
 *                 error:
 *                   summary: Example of an error response
 *                   value:
 *                     status: "error"
 *                     error: "error creating notification, check the userId and topic_identification_token"
 *
 *   /notification/{user}/all:
 *     get:
 *       tags:
 *         - Notifications
 *       summary: searches all notifications of a certain user
 *       operationId: getAllNotifications
 *       description: Obtains all the notifications for the specific user
 *       parameters:
 *         - in: path
 *           name: user
 *           required: true
 *           schema:
 *             type: string
 *           description: The user ID
 *       responses:
 *         '200':
 *           description: If status OK, returns all the user's notifications. If not, returns error message
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Status message
 *                   error:
 *                     type: string
 *                     description: Error description message
 *                   notifications:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Notification'
 *                     description: Array containing the user's notifications
 *               examples:
 *                 success:
 *                     summary: Example of a successful response
 *                     value:
 *                       status: "ok"
 *                       notifications:
 *                           - title: "Payment Received"
 *                             content: "Your payment with id <xxxxx> has been succesfully processed"
 *                             topic: "Current Account"
 *                             userID: "Example userID"
 *                           - title: "Payment Awaiting"
 *                             content: "Your payment with id <xxxxx> is ready"
 *                             topic: "Current Account"
 *                             userID: "Example userID"
 *                 error:
 *                   summary: Example of an error response
 *                   value:
 *                     status: "error"
 *                     error: "user does not exist"
 *
 *   /topic/{topic}:
 *     post:
 *       tags:
 *         - Notifications
 *       summary: Creates a notification topic
 *       operationId: createTopic
 *       description: Creates a notification topic if it doesn't exist
 *       parameters:
 *         - in: path
 *           name: topic
 *           required: true
 *           schema:
 *             type: string
 *           description: The topic name
 *       responses:
 *         '200':
 *           description: If status OK, returns identification_token. If not, returns error message
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Status message
 *                   identification_token:
 *                     type: string
 *                     description: Token required for future posting of notifications to that specific topic
 *                   error:
 *                     type: string
 *                     description: Error description message
 *               examples:
 *                 success:
 *                     summary: Example of a successful response
 *                     value:
 *                       status: "ok"
 *                       token: "fff5b78d-906f-4680-b071-b067e38a6e4c"
 *                 error:
 *                   summary: Example of an error response
 *                   value:
 *                     status: "error"
 *                     error: "topic already exists"
 *     delete:
 *       tags:
 *         - Notifications
 *       summary: deletes a notification topic
 *       operationId: deleteTopic
 *       description: Deletes a notification topic from the system
 *       parameters:
 *         - in: path
 *           name: topic
 *           required: true
 *           schema:
 *             type: string
 *           description: identification_token
 *       responses:
 *         '200':
 *           description: If status not OK, returns error message
 *           content:
 *             application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       description: Status message
 *                     error:
 *                       type: string
 *                       description: Error description message
 *                 examples:
 *                   success:
 *                       summary: Example of a successful response
 *                       value:
 *                         status: "ok"
 *                   error:
 *                     summary: Example of an error response
 *                     value:
 *                       status: "error"
 *                       error: "topic missing"
 *   /config/all:
 *     get:
 *       tags:
 *         - Notifications Preferences
 *       summary: Obtains all notification topics
 *       operationId: getTopics
 *       description: Obtains all existing notification topics
 *       responses:
 *         '200':
 *           description: Returns all existing notification topics
 *   /config/blocked/{user}:
 *     get:
 *       tags:
 *         - Notifications Preferences
 *       summary: Obtains all topics that a certain user is ignoring
 *       operationId: getBlockedTopics
 *       description: Obtains all topics that a certain user is ignoring
 *       parameters:
 *         - in: path
 *           name: user
 *           required: true
 *           schema:
 *             type: string
 *           description: The user device identifying token
 *       responses:
 *         '200':
 *           description: If status OK, returns all the user's currently ignored topic. If not, returns error message
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Status message
 *                   error:
 *                     type: string
 *                     description: Error description message
 *                   blocked_topics:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array containing the topic identifying strings
 *               examples:
 *                 success:
 *                     summary: Example of a successful response
 *                     value:
 *                       status: "ok"
 *                       blocked_topics:
 *                           - "topic_example_1"
 *                           - "topic_example_2"
 *                 error:
 *                   summary: Example of an error response
 *                   value:
 *                     status: "error"
 *                     error: "user does not exist"
 *   /config/{user}:
 *     post:
 *       tags:
 *         - Notifications Preferences
 *       summary: Adds topics to the list of ignored topic of that user.
 *       operationId: ignoreTopics
 *       description: Adds topics to the list of ignored topic of that user.
 *       parameters:
 *         - in: path
 *           name: user
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique device token
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 topicArray:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Topic name
 *                   description: Array of topic names
 *               required:
 *                 - topicArray
 *       responses:
 *         '200':
 *           description: If status OK, returns all the user's currently ignored topic. If not, returns error message
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Status message
 *                   error:
 *                     type: string
 *                     description: Error description message
 *                   blocked_topics:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array containing the topic identifying strings
 *               examples:
 *                 success:
 *                     summary: Example of a successful response
 *                     value:
 *                       status: "ok"
 *                       blocked_topics:
 *                           - "topic_example_1"
 *                           - "topic_example_2"
 *                 error:
 *                   summary: Example of an error response
 *                   value:
 *                     status: "error"
 *                     error: "user does not exist"
 *
 *     patch:
 *       tags:
 *         - Notifications
 *       summary: Removes topics from the user's ignored topics list.
 *       operationId: stopIgnoreTopics
 *       description: Removes topics from the user's ignored topics list.
 *       parameters:
 *         - in: path
 *           name: user
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique device token
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 topicArray:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Topic name
 *                   description: Array of topic names
 *               required:
 *                 - topicArray
 *       responses:
 *         '200':
 *           description: If status OK, returns all the user's currently ignored topic. If not, returns error message
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Status message
 *                   error:
 *                     type: string
 *                     description: Error description message
 *                   blocked_topics:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array containing the topic identifying strings
 *               examples:
 *                 success:
 *                     summary: Example of a successful response
 *                     value:
 *                       status: "ok"
 *                       blocked_topics:
 *                           - "topic_example_1"
 *                           - "topic_example_2"
 *                 error:
 *                   summary: Example of an error response
 *                   value:
 *                     status: "error"
 *                     error: "user does not exist"
 *
 *   /user/{deviceToken}:
 *     post:
 *       tags:
 *         - Notifications
 *       summary: Associates a device token to the user
 *       operationId: addDeviceToken
 *       description: The system needs a device token to push new notifications to the device. This allows a device to specify it.
 *       parameters:
 *         - in: path
 *           name: deviceToken
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique device token
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 userID:
 *                   type: string
 *                   description: "userId of the user"
 *               required:
 *                 - userID
 *       responses:
 *         '200':
 *           description: Return ok
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Status message
 *               examples:
 *                 success:
 *                     summary: Example of a successful response
 *                     value:
 *                       status: "ok"
 *     delete:
 *       tags:
 *         - Notifications
 *       summary: Removes a device token from the user
 *       operationId: removeDeviceToken
 *       description: The system needs a device token to push new notifications to the device. This allows a device to remove it and no longer be bothered.
 *       parameters:
 *         - in: path
 *           name: deviceToken
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique device token
 *         - in: query
 *           name: userID
 *           required: true
 *           schema:
 *             type: string
 *           description: userID of the user
 *       responses:
 *         '200':
 *           description: Return ok
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Status message
 *               examples:
 *                 success:
 *                     summary: Example of a successful response
 *                     value:
 *                       status: "ok"
 *
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - topic
 *         - userID
 *       properties:
 *         title:
 *           type: string
 *           example:
 *               "d"
 *         content:
 *           type: string
 *         topic:
 *           type: string
 *         userID:
 *           type: string
 */
router.post("/user/:deviceToken",controller.addDeviceToken)


// Route to create a notification topic
router.post('/topic/:topic', controller.createTopic)

// Route to delete a notification topic
router.delete('/topic/:topic', controller.deleteTopic)


// notifications configuration
router.get('/config/all', controller.getTopics)
router.get('/config/blocked/:user', controller.getBlockedTopics)


router.post('/config/:user', controller.ignoreTopics)
router.delete('/config/:user', controller.stopIgnoreTopics)

router.post('/notification/:user', controller.createNotification)


// Route to get all notifications
router.get('/notification/:user/all', controller.getAllNotifications)




export default router
