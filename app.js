// const dotenv = require('dotenv');
// dotenv.config(); // 아니면 한줄로 require('dotenv').config();
require('dotenv').config();
const http = require('http');
const express = require('express');
const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
});

myDataSource.initialize().then(() => {
    console.log("Data Source has been initialized")
    }).catch(() => {
    console.log("Database initiate fail")
    })

const app = express();
app.use(express.json());

const port = 8000;

app.post('/books', async (req, res) => {
    const {title, description, coverImage} = req.body;

    await myDataSource.query(
        `INSERT INTO books(
            title, description, cover_image
            ) VALUES (?, ?, ?);
        `, [title, description, coverImage]
    );
    res.status(201).json({message: "successfully created"});
});

app.get('/books', async(req, res) => {
    await myDataSource.query(
        `SELECT books.id,
        books.title,
        books.description,
        books.cover_image,
        authors.first_name,
        authors.last_name,
        authors.age
        FROM books_authors ba
        INNER JOIN authors ON ba.author_id = authors.id
        INNER JOIN books ON ba.book_id = books.id
        `, (err, rows) => {
            res.status(200).json(rows);
        }
    );
});

app.put('/books', async (req, res) => {
    const {title, description, coverImage, bookId} = req.body;

    await myDataSource.query(
        `UPDATE books
        SET
        title = ?,
        description = ?,
        cover_image = ?
        WHERE id = ?`,
        [title, description, coverImage, bookId]
    );
    res.status(201).json({message: "successfully updated"});
});

const server = http.createServer(app);
server.listen(port, () => {console.log("서버켜짐");});