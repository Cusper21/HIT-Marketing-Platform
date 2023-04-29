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
    SELECT p.*, product_id_rfk
    FROM products p
    LEFT JOIN reported_products r ON p.id = r.product_id_rfk
    WHERE  ISNULL(r.product_id_rfk)
    ORDER BY RAND() LIMIT 4`; //randomise

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
    SELECT p.*, product_id_rfk
    FROM products p
    LEFT JOIN reported_products r ON p.id = r.product_id_rfk
    WHERE  ISNULL(r.product_id_rfk) and p.category_pfk = ?`;
    
    db.query(q,[req.body.category_pfk], (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
        
    });
};

export const fetchCleanProducts = (req, res) => {

    const q = `
    SELECT name, description, price, image1, size, colors, quantity, date_added
    FROM products p
    LEFT JOIN reported_products r ON p.id = r.product_id_rfk
    WHERE  ISNULL(r.product_id_rfk)`;

    db.query(q, (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};

export const fetchAllProducts = (req, res) => {

    const q = `
    SELECT p.id, name, description, price, image1, size, colors, quantity, date_added,product_id_rfk
    FROM products p
    LEFT JOIN reported_products r ON p.id = r.product_id_rfk`

    db.query(q, (err,data)=>{
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
        SELECT p.*, product_id_rfk
        FROM products p
        LEFT JOIN reported_products r ON p.id = r.product_id_rfk 
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
            SELECT p.*, product_id_rfk, vendor_id_rfk, customer_id_rfk
            FROM reported_products r
            LEFT JOIN products p ON r.product_id_rfk = p.id 
            WHERE r.vendor_id_rfk = ?
            GROUP BY r.product_id_rfk;`
    
        db.query(q, [data.id], (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send(data);
        });
    })

};

export const fetchProduct = (req, res) => {

    const q = `
    SELECT p.*,v.name as vname, type, address, cell, profile_picture
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
    
        let q = '';
        if (data.id === 'Admin') {
            q = `
            DELETE
            FROM products
            WHERE id = ?`;
        } else {
            q = `
            DELETE
            FROM products
            WHERE id = ? and vendor_id_pfk = ?`;
        }

        const params = [req.body.id];
        if (data.id !== 'admin') {
            params.push(data.id);
        }
    
        db.query(q,params, (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send("Product deleted!");
        });
    })    
};

export const restoreProduct = (req, res) => {
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")

        if(data.id==='Admin'){
                const q = `
                DELETE
                FROM reported_products
                WHERE product_id_rfk = ?`;
        
            db.query(q,req.body.id, (err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send("Product deleted!");
            });

        }
    })    
};

export const reportProduct = (req, res) => {
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = `
        INSERT INTO reported_products(product_id_rfk, vendor_id_rfk, customer_id_rfk)
        VALUES(?,?,?)`
    
        db.query(q,[req.body.id, req.body.vendor_id_pfk, data.id], (err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send("Product reported!");
        });
    })    
};