import 'module-alias/register'
import 'source-map-support/register'
import bodyParser from 'body-parser'

import express from 'express'

import routes from '@/routes'

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Application running in port ${port}.`)
})

app.use('/associations', routes.associations)
app.use('/authentication', routes.authentication)
app.use('/hello', routes.hello)
app.use('/library', routes.library)
app.use('/meals', routes.meals)
app.use('/news', routes.news)
app.use('/status', routes.status)
