const redis = require('redis');
const client = redis.createClient();

client.on('connect', function () {
        console.log('Redis connected!');
});

client.connect();

client.zRange("accessCount", 0, 9, {REV: true}).then(
    result => { 
        console.log(`success: ${result}`); 
        process.exit(0);
    },
    reason => {
        console.log(`fail: ${reason}`);
        process.exit(0);
    }
);

