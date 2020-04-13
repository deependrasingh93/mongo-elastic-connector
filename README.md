# mongo-elastic-connector

[![GitHub issues](https://img.shields.io/github/issues/deependrasingh93/mongo-elastic-connector)](https://github.com/deependrasingh93/mongo-elastic-connector/issues) [![GitHub license](https://img.shields.io/github/license/deependrasingh93/mongo-elastic-connector)](https://github.com/deependrasingh93/mongo-elastic-connector/blob/master/LICENSE) [![GitHub license](https://img.shields.io/badge/npm-v1.0.0-informational)](https://github.com/deependrasingh93/mongo-elastic-connector/blob/master/LICENSE)




A package to dump mongo data in elasticsearch and also sync real time updates between the 2 databases


## Install 

`npm i mongo-elastic-connector`

## How to Use

`mongo-elastic-connector` takes 5 parameters, `mongoURL`, `Mongo Database Name`, `Elasticsearch connect URL`, `Elasticsearch Username`, `Elasticsearch Password`.

`mongo-elastic-connector` uses `mongo-streams` to listen for changes in DB and pipes them to Elasticsearch shard. The index used in Elasticsearch is of the same name as the collection name in MongoDB. The `id` in Elasticsearch is the same as `objectID` in MongoDB. 

## Example

```javascript
const {Sync} = require('mongo-elastic-connector')

const syncObject = new Sync('mongoURl', 'MongoDBName', 'elasticConnectURL', 'elasticUsername', 'elasticPassword')

syncObject.startSync()
```

This will start real time syncing of MongoDB with Elascticsearch.

