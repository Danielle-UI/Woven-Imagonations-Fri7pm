//Danielle Simpson - 2306918
//Rodane Baugh 2205798
//Ashleigh Allwood 1401887
//Web Programming: CIT2011
//Friday @7pm

//------------------------------
//Question 1 (a) Registration Page Validation
//------------------------------

if(document.body.id === 'registerPage'){

    document.getElementById('slogin').addEventListener('click', () =>{
        window.location.href = 'index.html';
        })
    signup = document.getElementById('signup_submit')

        signup.addEventListener('click', () =>{
            const signup_trn = document.getElementById('trn').value.trim()
            const signup_pwd = document.getElementById('signuppassword').value.trim()
            const fname = document.getElementById('fname').value.trim()
            const lname =  document.getElementById('lname').value.trim()
            const selectgender = document.getElementById('gender');
            const gender = selectgender.value;
            const email = document.getElementById('email').value.trim()
            const dob = document.getElementById('dob').value.trim()
            const confirmpwd = document.getElementById('confirmpassword').value.trim()
            const pnum = document.getElementById('phoneNum').value.trim()

            //Required Fields validation
            if (!signup_trn || !pnum || !signup_pwd || !gender || !fname || !lname || !email || !dob || !confirmpwd) {
            alert("Please fill out all required fields.");
            return;
            }

            //Phone Number Validation
            if (!/^\d{7,15}$/.test(pnum)) {
                alert("Phone number must be 7-15 digits.");
                return;
            }
            
            //Password Validation
            const pwdpattern = /^\S{8,}$/;
            if (!pwdpattern.test(signup_pwd)) {
                alert("Password must be at least 8 characters long with no spaces.");
                return;
            }
            if(signup_pwd!==confirmpwd){
                alert('Passwords do not match');
                return;
            }

            //Name Validation
            const lettersonly = /^[A-Za-z\s]+$/
            if (!lettersonly.test(fname) || !lettersonly.test(lname)){
                alert("Names can contain only letters.")
                return;
            }

            const trnpattern = /^\d{3}-\d{3}-\d{3}$/;
            if (!trnpattern.test(signup_trn)) {
                alert("TRN must be in the format 000-000-000");
                return;
            }

            //Validate Email
            if(email) {
                const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                let valid = emailpattern.test(email);
                if(!valid){
                    alert('Enter Valid Email address')
                    return;
                }
            }

            //Validate Date of Birth
            const dateofbirth = new Date(dob);
            today = new Date();
            const age = today.getFullYear() - dateofbirth.getFullYear(); // approximate age

            if (age < 18) {
                alert("You have to be 18 years or older to create an account.");
                return;
            }

            //checks if username already exists in local storage
            const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
            let storeduser = false;
            for (let i = 0; i < users.length; i++) {
                if (users[i].username === signup_trn) {
                    storeduser = true;
                    break;
                }
            }
            if (storeduser){
                alert("user already exists. Please choose another or login");
                return;
            }

            //cart array
            const mycart = [];
            //orders array
            const myorders = [];
            //saves all user inputs into a user variable and adds to local storage
            users.push({
                username:signup_trn, 
                password:signup_pwd,
                firstname: fname,
                lastname: lname,
                gender: gender,
                email: email,
                DateOfBirth: dob,
                cart: mycart,
                orders: myorders,
                age: age,
                dateofregistration: today.toISOString().split('T')[0]
            });

            //Store TRN separately in local storage in Key called RegisterData
            localStorage.setItem('RegistrationData', JSON.stringify(users));
            localStorage.setItem('RegisterData', signup_trn)
            alert('Account created successfully')
            window.location.href = 'product.html';
        })
}

//------------------------------
//Question 1 (b) Login Page Validation
//------------------------------

