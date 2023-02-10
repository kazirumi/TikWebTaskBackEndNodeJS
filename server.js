const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors())

//connect database
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/product")
    .then(() => { console.log("connection successfull") })
    .catch((err) => { console.log(err) })


const authenticateToken = require('./middleware/authenticateToken')

app.get('/', authenticateToken, (req, res) => {
    console.log("Here token authenticate", req.user)


    res.send(`Hi ${req.user.name}`)

})

//file Saving Section
const multer = require('multer')
const path= require('path')
//file upload destination
const upload_folder = "./public/Image/";
// define the storage
const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,upload_folder);
    },
    filename:(req,file,cb)=>{
        //set filename
        const fileExt=path.extname(file.originalname);
        const fileName= file.originalname.replace(fileExt,"").toLocaleLowerCase().split(" ").join("-")+"-"+Date.now();
        cb(null,fileName+fileExt);
    },
});
//prepare final multer object
var upload = multer({
    storage: storage,
    limits: {

    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg"

        ) {
            cb(null, true);
        } else {
            cb(new Error("only .jpg, .png and .jpeg allowed"))
        }
    }
})


//This Endpoint is for file saving
app.post('/file', upload.array("avatar",5), (req, res) => {
    res.send(req.files);
})

app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send("There was an upload error in multer");
        } else {
            res.status(500).send(err.message);
        }

    } else {
        res.send("success");
    }
})

const UserAuthenticateRouter = require('./routes/UserAuthenticate')
const ProductRouter = require('./routes/Product')
const CategoryRouter = require('./routes/Category')
const VariantRouter = require('./routes/Variant')






//All Other Routes

app.use('/users', UserAuthenticateRouter)
app.use('/product', ProductRouter)
app.use('/category', CategoryRouter)
app.use('/variant', VariantRouter)



app.listen(3000)

