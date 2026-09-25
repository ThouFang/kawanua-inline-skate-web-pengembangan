document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("surveyRegisterForm");
    const surveyButtons = document.querySelectorAll(".survey-btn");
    
    const secGuardianData = document.getElementById("sec-guardianData");
    const secAdultPhone = document.getElementById("sec-adultPhone");

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

        // 3. Ambil Nilai dari Form
        const studentName = document.getElementById("studentName").value.trim();
        const studentAge = document.getElementById("studentAge").value.trim();
        const skillLevel = document.getElementById("skillLevel").value;
        const equipment = document.getElementById("equipment").value;
        const packageChoice = document.getElementById("package").value;
        const coachChoice = document.getElementById("coach").value;
        const scheduleText = document.getElementById("scheduleText").value.trim();

        let phoneNum = "";
        let guardianName = "";

        if (ageGroupVal === "Anak-anak") {
            guardianName = document.getElementById("guardianName").value.trim();
            phoneNum = document.getElementById("guardianWa").value.trim();
        } else {
            phoneNum = document.getElementById("adultWa").value.trim();
        }

        // Hitung perkiraan nominal pembayaran berdasarkan pilihan paket
        let estimatedPrice = "175.000";
        if (packageChoice.toLowerCase().includes("month") || packageChoice.toLowerCase().includes("bulan")) {
            estimatedPrice = packageChoice.toLowerCase().includes("weekend") ? "700.000" : "600.000";
        } else if (packageChoice.toLowerCase().includes("weekend")) {
            estimatedPrice = "200.000";
        }

        // 4. Simpan Data Pendaftaran Lengkap ke localStorage
        const bookingData = {
            nama: studentName,
            usia: studentAge,
            kategori: ageGroupVal,
            namaWali: guardianName,
            phone: phoneNum,
            skill: skillLevel,
            alat: equipment,
            paket: packageChoice,
            coach: coachChoice,
            jadwal: scheduleText,
            total: estimatedPrice
        };

        localStorage.setItem("kawanuaBookingData", JSON.stringify(bookingData));

        // 5. Arahkan Pengguna ke Halaman Pembayaran
        window.location.href = "../payment.html";
    });
});
