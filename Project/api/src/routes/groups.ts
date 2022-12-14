import express from 'express'
import auth from '@/middleware/auth'

import controller from '../controller/groups.controller'

const router = express.Router()

router.use(express.json())




// GROUP ENDPOINTS.


/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get a list of groups. 
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         type: integer
 *         description: Ammount of information to return.
 *       - in: query
 *         name: offset
 *         required: false
 *         type: integer
 *         description: Page of information to return.
 *       - in: query
 *         name: classId
 *         required: false
 *         type: integer
 *         description: Filter groups by a single class by specifing its ID.
 *     responses:
 *       200:
 *         description: List of groups that matches filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                      id: 
 *                        type: integer
 *                      typename: 
 *                        type: string
 *                      title: 
 *                        type: string
 *                      description: 
 *                        type: string
 *                      mlimit: 
 *                        type: integer
 *                      autoaccept: 
 *                        type: boolean
 *                      classId: 
 *                        type: integer
 *       500:
 *         description: Unexpected error.
*/
router.get('/', controller.getGroups)



/**
 * @swagger
 * /groups/{groupId}:
 *   get:
 *     summary: Get information of a single group. 
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: integer
 *         description: Id of the group to return.
 *     responses:
 *       200:
 *         description: Group information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                      id:
 *                        type: integer
 *                      typename:
 *                        type: string
 *                      title:
 *                        type: string
 *                      description:
 *                        type: string
 *                      mlimit:
 *                        type: integer
 *                      autoaccept:
 *                        type: boolean
 *                      classId:
 *                        type: integer
 *       500:
 *         description: Unexpected error.
*/
router.get('/:id', controller.getGroup)


/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a new group.
 *     tags:
 *       - Groups
 *     requestBody:
 *       description: Group information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               typename:
 *                 type: string
 *                 example: "project"
 *               title:
 *                 type: string
 *                 example: "ASSO Project Group"
 *               description:
 *                 type: string
 *                 example: "Project Group for ASSO class"
 *               mlimit:
 *                 type: integer
 *                 example: 5
 *               autoaccept:
 *                 type: boolean
 *                 example: true
 *               classId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Group was created with success.
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
 *      
*/
router.post('/',auth.verifySessionToken,controller.createGroup)


/**
 * @swagger
 * /groups/{id}/{groupId}:
 *   delete:
 *     summary: Delete a group.
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: Id of the user who requested the deletion.
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: integer
 *         description: Id of the group to delete.
 *     responses:
 *       200:
 *         description: Group was deleted with success.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.delete('/:id/:groupId',auth.verifyAuthorization, controller.deleteGroup)


/**
 * @swagger
 * /myGroups/{userId}:
 *   get:
 *     summary: Get list of groups where a specific user is a member of. 
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: integer
 *         description: Id of the user from whom to return groups.
 *     responses:
 *       200:
 *         description: List of groups where the given user is a member of.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                      id:
 *                        type: integer
 *                      typename:
 *                        type: string
 *                      title:
 *                        type: string
 *                      description:
 *                        type: string
 *                      mlimit:
 *                        type: integer
 *                      autoaccept:
 *                        type: boolean
 *                      classId:
 *                        type: integer
 *       500:
 *         description: Unexpected error.
*/
router.get('/myGroups/:id', auth.verifyAuthorization ,controller.getMyGroups)


/**
 * @swagger
 * /groups/{id}/{groupId}:
 *   patch:
 *     summary: Edit information on an existing group.
 *     tags:
 *       - Groups
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: Id of the user who wants to edit the group.
 *      - in: path
 *        name: groupId
 *        required: true
 *        type: integer
 *        description: Id of the group to edit.
 *     requestBody:
 *       description: Group information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               typename:
 *                 type: string
 *                 example: "project"
 *               title:
 *                 type: string
 *                 example: "ASSO Project Group"
 *               description:
 *                 type: string
 *                 example: "Project Group for ASSO class"
 *               mlimit:
 *                 type: integer
 *                 example: 5
 *               autoaccept:
 *                 type: boolean
 *                 example: true
 *               classId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Group was updated with success.
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
 *      
*/
router.patch('/:id/:groupId',auth.verifyAuthorization,controller.editGroup)








// MEMBERS ENDPOINTS.


