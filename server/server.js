import mariadb from "mariadb";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectionLimit: 5,
});
let data = [];

app.get("/", cors(), async (req, res) => {
  // res.send({ info: `Hello World!` });
  let connection;
  try {
  } catch (error) {}
});

const createIdea = async (req, res, next) => {
  if (req.params.id == "create") {
    let connection;
    try {
      connection = await pool.getConnection();
      const prepare = await connection.query(
        "INSERT INTO brilliant_minds.ideas(title, description) VALUES (?, ?)",
        ["remove", "test create and deletes"]
        // [req.body.title, req.body.description]
      );
      res.send(data);
    } catch (error) {
      throw error;
    } finally {
      if (connection) connection.end();
    }
  } else next();
};
app.get("/ideas/:id", cors(), createIdea, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    let prepare;
    if (req.params.id !== "all")
      prepare = await connection.execute(
        "SELECT * FROM brilliant_minds.ideas WHERE id = ?",
        [parseInt(req.params.id)]
      );
    else
      prepare = await connection.execute("SELECT * FROM brilliant_minds.ideas");
    console.log(prepare, req.params.id);
    res.send(prepare);
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.end();
  }
});

app.delete("/ideas/:id/delete", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(`DELETE FROM brilliant_minds.ideas WHERE id=?;`, [
      req.params.id,
    ]);
    res.send("idea deleted");
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.end();
  }
});

app.listen(PORT, () =>
  console.log(`Server started: http://localhost:${PORT}/`)
);

(async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    data = await connection.query(`SELECT * FROM brilliant_minds.ideas`);
    console.log(data);
  } catch (err) {
    console.log("no connction");
    throw err;
  } finally {
    if (connection) connection.end();
  }
})();
