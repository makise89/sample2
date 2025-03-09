
//ロード項目

const express = require('express');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const ecRouter = require('./router/ec');


const app = express();




//設定項目

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'view'));




//グローバル変数

const users = [];




//ミドルウェア

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret:'your-select-key',
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60}
}));


app.use('/ec',ecRouter);


//スタイルシートの処理

app.get('/ecstyle',(req,res) => {
    res.sendFile(path.join(__dirname,"ecstyle.css"));
});


//画像の処理

app.get('/images',(req,res) => {
    res.sendFile(path.join(__dirname,"img","images.png"));
});

app.get('/item1',(req,res) => {
    res.sendFile(path.join(__dirname,"img","item1.jpg"));
});

app.get('/item2',(req,res) => {
    res.sendFile(path.join(__dirname,"img","item2.jpg"));
});

app.get('/item3',(req,res) => {
    res.sendFile(path.join(__dirname,"img","item3.jpg"));
});

app.get('/item4',(req,res) => {
    res.sendFile(path.join(__dirname,"img","item4.jpg"));
});

app.get('/item5',(req,res) => {
    res.sendFile(path.join(__dirname,"img","item5.jpg"));
});

app.get('/item6',(req,res) => {
    res.sendFile(path.join(__dirname,"img","item6.jpg"));
});

app.get('/item7',(req,res) => {
    res.sendFile(path.join(__dirname,"img","item7.jpg"));
});

app.get('/item8',(req,res) => {
    res.sendFile(path.join(__dirname,"img","item8.jpg"));
});




//フォームの表示

app.get('/form',(req,res) => {

    res.render('form',{
        title:'新規登録',
        error:'',
    });
});

//フォーム送信処理

app.post('/form',(req,res) => {
    const {username,email,password} = req.body;


//入力チェック

    if(!username || !email || !password){
        return res.render('form',{
            title:'新規登録',
            error:'すべての項目を入力してください',
        });
    }

    //メールアドレスの重複チェック

    const sameEmail = users.find(user => user.email === email);
    if(sameEmail){
        return res.render('form',{
            title:'新規登録',
            error:'このメールは既に使用されています'
        });
    }

    //パスワードハッシュ化

    const total = 10;
    const hashedPassword = bcrypt.hashSync(password,total);


    //ユーザー情報をデータベースに保存


    const newUser = {
        id:users.length+1,
        username:username,
        email:email,
        password:hashedPassword,
    };

    users.push(newUser);
    res.render('login',{
    title:'ログインページ',
    error:'',
});

});


//ログインの処理

app.get('/',(req,res) => {
    if(req.session.username){
        res.redirect('/ec');
     return 
    }
    res.render('login',{
        title:'ログイン',
        error:'',
    });
});


//送られてきたid,password処理

app.post('/login',(req,res) => {
    const {email,password} = req.body;


//入力されたメールアドレスの処理

console.log(users);

const user = users.find(u => String(u.email) === String(email));


//パスワードを合致確認処理


if(user && bcrypt.compareSync(String(password),String(user.password))){
    req.session.userId = user.id;
    req.session.username = user.username;
    res.redirect('/ec');
    
}else{
    res.render('login',{title:'ログイン',error:'メールアドレスまたはパスワードが間違っています'});
}
});









app.listen(3000);