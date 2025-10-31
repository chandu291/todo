//  Import packages 
const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");
const app = express();

// environment variables 
dotenv.config();

//  Middleware 
app.use(express.json());

// POST 
app.post("/todos", async (req, res) => {
  const { title, completed } = req.body;
  if (!title) return res.json({ success: false, message: "Title is required" });

  try {
    const [result] = await db.execute(
      "INSERT INTO todo (title, completed) VALUES (?, ?)",
      [title, completed || false]
    );
    res.json({
      success: true,
      message: "Todo created successfully",
      data: { id: result.insertId, title, completed: !!completed },
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// GET 
app.get("/todos", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM todo ORDER BY id DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// GET 
app.get("/todos/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM todo WHERE id = ?", [req.params.id]);
    if (rows.length === 0)
      return res.json({ success: false, message: "Todo not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// PUT 
app.put("/todos/:id", async (req, res) => {
  const { title, completed } = req.body;
  if (!title) return res.json({ success: false, message: "Title is required" });

  try {
    const [result] = await db.execute(
      "UPDATE todo SET title=?, completed=? WHERE id=?",
      [title, completed, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.json({ success: false, message: "Todo not found" });
    res.json({ success: true, message: "Todo updated successfully" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// DELETE 
app.delete("/todos/:id", async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM todo WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0)
      return res.json({ success: false, message: "Todo not found" });
    res.json({ success: true, message: "Todo deleted successfully" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Start Server 
app.listen(5000, () => console.log("Server running"));

  