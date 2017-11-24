import _ from 'lodash';
import ipaddr from 'ipaddr.js';
import Router from 'koa-router';
const router = new Router();

import trello from './trello';
import wordpress from './wordpress';

import text from './text';

// Ref https://developers.trello.com/v1.0/page/webhooks#section-webhook-source
const ipaddrs = _.map([
    '::1', // DEBUG for ngrok
    '::ffff:127.0.0.1',
    '127.0.0.1',
    '107.23.104.115', 
    '107.23.149.70', 
    '54.152.166.250', 
    '54.164.77.56'], ip => {
    return ipaddr.process(ip);
});

// Webhook callback
router.head('/trellocallback', async ctx => {
    ctx.status = 200;
});

router.post('/trellocallback', async ctx => {
    // Check source IP Ref https://stackoverflow.com/a/30904383
    // https://github.com/whitequark/ipaddr.js
    if(_.find(ipaddrs, _.partial(_.isEqual, ipaddr.process(ctx.ip))) == undefined){
        ctx.status = 404;
        return;
    }
    let action = await trello.parseHookEvent(ctx.request.fields);
    //init all card
    // await wordpress.updateAllPost();
    if(action != null){
        if(action.type == 'createCard'){
            let listId = ctx.request.fields.action.data.list.id;
            await wordpress.createPost(action.data,listId);
            // await wordpress.findAllPost();
            // console.log(wordpress.findAllPost());
            // await text.text(action.data,listId);
        }
        if(action.type == 'updateCard'){
            await wordpress.updatePost(action.data);
           
        }
        if(action.type == 'deleteCard'){
            await wordpress.deleteCardPost(action.data);
           
        }
        if(action.type == 'addLabelToCard'){
            await wordpress.addLabelToCardPost(action.data);
        }
        if(action.type == 'removeLabelFromCard'){
            await wordpress.removeLabelFromCardPost(action.data);
        }
        ctx.status = 200;
    }

});

export default router;