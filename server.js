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





// app.get("/leave-requests/all", async (req, res) => {
//   const managerId = req.query.manager;

//   try {
//     let query = `
//       SELECT 
//         pd.employee_id,
//         pd.first_name,
//         pd.last_name,
//         jd.department_name,
//         jd.manager_id,
//         m.first_name AS manager_first_name,
//         m.last_name AS manager_last_name,
//         lr.leave_id,
//         lr.leave_type,
//         lr.start_date,
//         lr.end_date,
//         lr.status
//       FROM personal_details pd
//       JOIN job_details jd ON pd.employee_id = jd.employee_id
//       LEFT JOIN personal_details m ON jd.manager_id = m.employee_id
//       LEFT JOIN leave_requests lr ON pd.employee_id = lr.employee_id
//     `;

//     // If a managerId is provided → add WHERE condition
//     const params = [];
//     if (managerId) {
//       query += " WHERE jd.manager_id = ?";
//       params.push(managerId);
//     }

//     // Execute query
//     const [rows] = await db.execute(query, params);

//     // Group results by employee with nested leave_requests array
//     const employees = {};
//     rows.forEach(row => {
//       if (!employees[row.employee_id]) {
//         employees[row.employee_id] = {
//           employee_id: row.employee_id,
//           first_name: row.first_name,
//           last_name: row.last_name,
//           department_name: row.department_name,
//           manager_id: row.manager_id,
//           manager_name: `${row.manager_first_name || ""} ${row.manager_last_name || ""}`.trim(),
//           leave_requests: []
//         };
//       }

//       if (row.leave_id) {
//         employees[row.employee_id].leave_requests.push({
//           leave_id: row.leave_id,
//           leave_type: row.leave_type,
//           start_date: row.start_date,
//           end_date: row.end_date,
//           status: row.status
//         });
//       }
//     });

//     // Send response
//     res.json({
//       success: true,
//       message: "Leave requests fetched successfully",
//       data: Object.values(employees)
//     });

//   } catch (err) {
//     console.error("Error fetching leave requests:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
