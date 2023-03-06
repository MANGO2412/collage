const express =require('express');
const session=require('express-session');
const fileUpload = require('express-fileupload');

const path = require("path");
const { send } = require('process');
const {queryPromise1}=require('./data/conectionDB.js');
const app=express();


app.use(fileUpload());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'/public')));
app.set("views",path.join(__dirname,'/views'));
app.set('view engine','ejs');

//my priciple routes
app.get("/",(req,res)=>{
    if(req.session.loggin)
      res.redirect('/home');
    else
     res.render('index',{title:"Inicio"});
    
})

app.get("/login",(req,res)=>{
    res.render('login',{title:"Iniciar sesion",mess:req.session.message})
})


app.get("/register",(req,res)=>{
    res.render('register',{title:"registrate"})
})

//start sesion
app.post('/auth',async (req,res)=>{
   let correo=req.body.correo;
   let password=req.body.password;
  if(correo && password){
    try {
        let sql =`select * from account where  correo="${correo}" AND  password="${password}"`;
        const result = await queryPromise1(sql);

        if(result.length > 0){
          req.session.loggin=true;
          req.session.email=result[0].correo;
          req.session.idAccount=result[0].id;
          res.redirect('/home');
        }else{
         req.session.message="your user and password aren't incorrect";
         res.redirect('/login');
        }  
    } catch (error) {
        console.log(error);
    }
  }
})


//start register an 
app.post('/reg',async (req,res)=>{
    let username=req.body.username;
    let correo=req.body.correo;
    let password=req.body.password;
    
    if(username && correo && password){
        try {
            let sql='insert into account(correo,password) values("'+correo+'","'+password+'")';
            const result=await queryPromise1(sql);
            try {
               sql=`insert into user(username,date_create,account) values("${username}",now(),${result.insertId})`;
               const user= await queryPromise1(sql);
               req.session.message="inicia sesion para usar la plataforma";
               res.redirect('/login');
            } catch (error) {
                 console.log(error);
            }
        } catch (error) {   
         console.log(error)
        }
    }
})

//user home
app.get('/home',async (req,res)=>{
      if(req.session.loggin){
        res.render('welcome',{title:"home"})
      }else{
         res.redirect('/');
      }
})


//about collections
app.get("/colect",async (req,res)=>{
    if(req.session.loggin){
        try {
            let sql="select * from  user where account="+req.session.idAccount;
            const result=await queryPromise1(sql);
    
            let sql2="select * from collections  where users="+result[0].id;
            const colec=await queryPromise1(sql2);

            console.log(result);
            console.log(colec);
           
            res.render("collections",{title:"collections",user:result[0],collection:colec})
         } catch (error) {
            console.log(error);
         }
         
    }else{
        res.redirect("/");
    }
})


//save my collection
app.get("/logout",(req,res)=>{
    if(req.session.loggin){
       req.session.destroy();
    }
    res.redirect('/home');
    res.end();
})
module.exports=app;

