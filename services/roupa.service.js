var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('roupas');

var service = {};

service.getById = getById;
service.getAll  = getAll;
service.create  = create;
service.update  = update;
service.delete  = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.roupas.findById(_id, function (err, roupa) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (roupa) {
            // return roupa
            deferred.resolve(roupa);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
        var deferred = Q.defer();
    
        db.roupas.find().sort( { _id: 1 }).toArray(function (err, roupas) {
            if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(roupas);
        }
        )

    return deferred.promise;
}

function create(roupaParam) {
    var deferred = Q.defer();

    // validation
    db.roupas.findOne(
        { _id: roupaParam._id },
        function (err, roupa) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (roupa) {
                // username already exists
                deferred.reject('Código "' + roupaParam._id + '" já foi cadastrado');
            } else {
                createRoupa();
            }
        });

    function createRoupa() {

        var roupa =roupaParam;

        db.roupas.insert(
            roupa,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, roupaParam) {
    var deferred = Q.defer();

    // validation
    db.roupas.findById(_id, function (err, roupa) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (roupa.codigo == roupaParam.codigo) {
            db.roupas.findOne(
                { _id: roupaParam._id },
                function (err, roupa) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (roupa) {
                        // username already exists
                        updateRoupa();
                    } else {
                        deferred.reject('Código "' + req.body.codigo + '" não foi cadastrado')
                    }
                });
        } else {
            deferred.reject('Código "' + req.body.codigo + '" não foi cadastrado')
        }
    });

    function updateRoupa() {
        // fields to update
        var set = {
            _id:         roupaParam._id,
            dataentrada:    roupaParam.dataentrada,
            tipo:           roupaParam.tipo,
            marca:          roupaParam.marca,
            carac:          roupaParam.carac,
            tamanho:        roupaParam.tamanho,
            cor:            roupaParam.cor,
            valoretiqueta:  roupaParam.valoretiqueta,
            valorcompra:    roupaParam.valorcompra,
            valormargem:    roupaParam.valormargem,
            precosugerido:  roupaParam.precosugerido,
        };

        db.roupas.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.roupas.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}