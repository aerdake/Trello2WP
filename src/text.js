import mongodb from './mongodb';

export default class text{
    static async text(data,listId){
        let response=1
            let dbDatas={"trelloID":data.id,"wpId":1,"listId":listId};
            console.log(dbDatas)
            mongodb.handleDb("addDb",dbDatas);
         return await response;
    }
}