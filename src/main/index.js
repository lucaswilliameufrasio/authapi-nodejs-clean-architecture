const MongoHelper = require('../infra/helpers/mongo-helper')
const app = require('./config/app')
const env = require('./config/env')

MongoHelper.connect(env.mongoUrl)
    .then(() => {
        app.listen(7777, () => console.log('Server Running'))
    })
    .catch(error => {
        console.log(error)
    })
