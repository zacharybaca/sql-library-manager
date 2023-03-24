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

/* Shows Book Detail Form */
router.get(
  "/books/:id",
  Handler(async (req, res) => {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if (book) {
      res.render("update-book", { book: book });
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "This Book Doesn't Exist!";
      res.render("page-not-found", {
        message: err.message,
        status: err.status,
      });
    }
  })
);

module.exports = router;
