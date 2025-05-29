// queries.js - All MongoDB queries for Week 1 Assignment

// Task 2: Basic CRUD Operations

// 1. Find all books in a specific genre (e.g., Fiction)
db.books.find({ genre: "Fiction" })

// 2. Find books published after a certain year (e.g., 1950)
db.books.find({ published_year: { $gt: 1950 } })

// 3. Find books by a specific author (e.g., George Orwell)
db.books.find({ author: "George Orwell" })

// 4. Update the price of a specific book (e.g., "The Hobbit")
db.books.updateOne(
  { title: "The Hobbit" },
  { $set: { price: 15.99 } }
)

// 5. Delete a book by its title (e.g., "Animal Farm")
db.books.deleteOne({ title: "Animal Farm" })

// Task 3: Advanced Queries 

// 1. Find books that are in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
})

// 2. Projection: Return only title, author, and price
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
)

// 3. Sort books by price (ascending)
db.books.find().sort({ price: 1 })

// 4. Sort books by price (descending)
db.books.find().sort({ price: -1 })

// 5. Pagination: Limit to 5 books per page (Page 1)
db.books.find().skip(0).limit(5)

//    Pagination: Page 2
db.books.find().skip(5).limit(5)

// Task 4: Aggregation 

// 1. Average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      average_price: { $avg: "$price" }
    }
  }
])

// 2. Author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 1 }
])

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $project: {
      decade: { $subtract: [ { $divide: ["$published_year", 10] }, { $mod: [ { $divide: ["$published_year", 10] }, 1 ] } ] }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])


// 1. Create index on the `title` field
db.books.createIndex({ title: 1 })

// 2. Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: -1 })

// 3. Use explain() to show performance improvement with index
db.books.find({ title: "1984" }).explain("executionStats")
db.books.find({ author: "J.R.R. Tolkien", published_year: 1954 }).explain("executionStats")