if(document.body.id === 'indexPage'){
        login = document.getElementById('login')
        log = document.getElementById('login_submit')
        guest_button = document.getElementById('guest')
        resetpwd = document.getElementById('forget')

        //2.a Dynamically update html and css

        guest_button.addEventListener('click', () =>{
        window.location.href = 'product.html';
        })
        
        document.getElementById('lsignup').addEventListener('click', () =>{
            window.location.href = 'register.html';
        })

        //2.b Event Handling
        //2.c Login Form Validation
        log.addEventListener('click', () =>{
                const login_username = document.getElementById('loginuser').value.trim();
                const login_pwd = document.getElementById('loginpassword').value.trim();

                //2.Password vaildation
                if (!login_username || !login_pwd) {
                    alert("Please fill out all fields.");
                    return;
                }

                //User account validation
                const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
                const thisuser = users.find(u => 
                    u.username === login_username && u.password === login_pwd
                );

                if (thisuser) {
                    localStorage.setItem('user', login_username);
                    alert("Login successful!");
                    window.location.href = 'product.html';
                } else {
                    alert("Incorrect TRN or password.");
                }
            
        })
}

//------------------------------
//Question 2 (a) Product Page Interactivity
//------------------------------

if(document.body.id === 'productPage'){
    const user = localStorage.getItem('RegisterData');
        if (!user){
            document.getElementById('user').innerHTML = `
            <a href="index.html">Login</a>
            `
        }else{
            document.getElementById('user').innerText = `Hello ${user}`
        }
        

        //script for adding products to cart
        document.querySelectorAll('.shopping_cart').forEach(button => {
            button.addEventListener('click', () => {
                if (!user) {
                    alert("Please login first.");
                    return;
                }
                const productcard = button.parentElement.parentElement;
                const name = productcard.querySelector('.product_name').textContent;
                const priceText = productcard.querySelector('.price h3').textContent;
                //converts string to float by removing the dollar sign
                const price = parseFloat(priceText.replace('$', ''));
                const image = productcard.querySelector('img').getAttribute('src');

                const select_color = productcard.querySelector('select[name="yarncolor"], select[name = "pursecolor"], select[name="handbagcolor"], select[name="casecolor"]');
                let color = null;
                if (select_color) {
                    color = select_color.value;
                    if(!color){
                        alert('Please select a color before adding to cart.');
                        return;
                    }
                }

                // Retrieve existing cart or create a new one
                let users = JSON.parse(localStorage.getItem('RegistrationData')) || [];                // Check if the item already exists
                // Find the index of the currently logged-in user
                const userIndex = users.findIndex(u => u.username === user);

                if (userIndex === -1) {
                    alert("Logged-in user data not found.");
                    return;
                }

                // Get the current user's cart
                let currentUser = users[userIndex];
                let cart = currentUser.cart || [];
                
                // Check if the item already exists in the user's cart array
                const duplicate = cart.find(item => 
                    item.name === name && item.color === color);

                if (duplicate) {
                    // If exist, increment quantity
                    duplicate.quantity += 1;
                } else {
                    // Item not in cart, add to cart 
                    cart.push({ name, price, image, color, quantity: 1 });
                }
                
                // Assign the updated cart back to the current user cart
                currentUser.cart = cart;
                
                // Update the user object within the main users array
                users[userIndex] = currentUser;

                // Save the updated users array back to Local Storage
                localStorage.setItem('RegistrationData', JSON.stringify(users));

                alert(`${name} is added to your cart!`);
                    });

            document.getElementById('logout').addEventListener('click', () =>{
            localStorage.setItem('user', "");
        });
    });
}

//------------------------------
//Question 3 Shopping Cart Functionality
//------------------------------

