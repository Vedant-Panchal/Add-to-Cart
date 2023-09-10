import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://add-to-cart-5952f-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsInDB = ref(database, "cart")
const cartBtn = document.getElementById("cart");
const itemInput = document.getElementById("items");
const cartList = document.getElementById("cartList");

cartBtn.addEventListener("click", function(){
    if(itemInput.value == '')
    {
        cartList.innerHTML = `<li class="px-4 py-2 bg-red-600/80 rounded-md shadow-md flex-grow">Please enter an item 😊</li>`;
    }
    else{
        push(itemsInDB,itemInput.value);
        clearInput();
        addToCart(itemInput.value);
    }
})

onValue(itemsInDB, function(snapshot) {
    if(snapshot.exists())
    {

        let cartArray = Object.entries(snapshot.val());
        clearCart();
        for (let i = 0; i < cartArray.length; i++) {
            let currentItem = cartArray[i];
            addToCart(currentItem);
        }
    }
    else{
        cartList.innerHTML = `<li class="px-4 py-2 bg-red-600/80 rounded-md shadow-md flex-grow">No items here yet... 🫠</li>`
    }
    })
    
function clearInput()
{
    itemInput.value = "";
}

function addToCart(item)
{
    let itemId = item[0];
    let itemValue = item[1];
    let newItem = document.createElement('li');
    newItem.setAttribute("class","px-4 py-2 bg-red-600/80 rounded-md shadow-md flex-grow");
    newItem.textContent = itemValue;
    newItem.addEventListener('dblclick',()=>{
        let location =  ref(database,`cart/${itemId}`);
        remove(location);
    })
    cartList.append(newItem);
}
function clearCart() {
    cartList.innerHTML = ""
}