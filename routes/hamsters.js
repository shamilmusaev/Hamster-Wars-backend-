const getDatabase = require('../database.js')
const db = getDatabase()
const express = require('express')
const router = express.Router()


//REST API

//GET /hamsters
router.get('/', async (req, res) => {
    console.log('/hamsters get hamsters')
  
    let items = [];
    try {
        const hamstersRef = db.collection('Hamsters');
        const sn = await hamstersRef.get();

        if (sn.empty) {
            res.status(404).send('error 404')
            return
        };
        sn.forEach(doc => {
            const data = doc.data()
            data.id = doc.id
            items.push(data)
        })
        res.send(items)
    }

    catch (error) {
        console.log('oops! An error occured' + error.message);
        res.status(500).send(error.message);
    }
});

// GET /hamsters/random

router.get('/random', async (req, res) => {
    const hamstersRef = db.collection('Hamsters')
    const sn = await hamstersRef.get();

    if (sn.empty) {
        res.status(404)
        return
    }

    let hamsters = []

    sn.forEach(doc => {
        const hamster = doc.data()
        hamster.id = doc.id
        hamsters.push(hamster)

    })

    const randomHamster = Math.floor(Math.random() * hamsters.length)
    res.status(200).send(hamsters[randomHamster])

})


// GET /hamsters/:id


router.get('/:id', async (req, res) => {
    const id = req.params.id
    const doc = await db.collection('Hamsters').doc(id).get()

    if (!doc.exists) {
        res.status(404).send('404')
        return
    }

    const data = doc.data()
    res.send(data)
})

// POST /hamsters

router.post('/', async (req, res) => {

    const hamster = req.body

    if (!isHamsterObject(hamster)) {
        res.status(400).send("Bad request")
        return
    }

    const doc = await db.collection('Hamsters').add(hamster)
    console.log('The document id is: ' + doc.id)

    res.status(200).send({ id: doc.id })


})



//PUT /hamstesrs/:id
router.put('/:id', async (req, res) => {

    const object = req.body
    const id = req.params.id
    const doc = await db.collection('Hamsters').doc(id).get()
    if (!id || !doc.exists) {
        res.status(404).send("404 hittar inte rätt id")
        return
    }
    else if (Object.keys(object).length === 0) {
        res.status(400).send("fel 400")
        return
    }
    await db.collection('Hamsters').doc(id).set(object, { merge: true })

    res.sendStatus(200)
})

function isHamsterObject(obj) {

	if (!obj)
		return false
	else if (!obj.name || !obj.age)
		return false

	return true
};



//DELETE /hamstesrs/:id


router.delete('/:id', async (req, res) => {

    const id = req.params.id
    const dr = db.collection('Hamsters').doc(id)
    const doc = await dr.get();

    if (!doc.exists) {
        res.status(404).send("404 hittar inte rätt id")
        return
    }

    else if (!id) {
        res.status(400).send("fel 400")
        return
    }

    await dr.delete()
    res.sendStatus(200)

})

module.exports = router

