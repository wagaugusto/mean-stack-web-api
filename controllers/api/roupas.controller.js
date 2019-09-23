var config = require('config.json');
var express = require('express');
var router = express.Router();
var roupaService = require('services/roupa.service');

// routes
router.post('/register', registerRoupa);
router.get('/:_id', getCurrentRoupa);
router.get('/all', getAllRoupa);
router.put('/:_id', updateRoupa);
router.delete('/:_id', deleteRoupa);

module.exports = router;

function registerRoupa(req, res) {
    roupaService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentRoupa(req, res) {
    roupaService.getById(req.params._id)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllRoupa(res) {
    roupaService.getAll()
        .then(function (roupas) {
            if (roupas) {
                res.send(roupas);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateRoupa(req, res) {
    roupaService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteRoupa(req, res) {
    roupaService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}