'use strict';
const ccxt = require('ccxt');
const Line = require('./module/line.js');
const myLine = new Line();
process.env.LINE_TOKEN ="amudw1KrdqYFxLw8kWSkNzQsciRbA9C7W0amgG6JRqZ";
const bitflyer = new ccxt.bitflyer();
const interbal = 15000;
myLine.setToken(process.env.LINE_TOKEN);
let getmarkets = require('./module/getmarkets.js');
let get_asset = require('./module/now_assets.js');
let deadlings = require('./module/order_r.js');

getmarkets.get();

const stopTerm = (timer) => {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },timer);
    })
}

//初期資金
let first_coin = 5000;

 //現在資産
let assets = 5000;

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
        console.log("現在の円保有量は、"+asset_jpy);
        let asset_bit = await get_asset.get(1);
        console.log("現在のbit保有量は、"+asset_bit);
        let asset_eth = await get_asset.get(3);
        console.log("現在のETH保有量は、"+asset_eth);

        results[0].name = 'BTC/JPY';
        results[1].name = 'BTC/ETH';
        results[2].name = 'ETH/JPY';
        console.log(`${results[0].name}の、${results[0].last}`);
        console.log(`${results[1].name}は、${results[1].last}`);
        console.log(`${results[2].name}は、${results[2].last}`);
        console.log(asset_jpy);
        //日本円をビットコインに
        let bit = ((assets/ results[0].ask)).toFixed(8);
        //let bit = (assets/results[0].last).toFixed(8);
        console.log("資産をビットコインにすると.."+bit);
        //ビットコインをイーサリアムに
        //let Eth = ((1/results[1].ask)*(assets / results[0].ask)).toFixed(7);
        let Eth = ((1/results[1].ask)*bit).toFixed(7)
        //let Eth = ((1/results[1].last)*bit).toFixed(7);
        console.log("ビットコインをイーサリアムにすると.."+Eth);
        //イーサリアムを日本円に
        //let Jpy = results[2].bid* (1/results[1].ask)*(assets / results[0].ask);
        let Jpy = (results[2].bid *Eth).toFixed(7);
       // let Jpy = (results[2].bid*Eth).toFixed(7);
        console.log("イーサリアムを日本円に"+Jpy);
        // myLine.notify(`${results[0].name}は、${results[0].ask}`);
        //console.log(results[0].info.ltp);
        if(assets*1.01 <= Jpy){ 
            //bitコイン買うよ
            let bit_buy = (bit-(bit*0.0015)).toFixed(8);
            let bit_order = await deadlings.sell('BTC_JPY','BUY',bit_buy);
            asset_bit = await get_asset.get(1);
            let asbit = asset_bit*(1/results[1].ask);
            console.log(asbit);
            let eth_buy = (asbit-(asbit*0.0015)).toFixed(7);
            let eth_order = await deadlings.sell('ETH_BTC','BUY',eth_buy);
            asset_eth = await get_asset.get(3);
            let eth_s = (asset_eth-(asset_eth*0.0015)).toFixed(7);
            console.log(eth_s);
            let eth_sell = await deadlings.sell( 'ETH_JPY','SELL',eth_s);

            console.log(bit_order);
            console.log(eth_order);
            console.log(eth_sell);
            //myLine.notify('このプログラムにより得た利益は、'+(Jpy - first_coin)+'円です。');
            myLine.notify('現在の保有資産は、'+ asset_jpy +'円です.');
            myLine.notify('このプログラムにより得た利益は、'+(asset_jpy - assets)+'円です。')
        }
        const bitflyerTicker = results[0];
        await stopTerm(interbal);
    }
})();