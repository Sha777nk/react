const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://iamshashank008:nuV9YMRw7lsgyNki@network-monitering-db.jkmg0ao.mongodb.net/?retryWrites=true&w=majority&appName=network-monitering-db'; // MongoDB Atlas connection string
const dbName = 'network-monitering-db'; // Replace with your desired database name

let db;

async function connectDB() {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
}

function getDB() {
    if (!db) {
        throw new Error('Database not connected');
    }
    return db;
}

module.exports = { connectDB, getDB };
