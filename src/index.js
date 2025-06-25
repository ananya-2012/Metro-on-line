const express=require('express');
const bcrypt=require('bcrypt');
const collection=require("./config");
//const cookieParser=require('cookie-parser');
//const jwt=require('jsonwebtoken');

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
//app.use(cookieParser());

app.set('view engine','ejs');

app.use(express.static("public"));

app.get("/",(req,res)=>{
    //let token=jwt.sign({email:"abc@gmail.com"},"secret");
    //res.cookie("token",token);
    res.render("login");
});

app.get("/login",(req,res)=>{
    //let data=jwt.verify(req.cookies.token,"secret");
    res.render("login");
});

app.get("/home",(req,res)=>{
    res.render("home");
})
app.get("/signup",(req,res)=>{
    res.render("signup");
})
app.get("/pay",(req,res)=>{
    res.render("pay");
})
app.get("/profile",(req,res)=>{
    res.render("profile");
})
app.get("/delhimap",(req,res)=>{
    res.render("delhiMap");
})
app.post("/signup",async(req,res)=>{
    const data={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }
app.post("/login",async(req,res)=>{
    try{
        const check=await collection.findOne({email:req.body.email});
        if(!check){
            res.send("Not registered with this email.");
            return;
        }
     const isPasswordMatch=await bcrypt.compare(req.body.password,check.password);
     if(isPasswordMatch){
         res.redirect("/home");
     }
     else{
        res.send("wrong password");
     }
    }catch(error){
        res.send("Incorrect details");
    }
})

    const existinguser=await collection.findOne({email:data.email});
    if(existinguser){
        res.send("User already exists.Please choose different email");
    }else{
    const saltRounds=10;
    const hashedPassword=await bcrypt.hash(data.password,saltRounds);

        data.password=hashedPassword;

    const userdata=await collection.insertMany(data);
    console.log(userdata);
    }
})

const port=5000;
app.listen(port,()=>{
    console.log(`server connected at ${port}`);
})