const express = require("express");
const fs = require("fs");
const path = require("path");
const {v4: uuidv4} = require("uuid");

const app = express();
const PORT = 3001;

const dataFile = path.join(__dirname,"data.json");

//use expreess with public folder 
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

//read note with readData function 

const readData = () =>{
    if(!fs.existsSync(dataFile))
        return[];
    const raw = fs.readFileSync(dataFile, "utf8");
    return raw ? JSON.parse(raw) : [];

};

// write data function

const writeData = (data) => {
    fs.writeFileSync(dataFile,JSON.stringify(data,null,2));
};

// get data 

app.get("/notes", (req, res)=>{
    res.json(readData());
});

// post 
app.post("/notes", (req,res)=> {
    const notes = readData();
    const new_note = {id: uuidv4(), ...req.body};
    notes.push(new_note);
    writeData(notes);
    res.json(new_note);
});

// put 
app.put("/notes/:id",(req,res)=>{
    const notes = readData();
    const index = notes.findIndex(note => note.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ message: "Note not found"});
    notes[index]= {...notes[index], ...req.body};
    writeData(notes);
    res.json(notes[index]);
});

// delete

app.delete("/api/notes/:id", (req, res) => {
  const notes = readData();
  const filtered = notes.filter(note => note.id !== req.params.id);
  if (notes.length === filtered.length) return res.status(404).json({ message: "Note not found" });
  writeData(filtered);
  res.json({ message: "Note deleted" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
