const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());

function getDatabase() {
  const db = JSON.parse(fs.readFileSync("./expressDb.json", "utf8"));

  return db;
}

function updateDatabase(db) {
  fs.writeFileSync("./expressDb.json", JSON.stringify(db));
  console.log("User added successfully");
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "logout.html"));
});

app.get("/students", (req, res) => {
  res.sendFile(path.join(__dirname, "viewStudents.html"));
});

app.get("/addStudent", (req, res) => {
  res.sendFile(path.join(__dirname, "addStudents.html"));
});

app.get("/modifyStudent", (req, res) => {
  res.sendFile(path.join(__dirname, "modifyDetails.html"));
});

app.post("/api/register", (req, res) => {
  try {
    const db = getDatabase();

    let len = db.users.length;

    let t_id = len > 0 ? db.users[len].id + 1 : 1;

    const user = { id: t_id, ...req.body };

    db.users.push(user);

    updateDatabase(db);

    const response = { success: true };

    res.json(response);
  } catch (err) {
    console.err(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/api/login", (req, res) => {
  try {
    const user = req.body;
    let db = getDatabase();
    db = db.users;
    console.log(db);
    const found = db.some((obj) => {
      return obj.name == user.name && obj.password == user.password;
    });

    console.log(found);

    // let result = "";

    if (found) {
      res.json({
        success: true,
        message: "Login Successfull",
      });
    } else {
      res.json({
        success: false,
        message: "Login failed",
      });
    }
  } catch (err) {
    console.err(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/api/addStudents", (req, res) => {
  try {
    const db = getDatabase();

    let len = db.students.length;

    let t_id = len > 0 ? db.students[len - 1].id + 1 : 1;

    const user = { id: t_id, ...req.body };

    db.students.push(user);

    updateDatabase(db);

    const response = { success: true };

    res.json(response);
  } catch (err) {
    console.err(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/viewStudents", (req, res) => {
  res.send(getDatabase());
});


app.get("/students/:id", (req, res) => {
  try {
    const db = getDatabase();
    const studentId = parseInt(req.params.id);
    const student = db.students.find((s) => s.id === studentId);

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.patch("/students/:id", (req, res) => {
  try {
    console.log("Request body:", req.body);
    const db = getDatabase();
    const studentId = parseInt(req.params.id);
    const studentIndex = db.students.findIndex((s) => s.id === studentId);

    console.log("Student index found:", studentIndex);
    
    if (studentIndex !== -1) {
      db.students[studentIndex] = {
        ...db.students[studentIndex],
        ...req.body,
      };
      console.log("Updated student:", db.students[studentIndex]);
      updateDatabase(db);
      res.json({
        success: true,
        message: "Student updated successfully",
        student: db.students[studentIndex],
      });
    } else {
      console.log("Student not found with ID:", studentId);
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
  } catch (err) {
    console.error("PATCH error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.delete("/students/:id", (req, res) => {
  try {
    const db = getDatabase();
    const studentId = parseInt(req.params.id);
    const studentIndex = db.students.findIndex((s) => s.id === studentId);

    if (studentIndex !== -1) {
      const deletedStudent = db.students.splice(studentIndex, 1);
      updateDatabase(db);
      res.json({
        success: true,
        message: "Student deleted successfully",
        student: deletedStudent[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(5000, () => {
  console.log("server is listening at http://localhost:5000");
});
