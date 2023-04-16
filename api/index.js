import express from "express";

const app = express();

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chats.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import likeRoutes from "./routes/likes.js";
import bookmarkRoutes from "./routes/bookmarks.js";

import cors from "cors";
import cookieParser from "cookie-parser";


import dotenv from 'dotenv';
dotenv.config();

export const secret = process.env.REACT_APP_JWT_SECRETKEY;


//middlewares
app.use((req,res,next)=>{
    req.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/bookmarks", bookmarkRoutes)

app.listen(8800, ()=>{
    console.log("api working");
});