document.addEventListener("DOMContentLoaded", function () {
    // FUNGSI BUAT PASSWORD ACAK 8 KARAKTER
    function generateRandomPassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // PROSES SUBMIT FORM PENDAFTARAN LESS PRIVATE
    const regForm = document.getElementById("registrationForm") || document.querySelector("form");
    
    if (regForm) {
        regForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Merekam data dari Form Pendaftaran Less Private
            const namaEl = document.getElementById("namaMurid") || document.querySelector("input[type='text']");
            const hpEl = document.getElementById("noWhatsApp") || document.querySelector("input[type='tel']");
            const paketEl = document.getElementById("paketPilihan") || document.querySelector("select");

            const nama = namaEl ? namaEl.value.trim() : "Murid Baru";
            const hp = hpEl ? hpEl.value.trim() : "-";
            const paket = paketEl ? paketEl.value : "Less Private";

            // Buat NIM unik dan Password acak otomatis
            const timestamp = Date.now().toString().slice(-4);
            const generatedNIM = `KWN-2026${timestamp}`;
            const generatedPassword = generateRandomPassword();

            // 1. Data Akun untuk Portal Murid (murid-dashboard.html)
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

            // 2. Data Rekap untuk Admin (admin-rekap.html)
            const newRegistration = {
                tanggal: new Date().toLocaleDateString("id-ID"),
                nama: nama,
                hp: hp,
                paket: paket,
                nim: generatedNIM,
                pass: generatedPassword
            };

            // SIMPAN KE STORAGE LOKAL (Shared across domain/project)
            let allStudents = JSON.parse(localStorage.getItem("kawanuaStudentsDB")) || {};
            allStudents[generatedNIM] = newStudentData;
            localStorage.setItem("kawanuaStudentsDB", JSON.stringify(allStudents));

            let rekapAdmin = JSON.parse(localStorage.getItem("kawanuaRegistrations")) || [];
            rekapAdmin.push(newRegistration);
            localStorage.setItem("kawanuaRegistrations", JSON.stringify(rekapAdmin));

            // POP-UP INFORMASI AKUN LOGIN UNTUK MURID
            alert(`🎉 Pendaftaran Less Private Berhasil!\n\nBerikut Akun Akses Portal Murid Anda:\n-----------------------------------\nNIM / Username: ${generatedNIM}\nPassword: ${generatedPassword}\n-----------------------------------\nSilakan simpan NIM & Password ini untuk masuk ke portal murid!`);

            // Direct ke Halaman Login atau Reset Form
            this.reset();
            window.location.href = "../login.html"; // Mengarahkan murid langsung ke halaman login di root
        });
    }
});
