import {get,getById,search,downloadImg} from './function.mjs';

//that setences is validated, all inputs are correct and searchimg for a topic
let btn=document.getElementById("btn");

btn.addEventListener("click",(e)=>{
    let topic= document.getElementById("look");
    let media= document.querySelector(".media");
    e.preventDefault();

    if(topic.value!=="" && topic.value!== " " ){
        search(topic.value,media);
    }else{
        alert("there isn't any query in the search input")
    }
  
})



document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".showImage").classList.add("hid");
})
