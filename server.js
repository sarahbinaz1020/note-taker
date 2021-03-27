const express = require("express");
const fs = require("fs");
const app = express();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { stringify } = require("querystring");

const PORT = process.env.PORT || 8080;

// Middleware functions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static file hosting for public directory
app.use(express.static("public"));

// HTML routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// API Routes
app.get("/api/notes", function (req, res) {
  // Retrieve all notes and res.json them back to the front end
  // read the contents of the db.json
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    // send them to the user
    return res.json(JSON.parse(data));
  });
});
app.post("/api/notes", function (req, res) {
  // create a note from req.body
  const note = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };
  // read the data from db json
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    // parse out the array
    const newdata = JSON.parse(data);
    // push the array
    newdata.push(note);
    // stringify the array
    //write file to new array
    fs.writeFile("./db/db.json", JSON.stringify(newdata), function (err) {
      // console.log(err);
      // respond to user
      return note;
    });
  });

  res.json(note);
});

// Tried to get the DELETE to work, but did not

// app.delete("/api/notes/:id", function (req, res) {
//   // delete note based off id
//   const { id } = req.params.id;
//   // read the data from db json
//   fs.readFile(__dirname + "db/db.json", "utf8", function (err, data) {
//       // parse out the array
//       const notes = JSON.parse(note);
//       // remove from the array
//       const newnotes = notes.filter((note) => note.id !== id);
//       // stringify the array
//       //write file to new array
//       fs.writeFile("./db/db.json", JSON.stringify(newnotes));
//       // respond to user
//       return newnotes;

//   })

//   res.json(newnotes)
// });

app.listen(PORT, () => console.log("App listening on port " + PORT));
