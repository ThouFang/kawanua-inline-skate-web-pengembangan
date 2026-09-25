document.addEventListener("DOMContentLoaded", function () {
    // NOMOR WHATSAPP ADMIN KAWANUA (Ubah sesuai nomor aktif)
    const adminPhoneNumber = "6281919208099";

    const form = document.getElementById("surveyRegisterForm");
    const surveyButtons = document.querySelectorAll(".survey-btn");
    
    const secGuardianData = document.getElementById("sec-guardianData");
    const secAdultPhone = document.getElementById("sec-adultPhone");

    // Helper: Buat Password Acak 8 Karakter untuk Portal Murid
    function generateRandomPassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // 1. Logika Klik Tombol Survei (Kartu Pilihan)
    surveyButtons.forEach(button => {
        button.addEventListener("click", function () {
            const fieldName = this.getAttribute("data-field");
            const value = this.getAttribute("data-value");

            // Matikan status aktif pada tombol lain dalam kelompok yang sama
            const siblings = document.querySelectorAll(`.survey-btn[data-field="${fieldName}"]`);
            siblings.forEach(btn => btn.classList.remove("active"));

            // Aktifkan tombol yang diklik
            this.classList.add("active");

            // Simpan nilai pilihan ke input hidden
            const hiddenInput = document.getElementById(fieldName);
            if (hiddenInput) {
                hiddenInput.value = value;
            }

            // Bersihkan indikator error jika opsi sudah dipilih
            const parentSection = this.closest(".form-section");
            if (parentSection) {
                parentSection.classList.remove("invalid-section");
            }

            // Logika Cabang: Anak-anak vs Dewasa
            if (fieldName === "ageGroup") {
                if (value === "Anak-anak") {
                    secGuardianData.classList.remove("hidden");
                    secAdultPhone.classList.add("hidden");
                } else if (value === "Dewasa") {
                    secGuardianData.classList.add("hidden");
                    secAdultPhone.classList.remove("hidden");
                }
            }
        });
    });

    // Reset warna merah error saat pengguna mulai mengetik
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", function () {
            const group = this.closest(".input-group");
            if (group) group.classList.remove("invalid-input");
        });
    });

    // 2. Validasi & Pengiriman Form
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let isValid = true;
            let firstInvalidElement = null;

            // Fungsi Validasi Section Opsi Survei
            function validateSurveySection(sectionId, hiddenInputId) {
                const section = document.getElementById(sectionId);
                const hiddenInput = document.getElementById(hiddenInputId);
                const val = hiddenInput ? hiddenInput.value : "";

                if (!val) {
                    if (section) section.classList.add("invalid-section");
                    if (!firstInvalidElement) firstInvalidElement = section;
                    isValid = false;
                } else {
                    if (section) section.classList.remove("invalid-section");
                }
            }

            // Fungsi Validasi Input Teks
            function validateTextInput(groupId, inputId) {
                const group = document.getElementById(groupId);
                const input = document.getElementById(inputId);

                if (!input || !input.value.trim()) {
                    if (group) group.classList.add("invalid-input");
                    if (!firstInvalidElement && input) firstInvalidElement = input;
                    isValid = false;
                } else {
                    if (group) group.classList.remove("invalid-input");
                }
            }

            // Validasi 1: Kategori Usia
            validateSurveySection("sec-ageGroup", "ageGroup");

            // Validasi 2: Data Diri Murid
            validateTextInput("group-studentName", "studentName");
            validateTextInput("group-studentAge", "studentAge");

            // Validasi 3: Kondisi Wali vs Dewasa
            const ageGroupVal = document.getElementById("ageGroup").value;
            if (ageGroupVal === "Anak-anak") {
                validateTextInput("group-guardianName", "guardianName");
                validateTextInput("group-guardianWa", "guardianWa");
            } else if (ageGroupVal === "Dewasa") {
                validateTextInput("group-adultWa", "adultWa");
            }

            // Validasi 4, 5, 6, 7: Option Sections
            validateSurveySection("sec-skillLevel", "skillLevel");
            validateSurveySection("sec-equipment", "equipment");
            validateSurveySection("sec-package", "package");
            validateSurveySection("sec-coach", "coach");

            // Validasi 8: Schedule
            validateTextInput("group-scheduleText", "scheduleText");

            // Jika ada input yang belum terisi: Scroll ke input bermasalah pertama
            if (!isValid) {
                if (firstInvalidElement) {
                    firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }

            // 3. Ambil Seluruh Data Isian
            const studentName = document.getElementById("studentName").value.trim();
            const studentAge = document.getElementById("studentAge").value.trim();
            const skillLevel = document.getElementById("skillLevel").value;
            const equipment = document.getElementById("equipment").value;
            const packageChoice = document.getElementById("package").value;
            const coachChoice = document.getElementById("coach").value;
            const scheduleText = document.getElementById("scheduleText").value.trim();

            let activeWa = "";
            let guardianInfoText = "";
            let guardianName = "";

            if (ageGroupVal === "Anak-anak") {
                guardianName = document.getElementById("guardianName").value.trim();
                activeWa = document.getElementById("guardianWa").value.trim();
                guardianInfoText = `• Nama Wali/Orang Tua: *${guardianName}*\n• WA Wali: *${activeWa}*`;
            } else {
                activeWa = document.getElementById("adultWa").value.trim();
                guardianInfoText = `• WA Peserta: *${activeWa}*`;
            }

            // 4. Generate NIM & Password Otomatis untuk Rekap Admin & Portal Murid
            const timestamp = Date.now().toString().slice(-4);
            const generatedNIM = `KWN-2026${timestamp}`;
            const generatedPassword = generateRandomPassword();

            // Structure Data Portal Murid
            const newStudentData = {
                nim: generatedNIM,
                pass: generatedPassword,
                nama: studentName,
                hp: activeWa,
                paket: packageChoice,
                coach: coachChoice,
                absensi: [],
                stats: { balance: 0, braking: 0, slalom: 0 },
                materiTerakhir: "Belum ada materi atau evaluasi dari coach."
            };

            // Structure Data Rekap Admin
            const newRegistration = {
                tanggal: new Date().toLocaleDateString("id-ID"),
                nama: studentName,
                hp: activeWa,
                paket: packageChoice,
                nim: generatedNIM,
                pass: generatedPassword,
                status: "Pending Transaksi"
            };

            // Simpan ke LocalStorage agar Rekap Admin & Login Langsung Ter-update
            let allStudents = JSON.parse(localStorage.getItem("kawanuaStudentsDB")) || {};
            allStudents[generatedNIM] = newStudentData;
            localStorage.setItem("kawanuaStudentsDB", JSON.stringify(allStudents));

            let rekapAdmin = JSON.parse(localStorage.getItem("kawanuaRegistrations")) || [];
            rekapAdmin.push(newRegistration);
            localStorage.setItem("kawanuaRegistrations", JSON.stringify(rekapAdmin));

            // 5. Susun Format Pesan WhatsApp Lengkap dengan Keterangan Transaksi
            const waMessage = 
`*PENDATAAN MURID BARU LES PRIVATE*
*KAWANUA INLINE SKATE SCHOOL*
--------------------------------------------
*1. DATA MURID*
• Nama Murid: *${studentName}*
• Usia Exact: *${studentAge} Tahun*
• Kategori: *${ageGroupVal}*
${guardianInfoText}

*2. DETAIL LATIHAN & COACH*
• Tingkat Kemampuan: *${skillLevel}*
• Status Peralatan: *${equipment}*
• Paket Pilihan: *${packageChoice}*
• Pilihan Coach: *${coachChoice}*
• Rencana Schedule: *${scheduleText}*

*3. KETERANGAN TRANSAKSI & VERIFIKASI*
• Kode Registrasi: *${generatedNIM}*
• Status Pendaftaran: *Menunggu Verifikasi & Pembayaran*
--------------------------------------------
Mohon instruksi nomor rekening / QRIS pembayaran serta konfirmasi ketersediaan jadwalnya. Terima kasih!`;

            // Buka tautan WhatsApp Admin
            const encodedUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(waMessage)}`;
            window.location.href = encodedUrl;
        });
    }
});
