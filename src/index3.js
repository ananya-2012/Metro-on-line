const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use(express.static("public"));
app.set("view engine","ejs");
// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/metroline", { useNewUrlParser: true, useUnifiedTopology: true });

const stationSchema = new mongoose.Schema({
    from: String,
    to: String,
    journeyDate: String,
    journeyTime: String
});

const Journey = mongoose.model("Journey", stationSchema);
app.get('/profile',(req,res)=>{
    res.render('profile');
})
app.get('/',(req,res)=>{
    res.render('delhiMap');
})
// API to save journey details
app.post("/save-journey", async (req, res) => {
    try {
        const { from, to, journeyDate, journeyTime } = req.body;
        const newJourney = new Journey({ from, to, journeyDate, journeyTime });
        await newJourney.save();
        res.status(201).send("Journey details saved successfully.");
    } catch (error) {
        res.status(500).send("Error saving journey details.");
    }
});
app.get("/pay", (req, res) => {
    const { customerId, from, to, journeyDateTime, tickets } = req.query;
    res.render("paynew", { customerId, from, to, journeyDateTime, tickets });
});

app.get("/payment", (req, res) => {   
    res.render("pay");
});

app.get("/upcoming", async(req, res) => {
    let allusers=await Journey.find();
    res.render("upcoming",{users:allusers});
});

// Start the server
app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});
