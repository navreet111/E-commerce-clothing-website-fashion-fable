
function first_image(){
   
    var first_image = document.getElementById("first_image");
   

    try_it.innerHTML="<img src=\'/images/women1.jpg'>"

}
function second_image(){
    
    var second_image = document.getElementById("second-image");
    
    try_it.innerHTML="<img src=\'/images/women2.jpg' width=\'100%\' height=\'500px\'>"
}
function third_image(){
    
    var second_image = document.getElementById("third-image");
    
    try_it.innerHTML="<img src=\'/images/women3.jpg'>"

}
function fourth_image(){

    
    var second_image = document.getElementById("fourth-image");
    

    try_it.innerHTML="<img src=\'/images/women4.jpg'>"

}

let currentIndex = 0;
const images = [
    "/images/women1.jpg",
    "/images/women2.jpg",
    "/images/women3.jpg",
    "/images/women4.jpg"
];

function changeImage(index) {
    currentIndex = index;
    updateMainImage();
}


function updateMainImage() {
    const mainImg = document.getElementById("MainImgs");
    mainImg.src = images[currentIndex];
}


function changeSlide(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = images.length - 1; 
    } else if (currentIndex >= images.length) {
        currentIndex = 0; 
    }
    updateMainImage();
}


setInterval(() => {
    changeSlide(1);
}, 10000); 


const sidebarLinks = document.querySelectorAll('.sidebar ul li a');

    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            
            sidebarLinks.forEach(item => item.classList.remove('active'));

          
            this.classList.add('active');
        });
    });



