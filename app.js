const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {Schema} = mongoose;
const connectionString = "mongodb://localhost:27017/data";
//database connection
mongoose.connect(connectionString,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
},(err)=>{
    if(err) console.log(err);
    else console.log("Database connected");
});
//creating schema
const usersSchema = new Schema({
    name: String,
    email: String,
    country: String
});
//linking user to model
const User = mongoose.model('User', usersSchema);

app.use(express.json())

//get all users
app.get("/users", (req,res) => {
    User.find({}, (err, user) =>{
        if(err) return res.status(500).json({message: "Not Successful",error: err});
        else return res.status(200).json({message:"Successful", user:user});
    })
});

//get a user
app.get("/users/:id", (req,res) => {
    User.findById({_id: req.params.id}, (err,user) =>{
        if(err){
            return res.status(500).json({message:"Not Successful", err: err});
        }
        else if(!user){
            return res.status(404).json({message:"Not Successful", user:"User With Id "+req.params.id+" Not Found"});
        }
        else{
            return res.status(200).json({message:"Successful", user: user});
        }
    })
});

//create a user
app.post("/users", (req,res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country 
    }, (err, user) => {
        if(err){
            return res.status(500).json({message:"Not Successful", error: err})
        }else{
            return res.status(201).json({message:"Successful", user: user});
        }
    })
});

app.put("/users/:id", (req,res) => {
    User.findByIdAndUpdate(
        req.params.id,
        {name:req.body.name,
        email: req.body.email,
        country: req.body.country
    },
        (err, user) =>{
            if(err){
                res.status(500).json({message:"Not Successful",error: err});
            }
             if(!user){
                res.status(404).json({message:"Not Successful", user:"User With Id "+req.params.id+" Not Found"});
            } else if(!user){
                res.status(404).json({message:"Not Successful", user:"User With Id "+req.params.id+" Not Found"});
            } else{
                user.save((err,savedUser) =>{
                    if(err){
                        return res.json({message:"Not Successful", error: err})
                    }else {
                        return res.status(202).json({message: "Successful", user: savedUser });
                    }
                });
            }
    })
});

app.delete("/users/:id", (req,res) => {
    User.findByIdAndDelete(req.params.id,
        (err, user) => {
            if(err){
                return res.status(500).json({message: "Not Successful", error: err});
            }else if(!user){
                res.status(404).json({message:"Not Successful", user:"User With Id "+req.params.id+" Not Found"});
            }else{
                return res.status(200).json({message:"Successful", user: "User Has Been Deleted"});
            }
    })
})
app.listen(3000, () => console.log("server is listening on port 3000"));
