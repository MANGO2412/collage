import {get,getById,search,downloadImg, saveCollection} from './function.mjs';

//that setences is validated, all inputs are correct and searchimg for a topic
let btn=document.getElementById("btn");

btn.addEventListener("click",(e)=>{
    let topic= document.getElementById("look");
    let media= document.querySelector(".media");
    e.preventDefault();

    if(topic.value!=="" && topic.value!== " " ){
        search(topic.value,media,()=>{
            let photos= document.querySelectorAll(".photo")
            for(let i=0;i<photos.length;i++){
               photos[i].addEventListener("click",()=>{
                    getById(photos[i].id,(data)=>{
                         let idimg=photos[i].id;
                        

                         //renderizar el formulario
                         document.querySelector(".showImage").style.background=data.avg_color;
                         document.getElementById("title").innerText=data.alt;
                         document.getElementById("user").innerText="creado por "+data.photographer;

                         //renderizar las imagenes
                         document.querySelector(".picture").src="img/cargando-loading-041.gif";
                         let img;
                          fetch(data.src.original)
                           .then((response)=>response.blob())
                           .then((data)=>{
                              img=URL.createObjectURL(data);
                           })
                           .catch(error =>{console.error("error: ",error)})
                           .finally(()=>{
                            document.querySelector(".picture").src=img;
                           })

                         document.querySelector(".showImage").classList.remove("hid"); 

                         //function to download img
                         document.querySelector(".downl").addEventListener("click",()=>{
                               downloadImg(document.querySelector(".picture").src);
                         })


                         //save a imagen
                        document.querySelector(".save").addEventListener("click",async ()=>{
                            let formData=new FormData();
                            formData.append("iduser",document.getElementById("iduser").textContent);
                            formData.append("image",document.querySelector(".picture").src);
                            let response= await fetch('/edit',{
                              method:'POST',
                              body:formData
                            })
                        })


                         
                    })//fin del evento obtener por id         
               })//fin del primer evento en la linea 15
            }//fin del for que inicia en la linea 14
        });
    }else{
        alert("there isn't any query in the search input")
    }
  
})



document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".showImage").classList.add("hid");
})
