    let products = [];
    let darkMode = true;

    window.onorientationchange = function() {
        localStorage.setItem('products', JSON.stringify(products));
        location.reload();
    };

    window.onload = function() {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            products = JSON.parse(storedProducts);
            updateProductList();
            updateTotalPrice();
        }
    };

    function addProduct() {
        const productName = document.getElementById('productName').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const price = parseFloat(document.getElementById('price').value);

        if (!productName || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
            alert('Παρακαλώ εισάγετε έγκυρες πληροφορίες προϊόντος.');
            return;
        }

        const product = {
            name: productName,
            quantity: quantity,
            price: price,
            total: calculateTotal(quantity, price)
        };

        products.push(product);

        clearInputs();
        updateProductList();
        updateTotalPrice();
    }

    function editProduct(index) {
        const product = products[index];

        const newName = prompt(`Επεξεργασία Ονόματος Προϊόντος (${product.name}):`);
        const newQuantity = parseInt(prompt(`Επεξεργασία Ποσότητας (${product.quantity}):`));
        const newPrice = parseFloat(prompt(`Επεξεργασία Τιμής (${product.price.toFixed(2)}):`));

        if (newName !== null && newName !== "") {
            product.name = newName;
        }
        if (!isNaN(newQuantity) && newQuantity > 0) {
            product.quantity = newQuantity;
        }
        if (!isNaN(newPrice) && newPrice > 0) {
            product.price = newPrice;
        }

        product.total = calculateTotal(product.quantity, product.price);

        updateProductList();
        updateTotalPrice();
    }

    function deleteProduct(index) {
        const confirmed = confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε το προϊόν;');
        if (confirmed) {
            products.splice(index, 1);
            updateProductList();
            updateTotalPrice();
        }
    }

    function clearInputs() {
        document.getElementById('productName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
    }

    function updateProductList() {
        const productListElement = document.getElementById('productList');
        productListElement.innerHTML = '';

        products.forEach((product, index) => {
            const listItem = document.createElement('li');
            listItem.setAttribute('draggable', 'true');
            listItem.setAttribute('ondragstart', `drag(event, ${index})`);
            listItem.innerHTML = `<span class="highlight">${product.name}</span> - Ποσότητα: <span class="highlight">${product.quantity}</span> - Τιμή: <span class="highlight">€${product.price.toFixed(2)}</span> - Σύνολο: <span> €${product.total.toFixed(2)}</span>`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Επεξεργασία';
            editButton.onclick = () => editProduct(index);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Διαγραφή';
            deleteButton.className = 'delete';
            deleteButton.onclick = () => deleteProduct(index);

            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            productListElement.appendChild(listItem);
        });
    }

    function updateTotalPrice() {
        const totalPriceElement = document.getElementById('totalPrice');
        const totalPrice = products.reduce((acc, product) => acc + product.total, 0);
        totalPriceElement.textContent = `Σύνολο: €${totalPrice.toFixed(2)}`;
    }

    function calculateTotal(quantity, price) {
        return quantity * price;
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drag(event, index) {
        event.dataTransfer.setData("text/plain", index);
    }

    function drop(event) {
        event.preventDefault();
        const fromIndex = event.dataTransfer.getData("text/plain");
        const toIndex = products.length;

        const [draggedProduct] = products.splice(fromIndex, 1);
        products.splice(toIndex, 0, draggedProduct);

        updateProductList();
    }