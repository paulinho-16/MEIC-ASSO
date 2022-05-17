import 'module-alias/register'
import 'source-map-support/register'

import express from 'express'

import routes from '@/routes'

const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Application running in port ${port}.`)
})

app.use('/associations', routes.associations)
app.use('/library', routes.library)
app.use('/hello', routes.hello)
app.use('/feedback', routes.feedback)
app.use('/jobs', routes.jobs)
app.use('/meals', routes.meals)
app.use('/news', routes.news)
app.use('/status', routes.status)
app.use('/groups', routes.groups)
