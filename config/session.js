const mongoDbStore = require('connect-mongodb-session');
const expressSession = require('express-session');

function createSessionStore(expressSession) {
    const MongoDbStore = mongoDbStore(expressSession);

    const store = new MongoDbStore({
        uri: 'mongodb://0.0.0.0:27017',
        databaseName: 'online-shop',
        collection: 'sessions'
    });

    return store;
}

function createSessionConfig() {
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(expressSession),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    };

}

module.exports = createSessionConfig;