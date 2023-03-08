//function to get data from json
const get=(url,apiKey=null)=>{
    if(apiKey != null){
        return fetch(url,{headers:{Authorization:apiKey}})
                .then(resp=>{
                    return resp.json()
                })
    }

    return fetch(url)
           .then(resp=>{
               return resp.json()
           })
}

//function to search all images
const search=(value,contener)=>{
       let reload=document.querySelector(".load");
       reload.classList.remove("hid");
       contener.classList.add("hid");

      contener.innerHTML="";
      let url="https://api.pexels.com/v1/search?query="+value+"&&per_page=30";
      get(url,'n9rsRPJxQg2ehBgJHHhY5MlE6hhm89LUYMX6wJOHe3vnAeQ8EiQJDiTl')
        .then(data=>{
            data["photos"].forEach(element => {
                contener.innerHTML+=`
                 <div>
                     <a href="/collections/${element.id}"><img  class="photo" width="200" height="200" src="${element.src.original}" alt="${element.alt}"/></a> 
                 </div>
                `;
              });
        })
        .catch(error =>{console.error("error: ",error)})
        .finally(()=>{
          reload.classList.add("hid");
          contener.classList.remove("hid");
        })
}

//function to get a image by id
const getById=(id,method)=>{
      let url='https://api.pexels.com/v1/photos/'+id;
      get(url,'n9rsRPJxQg2ehBgJHHhY5MlE6hhm89LUYMX6wJOHe3vnAeQ8EiQJDiTl')
        .then(data=>{method(data)})
}

//function to download image
async function downloadImg(imageSrc){
    const image = await fetch(imageSrc);
    const imageBlog=await image.blob();
    const imageURL=URL.createObjectURL(imageBlog);

    const link=document.createElement('a');
    link.href=imageURL;
    link.download="prueba";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


//function to save a image in my collection



export {get,search,getById,downloadImg};

