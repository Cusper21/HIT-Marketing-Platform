import express from "express";
const app = express();

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chats.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import likeRoutes from "./routes/likes.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/productImages')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

const upload = multer({storage: storage })

  const cpUpload = upload.fields([{ name: 'fimage', maxCount: 1 }, { name: 'simage', maxCount: 1 }])
  app.post('/api/upload', cpUpload, function (req, res) {
    console.log(req.files.simage[0].path)
    
    res.status(200).send(req.files)
  })

app.use("/api/auth", authRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/likes", likeRoutes)

app.listen(8800, ()=>{
    console.log("api working");
});