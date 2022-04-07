let express = require('express');
let app = express();
let request = require('request');

let path = "/v1/getticker";
let query = '?product_code=XLM_JPY';
let timestamp = Date.now().toString();


const options = {
    url:'https://api.bitflyer.com'+path+query,
    method:"GET",
    headers:{
        'ACCESS-TIMESTAMP': timestamp
    }
};

exports.get = function(){ 
    request(options,(req,res,body) => { 
        let market = JSON.parse(body);
        console.log(market.ltp);
    });
}