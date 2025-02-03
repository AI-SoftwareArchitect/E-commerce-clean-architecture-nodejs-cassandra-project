const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1:9042', '127.0.0.1:9043'],
    localDataCenter: 'datacenter1',
    keyspace: 'mykeyspace'
});

client.connect()
    .then(() => console.log('✅ Connected to Cassandra'))
    .catch(err => {
        console.error('❌ Cassandra connection error:', err);
        process.exit(1);
    });

module.exports = client;
