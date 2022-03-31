import express from 'express'

import routes from './routes'

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`Application running in port ${port}.`)
})

app.use('/hello', routes.hello)
app.use('/jobs', routes.jobs)
