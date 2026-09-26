document.addEventListener("DOMContentLoaded", function () {

    const budgetInput = document.getElementById("budgetInput");
    const continueButton = document.getElementById("continueButton");
    const destinationName = document.getElementById("destinationName");
    const API_URL = "https://smart-yatra-api.onrender.com";

    // =========================
    // 1. SMART URL & STORAGE GRABBER
    // =========================
    const params = new URLSearchParams(window.location.search);
    let destination = params.get("destination") || "";

    // Pull from local storage if the URL is empty
    let savedTrip = JSON.parse(localStorage.getItem("smartYatraTrip")) || {};
    if (!destination && savedTrip.destination) {
        destination = savedTrip.destination;
    }

    // Update the big text on the screen
    if (destination) {
        destinationName.textContent = decodeURIComponent(destination);
    } else {
        destinationName.textContent = "Destination missing";
    }

    // =========================
    // 2. THE BUTTON LOGIC
    // =========================
    continueButton.addEventListener("click", async function () {
        const budget = Number(budgetInput.value);

        if (!budget || budget <= 0) {
            budgetInput.style.borderColor = "#ff6b6b";
            return;
        }

        // Lock the button so they don't spam click
        continueButton.disabled = true;
        continueButton.textContent = "Connecting to Database...";

        try {
            // Fetch all DB spots
            const response = await fetch(`${API_URL}/destinations`);
            if (!response.ok) throw new Error("Backend offline. Is Uvicorn running?");
            
            const destinations = await response.json();
            
            // BULLETPROOF SEARCH LOGIC
            const searchQuery = decodeURIComponent(destination).toLowerCase().trim();
            const selected = destinations.find(d => 
                d.name.toLowerCase() === searchQuery || 
                d.city.toLowerCase() === searchQuery
            );

            if (!selected) {
                // If it fails, this will explicitly tell you WHAT word it was looking for
                throw new Error(`Database rejected it: We couldn't find "${searchQuery}". Ensure you are searching for Goa, Manali, or Rishikesh.`);
            }

            // Hit the smart API
            const planRes = await fetch(`${API_URL}/plan-smart-trip/${selected.id}/${budget}`);
            const planData = await planRes.json();
            
            if (!planRes.ok) throw new Error(planData.detail || "Budget calculation failed.");

            // Update the memory and push to the next screen
            savedTrip.destination = selected.name; 
            savedTrip.destinationId = selected.id;
            savedTrip.budget = budget;
            savedTrip.plan = planData;
            
            localStorage.setItem("smartYatraTrip", JSON.stringify(savedTrip));
            window.location.href = "trip-details.html";

        } catch (error) {
            alert(error.message);
            continueButton.disabled = false;
            continueButton.textContent = "Continue";
        }
    });

    // Enter key support
    budgetInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") continueButton.click();
    });
});
