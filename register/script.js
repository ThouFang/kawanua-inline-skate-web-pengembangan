document.addEventListener("DOMContentLoaded", function () {
    const regForm = document.getElementById("registrationForm");
    
    if (regForm) {
        regForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Elemen Input Form
            const namaEl = document.getElementById("namaMurid") || document.querySelector("input[name='nama']");
            const hpEl = document.getElementById("noWhatsApp") || document.querySelector("input[type='tel']");
            const paketEl = document.getElementById("paketPilihan") || document.querySelector("select");

            const nama = namaEl ? namaEl.value.trim() : "Murid Baru";
            const hp = hpEl ? hpEl.value.trim() : "-";
            const paket = paketEl ? paketEl.value : "Reguler";

            // Buat NIM Unik & Password Acak 8 Karakter
            const timestamp = Date.now().toString().slice(-4);
            const generatedNIM = `KWN-2026${timestamp}`;
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let generatedPassword = '';
            for (let i = 0; i < 8; i++) {
                generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            // 1. Data untuk Portal Murid
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

            // 2. Data untuk Rekap Admin
            const newRegistration = {
                tanggal: new Date().toLocaleDateString("id-ID"),
                nama: nama,
                hp: hp,
                paket: paket,
                nim: generatedNIM,
                pass: generatedPassword
            };

            // SIMPAN KE LOCAL STORAGE
            let allStudents = JSON.parse(localStorage.getItem("kawanuaStudentsDB")) || {};
            allStudents[generatedNIM] = newStudentData;
            localStorage.setItem("kawanuaStudentsDB", JSON.stringify(allStudents));

            let rekapAdmin = JSON.parse(localStorage.getItem("kawanuaRegistrations")) || [];
            rekapAdmin.push(newRegistration);
            localStorage.setItem("kawanuaRegistrations", JSON.stringify(rekapAdmin));

            // POPUP INFORMASI LOGIN
            alert(`🎉 Pendaftaran Berhasil!\n\nDetail Akun Portal Murid Anda:\n-----------------------------------\nNIM / Username: ${generatedNIM}\nPassword: ${generatedPassword}\n-----------------------------------\nSilakan simpan password ini untuk login!`);

            this.reset();
        });
    }
});
