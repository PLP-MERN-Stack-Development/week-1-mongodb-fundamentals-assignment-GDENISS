// queries.js

const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Basic Query
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    console.log('Fiction books:', fictionBooks);

    // Advanced Query
    const advancedQuery = await collection.find({
      $and: [
        { price: { $gt: 10 } },
        { in_stock: true }
      ]
    }).toArray();
    console.log('Expensive books in stock:', advancedQuery);

    // Aggregation
    const groupedGenres = await collection.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } }
    ]).toArray();
    console.log('Book count by genre:', groupedGenres);

    // Indexing + Explain
    await collection.createIndex({ author: 1, published_year: -1 });
    const explain = await collection.find({
      author: 'J.R.R. Tolkien',
      published_year: 1954
    }).explain("executionStats");
    console.log('Explain output:', explain);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

runQueries();
