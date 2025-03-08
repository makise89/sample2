const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('ec.db');


//最初の処理

router.get('/',(req,res,next) => {
    if(req.session.username){
        db.serialize(() => {
            let data = '';
            db.each("select * from myec",(err,rows) => {
                if(!err){
                    data += `<div class = "main-div">
                    <img src = "/${rows.pass}" class = "item">
                    <p class = "product"><span>商品</span>：${rows.product}</p>
                    <p class = "price"><span>値段</span>：${rows.price}</p>
                    </div>`;
                }
            },(err,count) => {
                console.log(data);
                res.render('ec',{
                    content:data,
                });
            });
        });
    }else{
        res.redirect('/');
    }
    
});


//検索されたときの処理

router.get('/serch',(req,res) => {
    const keyword = req.query.keyword;
    const order = req.query.order;

    let spl = "select * from myec";
    let params = [];

    if(keyword){
        spl += " WHERE product LIKE ?";
        params.push(`%${keyword}%`);
    }

    if(order === "orderAsc"){
        spl += " ORDER BY 'order' Asc";
    }else if(order === "priceAsc"){
        spl += " ORDER BY price Asc";
    }

    db.serialize(() => {
        db.all(spl,params,(err,rows) => {
            if(err){
                res.render('ec',{
                    content:'',
                })
                return;
            }
        let data = rows.map(row =>  `<div class = "main-div">
                <img src = "/${row.pass}" class = "item">
                <p class = "product"><span>商品</span>：${row.product}</p>
                <p class = "price"><span>値段</span>：${row.price}</p>
                </div>`).join('');
        console.log(data);
        res.render('ec',{content:data});
        });
    });
});


module.exports = router;