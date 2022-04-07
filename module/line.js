const axios = require('axios');
const querystring = require('querystring');

const Line = function () {};

// prototype を書くことによりメソッドの追加が可能。
Line.prototype.setToken = function(token) {
  this.token = token;
};


Line.prototype.notify = function(text) {
  if(this.token == undefined || this.token == null){
    console.error('undefined token.');
    return;
  }
  console.log(`notify message : ${text}`);
  axios(
    {
      method: 'post',
      url: 'https://notify-api.line.me/api/notify',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        message: text,
      }),
    }
  )
  .then((res) => {
    console.log(res.data);
  })
  .catch( (err) => {
    console.error(err);
  });
}; 

module.exports = Line;