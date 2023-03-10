const express =require('express');
const session=require('express-session');
const bodyParser=require('body-parser')
//la api de pexels


const {createClient}=require('pexels');
const path = require("path");
const {queryPromise1}=require('./data/conectionDB.js');
const app=express();


//uso de la session
var sess = {
  secret: 'keyboard cat',
  resave:true,
  saveUninitialized:true,
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'/public')));
app.set("views",path.join(__dirname,'/views'));
app.set('view engine','ejs');

//my priciple routes
app.get("/login",(req,res)=>{
    res.render('login',{title:"Iniciar sesion",mess:req.session.message})
})


app.get("/register",(req,res)=>{
    res.render('register',{title:"registrate"})
})

//start sesion
app.post('/auth',async (req,res,next)=>{
   let correo=req.body.correo;
   let password=req.body.password;
  if(correo && password){
    try {
        let sql =`select * from account where  correo="${correo}" AND  password="${password}"`;
        const result = await queryPromise1(sql);

        if(result.length > 0){
          sql="select * from  user where account="+result[0].id;
          const user=await queryPromise1(sql);

          req.session.loggin=true;
          req.session.email=result[0].correo;
          req.session.idAccount=result[0].id;
          req.session.iduser=user[0].id;
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

app.get("/",(req,res)=>{
  if(req.session.loggin){
      res.redirect("/home");
  }else{
    res.render('index',{title:"Inicio"});
  }
 
})
//start register an 
app.post('/reg',async (req,res,next)=>{
    let username=req.body.username;
    let correo=req.body.correo;
    let password=req.body.password;
    
    if(username && correo && password){
       try {
        let sql='insert into account(correo,password) values("'+correo+'","'+password+'")';
        const result=await queryPromise1(sql); 
        let sql2=`insert user(username,date_create,account) values("${username}",now(),${result.insertId})`;
        const user=await queryPromise1(sql2);
        req.session.message="tu cuenta se registro con exito";
        res.redirect("/login");

       } catch (error) {console.log(error)}
    }
})

//user home
app.get('/home',(req,res)=>{
      if(req.session.loggin){
        res.render('welcome',{title:"home"})
      }else{
         res.redirect('/');
      }
})


//about collections
app.get("/collections",async (req,res)=>{
        try {
            let sql="select * from  user where account="+req.session.idAccount;
            const result=await queryPromise1(sql);
    
            let sql2="select * from collections  where users="+result[0].id;
            const colec=await queryPromise1(sql2);
            res.render("galery",{title:"collections",user:result[0],collection:colec})
         } catch (error) {
            console.log(error);
         }
})

//see image by id
app.get("/collections/:idImg",(req,res)=>{
      if(req.params.idImg){
        const  client=createClient('n9rsRPJxQg2ehBgJHHhY5MlE6hhm89LUYMX6wJOHe3vnAeQ8EiQJDiTl');
        client.photos.show({id:req.params.idImg})
                .then(photo=>{
                  res.render('collections',{title:"ver foto",img:photo,noti:req.session.mes})
                })
      }else{
        res.redirect("/home");
      }
})


app.get("/save/:img", async(req,res)=>{
     if(req.params.img){
       const  client=createClient('n9rsRPJxQg2ehBgJHHhY5MlE6hhm89LUYMX6wJOHe3vnAeQ8EiQJDiTl');
       const result= await client.photos.show({id:req.params.img});
       const allcollection=await queryPromise1(`select * from  collections where users=${req.session.iduser}`);
       let exist=false;

       for (const iterator of allcollection) {
           if(iterator["code_image"]==req.params.img){
              exist=true;
              break;
           }
       }
       if(!exist){
        try {
           let sql=`insert into collections(code_image,url,users) value("${result.id}","${result.src.original}",${req.session.iduser})`;
           const resultDB= await queryPromise1(sql);
           req.session.mes="la imagen se aguardo exitosamente";
           res.redirect(`/collections/${result.id}`);
        } catch (error) {console.log(error)}

       }else{
        req.session.mes="Esta imagen, ya esta aguardad";
        res.redirect(`/collections/${result.id}`);
       }
       
     }else{
      res.redirect("/home");
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

