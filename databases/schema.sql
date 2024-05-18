/* users */
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL
)
/* user_keywords */
DROP TABLE IF EXISTS user_keywords;
CREATE TABLE user_keywords (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type INTEGER NOT NULL,
  keyword TEXT NOT NULL,

  FOREIGN JEY (user_id) PREFERENCES users(id)
)
/* user_new_publication_books */
DROP TABLE IF EXISTS user_new_publication_books;
CREATE TABLE user_new_publication_books (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  month TEXT NOT NULL,
  book_id INTEGER NOT NULL,

  FOREIGN JEY (user_id) PREFERENCES users(id),
  FOREIGN JEY (book_id) PREFERENCES books(id)
)
/* books */
DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  title_frigana TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  subtitle_furigana TEXT NOT NULL DEFAULT '',
  series_name TEXT NOT NULL DEFAULT '',
  series_name_furigana TEXT NOT NULL DEFAULT '',
  author_name TEXT NOT NULL,
  author_name_furigana TEXT NOT NULL,
  publisher_name TEXT NOT NULL,
  size TEXT NOT NULL,
  isbn TEXT NOT NULL,
  caption TEXT NOT NULL,
  sales_date TEXT NOT NULL,
  sales_date_text TEXT NOT NULL,
  price TEXT NOT NULL
)
