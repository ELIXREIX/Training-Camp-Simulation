const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const session = require('express-session'); // Add express-session
require('dotenv').config();

const app = express();

// Use express-session middleware
app.use(session({
    secret: 'your-secret-key',  // Change this to a secure key
    resave: false,
    saveUninitialized: false
}));

// Define the User schema and model
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Add encryption plugin to encrypt the 'password' field
const secret = "ThisisSecret";
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

mongoose.connect("mongodb+srv://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@cluster0.mympn5w.mongodb.net/?retryWrites=true&w=majority");
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password,
        });

        await newUser.save();
        res.render("secrets");
    } catch (err) {
        console.error(err);
        res.render("error");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const foundUser = await User.findOne({ email: username });

        if (foundUser && foundUser.password === password) {
            res.render("secrets");
        } else {
            res.render("login", { error: "Invalid username or password" });
        }
    } catch (err) {
        console.error(err);
        res.render("error");
    }
});

app.get("/logout", (req, res) => {
    // Check if session exists before attempting to destroy
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.render("error");
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
});

app.get("/secrets", (req, res) => {
    res.render("secrets");
});

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(3000, () => {
    console.log("Server opened on port 3000");
});