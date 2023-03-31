import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {secret} from './../index.js'

export const registerCustomer = (req, res) => {

    const q = `
    SELECT *
    FROM login
    WHERE username = ?`;

    db.query(q, [req.body.username], (err,data)=>{
        if (err)
        return res.status(500).send(err);
        if (data.length)
        return res.status(409).send("User already exists!");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = `
        BEGIN;
        INSERT INTO customers(first_name, last_name, gender, date_of_birth)
        VALUES (?);
        INSERT INTO login(username, email, password, customer_id_lfk)
        VALUES(?,(Select max(id) from customers));
        COMMIT;`;

        const values = [[req.body.first_name,req.body.last_name,req.body.gender,req.body.date_of_birth],[req.body.username,req.body.email,hashedPassword]];

        db.query(q,values,(err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send("User handle created!");
        });
    });
};

export const registerVendor = (req, res) => {

    const q = `SELECT *
    FROM login
    WHERE username = ?`;

    db.query(q, [req.body.username], (err,data)=>{
        if (err)
        return res.status(500).send(err);
        if (data.length)
        return res.status(409).send("User already exists!");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = `
        BEGIN;
        INSERT INTO vendors(name, type, address, cell, profile_picture)
        VALUES (?);
        INSERT INTO login(username, email, password, vendor_id_lfk)
        VALUES(?,(Select max(id) from vendors));
        COMMIT;`;

        const values = [[req.body.name,req.body.type,req.body.address,req.body.cell,req.body.profile_picture],[req.body.username,req.body.email,hashedPassword]];

        db.query(q,values,(err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).send("User handle created!");
        });
    });
};

export const login = (req, res) => {

    const q = `
    SELECT username, email, login.password, IFNULL(customer_id_lfk, vendor_id_lfk)id ,gender, IFNULL(first_name, name)name,IFNULL(c.profile_picture, v.profile_picture)profile_picture
    FROM login
    LEFT JOIN customers c ON customer_id_lfk = c.id
    LEFT JOIN vendors v ON vendor_id_lfk = v.id
    WHERE (c.id is not null or v.id is not null) and login.username = ?;`

    db.query(q,[req.body.username], (err,data) => {

        if (err) 
        return res.status(500).send(err);

        if (data.length === 0)
        return res.status(404).send("User not found");

        const checkPassword = bcrypt.compareSync(req.body.password,data[0].password);

        if(!checkPassword)
        return res.status(400).send("Wrong username or password!");
        
        const token = jwt.sign({id:data[0].id}, secret);

        const {password, ...others} = data[0];

        res.cookie("accessToken", token,{
            httpOnly:true
        }).status(200).send(others); 
    });
};

export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure:true,
        sameSite:"none"
    }).status(200).send("User has been logged out.");
};