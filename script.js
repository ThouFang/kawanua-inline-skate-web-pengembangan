document.addEventListener("DOMContentLoaded", function () {
    const togglePriceBtn = document.getElementById("togglePriceBtn");
    const priceSection = document.getElementById("priceSection");

    if (togglePriceBtn && priceSection) {
        togglePriceBtn.addEventListener("click", function () {
            priceSection.classList.toggle("hidden");
            this.classList.toggle("active");

            // Scroll halus ke daftar harga saat dibuka
            if (!priceSection.classList.contains("hidden")) {
                priceSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }
});
