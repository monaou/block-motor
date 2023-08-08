const express = require('express'); //expressの読み込み
const app = express(); //expressを使用するための準備

//localhost:3000でアクセス可能なサーバーを起動
app.listen(3000);
console.log("test")
app.get('/top', () => { //URL「/top」にアクセスしたとき
    //トップ画面を表示
});
