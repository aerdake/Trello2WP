import config from 'config';
import WPAPI from 'wpapi';

import {markdown} from 'markdown';
import mongodb from './mongodb';

import trello from './trello';
// Read Configuration
const endpoint = config.get('wp_endpoint');
const username = config.get('wp_username');
const password = config.get('wp_password');



const wp = new WPAPI({
    'endpoint': endpoint,
    'username': username,
    'password': password
});

// Authentication http://wp-api.org/node-wpapi/authentication/
// Download and install the WordPress plugin https://github.com/WP-API/Basic-Auth

export default class WordPress{
    static async updateAllPost(){
         try {
            mongodb.handleDb("updateAll",0,function(data){
                console.log(data);
                for(let da of data){
                    console.log(da.troListId);
                    // let action = await trello.fetchallcardevent(da.troListId);
                    console.log(action);       
                }
                // fetchAllCard(da.) 
            });
            let response = await wp.posts();
             console.log(response)
             return await response.id;
         } catch (error) {
             // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
             console.log(error);
             throw error;
         } 
     }
    static async createPost(data,listId){
        try {
            // console.log(data);
            let response = await wp.posts().create({
                title:data.name,
                author:data.author,
                date:data.dateTime,
                // categories:'',
                status: 'publish'
            });
            // console.log(data);
            let dbDatas={"troCardId":data.id,"wpCardId":response.id,"trolistId":listId};
            mongodb.handleDb("addDb",dbDatas);
            return await response.id;
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        } 
    }
    static async updatePost(data){
        try {
        let dbDatas={"troCardId":data.id};
        let fileContent;
        if(!data.closed||data.closed==false){
            mongodb.handleDb("selectDb",dbDatas,function(dates){
                if(!dates[0].wpCardId){
                    return;
                }
                if(data.desc){
                    console.log(data.desc)
                    fileContent = markdown.toHTML(data.desc);
                    console.log('Done!');    
                }
                console.log(dates[0].wpCardId)
                let response =wp.posts().id(dates[0].wpCardId).update({
                            title: data.name, 
                            content:fileContent,
                            excerpt:fileContent,
                            date:data.dateTime,
                            status: 'publish'
                        });
                    });
        }else{
            mongodb.handleDb("selectDb",dbDatas,function(dates){
                if(!dates[0].wpCardId){
                    return;
                }
                if(data.desc){
                    console.log(data.wpCardId)
                    fileContent = markdown.toHTML(data.desc);
                    console.log('Done!');    
                }
                console.log(dates[0].wpCardId);
                let response =wp.posts().id(dates[0].wpCardId).delete();
            });
        }
            // return await response.id;
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        }     

    }

    static async deleteCardPost(data){
        try {
            let dbDatas={"troCardId":data.id};
            mongodb.handleDb("selectDb",dbDatas,function(dates){
            let response =wp.posts().id(dates[0].wpId).delete();
            mongodb.handleDb("deleteDb",dbDatas);
            console.log(response)
        });
            // return await response.id;
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        } 
    }
    static async addLabelToCardPost(data){
        console.log(data);
        // try {
        // let dbDatas={"troCardId":data.id};
        // mongodb.handleDb("selectDb",dbDatas,function(dates){
        //     let response =wp.posts().id(dates[0].wpId).update({
        //                 // tags:data
        //                 status: 'publish'
        //             });
        //         });
        //             // return await response.id;
        //         } catch (error) {
        //             // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
        //             console.log(error);
        //             throw error;
        //         }     

    }
}