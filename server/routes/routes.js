const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-monkeywit-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('image')

router.get('/', (req, res) => {
    res.send('Welcome to my image app')
})

router.post('/images/post', fileUpload,(req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send('server error')

        const type = req.file.mimetype
        const name = req.file.originalname
        const data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filename))

        conn.query('INSERT INTO image set ?', [{type, name, data}], (err, rows) => {
            if(err) return res.status(500).send('server error')

            res.send('image saved!')
        })
    })
    
})

module.exports = router