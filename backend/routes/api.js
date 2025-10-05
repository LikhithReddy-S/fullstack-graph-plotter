const express = require('express');
const router = express.Router();
const {
    evaluateFunction,
    saveFunction,
    listFunctions,
    deleteFunction,
} = require('../controllers/functionController');

router.post('/eval', evaluateFunction);
router.post('/save', saveFunction);
router.get('/list', listFunctions);
router.delete('/delete/:id', deleteFunction);

module.exports = router;