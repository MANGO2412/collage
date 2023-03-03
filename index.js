const app=require('./src/app.js');
const port=3000;

app.listen(port,()=>{
    console.log("the server is runing on port "+port);
})