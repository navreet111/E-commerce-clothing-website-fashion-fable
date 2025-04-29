// document.addEventListener("DOMContentLoaded", () => {
//     const cartItemsContainer = document.getElementById("cart-items");
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
//     function updateCart() {
//       cartItemsContainer.innerHTML = "";
//       let subtotal = 0;
  
//       cart.forEach((item, index) => {
//         const totalPrice = item.price * item.quantity;
//         subtotal += totalPrice;
  
//         const row = document.createElement("tr");
//         row.innerHTML = `
//           <td>
//             <div class="product-info">
//               <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;">
//               <span>${item.name}</span>
//             </div>
//           </td>
//           <td>₹${item.price}</td>
//           <td>
//             <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input" />
//           </td>
//           <td>₹${totalPrice}</td>
//           <td><button class="remove-btn" data-index="${index}">Remove</button></td>
//         `;
//         cartItemsContainer.appendChild(row);
//       });
  
//       // Update summary
//       document.querySelector(".summary-item span:last-child").textContent = `₹${subtotal}`;
//       document.querySelector(".summary-total span:last-child").textContent = `₹${subtotal}`;
//     }
  
//     // Handle quantity change
//     cartItemsContainer.addEventListener("input", (e) => {
//       if (e.target.classList.contains("quantity-input")) {
//         const index = e.target.getAttribute("data-index");
//         const newQuantity = parseInt(e.target.value);
//         if (newQuantity > 0) {
//           cart[index].quantity = newQuantity;
//           localStorage.setItem("cart", JSON.stringify(cart));
//           updateCart();
//         }
//       }
//     });
  
//     // Handle remove item
//     cartItemsContainer.addEventListener("click", (e) => {
//       if (e.target.classList.contains("remove-btn")) {
//         const index = e.target.getAttribute("data-index");
//         cart.splice(index, 1);
//         localStorage.setItem("cart", JSON.stringify(cart));
//         updateCart();
//       }
//     });
  
//     updateCart();
//   });
  

// document.addEventListener('DOMContentLoaded', () => {
//     // Check if user token or login flag exists in localStorage/sessionStorage
//     const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')

//     if (!token) {
//         // User not logged in, redirect to signup page
//         alert("Please sign up or login to proceed with your purchase.");
//         console.log("Redirecting to login page...");
// window.location.href ="/final website fashion 2 (2)/final website fashion 2/loginSignup/login.html";

//     }
// });

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if user token exists and parse role from the token
  const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')

  if (!token) {
      // User not logged in, redirect to signup page
      alert("Please sign up or login to proceed with your purchase.");
      window.location.href = "/final website fashion 2 (2)/final website fashion 2/loginSignup/login.html";
  }

  let userRole = '';
  try {
      const decodedToken = jwt.decode(token); // Assuming jwt.decode is available
      userRole = decodedToken.role; // This assumes the role is included in the token payload
  } catch (error) {
      console.error("Error decoding token:", error);
  }

  function updateCart() {
      cartItemsContainer.innerHTML = "";
      let subtotal = 0;

      cart.forEach((item, index) => {
          const totalPrice = item.price * item.quantity;
          subtotal += totalPrice;

          const row = document.createElement("tr");
          row.innerHTML = `
              <td>
                  <div class="product-info">
                      <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;">
                      <span>${item.name}</span>
                  </div>
              </td>
              <td>₹${item.price}</td>
              <td>
                  <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input" ${userRole !== 'buyer' ? 'disabled' : ''}/>
              </td>
              <td>₹${totalPrice}</td>
              <td>
                  ${userRole === 'buyer' ? `<button class="remove-btn" data-index="${index}">Remove</button>` : ''}
              </td>
          `;
          cartItemsContainer.appendChild(row);
      });

      // Update summary
      document.querySelector(".summary-item span:last-child").textContent = `₹${subtotal}`;
      document.querySelector(".summary-total span:last-child").textContent = `₹${subtotal}`;
  }

  // Handle quantity change (only for buyers)
  cartItemsContainer.addEventListener("input", (e) => {
      if (e.target.classList.contains("quantity-input") && userRole === 'buyer') {
          const index = e.target.getAttribute("data-index");
          const newQuantity = parseInt(e.target.value);
          if (newQuantity > 0) {
              cart[index].quantity = newQuantity;
              localStorage.setItem("cart", JSON.stringify(cart));
              updateCart();
          }
      }
  });

  // Handle remove item (only for buyers)
  cartItemsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn") && userRole === 'buyer') {
          const index = e.target.getAttribute("data-index");
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCart();
      }
  });

  updateCart();
});
