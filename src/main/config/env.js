module.exports = {
    mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/clean-node-api',
    tokenSecret: process.env.TOKEN_SECRET || 'secret'
}
