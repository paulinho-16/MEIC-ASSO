import 'module-alias/register'
import 'source-map-support/register'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from'swagger-ui-express'
import 'body-parser'
import express from 'express'
import routes from '@/routes'
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.listen(port, () => {
  console.log(`Application running in port ${port}.`)
})

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Uni4all API',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'JSONPlaceholder',
        url: 'https://jsonplaceholder.typicode.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/associations', routes.associations)
app.use('/library', routes.library)
app.use('/authentication', routes.authentication)
app.use('/hello', routes.hello)
app.use('/feedback', routes.feedback)
app.use('/jobs', routes.jobs)
app.use('/meals', routes.meals)
app.use('/news', routes.news)
app.use('/status', routes.status)
app.use('/services', routes.services)
app.use('/profile', routes.profile)
app.use('/groups', routes.groups)
app.use('/user', routes.user)
app.use('/curricular-unit', routes.curricularUnit)
app.use('/schedule', routes.schedule)
