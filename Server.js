const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.url == "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.readFile("./index.html", "utf8", (err, data) => {
      if (err) {
        res.end("<h4 style='font:red;'>Error Occured</h4>");
      }
      res.write(data);
      res.end();
    });
  } else if (req.url == "/styles.css") {
    fs.readFile("./styles.css", (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end();
      }
      res.writeHead(200, {
        "Content-Type": "text/css",
      });
      res.end(data);
    });
  } else if (req.url == "/signup") {
    fs.readFile("./signup.html", "utf8", (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  } else if (req.url == "/login") {
    fs.readFile("./login.html", "utf8", (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  } else if (req.url == "/dashboard") {
    fs.readFile("./dashboard.html", "utf8", (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  } else if (req.url == "/students") {
    fs.readFile("./viewStudents.html", "utf8", (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  } else if (req.url == "/addStudent") {
    fs.readFile("./addStudents.html", "utf8", (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  } else if (req.url == "/modifyStudent") {
    fs.readFile("./modifyDetails.html", "utf8", (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  } else if (req.url == "/logout") {
    fs.readFile("./logout.html", "utf8", (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  } else if (req.url == "/api/register" && req.method == "POST") {
    console.log("REGISTER ROUTE HIT");
    let body = "";
    req.on("data", (chunk) => {
      console.log("DATA RECEIVED");
      body += chunk;
    });

    req.on("end", () => {
      console.log("END EVENT");
      const user = JSON.parse(body);
      console.log(user);
      fs.readFile("./db.json", "utf8", (err, data) => {
        console.log("FILE READ");
        if (err) {
          return res.end(
            JSON.stringify({
              success: false,
            }),
          );
        }
        const db = JSON.parse(data);
        const alreadyExisting = db.users.some((obj) => obj.name == user.name);
        res.writeHead(201, {
          "Content-Type": "application/json",
        });
        if (alreadyExisting) {
          return res.end(
            JSON.stringify({
              success: false,
              message: "Username already exists",
            }),
          );
        } else {
          db.users.push(user);
          const updatedData = JSON.stringify(db);
          fs.writeFile("./db.json", updatedData, () => {
            return res.end(
              JSON.stringify({
                success: true,
              }),
            );
          });
        }
      });
    });
  } else if (req.url == "/api/login" && req.method == "POST") {
    res.writeHead(201, { "Content-Type": "application/json" });

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const user = JSON.parse(body);
      console.log(user);
      fs.readFile("./db.json", "utf8", (err, data) => {
        if (err) {
          return res.end(
            JSON.stringify({
              success: false,
            }),
          );
        }

        let db = JSON.parse(data);
        db = db.users;
        console.log(db);

        const found = db.some((obj) => {
          return obj.name == user.name && obj.password == user.password;
        });

        console.log(found);

        let result = "";

        if (found) {
          return res.end(
            JSON.stringify({
              success: true,
              message: "Login Successfull",
            }),
          );
        } else {
          return res.end(
            JSON.stringify({
              success: false,
              message: "Login failed",
            }),
          );
        }
      });
    });
  } else if (req.url == "/viewStudents" && req.method == "GET") {
    // req.on("end",()=>{
    fs.readFile("./db.json", "utf8", (err, data) => {
      if (err) {
        return res.end(
          JSON.stringify({
            success: false,
          }),
        );
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      return res.end(data);
    });
    // });
  } else if (req.url == "/api/addStudents" && req.method == "POST") {
    res.writeHead(201, {
      "Content-Type": "application/json",
    });
    let body = "";
    req.on("data", (chunk) => {
      // console.log("DATA RECEIVED");
      body += chunk;
    });

    req.on("end", () => {
      // console.log("END EVENT");
      const student = JSON.parse(body);
      console.log(student);
      fs.readFile("./db.json", "utf8", (err, data) => {
        // console.log("FILE READ");
        if (err) {
          return res.end(
            JSON.stringify({
              success: false,
            }),
          );
        }
        const db = JSON.parse(data);
        // const alreadyExisting = db.students.some((obj) => obj.name == user.name);
        db.students.push(student);
        const updatedData = JSON.stringify(db);
        fs.writeFile("./db.json", updatedData, () => {
          return res.end(
            JSON.stringify({
              success: true,
            }),
          );
        });
      });
    });
  }
});

server.listen(4000, () => {
  console.log("Server is running at http://localhost:4000");
});