if(document.body.id === 'cartPage'){
        const user = localStorage.getItem('RegisterData');
        const userData = JSON.parse(localStorage.getItem('RegistrationData')) || [];
        const userIndex = userData.findIndex(u => u.username === user);
        const currentUser = userData[userIndex];
        const cartItems = currentUser ? (currentUser.cart || []) : [];
        const cart_list = document.getElementById('cart_products');
        document.getElementById('clrcart').addEventListener('click', () =>{
            if (confirm("Are you sure you want to clear the cart?")) {
                // Clear cart
                userData[userIndex].cart = [];
                localStorage.setItem('RegistrationData', JSON.stringify(userData));
                // Reload the page
                location.reload();
            }
        });
        
        if(cartItems.length === 0){
            cart_list.innerHTML = '<h3>Your cart is empty, continue shopping.</h3>';
        }else{
            cartItems.forEach((product, index) => {
                const productitem = document.createElement('div');
                productitem.innerHTML = `
                    <div class="cart_items">
                    <img src="../Assets/${product.image}" alt="${product.name}" class="cartimg">
                    <br>
                    <div>
                        <h3>${product.name}</h3><br>
                        <h5>Price: $${product.price}</h5><br>
                        Quantity: <input type="number" min="1" class="qty" data-index=${index} value="${product.quantity}"><br>
                        ${product.color ? `Color: ${product.color}<br><br>` : '<br>'}
                        <button class="remove" data-index="${index}"">Remove</button>
                    </div>
                    </div>    
                    <br>  
                    <hr>              
                
                `;
                cart_list.appendChild(productitem);
            });

            //calculate subtotal, discount, tax and total
            const discount = 0.05; //fixed discount
            const tax = 0.15; //fixed
            let subtotal = 0;
            cartItems.forEach((product) => {
                subtotal += product.price * product.quantity;
            });
            let discountamt = discount * subtotal;
            let taxamt = tax * (subtotal-discountamt);
            document.getElementById('subtotal').innerHTML = 
            `<h3>Subtotal: $${subtotal.toFixed(2)}</h3>
            <h4>Discount: $${discountamt.toFixed(2)}</h4>
            <h4>Tax: $${taxamt.toFixed(2)}</h4>
            <hr>
            <h2>Total: $${((subtotal - discountamt)+taxamt).toFixed(2)}</h2>`;
            
        }

        const remove = document.querySelectorAll('.remove');
        remove.forEach(button =>{
            button.addEventListener('click', (e) => {
                const productIndex = e.target.getAttribute('data-index');
                //remove item from array
                cartItems.splice(productIndex, 1);

                // Update the user record
                userData[userIndex].cart = cartItems;
                //save updated array back to localStorage
                localStorage.setItem('RegistrationData', JSON.stringify(userData));
                //reload the page
                location.reload();
            });
        })

        // Select all quantity inputs
        const qty = document.querySelectorAll('.qty');

        qty.forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.getAttribute('data-index');
                const newQty = parseInt(e.target.value);

                // Update the array
                userData[userIndex].cart[index].quantity = newQty;

                // Save updated array back to localStorage
                localStorage.setItem('RegistrationData', JSON.stringify(userData));
                location.reload();
            });
        });
}

//------------------------------
//Question 4 Checkout Page Functionality
//------------------------------

