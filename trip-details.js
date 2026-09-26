document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       1. DATA RECOVERY (URL + STORAGE)
    ======================================== */
    const params = new URLSearchParams(window.location.search);
    let destination = params.get("destination") || "";
    let budget = Number(params.get("budget")) || 0;
    
    let existingTrip = {};
    const savedTrip = localStorage.getItem("smartYatraTrip");
    
    if (savedTrip) {
        try {
            existingTrip = JSON.parse(savedTrip);
            if (!destination) destination = existingTrip.destination || "";
            if (!budget) budget = Number(existingTrip.budget) || 0;
        } catch (error) {
            console.log("Could not read previous trip data.");
        }
    }

    /* ========================================
       2. ELEMENTS (WITH FALLBACKS)
    ======================================== */
    const toCity = document.getElementById("toCity");
    const fromCity = document.getElementById("fromCity");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const travellerCount = document.getElementById("travellerCount");
    const minusTraveller = document.getElementById("minusTraveller");
    const plusTraveller = document.getElementById("plusTraveller");
    const budgetDisplay = document.getElementById("budgetDisplay");
    const dateMessage = document.getElementById("dateMessage");
    
    // THE FIX: If "tripDetailsForm" doesn't exist, it just grabs the first form on the page
    const form = document.getElementById("tripDetailsForm") || document.querySelector("form");

    /* ========================================
       3. APPLY DATA SAFELY
    ======================================== */
    if (toCity) {
        toCity.value = destination;
        if (destination) {
            toCity.readOnly = true;
            toCity.classList.add("destination-locked");
        } else {
            toCity.placeholder = "Enter destination";
        }
    }

    if (budgetDisplay) {
        budgetDisplay.textContent = "₹" + budget.toLocaleString("en-IN");
    }

    /* ========================================
       4. DATE & TRAVELLER LOGIC
    ======================================== */
    const today = new Date().toISOString().split("T")[0];
    
    if (startDate && endDate) {
        startDate.min = today;
        endDate.min = today;

        startDate.addEventListener("change", function () {
            if (startDate.value) endDate.min = startDate.value;
            if (endDate.value && endDate.value < startDate.value) endDate.value = "";
            if (dateMessage) dateMessage.textContent = "";
        });

        endDate.addEventListener("change", function () {
            if (startDate.value && endDate.value < startDate.value) {
                if (dateMessage) dateMessage.textContent = "End date must be after the start date.";
            } else {
                if (dateMessage) dateMessage.textContent = "";
            }
        });
    }

    let travellers = 1;
    function updateTravellers() {
        if (travellerCount) travellerCount.textContent = travellers;
    }

    if (plusTraveller) {
        plusTraveller.addEventListener("click", function () {
            if (travellers < 20) {
                travellers++;
                updateTravellers();
            }
        });
    }

    if (minusTraveller) {
        minusTraveller.addEventListener("click", function () {
            if (travellers > 1) {
                travellers--;
                updateTravellers();
            }
        });
    }

    /* ========================================
       5. BULLETPROOF FORM SUBMISSION
    ======================================== */
    if (form) {
        form.addEventListener("submit", function (event) {
            // This physically stops the page from reloading
            event.preventDefault();

            const finalDestination = toCity ? toCity.value.trim() : destination;
            const finalFrom = fromCity ? fromCity.value.trim() : "Not specified";
            const startVal = startDate ? startDate.value : "";
            const endVal = endDate ? endDate.value : "";

            /* Validation */
            if (!finalDestination && toCity) {
                toCity.focus();
                toCity.style.borderColor = "#ff7777";
                setTimeout(() => toCity.style.borderColor = "", 1200);
                return;
            }

            if (!finalFrom && fromCity) {
                fromCity.focus();
                fromCity.style.borderColor = "#ff7777";
                setTimeout(() => fromCity.style.borderColor = "", 1200);
                return;
            }

            if (!startVal || !endVal) {
                if (dateMessage) dateMessage.textContent = "Please select both start and end dates.";
                return;
            }

            if (endVal < startVal) {
                if (dateMessage) dateMessage.textContent = "End date must be after the start date.";
                if (endDate) endDate.focus();
                return;
            }

            if (dateMessage) dateMessage.textContent = "";

            /* Selections */
            const selectedTransport = document.querySelector('input[name="transport"]:checked');
            const transport = selectedTransport ? selectedTransport.value : "Smart Choice";
            
            const selectedInterests = Array.from(document.querySelectorAll(".interest input:checked"))
                .map(item => item.value);

            /* Date Math */
            const start = new Date(startVal + "T00:00:00");
            const end = new Date(endVal + "T00:00:00");
            const tripDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            /* Final Save & Redirect */
            const tripData = {
                ...existingTrip, 
                destination: finalDestination,
                budget: budget,
                from: finalFrom,
                startDate: startVal,
                endDate: endVal,
                days: tripDays,
                travellers: travellers,
                transport: transport,
                interests: selectedInterests
            };

            localStorage.setItem("smartYatraTrip", JSON.stringify(tripData));
            window.location.href = "planning.html";
        });
    } else {
        console.error("FATAL ERROR: Could not find the form to attach the submit event!");
    }
});