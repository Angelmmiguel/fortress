const mongodb = require('mongodb');

module.exports = async function connect() {
  const db = await mongodb.MongoClient.connect(process.env.MONGO_URI);
  return db;
}
