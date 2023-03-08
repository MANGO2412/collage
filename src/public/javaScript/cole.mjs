import {get,search,downloadImg} from './function.mjs';
const down=document.querySelector(".downl"),
      imgData=document.querySelector(".picture");


 //event to download     
down.addEventListener("click",()=>{
      downloadImg(imgData.src);
})