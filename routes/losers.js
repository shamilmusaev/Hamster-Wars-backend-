
const getDatabase = require("../database.js");
const db = getDatabase();
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {

    const matchesRef = db.collection("hamsters");
    const snapshot = await matchesRef.get();

    if (snapshot.empty) {
      res.send([]);
      return;
    }

    let items = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id; // id behövs för POST+PUT+DELETE
      items.push(data);
    });
    items.sort((a,b)=>(a.defeats < b.defeats) ? 1 : ((b.defeats < a.defeats) ? -1 : 0))
    res.send(items.slice(0, 5));
});

module.exports = router;