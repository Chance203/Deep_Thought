const WORKER_BASE_URL =
  "https://REPLACE-WITH-YOUR-WORKER.workers.dev";

const productStatus =
  document.getElementById("product-status");

const productContainer =
  document.getElementById("product-container");

const productError =
  document.getElementById("product-error");

const mainProductImage =
  document.getElementById("main-product-image");

const thumbnailList =
  document.getElementById("thumbnail-list");

const productTitle =
  document.getElementById("product-title");

const productPrice =
  document.getElementById("product-price");

const productDescription =
  document.getElementById("product-description");

const variantSelect =
  document.getElementById("variant-select");

function formatCurrency(priceInCents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(priceInCents / 100);
}

function getProductId() {
  const parameters =
    new URLSearchParams(window.location.search);

  return parameters.get("id");
}

function setMainImage(imageUrl, alternativeText) {
  mainProductImage.src = imageUrl;
  mainProductImage.alt = alternativeText;
}

function createThumbnail(image, product) {
  const button =
    document.createElement("button");

  button.className = "thumbnail-button";
  button.type = "button";

  const thumbnail =
    document.createElement("img");

  thumbnail.src = image.src;
  thumbnail.alt = `${product.title} preview`;
  thumbnail.loading = "lazy";

  button.appendChild(thumbnail);

  button.addEventListener("click", () => {
    setMainImage(image.src, product.title);

    document
      .querySelectorAll(".thumbnail-button")
      .forEach((thumbnailButton) => {
        thumbnailButton.classList.remove("active");
      });

    button.classList.add("active");
  });

  return button;
}

function renderImages(product) {
  thumbnailList.replaceChildren();

  const images =
    Array.isArray(product.images)
      ? product.images.filter((image) => image.src)
      : [];

  const primaryImage =
    product.image ||
    images[0]?.src ||
    "";

  setMainImage(primaryImage, product.title);

  for (const [index, image] of images.entries()) {
    const thumbnail =
      createThumbnail(image, product);

    if (
      image.src === primaryImage ||
      (index === 0 && !product.image)
    ) {
      thumbnail.classList.add("active");
    }

    thumbnailList.appendChild(thumbnail);
  }
}

function renderVariants(product) {
  variantSelect.replaceChildren();

  const placeholder =
    document.createElement("option");

  placeholder.value = "";
  placeholder.textContent = "Select an option";

  variantSelect.appendChild(placeholder);

  const variants =
    Array.isArray(product.variants)
      ? product.variants
      : [];

  for (const variant of variants) {
    const option =
      document.createElement("option");

    option.value = variant.id;
    option.textContent =
      `${variant.title} — ${formatCurrency(variant.price)}`;

    option.dataset.price = variant.price;

    variantSelect.appendChild(option);
  }

  variantSelect.addEventListener("change", () => {
    const selectedOption =
      variantSelect.options[variantSelect.selectedIndex];

    const selectedPrice =
      Number(selectedOption.dataset.price);

    if (Number.isFinite(selectedPrice)) {
      productPrice.textContent =
        formatCurrency(selectedPrice);
    } else if (Number.isFinite(product.startingPrice)) {
      productPrice.textContent =
        `From ${formatCurrency(product.startingPrice)}`;
    }
  });
}

function renderProduct(product) {
  document.title =
    `${product.title} | KoalaTeaTech`;

  productTitle.textContent = product.title;

  productPrice.textContent =
    Number.isFinite(product.startingPrice)
      ? `From ${formatCurrency(product.startingPrice)}`
      : "Price unavailable";

  productDescription.innerHTML =
    product.description || "";

  renderImages(product);
  renderVariants(product);

  productStatus.hidden = true;
  productContainer.hidden = false;
}

function showError(message) {
  console.error(message);

  productStatus.hidden = true;
  productContainer.hidden = true;
  productError.hidden = false;
}

async function loadProduct() {
  const productId = getProductId();

  if (!productId) {
    showError("No product ID was provided.");
    return;
  }

  try {
    const response = await fetch(
      `${WORKER_BASE_URL}/api/products/${encodeURIComponent(productId)}`,
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

    if (!result.product) {
      throw new Error(
        "The API response did not contain a product."
      );
    }

    renderProduct(result.product);
  } catch (error) {
    showError(error);
  }
}

loadProduct();