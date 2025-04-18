
let currentIndex = 0;
const images = [
    "/kids/kid1.jpg",
    "/kids/kid2.jpg",
    "/kids/kid3.jpg",
    "/kids/kid4.jpg",
    
];


function changeImage(index) {
    currentIndex = index;
    updateMainImage();
}


function updateMainImage() {
    const mainImg = document.getElementById("MainImg");
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
      




      



