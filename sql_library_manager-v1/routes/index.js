var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

/*Async Middleware Wrapper*/
function Handler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/* Homepage Redirect to Books Route */
router.get(
  "/",
  Handler(async (req, res) => {
    res.redirect("/books");
  })
);

/* GET Books */
router.get(
  "/books",
  Handler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", { books: books });
  })
);

/* Shows New Book Form */
router.get(
  "/books/new",
  Handler(async (req, res) => {
    res.render("new-book", {});
  })
);

/* Posts New Book to Database */
router.post(
  "/books/new",
  Handler(async (req, res) => {
    const book = await Book.create(req.body);
    res.redirect("/");
  })
);

module.exports = router;
