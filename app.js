const dotenv = require('dotenv');
dotenv.config(); // 아니면 한줄로 require('dotenv').config();

const { DataSource } = require('typeorm');
const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
});
myDataSource.initialize().then(()=>{
    console.log("success")
    const nickname = "테스트";
    const email = "test@test.com";
    const password = "testpassword";

    myDataSource.query(`
    insert into users (email, nickname, password)
    values (?, ?, ?)`,
    [nickname, email, password])
    const queryRes = myDataSource.query('select * from users');
    queryRes.then((value) => {
        console.log(value);
    }).catch(() => {

    });
}).catch(()=>{
    console.log("fail");
});

const express = require('express');
const app = express();
const port = 8000;