if(document.body.id === 'checkoutPage'){
    const user = localStorage.getItem('RegisterData');
    const userData = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const AllInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    const userIndex = userData.findIndex(u => u.username === user);
    const cart = userData[userIndex].cart || [];

    //Order summary in checkout page
        const cartItems = userData[userIndex].cart || [];
        ordersum = document.getElementById('summary')
        cartItems.forEach((product, index) => {
                const productitem = document.createElement('div');
                productitem.innerHTML = `
                    <div>
                    <img src="../Assets/${product.image}" alt="${product.name}" class="cartimg">
                    <br>
                    <div>
                        <p>${product.name} [qty:${product.quantity}]</p>

                    </div>
                    </div>    
                    <br>             
                
                `;
                ordersum.appendChild(productitem);
            });
            //2.d Basic Interactivity
            //calculations for order total
            const totals = calculateTotals(cartItems);
            document.getElementById('checkoutamt').innerHTML = 
            `<h3>Subtotal: $${totals.subtotal}</h3>
            <h4>Discount: $${totals.discountAmt}</h4>
            <h4>Tax: $${totals.taxAmt}</h4>
            <hr>
            <h2>Total: $${totals.total}</h2>`;
        
        //Close button
        document.getElementById('closebtn').addEventListener("click", () =>{
            window.location.href = 'cart.html';
        })

        //Form Validation
        document.getElementById('placebtn').addEventListener("click", () =>{
            const requiredinputs = document.querySelectorAll("input[required], select[required]")
            const empty = Array.from(requiredinputs).some(field => !field.value.trim());
            if (empty) {
            alert("Please fill out all required fields.");
            return;
            }

            cardname = document.getElementById("cardname").value.trim();
            fname = document.getElementById("fname").value.trim();
            lname = document.getElementById("lname").value.trim();
            const lettersonly = /^[A-Za-z\s]+$/
            if (!lettersonly.test(cardname) || !lettersonly.test(fname) || !lettersonly.test(lname)){
                alert("Names can contain only letters.")
                return;
            }
            const zip = document.getElementById("zip").value.trim();
            if (!/^\d{5}$/.test(zip)) {
                alert("Zip must be 5 digits.");
                return;
            }

            const phone = document.getElementById("phone").value.trim();
            if (!/^\d{7,15}$/.test(phone)) {
                alert("Phone number must be 7-15 digits.");
                return;
            }

            const cvv = document.getElementById("cvv").value.trim();
            if (!/^\d{3}$/.test(cvv)) {
                alert("CVV must be 3 digits.");
                return;
            }

            const cardnum = document.getElementById("cardnumber").value.trim();
            if (!/^\d{13,19}$/.test(cardnum)) {
                alert("Card number must be 13-19 digits.");
                return;
            }

            const expiry = document.getElementById('expiry').value
            const [year, month] = expiry.split("-").map(Number);

            const today = new Date();
            const expiryDate = new Date(year, month, 0);

            // Card is valid if expiry >= today else card is expired
            if (expiryDate < today) {
                alert("Card has expired");
                return;
            }


            if (confirm("Confirm Checkout")) {

            //Storing order details
            const shipping = {
                country: document.getElementById("address").value.trim(),
                firstname: document.getElementById("fname").value.trim(),
                lasname: document.getElementById("lname").value.trim(),
                street: document.getElementById("street").value.trim(),
                city: document.getElementById("city").value.trim(),
                zipcode: document.getElementById("zip").value.trim(),
                number: document.getElementById("phone").value.trim()
            }

            const payment = {
                subtotal: totals.subtotal,
                total: totals.total,
                discount: totals.discountAmt,
                tax: totals.taxAmt,
            }

            const orderdetails = {
                date: new Date().toLocaleString(),
                cart: cart,
                shipping: shipping,
                payment: payment,
            };

            // Ensure orders array exists
            if (!userData[userIndex].orders) {
                userData[userIndex].orders = [];
            }
                
            //appends new orders to orders array
            userData[userIndex].orders.push(orderdetails);
            // Save updated orderdetails to local storage
            localStorage.setItem("RegistrationData", JSON.stringify(userData));
            AllInvoices.push(orderdetails);
            localStorage.setItem("AllInvoices", JSON.stringify(AllInvoices));

            alert("Invoice sent to your email!");
        } else {
            // User clicked Cancel
            alert("Checkout cancelled")
        }

        })
}

function calculateTotals(cartItems) {
    const discount = 0.05; //fixed discount
    const tax = 0.15; //fixed tax
    let total = 0;

    cartItems.forEach((product) => {
        total += product.price * product.quantity;
    });

    const discountAmt = discount * total;
    const taxAmt = tax * (total - discountAmt);
    const subtotal = (total - discountAmt) + taxAmt;

    return {
        total: total.toFixed(2),
        discountAmt: discountAmt.toFixed(2),
        taxAmt: taxAmt.toFixed(2),
        subtotal: subtotal.toFixed(2)
    };
}

//------------------------------
//Question 5 Invoice Page Functionality
//------------------------------

