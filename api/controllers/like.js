import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const likes = (req,res) =>{

    const q = `
        SELECT customer_id_wfk
        FROM likes
        WHERE product_id_wfk= ?`;

        db.query(q,[req.query.product_id_wfk],(err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send(data.map(like=>like.customer_id_wfk));
        });
}

export const like = (req,res) =>{
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, "secretkey", (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
            const q = `
            INSERT INTO likes
            (customer_id_wfk ,product_id_wfk)
            VALUES
            (?,?);`

            db.query(q, [data.id, req.query.product_id_wfk], (err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send('Wish Saved!');
        });
    })
}

export const removeLike = (req,res) =>{
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, "secretkey", (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
            const q = `
            DELETE 
            FROM likes
            WHERE customer_id_wfk = ? AND product_id_wfk= ?`

            db.query(q, [data.id, req.query.product_id_wfk], (err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send('Wish deleted!');
        });
    })
}
