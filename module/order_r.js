let request = require('request');
let crypto = require('crypto');
let now = require('./now_assets.js');
const config = require('../config/key.js');

let timestamp = Date.now().toString();
let method = 'POST';
let path = '/v1/me/sendchildorder';
/*
let body = JSON.stringify({
    product_code:'XLM_JPY',
    child_order_type:"MARKET",
    side:"SELL",
    size: ,
});

let text = timestamp + method + path + body;
//暗号化
let sign = crypto.createHmac('sha256', secret).update(text).digest('hex');

let options = {
    url: 'https://api.bitflyer.com' + path,
    method: method,
    body: body,
    headers: {
        'ACCESS-KEY': key,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-SIGN': sign,
        'Content-Type': 'application/json'
    }
}; */

//現在の資産を計算する関数
 exports.sell = function(product_code,side,size) { 
    let body = JSON.stringify({
        product_code:product_code,
        child_order_type:"MARKET",
        side:side,
        size: size,
    });
    let text = timestamp + method + path + body;
    //暗号化
    let sign = crypto.createHmac('sha256', config.secret).update(text).digest('hex');
    
    let options = {
        url: 'https://api.bitflyer.com' + path,
        method: method,
        body: body,
        headers: {
            'ACCESS-KEY': config.key ,
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-SIGN': sign,
            'Content-Type': 'application/json'
        }
    };

     return new Promise((resolve,reject) => { 
         request(options,(err,res,payload)=>{ 
             console.log(payload);
             resolve('ok');
         });
     })
} 

