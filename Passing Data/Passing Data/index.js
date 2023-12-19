import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", (req, res) => {
    const name = req.body.fName.length;
    const surname = req.body.lName.length;
    res.render("index.ejs", { num: name+surname });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
