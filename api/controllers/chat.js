import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";

export const createChat = (req, res) => {
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, "secretkey", (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
       
        const combined_id = `${data.id}${req.body.user_id}`

        const q = "BEGIN; CREATE TABLE IF NOT EXISTS ??(id int unsigned NOT NULL AUTO_INCREMENT,message varchar(10000) NOT NULL,date datetime NOT NULL,sender_id varchar(10) NOT NULL,PRIMARY KEY (id),UNIQUE KEY id_UNIQUE (id)); CREATE TABLE IF NOT EXISTS ?? (`user_id` varchar(20) NOT NULL,`user_name` varchar(45) NOT NULL,`user_image` varchar(500) DEFAULT NULL,`last_message` varchar(10000) DEFAULT NULL,`date` datetime DEFAULT NULL,PRIMARY KEY (`user_id`),UNIQUE KEY `chats_UNIQUE` (`user_id`)); INSERT IGNORE INTO ??(user_id, user_name,user_image) VALUES(?,?,?); COMMIT"

        db.query(q, [combined_id, data.id, data.id, req.body.user_id, req.body.user_name, req.body.user_image], (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send(data);
        });
    })
};

export const fetchChat = (req, res) => {
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, "secretkey", (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")

        let combined_id;

        if(data.id.toString().includes('C')){
            combined_id = data.id + req.body.user_id
        }else{
            combined_id = req.body.user_id + data.id
        }
    
        const q = "SELECT * FROM ?? ORDER BY (date) ASC"
    
        db.query(q, [combined_id], (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send(data);
        });
    })
};

export const saveMessage = (req, res) => {
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, "secretkey", (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")

        let combined_id;

        if(data.id.toString().includes('C')){
            combined_id = data.id + req.body.user_id
        }else{
            combined_id = req.body.user_id + data.id
        }

        // const salt = bcrypt.genSaltSync(10);
        // const message = bcrypt.hashSync(req.body.message, salt);
        const message = req.body.message

        const q = "CREATE TABLE IF NOT EXISTS ?? (`user_id` varchar(20) NOT NULL,`user_name` varchar(45) NOT NULL,`user_image` varchar(500) DEFAULT NULL,`last_message` varchar(10000) DEFAULT NULL,`date` datetime DEFAULT NULL,PRIMARY KEY (`user_id`),UNIQUE KEY `chats_UNIQUE` (`user_id`)); INSERT INTO ??(user_id, user_name,user_image,last_message,date) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE last_message=? ,date=?; INSERT INTO ??(message, date, sender_id) VALUES(?,?,?);"

        db.query(q, [req.body.user_id, req.body.user_id,req.body.id,req.body.name,req.body.image, message, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), message, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), combined_id, message, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), data.id], (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send("Sent");
        });
    })
};

export const fetchChats = (req, res) => {
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, "secretkey", (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = "SELECT * FROM ??"
    
        db.query(q, [data.id], (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send(data);
        });
    })
};