/**
 * @swagger
 * /groups/{id}/{groupId}/members:
 *   get:
 *     summary: Get a list of group's members. 
 *     tags:
 *       - Group Members
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: integer
 *         description: Group for which to return its members.
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: User who issued the request.
 *       - in: query
 *         name: offset
 *         required: false
 *         type: integer
 *         description: Page of information to return.
 *       - in: query
 *         name: limit
 *         required: false
 *         type: integer
 *         description: Ammount of groups to return.
 *     responses:
 *       200:
 *         description: List of members of specified group. 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                    id: 
 *                      type: integer
 *                    groupid: 
 *                      type: integer
 *                    studentid: 
 *                      type: integer
 *                    isadmin: 
 *                      type: boolean
 *                    isaccepted: 
 *                      type: boolean
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
*/
router.get('/:id/:groupId/members', auth.verifyAuthorization, controller.getGroupMembers)


/**
 * @swagger
 * /groups/{id}/{groupId}/members/{memberId}:
 *   get:
 *     summary: Get information of a single group. 
 *     tags:
 *       - Group Members
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: Id of user who issued the request.
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: integer
 *         description: Id of the group for which member to return.
 *       - in: path
 *         name: memberId
 *         required: true
 *         type: integer
 *         description: Id of the member to return.
 *     responses:
 *       200:
 *         description: Member information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  id: 
 *                    type: integer
 *                  groupid: 
 *                    type: integer
 *                  studentid: 
 *                    type: integer
 *                  isadmin: 
 *                    type: boolean
 *                  isaccepted: 
 *                    type: boolean
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
*/
router.get('/:id/:groupId/members/:userId',  auth.verifyAuthorization, controller.getGroupMember)


/**
 * @swagger
 * /groups/{id}/{groupId}/members/{memberId}:
 *   post:
 *     summary: Join a group. 
 *     tags:
 *       - Group Members
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: Id of user who issued the request.
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: integer
 *         description: Id of the group for which member to return.
 *       - in: path
 *         name: memberId
 *         required: true
 *         type: integer
 *         description: Id of the member to return.
 *     responses:
 *       204:
 *         description: Group join was success.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.post('/:id/:groupId/members/:userId',  auth.verifyAuthorization, controller.createGroupMember)


/**
 * @swagger
 * /groups/{id}/{groupId}/members/{memberId}:
 *   delete:
 *     summary: Unjoin a group. 
 *     tags:
 *       - Group Members
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: Id of user who issued the request.
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: integer
 *         description: Id of the group for which member to return.
 *       - in: path
 *         name: memberId
 *         required: true
 *         type: integer
 *         description: Id of the member to return.
 *     responses:
 *       204:
 *         description: Group unjoin was success.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.delete('/:id/:groupId/members/:userId', auth.verifyAuthorization, controller.deleteGroupMember)












// ADMIN ENDPOINTS


/**
 * @swagger
 * /groups/{id}/{groupId}/admins:
 *   get:
 *     summary: Get a list of group's admins. 
 *     tags:
 *       - Group Admins
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: Id of user who issued the request.
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: integer
 *         description: Group for which to return its members.
 *     responses:
 *       200:
 *         description: List of admins of specified group. 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                      id:
 *                        type: integer
 *                      groupid:
 *                        type: integer
 *                      studentid:
 *                        type: integer
 *                      isadmin:
 *                        type: boolean
 *                      isaccepted:
 *                        type: boolean
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
*/
router.get(':id/:groupId/admins', auth.verifyAuthorization, controller.getGroupAdmins)


/**
 * @swagger
 * /groups/{id}/{groupId}/admins/{userId}:
 *   post:
 *     summary: Add an admin to a group. 
 *     tags:
 *       - Group Admins
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: Id of user who issued the request.
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: integer
 *         description: Id of the group for which admin to add.
 *       - in: path
 *         name: userId
 *         required: true
 *         type: integer
 *         description: Id of the admin to add.
 *     responses:
 *       204:
 *         description: Add admin was successful.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.post(':id/:groupId/admins/:userId', auth.verifyAuthorization,controller.addGroupAdmin)


/**
 * @swagger
 * /groups/{id}/{groupId}/admins/{userId}:
 *   delete:
 *     summary: Remove and admin from a group. 
 *     tags:
 *       - Group Admins
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: Id of user who issued the request.
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: integer
 *         description: Id of the group for which admin to delete.
 *       - in: path
 *         name: userId
 *         required: true
 *         type: integer
 *         description: Id of the admin to delete.
 *     responses:
 *       204:
 *         description: Remove admin was successful.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.delete(':id/:groupId/admins/:userId', auth.verifyAuthorization, controller.deleteGroupAdmin)





export default router