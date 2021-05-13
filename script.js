let currentPage = 0;
let loadingImg = false;
let refreshPage = false;
let main = document.querySelector('main');

document.querySelector('button').addEventListener('click', async () => {
    let images = await getImg(); 
    if(refreshPage === false){ 
        updateUserInterface(images);
        refreshPage = true;
    }
    else if(refreshPage === true){
        while(main.firstChild){
            main.removeChild(main.lastChild)
        }
        updateUserInterface(images);
        refreshPage = false;
    }
    });


 



async function getImg(){
    const apiKey = 'bb389f85a2b1ecabdffbc6c79aeccabd';
    let method = 'flickr.photos.search';
    let text = document.querySelector('input#text').value;
    const baseUrl = 'https://api.flickr.com/services/rest';

    let url =`${baseUrl}?api_key=${apiKey}&method=${method}&text=${text}&page=${currentPage}&format=json&nojsoncallback=1`;

    try{
        let resp = await fetch(url);
        let data = await resp.json();
        return await data;
    }
    catch(err){
        console.error(err);
    }

    
}
function imgUrl(img, size){

    let imgSize = 'z';
    if(size == 'thumb'){imgSize = 'q'}
    
    if(size == 'large'){imgSize='b'}

    let url = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_${imgSize}.jpg`;

    return url;
}

function updateUserInterface(data){

    loadingImg = false;

    data.photos.photo.forEach(img => {

        if(img.farm !== 0){

            let el = document.createElement('img');
            el.setAttribute('src', imgUrl(img, 'thumb'));
            el.setAttribute('alt', img.title);

            el.addEventListener('click', () => {
                handleLightbox(img.title, imgUrl(img, 'large'));
            })

            main.appendChild(el);
        }
       

    });
}
function handleLightbox(title, url){
    document.querySelector('#overlay').classList.toggle('show');
    let el = document.querySelector('#overlay img');
    el.setAttribute('src', url);
    el.setAttribute('alt', title);

    document.querySelector('#overlay figcaption').innerHTML = title;


}

document.querySelector('#overlay').addEventListener('click', () => { 
    document.querySelector('#overlay').classList.toggle('show');
})

let lastKnownScrollPosition = 0;
let ticking = false;
function onscroll(){

}
document.addEventListener('scroll', function(e)
{
    lastKnownScrollPosition = window.scrollY;
    if(!ticking && window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight){
            window.requestAnimationFrame(function() {
                onscroll(lastKnownScrollPosition);
                console.log("position: " + lastKnownScrollPosition);
                currentPage++;
                nextPage();
                ticking= false;
            });
            ticking = true;
        }
})



async function nextPage(){
    let images = await getImg();
    updateUserInterface(images);
}

