document.addEventListener("DOMContentLoaded", () => {
  const apiUrl =
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json";
  const jsonDataUrl = "data.json";

  const fetchData = (url) => {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    });
  };

  const updateContainerTwo = (product) => {
    const containerTwo = document.querySelector(".containerTwo");
    containerTwo.querySelector("h3").textContent = product.title;
    containerTwo.querySelector("h1 b").textContent = `$${product.price} `;
    containerTwo.querySelector(
      "h3:nth-of-type(2)"
    ).textContent = `$${product.compare_at_price}`;
    containerTwo.querySelector(".color h3").textContent = "Choose a Color";
    containerTwo.querySelector(".size h3").textContent = "Choose a Size";
    updateColorOptions(product);
    updateSizeOptions(product);
    containerTwo.querySelector("p").textContent = product.description;
  };

  const updateColorOptions = (product) => {
    const colorDivs = document.querySelectorAll(".color-box");
    product.options
      .find((option) => option.name === "Color")
      .values.forEach((value, index) => {
        colorDivs[index].style.backgroundColor = value[Object.keys(value)[0]];
      });
    initializeTick(colorDivs);
  };

  const initializeTick = (colorDivs) => {
    let tickIndex = 0;
    const tickSVG = createTickSVG();
    toggleTick(tickIndex, colorDivs, tickSVG);
    colorDivs.forEach((box, index) => {
      box.addEventListener("click", () => {
        toggleTick(index, colorDivs, tickSVG);
      });
    });
  };

  const createTickSVG = () => {
    const tickSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    tickSVG.setAttribute("id", "tick");
    tickSVG.setAttribute("viewBox", "0 0 24 24");
    tickSVG.innerHTML = `<path d="M20.293,7.293l-9,9c-0.391,0.391-1.023,0.391-1.414,0l-4-4c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0l3.293,3.293l8.293-8.293c0.391-0.391,1.023-0.391,1.414,0S20.684,6.902,20.293,7.293z"/>`;
    return tickSVG;
  };

  const toggleTick = (index, colorDivs, tickSVG) => {
    colorDivs.forEach((box) => {
      box.classList.remove("selected");
      const existingTick = box.querySelector("#tick");
      if (existingTick) {
        box.removeChild(existingTick);
      }
    });
    tickIndex = index;
    colorDivs[index].classList.add("selected");
    colorDivs[index].appendChild(tickSVG.cloneNode(true));
  };

  const updateSizeOptions = (product) => {
    const sizeLabels = document.querySelectorAll(".size .radio");
    product.options
      .find((option) => option.name === "Size")
      .values.forEach((value, index) => {
        sizeLabels[
          index
        ].innerHTML = `<input type="radio" name="size" value="${value}" /> ${value}`;
      });
  };

  const handleCartActions = () => {
    let quantity = 0;
    const quantityElement = document.querySelector(".button-quantity");
    const alertH3 = document.querySelector(".alert h3");

    const colorBoxes = document.querySelectorAll(".color-box");
    const tickIndex = Array.from(colorBoxes).findIndex((box) =>
      box.classList.contains("selected")
    );

    document.querySelector(".button-minus").addEventListener("click", () => {
      if (quantity > 0) {
        quantity--;
        quantityElement.textContent = quantity;
      }
    });

    document.querySelector(".button-plus").addEventListener("click", () => {
      quantity++;
      quantityElement.textContent = quantity;
    });

    document
      .querySelector(".button-add-to-cart")
      .addEventListener("click", () => {
        const selectedSizeInput = document.querySelector(
          'input[name="size"]:checked'
        );

        if (selectedSizeInput) {
          const sizeName = selectedSizeInput.value;

          // Define the color names based on the order of the color boxes
          const colorNames = ["Yellow", "Green", "Blue", "Pink"];
          const selectedColorName = colorNames[tickIndex] || "Yellow";

          // Update the text content of the alert h3
          alertH3.textContent = `Embrace Sideboard with Color ${selectedColorName} and Size ${sizeName} added to cart!`;

          // Show the alert section
          document.querySelector(".alert").style.display = "block";

          // Implement cart functionality here (e.g., send data to server, update UI)

          // Reset quantity after adding to cart
          quantity = 0;
          quantityElement.textContent = quantity;
        } else {
          // If no size is selected, prompt the user to select a size
          alert("Please select a size before adding to cart.");
        }
      });

    // Hide the alert section initially
    document.querySelector(".alert").style.display = "none";
  };

  fetchData(apiUrl)
    .then((data) => {
      const product = data.product;
      updateContainerTwo(product);
      fetchData(jsonDataUrl).then((jsonData) => {
        const images = jsonData.images;
        const mainImage = document.querySelector(".big-image img");
        mainImage.src = images[0].src;
        const imageDivs = document.querySelectorAll(".images div img");
        imageDivs.forEach((image, index) => {
          if (images[index + 1]) {
            image.src = images[index + 1].src;
            image.addEventListener("click", () => {
              mainImage.src = image.src;
            });
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      const dataContainer = document.getElementById("dataContainer");
      dataContainer.textContent =
        "Failed to fetch data. Please try again later.";
    });

  handleCartActions();
});
