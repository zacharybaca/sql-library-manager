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
    res.render("new-book", { book: {}, title: "New Book" });
  })
);

/* Posts New Book to Database */
router.post(
  "/books/new",
  Handler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        throw error;
      }
    }
  })
);

/* Shows Book Detail Form */
router.get(
  "/books/:id",
  Handler(async (req, res) => {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if (book) {
      res.render("update-book", { book, title: book.title });
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "This Book Doesn't Exist!";
      res.render("page-not-found", {
        title: "Page Not Found",
        err,
      });
    }
  })
);

/* Updates Book Info in the Database */
router.post(
  "/books/:id",
  Handler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/");
      } else {
        const err = new Error();
        err.status = 404;
        err.message = "Book Id Doesn't Exist";
        res.render("page-not-found", {
          title: "Page-Not-Found",
          err,
        });
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        res.sendStatus(404);
      }
    }
  })
);

module.exports = router;
