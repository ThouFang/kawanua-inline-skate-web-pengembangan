document.addEventListener("DOMContentLoaded", function () {
    // Fungsi Buat Password Acak 8 Karakter
    function generateRandomPassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    const regForm = document.getElementById("registrationForm") || document.querySelector("form");
    
    if (regForm) {
        regForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // 1. Ambil data dari form pendaftaran
            const namaEl = document.getElementById("namaMurid") || document.querySelector("input[name='nama']");
            const hpEl = document.getElementById("noWhatsApp") || document.querySelector("input[type='tel']");
            const paketEl = document.getElementById("paketPilihan") || document.querySelector("select");

            const nama = namaEl ? namaEl.value.trim() : "Murid Baru";
            const hp = hpEl ? hpEl.value.trim() : "-";
            const paket = paketEl ? paketEl.value : "Less Private";

            // 2. Generate NIM & Password di belakang layar (Admin Only)
            const timestamp = Date.now().toString().slice(-4);
            const generatedNIM = `KWN-2026${timestamp}`;
            const generatedPassword = generateRandomPassword();

            // 3. Simpan data untuk Akses Portal Murid
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

            // 4. Simpan data untuk Rekap Admin
            const newRegistration = {
                tanggal: new Date().toLocaleDateString("id-ID"),
                nama: nama,
                hp: hp,
                paket: paket,
                nim: generatedNIM,
                pass: generatedPassword,
                status: "Pending/Belum Bayar"
            };

            // Simpan ke Local Storage
            let allStudents = JSON.parse(localStorage.getItem("kawanuaStudentsDB")) || {};
            allStudents[generatedNIM] = newStudentData;
            localStorage.setItem("kawanuaStudentsDB", JSON.stringify(allStudents));

            let rekapAdmin = JSON.parse(localStorage.getItem("kawanuaRegistrations")) || [];
            rekapAdmin.push(newRegistration);
            localStorage.setItem("kawanuaRegistrations", JSON.stringify(rekapAdmin));

            // 5. Tampilkan Pesan Sukses Ringkas di Halaman (Tanpa Pop-Up & Tanpa WA Otomatis)
            alert("✅ Pendaftaran Berhasil Dikirim!\n\nData pendaftaran Anda telah kami terima. Admin/Coach Kawanua akan menghubungi Anda via WhatsApp untuk verifikasi pembayaran dan pemberian Akun Login Portal Murid.");

            // Reset formulir
            this.reset();
        });
    }
});
