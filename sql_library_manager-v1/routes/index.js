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

module.exports = router;
