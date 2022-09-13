import express from 'express'
import controller from '@/controller/chat.controller'

const router = express.Router()

/**
 * @swagger
 * /chat/location:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Get the URL where the chat server will listen for incoming messages
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: http://uni4all.servehttp.com:8082/
 */
router.get('/location', controller.location)

/**
 * @swagger
 * /chat/message:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Get the messages of a user
 *     parameters:
 *       - in: query
 *         name: userUp
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's UP number
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "userUp is not defined"
 */
router.get('/message', controller.message)

/**
 * @swagger
 * /chat/group:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Gets the groups of a user
 *     parameters:
 *       - in: query
 *         name: userUp
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's UP number
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "userUp is not defined"
 */
router.get('/group', controller.getGroups)

/**
 * @swagger
 * /chat/group:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Creates a new group
 *     parameters:
 *       - in: query
 *         name: userNumbers
 *         required: true
 *         schema:
 *           type: array
 *           description: The users' UP numbers
 *           items:
 *             type: string
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           description: The name of the group
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "name is not defined"
 */
router.post('/group', controller.createGroup)

/**
 * @swagger
 * /chat/group/{groupId}:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Gets the group's information
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The group's ID
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "name is not defined"
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "group not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/group/:groupID', controller.groupMessage)

/**
 * @swagger
 * /chat/group/{groupId}/messages:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Gets the group's messages
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The group's ID
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: number
 *         description: The page number
 *       - in: query
 *         name: perPage
 *         required: true
 *         schema:
 *           type: number
 *         description: The number of messages per page
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "page is not defined"
 */
router.get('/group/:groupID/messages', controller.getGroupMessages)

/**
 * @swagger
 * /chat/group/{groupId}/members:
 *   put:
 *     tags:
 *       - Chat
 *     summary: Adds a user to a group
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The group's ID
 *       - in: query
 *         name: userUp
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's UP number
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "userUp is not defined"
 */
router.put('/group/:groupID/members', controller.addToGroup)

/**
 * @swagger
 * /chat/group/{groupId}/members/{userUp}:
 *   delete:
 *     tags:
 *       - Chat
 *     summary: Removes a user from a group
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The group's ID
 *       - in: path
 *         name: userUp
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's UP number
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "userUp is not defined"
 */
router.delete('/group/:groupID/members/:userUp', controller.removeFromGroup)

export default router
