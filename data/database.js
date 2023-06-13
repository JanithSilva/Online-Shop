const mongodb = require('mongodb');

mongoClient = mongodb.MongoClient;

let database;

async function connectToDatabse(){
    const client =  await mongoClient.connect('mongodb://0.0.0.0:27017');
    database = client.db('online-shop');
}

function getDB(){
    if(!database){
        throw new Error('You must connect frist!');
    }else{
        return database;
    }
}

module.exports = {
    connectToDatabse : connectToDatabse,
    getDB : getDB
}