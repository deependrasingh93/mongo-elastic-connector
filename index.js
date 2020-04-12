const MongoClient = require('mongodb').MongoClient;

const { Client } = require('@elastic/elasticsearch')



class Sync
{

    db;
    ESclient;
    mongoURL; 
    mongoDBName;
    elasticURL;
    elasticUsername;
    elasticPassword;

    initElastic() {
        return new Promise((resolve, reject)=>{
            const client = new Client({

                cloud: {
                  id: this.elasticURL,
                },
                auth: {
                  username: this.elasticUsername,
                  password: this.elasticPassword
                }
              })
              
            client.ping({}, function (error) {
                if (error) {
                    throw {
                        message : 'elasticsearch cluster is down! OR Wrong Elastic Credentials',
                        error
                    }
    
                } else {
                    console.log('Elastic si ready!!');
                    resolve (client);
                }
                })
        })
    }

    initMongo(){
        return new Promise((resolve, reject)=>{
            MongoClient.connect(this.mongoURL ,{useUnifiedTopology:true}, (error, client) => {
                if(error){
                    throw {
                        message : 'mongoDB connection failure',
                        error
                    }
                }else{
                    console.log("Connected successfully to server");
               
                    const db = client.db(this.mongoDBName);
                    resolve(db);
                }
              });
        })
    }

    startWatcher(){
        this.db.watch({fullDocument:'updateLookup'}).on('change', (data)=>{
            console.log(data);
            let index = data.ns.coll.toLowerCase()
            console.log(index);
            
            let body = data.fullDocument
            let id = body._id
            delete body._id
            console.log(body);
            this.saveDataToElastic(id, index, body)
        })
    }

    async startSync(){
        await this.initElastic().then(client=>{
            this.ESclient = client
            this.initMongo().then(db=>{
                this.db = db
                this.startWatcher()
            })
        })
        
        
        console.log('starting atch');
        
        // this.startWatcher()
    }


    async saveDataToElastic(id, index, body){
      
        await this.ESclient.index({
            index,
            id,
            body
        }).then(d=>{
            console.log(d.body);
            
        }).catch(e=>{
            console.log(e.body);
            
        })
    }




    constructor(mongoURL, mongoDBName, elasticURL, elasticUsername, elasticPassword){

        this.mongoURL = mongoURL; 
        this.mongoDBName = mongoDBName;
        this.elasticURL = elasticURL;
        this.elasticUsername = elasticUsername;
        this.elasticPassword = elasticPassword;

        // this.initElastic(elasticURL, elasticUsername, elasticPassword)
        
        // this.db = this.initMongo(mongoURL, mongoDBName)
    }
}

module.exports = {
    Sync
}