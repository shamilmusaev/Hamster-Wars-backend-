const getDatabase = require("../database.js");
const db = getDatabase();
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    console.log("/Matches Rest Api");

    const matchesRef = db.collection("matches");
    const snapshot = await matchesRef.get();

    if (snapshot.empty) {
      res.send([]);
      return;
    }

    let matches = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id; // id behövs för POST+PUT+DELETE
      matches.push(data);
    });
    res.send(matches);
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const matchesRef = await db.collection("matches").doc(id).get();

    if (!matchesRef.exists) {
      res.status(404).send("Match does not exist");
      return;
    }

    const data = matchesRef.data();
    data.id = matchesRef.id
    return res.status(200).send(data);
});

router.post("/", async (req, res) => {
    const object = req.body;
    const docRef = await db.collection("matches").add(object);
    return res.status(200).send({ id: docRef.id });
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    if (!id) {
      res.sendStatus(400);
      return;
    }
    const matchesRef = await db.collection("matches").doc(id).get();

    if (!matchesRef.exists) {
      res.status(404).send("Match does not exist");
      return;
    }
    const deleted = await db
      .collection("matches")
      .doc(id)
      .delete()
      .then((results) => {
        console.log(results);
        console.log("Document successfully deleted!");
        return res.status(200).send();
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
        return res.status(500).send(error);
      });
});

module.exports = router;