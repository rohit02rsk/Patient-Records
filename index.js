const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Record = require("./models/records.js");

mongoose
  .connect("mongodb://localhost:27017/patientRecords")
  .then(() => {
    console.log("MongoDB Connection open!");
  })
  .catch((err) => {
    console.log("MongoDB Error occurred!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/records", async (req, res) => {
  const records = await Record.find({});
  res.render("records/index", { records });
});

app.get("/records/new", (req, res) => {
  res.render("records/new");
});

app.get("/records/:id", async (req, res) => {
  const { id } = req.params;
  const record = await Record.findById(id);
  res.render("records/show", { record });
});

app.get("/records/:id/edit", async (req, res) => {
  const { id } = req.params;
  const record = await Record.findById(id);
  res.render("records/edit", { record });
});

app.post("/records", async (req, res) => {
  const newRecord = new Record(req.body);
  await newRecord.save();
  res.redirect(`/records/${newRecord._id}`);
});

app.put("/records/:id", async (req, res) => {
  const { id } = req.params;
  const record = await Record.findByIdAndUpdate(id, req.body);
  res.redirect(`/records/${record._id}`);
});

app.delete("/records/:id", async (req, res) => {
  const { id } = req.params;
  const delRecord = await Record.findByIdAndDelete(id);
  console.log(delRecord);
  res.redirect("/records");
});

app.listen(3000, () => {
  console.log("App is listening on PORT 3000");
});
