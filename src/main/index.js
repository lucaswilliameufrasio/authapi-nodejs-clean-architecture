require('dotenv').config()
const MongoHelper = require('../infra/helpers/mongo-helper')
const app = require('./config/app')
const env = require('./config/env')

MongoHelper.connect(env.mongoUrl)
    .then(() => {
        app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
    })
    .catch(error => {
        console.log(error)
    })
