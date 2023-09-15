import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://add-to-cart-5952f-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
let ipAddress = null; // Initialize ipAddress

// Function to fetch the IP address
function getIp() {
    return fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        ipAddress = data.ip;
        console.log('Your IP address is:', ipAddress);
    })
    .catch(error => {
        console.error(error);
        ipAddress = null; // Handle error by setting ipAddress to null
    });
}

// Function to sanitize IP address for Firebase path
function sanitizeIpAddress(ipAddress) {
    return ipAddress.replace(/\./g, '-');
}

// Call getIp to fetch the IP address
getIp().then(() => {
    // Now, ipAddress should be available, and you can create the Firebase reference
    if (ipAddress) {
        // Sanitize the IP address before using it in the path
        const sanitizedIp = sanitizeIpAddress(ipAddress);
        const itemsInDB = ref(database, `${sanitizedIp}/cart`);

        // Select your HTML elements
        const cartBtn = document.getElementById("cart");
        const itemInput = document.getElementById("items");
        const cartList = document.getElementById("cartList");

        cartBtn.addEventListener("click", function(){
            if(itemInput.value == '') {
                cartList.innerHTML = `<li class="px-4 py-2 bg-red-600/80 rounded-md shadow-md flex-grow">Please enter an item 😊</li>`;
            } else {
                push(itemsInDB, itemInput.value);
                clearInput();
                addToCart(itemInput.value);
            }
        });

        onValue(itemsInDB, function(snapshot) {
            if(snapshot.exists()) {
                let cartArray = Object.entries(snapshot.val());
                clearCart();
                for (let i = 0; i < cartArray.length; i++) {
                    let currentItem = cartArray[i];
                    addToCart(currentItem);
                }
            } else {
                cartList.innerHTML = `<li class="px-4 py-2 bg-red-600/80 rounded-md shadow-md flex-grow">No items here yet... 🫠</li>`;
            }
        });

        function clearInput() {
            itemInput.value = "";
        }

        function addToCart(item) {
            let itemId = item[0];
            let itemValue = item[1];
            let newItem = document.createElement('li');
            newItem.setAttribute("class", "px-4 py-2 bg-red-600/80 rounded-md shadow-md flex-grow text-center");
            newItem.textContent = itemValue;
            newItem.addEventListener('dblclick', () => {
                let location =  ref(database, `${sanitizedIp}/cart/${itemId}`);
                remove(location);
            });
            cartList.append(newItem);
        }

        function clearCart() {
            cartList.innerHTML = "";
        }
    } else {
        // Handle the case where ipAddress is null (an error occurred)
        console.error('Failed to retrieve IP address.');
    }
});
