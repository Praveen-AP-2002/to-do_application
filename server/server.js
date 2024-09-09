const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const pool = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT ?? 8000;

app.use(cors());
app.use(express.json());

// get all todo tasks
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const todos = await pool.query("SELECT * FROM todos WHERE user_email = $1", [userEmail]);
    res.json(todos.rows);
  } catch (err) {
    console.error(err);
  }
});

// create a new todo
app.post("/todos", async (req, res) => {
  const { user_email, title, description, progress, date } = req.body;
  const id = uuidv4();
  try {
    const newTodo = await pool.query(
      `INSERT INTO todos (id, user_email, title, description, progress, date) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, user_email, title, description, progress, date]
    );
    res.json(newTodo);
  } catch (err) {
    console.error(err);
  }
});

// edit todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, description, progress, date } = req.body;
  try {
    const editTodo = await pool.query(
      `UPDATE todos SET user_email = $1, title = $2, description = $3, progress = $4, date = $5 WHERE id = $6;`,
      [user_email, title, description, progress, date, id]
    );
    res.json(editTodo);
  } catch (err) {
    console.error(err);
  }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json(deleteTodo);
  } catch (err) {
    console.error(err);
  }
});

// signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  
  try {
    const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES ($1, $2)`, [email, hashedPassword]);
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
    res.json({ email, token });
  } catch (err) {
    console.error(err);
    res.json({ details: err.detail }); // Return detailed error if signup fails
  }
});

// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    
    if (!users.rows.length) {
      return res.json({ detail: 'User does not exist!' });
    }

    const success = await bcrypt.compare(password, users.rows[0].hashed_password); // Fix user.row[0] to users.rows[0]
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

    if (success) {
      res.json({ email: users.rows[0].email, token });
    } else {
      res.json({ detail: 'Login Failed!' });
    }
    
  } catch (err) {
    console.error(err);
    res.json({ detail: 'Error during login' });
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