if(document.body.id === 'invoicePage'){
    const user = localStorage.getItem('RegisterData');
    const userData = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const userIndex = userData.findIndex(u => u.username === user);
    const orders = userData[userIndex].orders || [];
    const invoice = document.getElementById('user_invoices');

    function DisplayInvoice() {
        if (orders.length === 0) {
            invoice.innerHTML = '<h3>No orders found.</h3>';
            return;
        }

        let allOrdersHTML = "";

        orders.forEach((order, i) => {
            // Display order details
            const shipping = order.shipping;
            const payment = order.payment;
            const cartItems = order.cart;
            const date = order.date;

            let itemsHTML = '';

            cartItems.forEach((product) => {
                itemsHTML += `
                    <div class="invoice_item">
                        <div>
                            <h3>${product.name}</h3>
                            <p>Quantity: ${product.quantity}</p>
                            <p>Price: $${product.price}</p>
                            ${product.color ? `<p>Color: ${product.color}</p>` : ''}<br>
                        </div>
                    </div>
                    <hr><br>
                `;
            });

            allOrdersHTML += `
                <div class="proceed" id="order_${i}">
                    <img src="../Assets/logo.png" alt="woven imaginations logo" height="180px">
                    <br>
                    <h3>Order #${(i + 1).toString().padStart(3, "0")}</h3>

                    <h3>Shipping Information</h3>
                    <br>
                    <p>Date: ${date}</p>
                    <br>
                    <p>Name: ${shipping.firstname} ${shipping.lasname}</p>
                    <p>TRN#: ${userData[userIndex].username}</p>
                    <p>Address: ${shipping.street}, ${shipping.city}, ${shipping.country}, ${shipping.zipcode}</p>
                    <p>Phone #: ${shipping.number}</p>
                    <br>

                    <h3>------- Items Purchased -------</h3>
                    <br>
                    ${itemsHTML}
                    <h3>Payment Summary</h3>
                    
                    <p>Discount: $${payment.discount}</p>
                    <p>Tax: $${payment.tax}</p>
                    <p>Total: $${payment.total}</p>
                    <p>Subtotal: $${payment.subtotal}</p><br>
                    
                    <button onclick = "PrintInvoice('order_${i}')">Print Invoice</button>

                </div>
                <br>
            `;
        });

        invoice.innerHTML = allOrdersHTML;  
    }

    function PrintInvoice(orderId) {
        const userorder = document.getElementById(orderId);
        const PageContent = document.body.innerHTML;
        const invoiceContent = userorder.innerHTML;
        document.body.innerHTML = invoiceContent;
        window.print();
        document.body.innerHTML = PageContent;
        location.reload();
    }

    DisplayInvoice();
}
//------------------------------
//Question #6 Additional Functionality
//------------------------------

function ShowUserFrequency(){
    const userData = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    let count_gender = {
        male: 0,
        female: 0,
        other: 0
    };

    let count_age = {
        '18-25': 0,
        '26-35': 0,
        '36-50': 0,
        '50+': 0
    }

    userData.forEach(user => {
        // Counting gender frequency
        if (count_gender[user.gender] !== undefined) {
            count_gender[user.gender]++;
        }

        // Counting age groups frequency
        if (user.age >= 18 && user.age <= 25) {
            count_age['18-25']++;
        } else if (user.age >= 26 && user.age <= 35) {
            count_age['26-35']++;
        } else if (user.age >= 36 && user.age <= 50) {
            count_age['36-50']++;
        } else if (user.age > 50) {
            count_age['50+']++;
        }
    });

    //Bar Graphs for gender frequency
    let genderGraph = "<h2>Gender Frequency</h2><br>";
    for (let i in count_gender) {
        const count = count_gender[i];
        const barWidth = count * 50; // 50px per user
        genderGraph += `
            <p>${i}: ${count}</p>
            <img src="../Assets/bar.jpg" width="${barWidth}px" height="30px"/>
            <br><br>
        `;
    }
    document.getElementById("gendergraph").innerHTML = genderGraph;

    //Bar Graphs for age group frequency
    let ageGrap = "<h2>Age Group Frequency</h2><br>";
    for (let i in count_age) {
        const count = count_age[i];
        const barWidth = count * 50; // 50px per user
        ageGrap += `
            <p>${i}: ${count}</p>
            <img src="../Assets/bar.jpg" width="${barWidth}px" height="30px"/>
            <br><br>
        `;
    }
    document.getElementById("agegraph").innerHTML = ageGrap;
}

if(document.body.id === 'dashboardPage'){
    ShowUserFrequency();
}

//Search all invoices and invoices by TRN in the console
function ShowInvoices(){
    const AllInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    const searchvalue = document.getElementById('search').value;
    users = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    if (AllInvoices.length === 0) {
        console.log("No invoices found.");
        return;
    }

    const filteredInvoices = users.filter(invoice => invoice.username === searchvalue);

    if (filteredInvoices.length === 0) {
        console.log("No invoices found for the given TRN.");
    } else {
        console.log(`${searchvalue} Invoices:`, filteredInvoices);
    }
    

    console.log("All Invoices:", AllInvoices);

}

function GetUserInvoices(){
    const trn = localStorage.getItem('RegisterData');
    const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const user = users.find(u => u.username === trn);
    if (user) {
        console.log(`Invoices for TRN ${trn}:`, user.orders);
    } else {
        console.log(`No user found with TRN ${trn}.`);
    }
}
