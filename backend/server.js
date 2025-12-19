// Express server exposing CRUD endpoints for donations

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

/**
 * GET all donations
 */
app.get("/donations", (req, res) => {
  db.all("SELECT * FROM donations", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/**
 * CREATE a donation
 */
app.post("/donations", (req, res) => {
  const { donorName, donationType, amount, donationDate } = req.body;

  const query = `
    INSERT INTO donations (donorName, donationType, amount, donationDate)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [donorName, donationType, amount, donationDate], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ id: this.lastID });
  });
});

/**
 * UPDATE a donation
 */
app.put("/donations/:id", (req, res) => {
  const { donorName, donationType, amount, donationDate } = req.body;

  const query = `
    UPDATE donations
    SET donorName=?, donationType=?, amount=?, donationDate=?
    WHERE id=?
  `;

  db.run(
    query,
    [donorName, donationType, amount, donationDate, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

/**
 * DELETE a donation
 */
app.delete("/donations/:id", (req, res) => {
  db.run("DELETE FROM donations WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});