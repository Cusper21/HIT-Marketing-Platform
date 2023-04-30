import { db } from "../connect.js";

export const fetchAllCategories = (req, res) => {

    const q = `
    SELECT *
    FROM categories`;

    db.query(q, (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};

export const fetchCategory = (req, res) => {
    
    const q = `
    SELECT *
    FROM categories
    WHERE title = ?`;

    db.query(q,[req.body.title], (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};

export const fetchSubCategories = (req, res) => {

    const q = `
    SELECT *
    FROM sub_categories
    WHERE category_sfk = ?
    LIMIT 20`;

    db.query(q,[req.body.category_sfk], (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};

export const fetchAllSubCategories = (req, res) => {

    const q = `
    SELECT *
    FROM sub_categories`;

    db.query(q,[req.body.category_sfk], (err,data)=>{
        if (err)
        return res.status(500).send(err);
        return res.status(200).send(data);
    });
};