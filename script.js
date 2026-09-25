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

    // 3. Fungsi Membuat Password Acak 8 Karakter
    function generateRandomPassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // 4. Penanganan Form Pendaftaran & Pembuatan Akun Murid
    const regForm = document.getElementById("registrationForm");
    if (regForm) {
        regForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Ambil data input dari formulir
            const namaEl = document.getElementById("namaMurid");
            const hpEl = document.getElementById("noWhatsApp");
            const paketEl = document.getElementById("paketPilihan");

            const nama = namaEl ? namaEl.value.trim() : "";
            const hp = hpEl ? hpEl.value.trim() : "";
            const paket = paketEl ? paketEl.value : "";

            // Buat NIM unik dan Password acak
            const timestamp = Date.now().toString().slice(-4);
            const generatedNIM = `KWN-2026${timestamp}`;
            const generatedPassword = generateRandomPassword();

            // Struktur data murid baru (data awal masih kosong)
            const newStudentData = {
                nim: generatedNIM,
                pass: generatedPassword,
                nama: nama,
                hp: hp,
                paket: paket,
                coach: "Belum Ditentukan",
                absensi: [],
                stats: { balance: 0, braking: 0, slalom: 0 },
                materiTerakhir: "Belum ada materi atau evaluasi dari coach."
            };

            // Simpan ke database portal murid lokal
            let allStudents = JSON.parse(localStorage.getItem("kawanuaStudentsDB")) || {};
            allStudents[generatedNIM] = newStudentData;
            localStorage.setItem("kawanuaStudentsDB", JSON.stringify(allStudents));

            // Simpan ke rekap pendaftaran admin
            let rekapAdmin = JSON.parse(localStorage.getItem("kawanuaRegistrations")) || [];
            rekapAdmin.push({
                tanggal: new Date().toLocaleDateString("id-ID"),
                nama: nama,
                hp: hp,
                paket: paket,
                nim: generatedNIM,
                pass: generatedPassword
            });
            localStorage.setItem("kawanuaRegistrations", JSON.stringify(rekapAdmin));

            // Tampilkan pop-up informasi akun login
            alert(`🎉 Pendaftaran Berhasil!\n\nBerikut Akun Akses Portal Murid Anda:\n-----------------------------------\nNIM / Username: ${generatedNIM}\nPassword: ${generatedPassword}\n-----------------------------------\nSilakan simpan password ini untuk melihat jadwal, absensi, dan grafik perkembangan latihan.`);

            // Reset formulir
            this.reset();
        });
    }
});
