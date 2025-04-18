/* Adjust the navbar on scroll */
window.onscroll = function() {
    var navbar = document.querySelector('nav');
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navbar.style.backgroundColor = 'rgba(51, 51, 51, 0.9)'; /* Change to solid background */
    } else {
        navbar.style.backgroundColor = 'transparent'; /* Transparent background */
    }
};

document.addEventListener("DOMContentLoaded", function () {
    /* Smooth Scroll */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    /* Back to Top Button */
    const backToTopButton = document.createElement('div');
    backToTopButton.innerHTML = '⬆';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.background = '#FFC107';
    backToTopButton.style.color = '#333';
    backToTopButton.style.padding = '10px';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.display = 'none'; // Initially hidden
    backToTopButton.style.zIndex = '1000';
    backToTopButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    /* Parallax Scroll Effect */
    const parallaxSection = document.querySelector('.parallax::before');
    window.addEventListener('scroll', function () {
        const scrollPos = window.scrollY;
        parallaxSection.style.backgroundPositionY = `${scrollPos * 0.5}px`; // Slow parallax effect
    });

    /* Animate Elements on Scroll */
    const scrollElements = document.querySelectorAll('.fade-in, .slide-up');

    const elementInView = (el, percentageScroll = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            ((window.innerHeight || document.documentElement.clientHeight) * percentageScroll)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 0.8)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    /* Show Collection Buttons on Hover */
    const collectionItems = document.querySelectorAll('.collection-item');
    collectionItems.forEach(item => {
        item.addEventListener('mouseover', function () {
            const button = this.querySelector('.shop-now-btn');
            button.style.opacity = '1';
        });

        item.addEventListener('mouseleave', function () {
            const button = this.querySelector('.shop-now-btn');
            button.style.opacity = '0';
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Set the date for the countdown (End of Diwali sale)
    const endDate = new Date("October 31, 2024 23:59:59").getTime(); // Set your Diwali sale end date here

    // Function to update the countdown
    function updateCountdown() {
        const now = new Date().getTime();
        const targetDate = new Date('2024-10-30T00:00:00').getTime();

        const timeRemaining = endDate - now;

        // Time calculations
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Update HTML
        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;

        // If the countdown is over, display a message
        if (timeRemaining < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "<h3>Sale has Ended!</h3>";
        }
    }

    // Update the countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
});
document.addEventListener("DOMContentLoaded", () => {
    const username = "navreetkaur"; // Example username
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", () => {
        const itemName = button.getAttribute("data-name");
        const itemPrice = button.getAttribute("data-price");
  
        // Prepare item data
        const item = { name: itemName, price: itemPrice };
  
        // Add item to the local cart
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
  
        // Send the item to the Express server to save in JSON data
        fetch(`/api/cart/${username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        })
        .then(response => response.json())
        .then(data => {
          alert(`${itemName} added to cart!`);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
    });
  });
  
