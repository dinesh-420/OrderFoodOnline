const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mongodb = require("mongodb").MongoClient;
const multer = require("multer");
const { memoryStorage } = require("multer");




const app = express();
app.use(cors());

app.use(bodyparser.json());

var db;

mongodb.connect("mongodb://teamdml:dinesh@cluster0-shard-00-00.ldv9b.mongodb.net:27017,cluster0-shard-00-01.ldv9b.mongodb.net:27017,cluster0-shard-00-02.ldv9b.mongodb.net:27017/project1?ssl=true&replicaSet=atlas-11rnam-shard-0&authSource=admin&retryWrites=true&w=majority", (error, result) => {

    if (error) {
        console.log("Data Base Not Connected");
    }
    else {
        db = result.db("project1");
        console.log("Data Base connected");
    }
});

app.use((req, res, next) => {
    console.log("Middleware 1");
    next();
});
app.use("/home", (req, res, next) => {
    console.log("Middleware 2");
    next();
});
function verifyUser(req, res, next) {
    console.log("User Verified");
    next();
}
app.get("/", (req, res) => {
    console.log("index page");
    res.json("namsthee");
});

app.get("/home", verifyUser, (req, res) => {
    console.log("home page");
    res.json("welcome to home");
});

app.post("/register", (req, res) => {

    req.body._id = new Date().getTime();

    console.log(req.body);

    db.collection("users").save(req.body, (error, data) => {
        if (error) {
            res.status(403).json("Error in insert query");
        }
        else {
            res.json("User Registered Successfully!");
        }
    });
});

app.post("/login", (req, res)=>{
    console.log(req.body)
     db.collection("users").find(req.body, {projection: {_id : 1, username : 1}}).toArray((error, data)=>{
        if(error)
         {
             res.status(403).json("Error in finding the login doc");
         }
         else{
             res.json(data);
         }
         
      });
      
 });

app.get("/usernamecheck/:username", (req, res) => {
    console.log(req.params.username);
    db.collection("users").find({ username: req.params.username }, { projection: { _id: 1 } }).toArray((error, data) => {
        if (error) {
            res.status(403).json("Error in finding Username Availibility");
        }
        else {
            res.json(data);
        }
    });
});
app.post("/adminregister", (req, res) => {

    req.body._id = new Date().getTime();

    console.log(req.body);

    db.collection("restaurants").save(req.body, (error, data) => {
        if (error) {
            res.status(403).json("Error in insert query");
        }
        else {
            res.json("User Registered Successfully!");
        }
    });
});
app.post("/adminlogin", (req, res) => {
    console.log(req.body)
    db.collection("restaurants").find(req.body, { projection: { _id: 1, restousername: 1 } }).toArray((error, data) => {
        if (error) {
            res.status(403).json("Error in finding the login doc");
        }
        else {
            res.json(data);
        }
    });
});
app.get("/allrestaurants", (req, res) => {
    db.collection("restaurants").find().toArray((error, data) => {
        res.json(data);
    });
});
app.get("/restousernamecheck/:username", (req, res) => {
    console.log(req.params.username);
    db.collection("restaurants").find({ username: req.params.username }, { projection: { _id: 1 } }).toArray((error, data) => {
        if (error) {
            res.status(403).json("Error in finding Username Availibility");
        }
        else {
            res.json(data);
        }
    });
});

app.get("/getuser/:userid", (req, res) => {
    console.log(req.params);
    db.collection("restaurants").find({ _id: Number(req.params.userid) }).toArray((error, data) => {
        if (error) {
            res.status(403).json("Error in finding the Doc");
        }
        else {
            res.json(data);
        }
    });
});
app.put("/updateuser", (req, res) => {
    console.log(req.body);
    var condition = { _id: req.body._id };

    var newValues = { $set: { restofirstname: req.body.firstname, restolastname: req.body.lastname, restomail: req.body.mail, restousername: req.body.username, restopasswrd: req.body.passwrd, restophnnumber: req.body.phnnumber, restoaddress: req.body.address, restopic: req.body.pic } };

    db.collection("restaurants").update(condition, newValues, (error, data) => {
        if (error) {
            res.status(403).json("Error in updating the Data");
        }
        else {
            res.json("DATA updated sucessfully");
        }
    });

});
app.delete("/deleteuser/:userid", (req, res) => {

    console.log(req.params);

    db.collection("restaurants").deleteOne({ _id: Number(req.params.userid) }, (error, data) => {
        res.json("DATA Deleted Successfully");
    });


});
app.get("/search/:searchtxt?", (req, res) => {

    console.log(req.params);

    if (req.params.searchtxt != undefined) {
        var search = new RegExp(req.params.searchtxt, 'i');
        var searchCond = { restofirstname: search };
    }
    else {
        var searchCond = null;
    }

    db.collection("restaurants").find(searchCond).toArray((error, data) => {
        res.json(data);
    });
});
app.post("/addmenu", (req, res) => {

    req.body._id = new Date().getTime();

    console.log(req.body);

    db.collection("foodmenu").save(req.body, (error, data) => {
        if (error) {
            res.status(403).json("Error in insert query");
        }
        else {
            res.json("Item added Successfully!");
        }
    });
});
app.get("/allitems", (req, res) => {
    db.collection("foodmenu").find(null, { projection: { psswrd: 0 } }).toArray((error, data) => {
        if (error) {
            res.status(403).json("Error in finding data");
        }
        else {
            res.json(data);
        }
    });
});
app.delete("/deleteitem/:userid", (req, res) => {

    console.log(req.params);

    db.collection("foodmenu").deleteOne({ _id: Number(req.params.userid) }, (error, data) => {
        res.json("item Deleted Successfully");
    });


});
app.get("/getitem/:itemid", (req, res) => {
    console.log(req.params);
    db.collection("foodmenu").find({ _id: Number(req.params.itemid) }).toArray((error, data) => {
        if (error) {
            res.status(403).json("Error in finding the Doc");
        }
        else {
            res.json(data);
        }
    });
});
app.put("/updateitem", (req, res) => {
    console.log(req.body);
    var condition = { _id: req.body._id };

    var newValues = { $set: { restoname: req.body.restoname, restoitemname: req.body.itemname, restoitemprice: req.body.price, restorating: req.body.rating, pic: req.body.pic } };

    db.collection("foodmenu").update(condition, newValues, (error, data) => {
        if (error) {
            res.status(403).json("Error in updating the Data");
        }
        else {
            res.json("item updated sucessfully");
        }
    });

});

