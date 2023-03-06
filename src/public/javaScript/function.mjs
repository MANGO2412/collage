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
const search=(value,contener,method)=>{
      contener.innerHTML="";
      let url="https://api.pexels.com/v1/search?query="+value;
      get(url,'n9rsRPJxQg2ehBgJHHhY5MlE6hhm89LUYMX6wJOHe3vnAeQ8EiQJDiTl')
        .then(data=>{
            data["photos"].forEach(element => {
                contener.innerHTML+=`
                 <div>
                    <img id="${element.id}" class="photo" width="200" height="200" src="${element.src.original}" alt="${element.alt}"/>
                 </div>
                `;
              });
              method();   
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
async function saveCollection(data){
      const resonse= await fetch(window.location.href.replace('/home','/save_collections'),{
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      });

      let result=await resonse.text();
      console.log(result)
}



export {get,search,getById,downloadImg,saveCollection};

