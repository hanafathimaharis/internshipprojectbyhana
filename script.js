let cart = [];
const productList = document.getElementById("products");
const cartContainer = document.getElementById("cart");
const message = document.getElementById("message");
productList.addEventListener("click", function (event) {
    const button = event.target.closest(".add-button");
    if (!button) return;
    const productElement = button.closest(".product");
    const id = Number(productElement.dataset.id);
    const name = productElement.dataset.name;
    const price = Number(productElement.dataset.price);
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) { existingProduct.quantity++; } else { cart.push({ id, name, price, quantity: 1 }); }
    message.textContent = name + " added to customer bill.";
    displayCart();
});
function displayCart() {
    cartContainer.replaceChildren();
    if (cart.length === 0) { const p = document.createElement("p"); p.textContent = "No products added yet."; cartContainer.appendChild(p); }
    let subtotal = 0;
    cart.forEach(function (item) {
        const itemTotal = item.price * item.quantity; subtotal += itemTotal;
        const row = document.createElement("div"); row.className = "cart-item";
        const details = document.createElement("div"); details.className = "cart-details";
        const name = document.createElement("strong"); name.textContent = item.name;
        const amount = document.createElement("div"); amount.textContent = "₹" + item.price.toFixed(2) + " × " + item.quantity + " = ₹" + itemTotal.toFixed(2);
        details.append(name, amount);
        const controls = document.createElement("div"); controls.className = "quantity-controls";
        const minus = document.createElement("button"); minus.type = "button"; minus.textContent = "−";
        minus.addEventListener("click", function () { item.quantity--; if (item.quantity <= 0) { cart = cart.filter(p => p.id !== item.id); } displayCart(); });
        const qty = document.createElement("span"); qty.textContent = item.quantity;
        const plus = document.createElement("button"); plus.type = "button"; plus.textContent = "+";
        plus.addEventListener("click", function () { item.quantity++; displayCart(); });
        controls.append(minus, qty, plus);
        const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "×"; remove.className = "remove-button";
        remove.addEventListener("click", function () { cart = cart.filter(p => p.id !== item.id); displayCart(); });
        row.append(details, controls, remove); cartContainer.appendChild(row);
    });
    const gst = subtotal * 0.05; const total = subtotal + gst;
    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("gst").textContent = gst.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}
document.getElementById("clear-cart").addEventListener("click", function () {
    cart = []; document.getElementById("customer").value = ""; document.getElementById("payment").value = "Cash";
    message.textContent = "Customer bill cleared."; displayCart();
});
document.getElementById("generate-bill").addEventListener("click", function () {
    const customer = document.getElementById("customer").value.trim();
    if (customer === "") { alert("Please enter the customer name."); return; }
    if (cart.length === 0) { alert("Please add products to the customer bill first."); return; }
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const gst = subtotal * 0.05; const total = subtotal + gst; const payment = document.getElementById("payment").value;
    const receipt = window.open("", "_blank"); if (!receipt) { alert("Please allow pop-ups."); return; }
    const rows = cart.map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>₹${i.price.toFixed(2)}</td><td>₹${(i.price * i.quantity).toFixed(2)}</td></tr>`).join("");
    receipt.document.write(`<!DOCTYPE html><html><head><title>Rubiyan Hypermarket Bill</title><style>body{font-family:Arial;padding:25px;}h1,h3,p{text-align:center;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:10px;text-align:left;}.totals{text-align:right;line-height:2;margin-top:20px;}</style></head><body><h1>RUBIYAN HYPERMARKET</h1><h3>Customer Bill</h3><p style="font-size:12px;">Minor Project - Last Internship | Done by Hana Fathima Haris | 03SU25RD017</p><p>Customer: ${customer}</p><p>Date: ${new Date().toLocaleString("en-IN")}</p><table><tr><th>Product</th><th>Qty</th><th>Price</th><th>Amount</th></tr>${rows}</table><div class="totals"><p>Subtotal: ₹${subtotal.toFixed(2)}</p><p>GST (5%): ₹${gst.toFixed(2)}</p><h2>Total: ₹${total.toFixed(2)}</h2><p>Payment: ${payment}</p></div><p style="font-size:12px; margin-top:20px;">Minor Project - Last Internship | Hana Fathima Haris - 03SU25RD017</p><p>Thank you for shopping with Rubiyan Hypermarket!</p><button onclick="window.print()">Print Bill</button></body></html>`);
    receipt.document.close(); message.textContent = "Bill generated successfully.";
});
displayCart();