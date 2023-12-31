import mariadb from "mariadb";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.DB_PORT || 3000;
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});
let data = [];

app.get("/", cors(), async (req, res) => {
  let connection;
  try {
  } catch (error) {}
});

app.post("/ideas/create", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const prepare = await connection.query(
      "INSERT INTO ideas(title, description) VALUES (?, ?)",
      [req.body.title, req.body.description]
    );
    res.send(data);
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.end();
  }
});

app.put("/ideas/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const prepare = await connection.query(
      `UPDATE ideas SET title =?, description=? WHERE id=? `,
      [req.body.title, req.body.description, req.params.id]
    );
    res.send(data);
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.end();
  }
});

app.get("/ideas/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    let id = req.params.id;
    let prepare;
    if (id === "all") prepare = await connection.execute("SELECT * FROM ideas");
    else if (!isNaN(id)) {
      prepare = await connection.execute("SELECT * FROM ideas WHERE id = ?", [
        parseInt(req.params.id),
      ]);
    } else {
      prepare = await connection.execute(
        `SELECT * FROM ideas WHERE title LIKE CONCAT( '%',?,'%') OR description LIKE CONCAT( '%',?,'%')`,
        [id, id]
      );
    }
    res.send(prepare);
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.end();
  }
});

app.delete("/ideas/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(`DELETE FROM ideas WHERE id=?;`, [req.params.id]);
    res.send("idea deleted");
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.end();
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server started: http://localhost:${PORT}/`)
);

(async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    data = await connection.query(`SELECT * FROM ideas`);
  } catch (err) {
    console.log("no connction");
    throw err;
  } finally {
    if (connection) connection.end();
  }
})();
