config = {
    port: process.env.PORT || 3030,
    mongo:{
        URL: process.env.mongoURL || "mongodb://alaa:alaa123@cluster0-shard-00-00-yunyh.mongodb.net:27017,cluster0-shard-00-01-yunyh.mongodb.net:27017,cluster0-shard-00-02-yunyh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
    }
}

module.exports = config;