'use strict';
const ccxt = require('ccxt');
const Line = require('./module/line.js');
const myLine = new Line();
process.env.LINE_TOKEN ="amudw1KrdqYFxLw8kWSkNzQsciRbA9C7W0amgG6JRqZ";
const bitflyer = new ccxt.bitflyer();
const interbal = 30000;
myLine.setToken(process.env.LINE_TOKEN);
let getmarkets = require('./module/getmarkets.js');
let get_asset = require('./module/now_assets.js');
let deadlings = require('./module/order_r.js');


const stopTerm = (timer) => {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },timer);
    })
}

//初期資金
let first_coin = 5000;

/* //現在資産
let assets = 5000; */

(async function() {
    while(true) { 
        const results = await Promise.all([
            bitflyer.fetchTicker ('BTC/JPY'),
            bitflyer.fetchTicker('ETH/BTC'),
            bitflyer.fetchTicker('ETH/JPY'),
        ])
        //現在資産
        let asset_now = await get_asset.get(9);
        console.log("現在のBat保有量は、"+asset_now);
        let asset_xlm = await get_asset.get(10);
        console.log("現在のXLM保有量は、"+asset_xlm);
        let asset_jpy = await get_asset.get(0);
        console.log("現在の円保有量は、"+asset_jpy.toFixed(7));
        let asset_bit = await get_asset.get(1);
        console.log("現在のbit保有量は、"+asset_bit);
        let asset_eth = await get_asset.get(3);
        console.log("現在のETH保有量は、"+asset_eth.toFixed(7));

        let a = 0.23054893758970;
        let b = (a-(0.0015*a)).toFixed(7);
        console.log(b);
            let bit_order = await deadlings.sell('XLM_JPY','BUY',b);
            myLine.notify(bit_order);
        const bitflyerTicker = results[0];
        await stopTerm(interbal);
    }
})();