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

/* GET home page. */
router.get(
  "/",
  Handler(async (req, res) => {
    const books = await Book.findAll().then((book) => {
      res.json(book);
    });
    res.render("index", { books: books });
  })
);

module.exports = router;
