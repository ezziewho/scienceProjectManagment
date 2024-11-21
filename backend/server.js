//const express = require("express");
import express from "express"
import mysql from 'mysql'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const salt = 10;



const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection( {
    host: "localhost",
    user: "root",
    password: "",
    database: "projectsmanager"
    
})

const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    if(!token){
        return res.json("we need token please provide it for the next time")
    } else {
        jwt.verify(token, "jwtSecretKey", (err, decoded) => {
            if(err) {
                res.json("Not authenticated");
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

app.get('/checkauth', verifyJwt,(req, res) => {
    return res.json("Authenticated");
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const password = req.body.password;
    bcrypt.hash(password.toString(), salt, (err, hash) => {
        if(err){
            console.log(err);
        }
        const values = [
            req.body.name,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, data) => {
            if(err){
                return res.json("Error");
            }
                return res.json(data);
        })
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ?";
    db.query(sql, [req.body.email], (err, data) => {
        //console.log(data);
        console.log("Email:", req.body.email);
        console.log("Password:", req.body.password);
        if(err){
            return res.json("Error");
        }
        if(data.length > 0 ){
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if(err){
                    console.error("Error during bcrypt comparison:", err);
                    return res.json("Error");
                    
                }
                if(response){
                    const id = data[0].id;
                    const token = jwt.sign({id}, 'jwtSecretKey', {expiresIn: 300});
                    return res.json({Login: true, token, data});
                }
                return res.json({Login: false});  
            }) 
        }
        else{
            return res.json("Failure");
        }       
    })
})

app.listen(8081, ()=>{
    console.log("listening");
})