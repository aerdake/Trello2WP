// import md from 'mongodb';
import config from 'config';
import  mongoose from 'mongoose';
import  events from 'events';

const db_conn_str = config.get('DB_CONN_STR');
const TestSchemacard = new mongoose.Schema({
    troCardId: { type:String },
    wpCardId: { type:String },
    trolistId: { type:String }
});
const TestSchemalist = new mongoose.Schema({
    troListId: { type:String },
    wpListId: { type:String }
});

export default class mongodb{
    static async addMdMsg(data){
        mongoose.Promise = global.Promise;
        let db = mongoose.connect(db_conn_str,{useMongoClient:true});
        console.log(TestSchemacard)
        let monModel = db.model("card", TestSchemacard);
        let monInsert = new monModel(data);
        console.log(monInsert);
        monInsert.save(function(err){
            if(err){
              console.log(err);
            }else{
              console.log('成功插入数据');
            }
            db.close();
        });
        return await 0;
    }
    static async selectFromtelloIdMsg(data,callback){
        mongoose.Promise = global.Promise;
        let db =mongoose.createConnection(db_conn_str);
        let monModel = db.model("card", TestSchemacard);
        monModel.find(data,function(err,result){
            if(err){
              console.log(err);
            }else{
              console.log(result);
              callback(result);
            }
            db.close();
          });
         
    }
    static async removeMsg(data){
        mongoose.Promise = global.Promise;
        let db =mongoose.createConnection(db_conn_str);
        let monModel = db.model("card", TestSchemacard);
        monModel.remove(data,function(err,result){
            if(err){
              console.log(err);
            }else{
              console.log(result);
            }
            db.close();
          });
         
    }
    static async updateAllMsg(data,callback){
        mongoose.Promise = global.Promise;
        console.log(data);
        let arrLsit=new Array();
        let db =mongoose.createConnection(db_conn_str);
        // let monModelCard = db.model("card", TestSchemacard);
        let monModelList = db.model("list", TestSchemalist);
        monModelList.find({},function(err,results){
            if(err){
              console.log(err);
            }else{
              console.log(results);
              callback(results);
            }
            db.close();
          }); 
    }

    static async handleDb(dbType,data,callback){
        if(dbType=="updateAll"){
            mongodb.updateAllMsg(data,function(r){
                callback(r)
            });
        }
        if(dbType=="addDb"){
            mongodb.addMdMsg(data);
        }else if(dbType=="selectDb"){
            mongodb.selectFromtelloIdMsg(data,function(c){
                callback(c)
            });
        }else if(dbType=="deleteDb"){
            mongodb.removeMsg(data);
        }else{
            db.close();
        }
    }
}
