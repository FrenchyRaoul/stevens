const MongoClient = require('mongodb').MongoClient;


const config = { 
    "server_url": 'mongodb://localhost:27017',
    "database": 'nicholai_lesperance_lab7'
};

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(config.server_url,
            { useNewUrlParser: true }); 
        _db = await _connection.db(config.database);
    }   
    return _db;
};
