import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import moment from "moment";
import jwt from "jsonwebtoken";
import {secret} from './../index.js'

export const registerCustomer = (req, res) => {

    const q = `
    SELECT *
    FROM login
    WHERE username = ? OR email = ?`;

    db.query(q, [req.body.username, req.body.email], (err,data)=>{
        if (err)
        return res.status(500).send(err);
        if (data.length)
        return res.status(409).send("User already exists!");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = `
        BEGIN;
        INSERT INTO customers(first_name, last_name, gender, date_of_birth)
        VALUES (?,?,?,?);
        INSERT INTO login(username, email, password, preferences, customer_id_lfk,join_date)
        VALUES(?,?,?,?,(Select max(id) from customers),?);
        COMMIT;`;

        const values = [req.body.first_name,req.body.last_name,req.body.gender,req.body.date_of_birth,req.body.username,req.body.email,hashedPassword,req.body.preferences,moment(Date.now()).format("YYYY-MM-DD")];

        db.query(q,values,(err,data)=>{
            if (err)
            return res.status(500).send(err);
            return res.status(200).json(data);
        });
    });
};

export const registerVendor = (req, res) => {

    const q = `SELECT *
    FROM login
    WHERE username = ? OR email = ?`;

    db.query(q, [req.body.username, req.body.email], (err,data)=>{
        if (err)
        return res.status(500).send("Could not register user. Contact Admin");
        if (data.length)
        return res.status(409).send("User already exists!");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q2 = `
        BEGIN;
        INSERT INTO vendors(name, type, address, cell, profile_picture,ban)
        VALUES (?,?,?,?,?,0);
        INSERT INTO login(username, email, password, vendor_id_lfk, join_date)
        VALUES(?,?,?,(Select max(id) from vendors),?);
        COMMIT;`;

        const values = [req.body.name,req.body.type,req.body.address,req.body.cell,req.body.profile_picture, req.body.username,req.body.email,hashedPassword,moment(Date.now()).format("YYYY-MM-DD")];

        db.query(q2,values,(err,data)=>{
            if (err)
           
            return res.status(500).send(err);
            return res.status(200).send("User handle created!");
        });
    });
};

export const login = (req, res) => {

    const q = `
    SELECT username, email, login.password, preferences, coalesce(customer_id_lfk, vendor_id_lfk, admin_id)id ,gender, IFNULL(first_name, name)name,coalesce(c.profile_picture, v.profile_picture, a.profile_picture)profile_picture,IFNULL(c.ban, v.ban)ban
    FROM login
    LEFT JOIN customers c ON customer_id_lfk = c.id
    LEFT JOIN vendors v ON vendor_id_lfk = v.id
    LEFT JOIN administration a ON admin_id = a.id
    WHERE (c.id is not null or v.id is not null or a.id is not null) and login.username = ?;`

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