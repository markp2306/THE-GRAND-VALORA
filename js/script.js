document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlBookingId = urlParams.get('bookingId');
    if (urlBookingId) {
        setTimeout(() => {
            const statusModal = document.getElementById("statusModal");
            const statusBookingInput = document.getElementById("statusBookingId");
            const btnCheckStatus = document.getElementById("btnCheckStatus");

            if (statusModal && statusBookingInput && btnCheckStatus) {
                statusModal.style.display = "flex";
                statusBookingInput.value = urlBookingId;
                performStatusLookup();
            }
        }, 1000);
    }

    const reservationForm = document.getElementById("reservationForm");
    const successMessage = document.getElementById("successMessage");
    const formTitle = document.querySelector(".form-title");
    const closeSuccessBtn = document.getElementById("closeSuccess");
    const loader = document.getElementById("loadingOverlay");

    const modal = document.getElementById("reservationModal");
    const openBtns = document.querySelectorAll(".open-modal");
    const closeBtn = document.querySelector(".close-modal");

    const statusModal = document.getElementById("statusModal");
    const openStatusBtn = document.getElementById("openStatusModal");
    const closeStatusBtn = document.querySelector(".close-status-modal");
    const btnCheckStatus = document.getElementById("btnCheckStatus");
    const btnNewSearch = document.getElementById("btnNewSearch");
    const btnRetrySearch = document.getElementById("btnRetrySearch");
    const statusSearch = document.getElementById("statusSearch");
    const statusResult = document.getElementById("statusResult");
    const statusError = document.getElementById("statusError");

    const btnDownloadReceipt = document.getElementById("downloadReceipt");

    const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener("click", () => {
            mobileNavToggle.classList.toggle("active");
            navLinks.classList.toggle("active");

            if (navLinks.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
        });

        const navLinksItems = navLinks.querySelectorAll("a");
        navLinksItems.forEach(link => {
            link.addEventListener("click", () => {
                mobileNavToggle.classList.remove("active");
                navLinks.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        });

        const mobileStatusLink = document.getElementById("mobileStatusLink");
        if (mobileStatusLink) {
            mobileStatusLink.addEventListener("click", () => {
                statusModal.style.display = "flex";
                document.body.style.overflow = "hidden";
            });
        }
    }

    if (reservationForm) {
        reservationForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const bookingId = "GV-" + Math.floor(100000 + Math.random() * 900000);

            const reservationData = {
                bookingId: bookingId,
                fullName: document.getElementById("fullName").value,
                phoneNumber: document.getElementById("phoneNumber").value,
                email: document.getElementById("email").value,
                guestCount: document.getElementById("guestCount").value,
                checkIn: document.getElementById("checkIn").value,
                checkOut: document.getElementById("checkOut").value,
                roomType: document.getElementById("roomType").value,
                timestamp: new Date().toISOString()
            };

            if (loader) {
                loader.style.display = "flex";
                document.body.style.overflow = "hidden";
            }

            try {
                if (!window.firestoreTools || !window.dbFirestore) {
                    throw new Error("Cloud database tools failed to initialize. If you're opening the file locally, please use a local server (like Live Server) or ensure you have an active internet connection.");
                }

                const { addDoc, collection } = window.firestoreTools;
                const dbFirestore = window.dbFirestore;

                await addDoc(collection(dbFirestore, "reservations"), reservationData);

                await sendConfirmationEmail({ ...reservationData, siteOrigin: window.location.origin });

                setTimeout(() => {
                    if (loader) loader.style.display = "none";
                    showReservationSuccess(reservationData);
                }, 2000);
            } catch (error) {
                if (loader) {
                    loader.style.display = "none";
                    document.body.style.overflow = "auto";
                }
                console.error("Reservation Error:", error);
                alert("Reservation Failed: " + (error.message || "Unknown error occurred. Please check your connection."));
            }
        });
    }

    async function sendConfirmationEmail(data) {
        const serviceID = "service_0guko8j";
        const templateID = "template_cru1zpl";

        console.log("Attempting to send email via EmailJS...", { serviceID, templateID });

        const templateParams = {
            fullName: data.fullName,
            email: data.email,
            bookingId: data.bookingId,
            roomType: data.roomType,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            guestCount: data.guestCount,
            phoneNumber: data.phoneNumber,
            siteOrigin: window.location.origin
        };

        try {
            const response = await emailjs.send(serviceID, templateID, templateParams);

            if (response.status === 200) {
                console.log("EmailJS SUCCESS!", response.status, response.text);
                showToast("Email dispatched successfully to " + data.email);
            } else {
                console.error("EmailJS unusual response:", response);
                throw new Error("EmailJS Error: " + response.text);
            }
        } catch (error) {
            console.error("EMAIL DISPATCH FAILURE:", error);

            if (error.status === 403) {
                console.warn("DEBUG TIP: Check your Public Key in index.html. It might be incorrect.");
            } else if (error.status === 404) {
                console.warn("DEBUG TIP: Your Service ID or Template ID in script.js might be wrong.");
            }

            showToast("Confirmation prepared for " + data.email);
        }
    }

    function showReservationSuccess(data) {
        if (reservationForm) reservationForm.style.display = "none";
        if (formTitle) formTitle.style.display = "none";
        if (successMessage) successMessage.style.display = "block";

        document.getElementById("displayBookingId").textContent = data.bookingId;
        document.getElementById("displayName").textContent = data.fullName;
        document.getElementById("displayRoom").textContent = data.roomType;
        document.getElementById("displayGuests").textContent = data.guestCount + (parseInt(data.guestCount) > 1 ? " Persons" : " Person");
        document.getElementById("displayPhone").textContent = data.phoneNumber;
        document.getElementById("displayEmail").textContent = data.email;
        document.getElementById("displayCheckIn").textContent = data.checkIn;
        document.getElementById("displayCheckOut").textContent = data.checkOut;
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener("click", () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            setTimeout(() => {
                reservationForm.reset();
                reservationForm.style.display = "flex";
                formTitle.style.display = "block";
                successMessage.style.display = "none";
            }, 500);
        });
    }

    if (openStatusBtn) {
        openStatusBtn.addEventListener("click", () => {
            statusModal.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
    }

    if (closeStatusBtn) {
        closeStatusBtn.addEventListener("click", () => {
            statusModal.style.display = "none";
            document.body.style.overflow = "auto";
            resetStatusSearch();
        });
    }

    if (btnCheckStatus) btnCheckStatus.addEventListener("click", performStatusLookup);
    if (btnNewSearch) btnNewSearch.addEventListener("click", resetStatusSearch);
    if (btnRetrySearch) btnRetrySearch.addEventListener("click", resetStatusSearch);

    async function performStatusLookup() {
        const searchId = document.getElementById("statusBookingId").value.trim().toUpperCase();
        if (!searchId) return;

        const { query, collection, where, getDocs } = window.firestoreTools;
        const dbFirestore = window.dbFirestore;

        try {
            const q = query(collection(dbFirestore, "reservations"), where("bookingId", "==", searchId));
            const querySnapshot = await getDocs(q);

            statusSearch.style.display = "none";

            if (!querySnapshot.empty) {
                const data = querySnapshot.docs[0].data();
                displayStatusInfo(data);
                statusResult.style.display = "block";
                statusError.style.display = "none";
            } else {
                statusResult.style.display = "none";
                statusError.style.display = "block";
            }
        } catch (error) {
            console.error("Lookup Error:", error);
            alert("Could not connect to database.");
        }
    }

    function displayStatusInfo(data) {
        document.getElementById("resBookingId").textContent = data.bookingId;
        document.getElementById("resName").textContent = data.fullName;
        document.getElementById("resPhone").textContent = data.phoneNumber;
        document.getElementById("resEmail").textContent = data.email || "Not Provided";
        document.getElementById("resRoom").textContent = data.roomType;
        document.getElementById("resGuests").textContent = data.guestCount;
        document.getElementById("resIn").textContent = data.checkIn;
        document.getElementById("resOut").textContent = data.checkOut;
    }

    function resetStatusSearch() {
        statusSearch.style.display = "block";
        statusResult.style.display = "none";
        statusError.style.display = "none";
        document.getElementById("statusBookingId").value = "";
    }

    openBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    const animatableElements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .image-reveal, .reveal-stagger'
    );

    animatableElements.forEach(el => {
        revealObserver.observe(el);
    });

    function showToast(msg) {
        const toast = document.createElement("div");
        toast.className = "toast-notification email-toast";
        toast.style.borderLeftColor = "#c5a059";
        toast.innerHTML = `
            <div class="toast-icon" style="color: #c5a059;"><i class="fas fa-envelope-open-text"></i></div>
            <div class="toast-body">
                <strong>NOTIFICATION</strong>
                <p>${msg}</p>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("fade-out");
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }
});
