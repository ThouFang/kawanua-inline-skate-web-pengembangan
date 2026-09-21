document.addEventListener("DOMContentLoaded", function () {
    // 1. Toggle Price List
    const togglePriceBtn = document.getElementById("togglePriceBtn");
    const priceSection = document.getElementById("priceSection");

    if (togglePriceBtn && priceSection) {
        togglePriceBtn.addEventListener("click", function () {
            priceSection.classList.toggle("hidden");
            this.classList.toggle("active");

            if (!priceSection.classList.contains("hidden")) {
                priceSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }

    // 2. Control Modal Media Sosial & Komunitas
    const openSocialModalBtn = document.getElementById("openSocialModalBtn");
    const closeSocialModalBtn = document.getElementById("closeSocialModalBtn");
    const socialModal = document.getElementById("socialModal");

    if (openSocialModalBtn && closeSocialModalBtn && socialModal) {
        // Buka Modal saat tombol diklik
        openSocialModalBtn.addEventListener("click", function (e) {
            e.preventDefault();
            socialModal.classList.remove("hidden");
        });

        // Tutup Modal lewat tombol X
        closeSocialModalBtn.addEventListener("click", function () {
            socialModal.classList.add("hidden");
        });

        // Tutup Modal jika area luar modal diklik
        socialModal.addEventListener("click", function (e) {
            if (e.target === socialModal) {
                socialModal.classList.add("hidden");
            }
        });
    }
});
