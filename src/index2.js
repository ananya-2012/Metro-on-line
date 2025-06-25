const express=require('express');
const app=express();
const userModel=require('./config');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const payment=require("./config2");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/signup",(req,res)=>{
    res.render("signup");
})
app.post('/signup',(req,res)=>{
    let {name,email,password}=req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
            let user=await userModel.create({
                name,
                email,
                password:hash
            })
            let token=jwt.sign({email},"&*fgc&fy$3nb");
            res.cookie("token",token);
            res.redirect("/login");
        })
    })
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.post("/login",async(req,res)=>{
    let {email,password}=req.body;
    const check=await userModel.findOne({email:email});
    
    const isPasswordMatch=await bcrypt.compare(password,check.password);
    if(isPasswordMatch) res.redirect("/home");
})
app.get("/home",(req,res)=>{
    res.render("home");
})
app.get("/pay",(req,res)=>{
    res.render("pay");
})

app.post("/pay",async(req,res)=>{
    const {name,ticketCount,paymentMethod}=req.body;
    let paymentDetails={};
    if(paymentMethod==="credit" || paymentMethod==="debit"){
        paymentDetails.cardNumber=req.body["paymentDetails.cardNumber"];
    } else if(paymentMethod==="upi"){
        paymentDetails.upiId=req.body["paymentDetails.upiId"];
    }

    console.log("Recieved payment details",{name,ticketCount,paymentMethod,paymentDetails});
    try{
        const ticket=await payment.create({
            name,
            tickets:ticketCount,
            paymentMethod,
            paymentDetails
        });
            console.log("Payment successfully saved:",ticket);
            res.redirect("/home");
    } catch(error){
        console.log("Error saving payment:",error);
        res.status(500).end("Error processing payment.");
    }
});

app.get("/delhi",(req,res)=>{
    res.render("delhi");
});
app.get("/contact",(req,res)=>{
    res.render("contact");
});
app.get("/about",(req,res)=>{
    res.render("about");
});
app.get("/hyderabad",(req,res)=>{
    res.render("hyderabad");
})
app.listen(5000);