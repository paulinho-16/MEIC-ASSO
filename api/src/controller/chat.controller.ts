import { Request, Response } from 'express'

function location(req: Request, res: Response) {
  return res.status(200).json({ url: "http://uni4all.servehttp.com:8082/"}) // TODO concrete location, not this
}

async function _groupMessage(group: number, page: number) {
  // use this method when you know that all parameters are correct
  // TODO requests the chat database
  const messages = [
    {
      id: "1",
      group: group,
      user: "1",
      content: "Hello",
      date: "2020-01-01T00:00:00.000Z",
    },
        {
      id: "2",
      group: group,
      user: "1",
      content: "Hellooo",
      date: "2020-01-02T00:00:00.000Z",
    },
  ]
  return messages
}

function groupMessage(req: Request, res: Response) {
  // TODO document

  const errors = []

  // we receive
  //   a group
  //   a page (for pagination)

  const groupString = req.params.group
  let { page } = req.body

  // dealing with group
  //  group is not null
  //  group is an ID
  // TODO check with database the ID format, assuming it's a string
  let group = 0
  if (groupString === null) {
    errors.push("group must be present")
  } else if (isNaN(parseInt(groupString))) {
    errors.push("group is not an ID")
  } else {
    group = parseInt(groupString)
  }

  // dealing with page
  //  page is a positive integer
  //  if page is null it defaults to 0
  if (!page) {
    page = 0
  } else if (typeof page !== "number") {
    errors.push("page must be a number")
  } else if (page < 0) {
    errors.push("page must be a non negative number")
  }

  // if there are errors, return them
  if (errors.length > 0) {
    // TODO use library for the HTTP status codes
    return res.status(400).json({ errors })
  }

  const messages = _groupMessage(group, page)

  return res.status(200).json({ messages })
}

async function message(req: Request, res: Response) {
  const errors = []
  
  // we receive
  //   a page (for pagination)

  let { page } = req.body

  // dealing with page
  //  page is a positive integer
  //  if page is null it defaults to 0
  if (!page) {
    page = 0
  } else if (typeof page !== "number") {
    errors.push("page must be a number")
  }

  // if there are errors, return them
  if (errors.length > 0) {
    // TODO use library for the HTTP status codes
    return res.status(400).json({ errors })
  }

  // TODO get the groups of this user
  const groups = [1, 2, 3]

  // for each group get the messages
  const messages = new Map<number, Object>();

  await Promise.all(groups.map(async (group) => {
    messages.set(group, await _groupMessage(group, page))
  }))
  
  // TODO this JSON prettier
  return res.status(200).json({ messages: [...messages] })
}

export default {
  location,
  groupMessage,
  message
}
