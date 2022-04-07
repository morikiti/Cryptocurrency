let request = require('request');
let crypto = require('crypto');
const config = require('../config/key.js');
const { copyFileSync } = require('fs');
const { resolve } = require('path');

let timestamp = Date.now().toString();
let method = 'GET';
let path = '/v1/me/getbalance';

let text = timestamp + method + path;
//暗号化
let sign = crypto.createHmac('sha256', config.secret).update(text).digest('hex');

let options = { 
    url: 'https://api.bitflyer.com' + path,
    method: method,
    headers: { 
        'ACCESS-KEY': config.key,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-SIGN': sign,
        'Content-Type': 'application/json'
    }
};
//現在の資産を計算する関数
 exports.get = function(number) { 
     return new Promise((resolve,reject) => { 
         request(options,(err,res,body)=>{ 
             let payload = JSON.parse(body);
             resolve(payload[number].available);
         });
     })
} 

