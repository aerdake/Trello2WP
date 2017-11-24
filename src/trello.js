import config from 'config';
import rp from 'request-promise';
// import { concat } from './C:/Users/Administrator/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/async';

// Read Configuration
const api_key = config.get('trello_api_key');
const api_token = config.get('trello_api_token');

export default class Trello{

    static async fetchCard(id){
        let options = {
            method: 'GET',
            uri: `https://api.trello.com/1/cards/${id}?key=${api_key}&token=${api_token}`,
            json: true
        };
        try {
            let body = await rp(options);
            return await body;
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }

    static async fetchAllCard(List){
        let options = {
            method: 'POST',
            uri: `https://api.trello.com/1/lists/${id}/cards?key=${api_key}&token=${api_token}`,
            json: true
        }
        try {
            let body = await rp(options);
            return await body;
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }
    static async fetchallcardevent(fields){
        // fetchallcard
        let cardlist = await this.fetchAllCard(listId);
    }

    static async parseHookEvent(fields){
        if(fields.action.type == 'createCard'){
            let cardId = fields.action.data.card.id;
            let card = await this.fetchCard(cardId);
            return await {
                'type': fields.action.type,
                'data': card,
                'author': fields.action.memberCreator.fullName,
                'dateTime':fields.action.date
            }
        }else if(fields.action.type == 'updateCard'){
            if(fields.action.data.old.closed==false){
                let cardId = fields.action.data.card.id;
                let card = await this.fetchCard(cardId);
                return await {
                    'type': fields.action.type,
                    'data': card
                }
               console.log('归档');
               return;
            }else {
                console.log('更新');
                let cardId = fields.action.data.card.id;
                let card = await this.fetchCard(cardId);
                return await {
                    'type': fields.action.type,
                    'data': card,
                    'dateTime':fields.action.date
                }     
            }
        }
        else if(fields.action.type == 'deleteCard'){
            console.log("删除card")
            let cardId = fields.action.data.card.id;
            // let card = await this.fetchCard(cardId);
            return await {
                'type': fields.action.type,
                'data': fields.action.data.card
            }
        } 
        else if(fields.action.type == 'addLabelToCard'){
            console.log("添加tag")
        } 
        else if(fields.action.type == 'removeLabelFromCard'){
            console.log("删除tag")
            return await null;
        }
        else if(fields.action.type == 'commentCard'){
            console.log(" 添加评论")
            return await null;
        }
        else if(fields.action.type == 'deleteComment'){
            console.log(" 删除评论")
            return await null;
        }
        
        else {
            return await null;
        }
    }
}