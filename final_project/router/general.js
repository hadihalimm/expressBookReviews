const express = require('express');
const axios = require('axios').default
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here

  // Check if the user does not provide an username
  if (!req.body.username || req.body.username === "") {
    return res.status(400).json({ message: "The username cannot be empty." })
  }
  // Check if the user does not provide a password
  if (!req.body.password || req.body.password === "") {
    return res.status(400).json({ message: "The password cannot be empty." })
  }

  // Check if the username is already stored in database
  let usersWithSameName = users.filter((user) => {
    return user.username === req.body.username
  })
  if (usersWithSameName.length > 0) {
    return res.status(400).json({ message: "Username already exists." })
  }

  // Create a new user
  const newUser = {
    "username": req.body.username,
    "password": req.body.password
  }
  users.push(newUser)

  return res.status(201).json({
    message: "User successfully registered",
    ...newUser,
  });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    resolve(books)
  })
  promise.then((result) => {
    res.status(200).json(result)
  },
    (error) => {
      console.log(error)
    })

  // Sync solution
  // return res.status(200).json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    let isbn = parseInt(req.params.isbn)
    resolve(books[isbn])
  })
  promise.then((result) => {
    res.status(200).json(result)
  },
    (error) => {
      console.log(error)
    })

  // Sync solution
  // let isbn = parseInt(req.params.isbn)
  // return res.status(200).json((books[isbn]));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    let booksToGet = []
    Object.entries(books).forEach(([key, value]) => {
      if (value.author.toLowerCase().includes(req.params.author.toLowerCase())) {
        booksToGet.push(books[key])
      }
    })
    resolve(booksToGet)
  })

  promise.then((result) => {
    res.status(200).json(result)
  },
    (error) => {
      console.log(error)
    })

  // Sync solution
  // let booksToGet = []
  // Object.entries(books).forEach(([key, value]) => {
  //   if (value.author.toLowerCase().includes(req.params.author.toLowerCase())) {
  //     booksToGet.push(books[key])
  //   }
  // })
  // return res.status(200).json(booksToGet);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    let booksToGet = []
    Object.entries(books).forEach(([key, value]) => {
      if (value.title.toLowerCase().includes(req.params.title.toLowerCase())) {
        booksToGet.push(books[key])
      }
    })
    resolve(booksToGet)
  })

  promise.then((result) => {
    res.status(200).json(result)
  },
    (error) => {
      console.log(error)
    })

  // Sync solution
  // let booksToGet = []
  // Object.entries(books).forEach(([key, value]) => {
  //   if (value.title.toLowerCase().includes(req.params.title.toLowerCase())) {
  //     booksToGet.push(books[key])
  //   }
  // })
  // return res.status(200).json(booksToGet);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn)
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
