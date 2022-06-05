import { Request, Response } from 'express'
import axios from 'axios'

type Message = {
  message: string
  from: string
}

type Group = {
  messages: Message[]
  data: any
}

function location(req: Request, res: Response) {
  return res.status(200).json({ url: 'http://uni4all.servehttp.com:8082/' }) // TODO concrete location, not this
}

async function _getGroup(group: string) {
  // use this method when you know that all parameters are correct
  // requests the mongo chat
  const groupObject: Group = await axios.get(`http://mongo_chat_server:3000/group/${group}`) // TODO concrete location

  return groupObject
}

async function groupMessage(req: Request, res: Response) {
  // TODO document

  const errors = []

  // we receive
  //   a group
  //   a page (for pagination)

  const group = req.params.group
  let { page } = req.body

  // dealing with group
  //  group is not null
  //  group is an ID
  if (!group) {
    errors.push('group is not defined')
  } else if (typeof group !== 'string') {
    errors.push('group is not a string')
  }

  // dealing with page
  //  page is a positive integer
  //  if page is null it defaults to 0
  if (!page) {
    page = 0
  } else if (typeof page !== 'number') {
    errors.push('page must be a number')
  } else if (page < 0) {
    errors.push('page must be a non negative number')
  }

  // if there are errors, return them
  if (errors.length > 0) {
    // TODO use library for the HTTP status codes
    return res.status(400).json({ errors })
  }

  // try {
  //   const messages = await _groupMessage(group)
  //   return res.status(200).json({ messages })
  // } catch (error) {
  //   return res.status(500).json({ error })
  // }

  return await _getGroup(group)
    .then(group => {
      return res.status(200).json({ group })
    })
    .catch(error => {
      // if the error status code is 404
      //  return a 404
      console.log(error)
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'group not found' })
      } else {
        return res.status(500).json({ error })
      }
    })
}

async function message(req: Request, res: Response) {
  const errors = []

  // we receive
  //   a page (for pagination)

  const { userUp } = req.body

  // dealing with userId
  //  userId is not null
  if (!userUp) {
    errors.push('userUp is not defined')
  }

  // if there are errors, return them
  if (errors.length > 0) {
    // TODO use library for the HTTP status codes
    return res.status(400).json({ errors })
  }

  // TODO get the groups of this user
  const response = await axios.get(`http://mongo_chat_server:3000/group/user/${userUp}`) // TODO concrete location
  const groups = response.data

  // for each group get the messages
  const messages = new Map<string, any>()

  groups.forEach((group: { _id: string; messages: any }) => {
    messages.set(group._id, group.messages)
  })

  // TODO this JSON prettier
  return res.status(200).json({ messages: [...messages] })
}

export default {
  location,
  groupMessage,
  message,
}
