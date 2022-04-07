'use strict';
const ccxt = require('ccxt');
const Line = require('./module/line.js');
const myLine = new Line();
process.env.LINE_TOKEN ="amudw1KrdqYFxLw8kWSkNzQsciRbA9C7W0amgG6JRqZ";
const bitflyer = new ccxt.bitflyer();
const interbal = 10000;
myLine.setToken(process.env.LINE_TOKEN);
let getmarkets = require('./module/getmarkets.js');

getmarkets.get();

const stopTerm = (timer) => {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },timer);
    })
}

//初期資金
const first_coin = 5000;

//現在資産
let assets = 5000;

(async function() {
    while(true) { 
        const results = await Promise.all([
            bitflyer.fetchTicker ('BTC/JPY'),
            bitflyer.fetchTicker('ETH/BTC'),
            bitflyer.fetchTicker('ETH/JPY'),
        ])
        let askBest = 0
        let bidBest = 1000000000
        let askIndex;
        let bidIndex;
        results[0].name = 'BTC/JPY';
        results[1].name = 'ETH/BTC';
        results[2].name = 'ETH/JPY';
        console.log(`${results[0].name}の、${results[0].ask}`);
        /* console.log(`${results[0].name}の、${results[0].bid}`);
        console.log(`${results[0].name}の最終取引価格、${results[0].last}`);
         */
        console.log(`${results[1].name}は、${results[1].ask}`);
        console.log(`${results[2].name}は、${results[2].ask}`);
        console.log(assets);
        //日本円をビットコインに
        let bit = assets / results[0].last;
        console.log("資産をビットコインにすると.."+bit);
        //ビットコインをイーサリアムに
        let Eth = (1/results[1].last)*bit
        console.log("ビットコインをイーサリアムにすると.."+Eth);
        //イーサリアムを日本円に
        let Jpy = results[2].last*Eth;
        console.log("イーサリアムを日本円に"+Jpy);
        // myLine.notify(`${results[0].name}は、${results[0].ask}`);
        //console.log(results[0].info.ltp);
        if(assets * 1.0001 <= Jpy){ 
            assets = Jpy;
            //実際に処理を行う（売買処理）。
            //myLine.notify('この処理で、'+(Jpy-assets)+'円の利益が発生しました');
            myLine.notify('このプログラムにより得た利益は、'+(Jpy - first_coin)+'円です。');
        }

        const bitflyerTicker = results[0];
        await stopTerm(interbal);
    }
})();