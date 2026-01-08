const products = getAvailableProducts();

const productList = document.querySelector("#product-list");

function renderProducts(products) {
  productList.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = products[i].image;
    img.alt = products[i].title;

    const title = document.createElement("h3");
    const price = document.createElement("p");
    const rating = document.createElement("p");

    title.innerText = products[i].title;
    price.innerText = "Price: DKK " + products[i].price;
    rating.innerText = "Rating: " + products[i].rating;

    li.appendChild(img);
    li.appendChild(title);
    li.appendChild(price);
    li.appendChild(rating);

    productList.appendChild(li);
  }
}

renderProducts(products);
