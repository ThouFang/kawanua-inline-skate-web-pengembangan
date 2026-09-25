document.addEventListener("DOMContentLoaded", function () {
    // NOMOR WHATSAPP ADMIN KAWANUA (Sesuaikan nomor WhatsApp Admin Anda)
    const adminWA = "6281919208099"; // Ganti dengan nomor WhatsApp Admin Aktif (format 62...)

    // 1. LOGIKA TOMBOL SURVEY (Kategori, Skill, Alat, Paket, Coach)
    const surveyButtons = document.querySelectorAll(".survey-btn");
    
    surveyButtons.forEach(button => {
        button.addEventListener("click", function () {
            const fieldName = this.getAttribute("data-field");
            const fieldValue = this.getAttribute("data-value");

            // Unselect tombol lain dalam grup yang sama
            const parentSection = this.closest(".form-section");
            parentSection.querySelectorAll(".survey-btn").forEach(btn => btn.classList.remove("active"));

            // Set tombol yang diklik menjadi aktif
            this.classList.add("active");

            // Set nilai ke hidden input
            const hiddenInput = document.getElementById(fieldName);
            if (hiddenInput) {
                hiddenInput.value = fieldValue;
            }

            // Tampilkan/Sembunyikan Form Wali berdasarkan Kategori Usia
            if (fieldName === "ageGroup") {
                const secGuardian = document.getElementById("sec-guardianData");
                const secAdultPhone = document.getElementById("sec-adultPhone");

                if (fieldValue === "Anak-anak") {
                    secGuardian.classList.remove("hidden");
                    secAdultPhone.classList.add("hidden");
                } else {
                    secGuardian.classList.add("hidden");
                    secAdultPhone.classList.remove("hidden");
                }
            }
        });
    });

    // 2. FUNGSI GENERATE PASSWORD ACAK
    function generateRandomPassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // 3. LOGIKA SUBMIT FORM
    const form = document.getElementById("surveyRegisterForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // Ambil semua data input
            const ageGroup = document.getElementById("ageGroup").value;
            const studentName = document.getElementById("studentName").value.trim();
            const studentAge = document.getElementById("studentAge").value.trim();
            const guardianName = document.getElementById("guardianName").value.trim();
            const guardianWa = document.getElementById("guardianWa").value.trim();
            const adultWa = document.getElementById("adultWa").value.trim();
            const skillLevel = document.getElementById("skillLevel").value;
            const equipment = document.getElementById("equipment").value;
            const packageVal = document.getElementById("package").value;
            const coachVal = document.getElementById("coach").value;
            const scheduleText = document.getElementById("scheduleText").value.trim();

            // Validasi Sederhana
            if (!ageGroup || !studentName || !studentAge || !skillLevel || !equipment || !packageVal || !coachVal || !scheduleText) {
                alert("⚠️ Mohon lengkapi semua isian survei yang bertanda bintang (*)");
                return;
            }

            const activePhone = ageGroup === "Anak-anak" ? guardianWa : adultWa;
            if (!activePhone) {
                alert("⚠️ Mohon isi Nomor WhatsApp aktif Anda!");
                return;
            }

            // Generate NIM & Password di belakang layar untuk Admin
            const timestamp = Date.now().toString().slice(-4);
            const generatedNIM = `KWN-2026${timestamp}`;
            const generatedPassword = generateRandomPassword();

            // Structure Data Murid
            const newStudentData = {
                nim: generatedNIM,
                pass: generatedPassword,
                nama: studentName,
                hp: activePhone,
                paket: packageVal,
                coach: coachVal,
                absensi: [],
                stats: { balance: 0, braking: 0, slalom: 0 },
                materiTerakhir: "Belum ada materi atau evaluasi dari coach."
            };

            // Structure Data Rekap Admin
            const newRegistration = {
                tanggal: new Date().toLocaleDateString("id-ID"),
                nama: studentName,
                hp: activePhone,
                paket: packageVal,
                nim: generatedNIM,
                pass: generatedPassword
            };

            // Simpan ke LocalStorage
            let allStudents = JSON.parse(localStorage.getItem("kawanuaStudentsDB")) || {};
            allStudents[generatedNIM] = newStudentData;
            localStorage.setItem("kawanuaStudentsDB", JSON.stringify(allStudents));

            let rekapAdmin = JSON.parse(localStorage.getItem("kawanuaRegistrations")) || [];
            rekapAdmin.push(newRegistration);
            localStorage.setItem("kawanuaRegistrations", JSON.stringify(rekapAdmin));

            // FORMAT PESAN KIRIM KE WHATSAPP ADMIN
            let waText = `Halo Admin KAWANUA Inline Skate, saya ingin mendaftar Les Private!%0A%0A`;
            waText += `📋 *DETAIL SURVEI PENDAFTARAN:*%0A`;
            waText += `• *Kategori Usia:* ${ageGroup}%0A`;
            waText += `• *Nama Murid:* ${studentName}%0A`;
            waText += `• *Usia:* ${studentAge} Tahun%0A`;
            if (ageGroup === "Anak-anak") {
                waText += `• *Nama Wali:* ${guardianName}%0A`;
            }
            waText += `• *No. WA:* ${activePhone}%0A`;
            waText += `• *Kemampuan:* ${skillLevel}%0A`;
            waText += `• *Status Alat:* ${equipment}%0A`;
            waText += `• *Paket Latihan:* ${packageVal}%0A`;
            waText += `• *Pilihan Coach:* ${coachVal}%0A`;
            waText += `• *Rencana Jadwal:* ${scheduleText}%0A%0A`;
            waText += `Mohon info langkah konfirmasi pembayaran selanjutnya. Terima kasih!`;

            // Buka WhatsApp Otomatis
            window.open(`https://wa.me/${adminWA}?text=${waText}`, '_blank');
        });
    }
});
