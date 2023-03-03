const mysql=require('mysql');
const {host,user,password,db}=require('./config.js')

const con=mysql.createPool({
    host:host,
    user:user,
    password:password,
    database:db     
});

const queryPromise1 =(sql)=>{
    return new Promise((resolve,reject)=>{
      con.query(sql,(error,results)=>{
        if(error){
            return reject(error);
        }
        return resolve(results);
      });
    })
}

module.exports={queryPromise1};
