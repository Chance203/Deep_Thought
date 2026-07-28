const WORKER_BASE_URL =
  "https://REPLACE-WITH-YOUR-WORKER.workers.dev";

const PRODUCTS_ENDPOINT =
  `${WORKER_BASE_URL}/api/products`;

const productGrid =
  document.getElementById("product-grid");

const shopStatus =
  document.getElementById("shop-status");

const searchInput =
  document.getElementById("product-search");

const sortSelect =
  document.getElementById("product-sort");

let allProducts = [];

function formatCurrency(priceInCents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(priceInCents / 100);
}

function convertHtmlToText(html) {
  const temporaryElement =
    document.createElement("div");

  temporaryElement.innerHTML = html ?? "";

  return (
    temporaryElement.textContent ||
    temporaryElement.innerText ||
    ""
  ).trim();
}

function shortenText(text, maximumLength = 135) {
  if (text.length <= maximumLength) {
    return text;
  }

  return `${text.slice(0, maximumLength).trim()}…`;
}

function createProductCard(product) {
  const article =
    document.createElement("article");

  article.className = "product-card";

  const imageLink =
    document.createElement("a");

  imageLink.className = "product-image-link";
  imageLink.href =
    `product.html?id=${encodeURIComponent(product.id)}`;

  const image =
    document.createElement("img");

  image.className = "product-image";
  image.src = product.image || "images/product-placeholder.png";
  image.alt = product.title;
  image.loading = "lazy";

  image.addEventListener("error", () => {
    image.src = "images/product-placeholder.png";
  });

  imageLink.appendChild(image);

  const content =
    document.createElement("div");

  content.className = "product-content";

  const title =
    document.createElement("h2");

  title.className = "product-title";
  title.textContent = product.title;

  const description =
    document.createElement("p");

  description.className = "product-description";
  description.textContent = shortenText(
    convertHtmlToText(product.description)
  );

  const footer =
    document.createElement("div");

  footer.className = "product-footer";

  const price =
    document.createElement("p");

  price.className = "product-price";

  price.textContent =
    Number.isFinite(product.startingPrice)
      ? `From ${formatCurrency(product.startingPrice)}`
      : "Unavailable";

  const productLink =
    document.createElement("a");

  productLink.className = "product-link";
  productLink.href =
    `product.html?id=${encodeURIComponent(product.id)}`;

  productLink.textContent = "View";

  footer.append(price, productLink);
  content.append(title, description, footer);
  article.append(imageLink, content);

  return article;
}

function getVisibleProducts() {
  const searchTerm =
    searchInput.value.trim().toLowerCase();

  const filteredProducts =
    allProducts.filter((product) => {
      const searchableText = [
        product.title,
        convertHtmlToText(product.description)
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });

  switch (sortSelect.value) {
    case "price-low":
      filteredProducts.sort(
        (first, second) =>
          (first.startingPrice ?? Infinity) -
          (second.startingPrice ?? Infinity)
      );
      break;

    case "price-high":
      filteredProducts.sort(
        (first, second) =>
          (second.startingPrice ?? -1) -
          (first.startingPrice ?? -1)
      );
      break;

    case "name":
      filteredProducts.sort((first, second) =>
        first.title.localeCompare(second.title)
      );
      break;

    default:
      break;
  }

  return filteredProducts;
}

function renderProducts() {
  productGrid.replaceChildren();

  const products = getVisibleProducts();

  if (products.length === 0) {
    const message =
      document.createElement("div");

    message.className = "empty-products";

    message.textContent =
      allProducts.length === 0
        ? "No products have been added yet."
        : "No products match your search.";

    productGrid.appendChild(message);
    return;
  }

  const fragment =
    document.createDocumentFragment();

  for (const product of products) {
    fragment.appendChild(
      createProductCard(product)
    );
  }

  productGrid.appendChild(fragment);
}

async function loadProducts() {
  shopStatus.hidden = false;
  shopStatus.textContent = "Loading products…";
  productGrid.replaceChildren();

  try {
    const response = await fetch(
      PRODUCTS_ENDPOINT,
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `The product API returned ${response.status}.`
      );
    }

    const result = await response.json();

    allProducts = Array.isArray(result.products)
      ? result.products
      : [];

    shopStatus.hidden = true;
    renderProducts();
  } catch (error) {
    console.error("Product loading error:", error);

    shopStatus.hidden = true;

    const errorContainer =
      document.createElement("div");

    errorContainer.className = "error-message";

    const message =
      document.createElement("p");

    message.textContent =
      "The shop could not load products right now.";

    const retryButton =
      document.createElement("button");

    retryButton.className = "retry-button";
    retryButton.type = "button";
    retryButton.textContent = "Try again";
    retryButton.addEventListener(
      "click",
      loadProducts
    );

    errorContainer.append(message, retryButton);
    productGrid.replaceChildren(errorContainer);
  }
}

searchInput.addEventListener(
  "input",
  renderProducts
);

sortSelect.addEventListener(
  "change",
  renderProducts
);

loadProducts();