app.get("/allviewitems", (req, res) => {
    db.collection("foodmenu").find(null, { projection: { psswrd: 0 } }).toArray((error, data) => {
        if (error) {
            res.status(403).json("Error in finding data");
        }
        else {
            res.json(data);
        }
    });
});
app.get("/searchitem/:searchtxt?", (req, res) => {

    console.log(req.params);

    if (req.params.searchtxt != undefined) {
        var search = new RegExp(req.params.searchtxt, 'i');
        var searchCond = { restoitemname: search };
    }
    else {
        var searchCond = null;
    }

    db.collection("foodmenu").find(searchCond).toArray((error, data) => {
        res.json(data);
    });
});

const mystorage = multer.diskStorage({
    destination: (req, fle, cb) => {
        cb(null, "src/assets/restaurantImages");
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname + "-" + new Date().getTime() + ".png");
    }
});


app.post("/addrestaurant", multer({ storage: mystorage }).single("restopic"), (req, res) => {

    req.body._id = new Date().getTime();
    req.body.restophnnumber = Number(req.body.restophnnumber);
    req.body.restoImgPath = req.file.filename;

    console.log(req.body);

    db.collection("restaurants").insert(req.body, (error, data) => {
        if (error) {
            res.status(401).json("Error in adding restaurant");
        }
        else {
            res.json("restaurant added sucessfully");

        }
    });
});
app.get("/cartitems", (req, res)=>{

    db.collection("cart").aggregate([
       
            { $lookup:
               {
                 from: 'foodmenu',
                 localField: 'cartuserId',
                 foreignField: '_id',
                 as: 'productdetails'
               }
             }
            ]).toArray((err, data)=> {
           
                res.json(data);
          });
        
        
});
const mypicstorage = multer.diskStorage({
    destination: (req, fle, cb) => {
        cb(null, "src/assets/menuImages");
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname + "-" + new Date().getTime() + ".png");
    }
});


app.post("/additem", multer({ storage: mypicstorage }).single("restoitempic"), (req, res) => {

    req.body._id = new Date().getTime();
    req.body.restophnnumber = Number(req.body.restophnnumber);
    req.body.restoImgPath = req.file.filename;

    console.log(req.body);

    db.collection("foodmenu").insert(req.body, (error, data) => {
        if (error) {
            res.status(401).json("Error in adding Item");
        }
        else {
            res.json("Item added sucessfully");

        }
    });
});
app.post("/addtocart", (req, res) => {

    req.body._id = new Date().getTime();
    
    req.body.cartQty = 1;

    


    console.log(req.body);

    db.collection("cart").insert(req.body, (error, data) => {
            res.json("Item added sucessfully");
    }); 
});

app.get("/cartcount", (req,res)=>{
    db.collection("cart").count((error, data)=>{
        res.json(data);
    });
});
app.put("/updatecart", (req, res)=>{

    var condition = {_id : req.body.cartId};

    var newValues = {$set: {cartQty : req.body.cartQty, cartrestoitemprice : Number(req.body.cartQty*Number(req.body.cartrestoitemprice))}};

    db.collection("cart").update(condition, newValues, (error, data)=>{

        res.json("Cart Item Updated");

    });

});
app.delete("/removecart/:cartid", (req, res)=>{

    // console.log(req.params);
 
     db.collection("cart").deleteOne({_id: Number(req.params.cartid)}, (error, data)=>{
 
         res.json("Cart Item Removed Successfully");
     });
 
 });


module.exports = app;