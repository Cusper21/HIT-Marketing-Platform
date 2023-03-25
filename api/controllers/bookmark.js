import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const fetchBookmarks = (req, res) => {

    const q = `
    SELECT customer_id_bfk
    FROM bookmarks
    WHERE product_id_bfk = ?`;

    db.query(q,[req.query.product_id_bfk],(err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data.map(bookmark=>bookmark.customer_id_bfk));
        
    });
};

export const addBookmark = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, "secretkey", (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
            
            const q = `
            INSERT INTO bookmarks
            (customer_id_bfk, product_id_bfk)
            VALUES
            (?,?);`

            db.query(q, [data.id, req.query.product_id_bfk], (err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send('Bookmark Saved!');
        });
    })
};

export const deleteBookmark = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, "secretkey", (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")

        console.log(req.query.product_id_bfk)
    
            const q = `
            DELETE
            FROM bookmarks
            WHERE customer_id_bfk = ? AND product_id_bfk = ?`

            db.query(q, [data.id, req.query.product_id_bfk], (err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send('Bookmark deleted!');
        });
    })
};