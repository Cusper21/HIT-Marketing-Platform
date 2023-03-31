import { db } from "../connect.js";
import jwt from "jsonwebtoken"
import moment from "moment";
import {secret} from './../index.js'

export const postProducts = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = `
        INSERT INTO products(name, description, price, image1, image2, size, colors, quantity, date_added, category_pfk, sub_category_pfk, vendor_id_pfk) 
        VALUES(?)`;

        const values = [req.body.name,req.body.description,req.body.price,req.body.image1,req.body.image2,req.body.size,req.body.colors,req.body.quantity, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),req.body.category_pfk,req.body.sub_category_pfk,data.id];

        db.query(q,[values],(err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send("Product Saved!");
        });
    })
};

export const getFeaturedProducts = (req, res) => {

    const q = `
    SELECT *
    FROM products
    LIMIT 4`; //randomise

    db.query(q, (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};

export const getPopularProducts = (req, res) => {

    const q = `
    SELECT *, COUNT(*) AS popularity
    FROM products
    JOIN likes l ON products.id = product_id_wfk
    GROUP BY product_id_wfk
    ORDER BY popularity desc LIMIT 4`;

    db.query(q, (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};
export const fetchProducts = (req, res) => {

    const q = `
    SELECT *
    FROM products
    LEFT JOIN reported_products r ON id = r.product_id_rfk
    WHERE  ISNULL(r.product_id_rfk) and category_pfk = ?
    LIMIT 20`;

    db.query(q,[req.body.category_pfk], (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};

export const fetchVendorProducts = (req, res) => {
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = `
        SELECT *
        FROM products
        LEFT JOIN reported_products r ON id = r.product_id_rfk 
        WHERE  ISNULL(r.product_id_rfk) AND vendor_id_pfk = ?;`
    
        db.query(q, [data.id], (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send(data);
        });
    })
};

export const fetchReportedProducts = (req, res) => {
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
            const q = `
            SELECT *
            FROM reported_products
            LEFT JOIN products p ON product_id_rfk = p.id 
            WHERE vendor_id_rfk = ?;`
    
        db.query(q, [data.id], (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send(data);
        });
    })

};

export const fetchProduct = (req, res) => {

    const q = `
    SELECT p.*, v.name as vendor_name,v.profile_picture,v.address
    FROM products p
    LEFT JOIN vendors v ON vendor_id_pfk = v.id 
    WHERE p.id = ?;`;

    db.query(q,[req.body.id], (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};

export const deleteProduct = (req, res) => {
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = `
        DELETE
        FROM products
        WHERE id = ? and vendor_id_pfk = `;
    
        db.query(q,[req.body.id, data.id], (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send("Product deleted!");
        });
    })    
};