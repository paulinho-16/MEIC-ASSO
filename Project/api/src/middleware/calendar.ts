import { Request, Response, NextFunction } from 'express'
import controller from '@/controller/calendar.controller'

async function verifyCalendarRequest(req: Request, res: Response, next: NextFunction) {
  const wishlist = controller.validateRequestWishList(req)

  // if doesn't need authentication
  if (
    wishlist.length == 1 &&
    wishlist.findIndex(v => v === controller.EventType.PUBLIC.toString()) !== -1
  ) {
    // return only public events
    //controller.getCalendarPublicEvents(req, res)
    res.status(200).send([])
    return
  }

  // else continue (verify token and retrieve events)
  next()
}

export default {
  verifyCalendarRequest,
}
