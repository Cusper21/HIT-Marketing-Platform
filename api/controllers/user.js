import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {secret} from './../index.js'

export const changePassword = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = `SELECT *
        FROM login
        WHERE (customer_id_lfk=? OR vendor_id_lfk =? OR admin_id = ?)`;

        db.query(q, [data.id,data.id,data.id], (err,info)=>{
            if (err)
            return res.status(500).send(err);
            if (!info.length)
            return res.status(404).send("User not found!");

            const checkPassword = bcrypt.compareSync(req.body.currentPassword,info[0].password);

            if(!checkPassword)
            return res.status(400).send("Incorrect Password!");

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.newPassword, salt);

            const q = `
            UPDATE login
            SET login.password = ?
            WHERE customer_id_lfk=? OR vendor_id_lfk =? OR admin_id = ?`;

            const values = [hashedPassword,data.id,data.id,data.id];

            db.query(q,values,(err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send("Password Changed!");
            });
        });
    })
};

export const banUser = (req, res) => {
    const q = `
    UPDATE ??
    SET ban = 1
    WHERE id = ? `;

    const values = [req.body.tablename,req.body.id];

    db.query(q,values,(err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send("User Banned!");
    });
};

export const redeemUser = (req, res) => {
    const q = `
    UPDATE ??
    SET ban = 0
    WHERE id = ? `;

    const values = [req.body.tablename,req.body.id];

    db.query(q,values,(err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send("User Redeemed!");
    });
};

export const fetchAllUser = (req, res) => {

    const q = `
    SELECT username, email, IFNULL(customer_id_lfk, vendor_id_lfk)id ,IFNULL(first_name, name)name,IFNULL(c.profile_picture, v.profile_picture)profile_picture,IFNULL(c.ban, v.ban)ban,join_date
    FROM login
    LEFT JOIN customers c ON customer_id_lfk = c.id
    LEFT JOIN vendors v ON vendor_id_lfk = v.id
    WHERE (c.id is not null or v.id is not null)`

    const values = [req.body.tablename,req.body.id];

    db.query(q,values,(err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};

export const fetchUserProfile = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = `
        SELECT *
        FROM login
        LEFT JOIN customers c ON customer_id_lfk = c.id
        WHERE customer_id_lfk = ?`

            db.query(q, [data.id], (err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send(data);
        });
    })
};

export const fetchVendorProfile = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = `
        SELECT *
        FROM login
        LEFT JOIN vendors v ON vendor_id_lfk = v.id
        WHERE vendor_id_lfk = ?`

            db.query(q, [data.id], (err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send(data);
        });
    })
};

export const updateProfilePicture = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = `
        UPDATE customers
        SET profile_picture = ?
        WHERE id = ?;`

            db.query(q, [req.body.url,data.id], (err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send(data);
        });
    })
};
export const updateVendorPicture = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q = `
        UPDATE vendors
        SET profile_picture = ?
        WHERE id = ?;`

            db.query(q, [req.body.url,data.id], (err,data)=>{
                if (err)
                return res.status(500).send(err);
                return res.status(200).send(data);
        });
    })
};

export const updateVendorProfile = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).send("User is not logged in!")

    jwt.verify(token, secret, (err,data)=>{
        if (err) return res.status(403).send("Token is invalid!")
    
        const q =
        `BEGIN;
        UPDATE vendors SET name=?, type=?, address=?, cell=? WHERE id=?;
        UPDATE login SET email=? WHERE vendor_id_lfk=?;
        COMMIT`;

        db.query(
        q,
        [req.body.name, req.body.type, req.body.address, req.body.cell, data.id,req.body.email, data.id], (err,data)=>{
                    if (err)
                    return res.status(500).send(err);
                    return res.status(200).send(data);
            });
        })
};

export const fetchAllVendors = (req, res) => {
    const q = `
    SELECT *
    FROM vendors
    WHERE ban = 0`;

    db.query(q,(err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};

export const fetchAllCustomers = (req, res) => {
    const q = `
    SELECT *
    FROM customers
    WHERE ban = 0`;

    db.query(q,(err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};