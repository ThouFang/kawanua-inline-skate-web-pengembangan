// Menggunakan window.onload agar pasti berjalan setelah semua elemen HTML siap
window.onload = function () {
    const whatsappNumber = "6281919208099"; 

    // Ambil semua elemen opsi sesi harga
    const sessions = document.querySelectorAll(".card-session");

    sessions.forEach(session => {
        session.style.cursor = "pointer";
        session.title = "Klik untuk mendaftar via WhatsApp";

        session.addEventListener("click", function () {
            // Ambil parent card untuk mendapatkan kata WEEKDAYS atau WEEKEND
            const card = this.closest(".price-card");
            const cardLabel = card ? card.querySelector(".card-label").innerText.trim() : "";
            
            const sessionTitle = this.querySelector(".session-title") ? this.querySelector(".session-title").innerText.trim() : "";
            const sessionPrice = this.querySelector(".session-price") ? this.querySelector(".session-price").innerText.trim() : "";

            // Buat Pesan WhatsApp
            const message = `Halo Admin KAWANUA Inline Skate School, saya ingin mendaftar kelas:\n\n` +
                            `• Kategori: *${cardLabel}*\n` +
                            `• Paket: *${sessionTitle}*\n` +
                            `• Harga: *${sessionPrice}*\n\n` +
                            `Mohon info ketersediaan jadwal dan langkah pendaftarannya. Terima kasih!`;

            const encodedMessage = encodeURIComponent(message);
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Langsung alihkan halaman (Bebas dari Pop-up Blocker HP/Browser)
            window.location.href = waUrl;
        });
    });
};
