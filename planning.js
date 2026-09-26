document.addEventListener("DOMContentLoaded", async () => {

    const raw = localStorage.getItem("smartYatraTrip");

    if (!raw) {
        location.href = "trip-details.html";
        return;
    }

    let trip;

    try {
        trip = JSON.parse(raw);
    } catch {
        localStorage.removeItem("smartYatraTrip");
        location.href = "trip-details.html";
        return;
    }


    // =========================
    // ELEMENTS
    // =========================

    const q = id => document.getElementById(id);

    const route = q("routeDisplay");
    const date = q("dateDisplay");
    const budget = q("budgetDisplay");
    const trav = q("travellerDisplay");
    const trans = q("transportDisplay");
    const pct = q("percentage");
    const fill = q("progressFill");
    const err = q("planningError");


    // =========================
    // DISPLAY TRIP DETAILS
    // =========================

    route.textContent =
        `${trip.from || "Starting point"} → ${trip.destination || "Destination"}`;

    const fd = v =>
        v
            ? new Date(v + "T00:00:00").toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )
            : "Not selected";

    date.textContent =
        `${fd(trip.startDate)} — ${fd(trip.endDate)}`;

    budget.textContent =
        `₹${Number(trip.budget || 0).toLocaleString("en-IN")}`;

    trav.textContent =
        `${trip.travellers || 1} ${
            Number(trip.travellers || 1) === 1
                ? "person"
                : "people"
        }`;

    trans.textContent =
        trip.transport || "Smart Choice";


    // =========================
    // PROGRESS STEPS
    // =========================

    const steps =
        [...document.querySelectorAll(".process-step")];

    function step(n, status = "Working") {

        steps.forEach((s, i) => {

            const st =
                s.querySelector(".step-status");

            const ic =
                s.querySelector(".step-icon span");

            s.classList.remove(
                "active",
                "completed"
            );

            if (
                i < n ||
                (i === n && status === "Completed")
            ) {

                s.classList.add("completed");

                st.textContent = "Completed";
                ic.textContent = "✓";

            } else if (i === n) {

                s.classList.add("active");

                st.textContent = status;

                ic.textContent =
                    String(i + 1).padStart(2, "0");

            } else {

                st.textContent = "Waiting";

                ic.textContent =
                    String(i + 1).padStart(2, "0");
            }

        });

        const p =
            Math.round(
                n /
                Math.max(1, steps.length - 1) *
                100
            );

        fill.style.width = p + "%";
        pct.textContent = p + "%";
    }


    // =========================
    // CALL FASTAPI
    // =========================

    try {

        step(0);


        // 1. Get destinations from FastAPI

        const destinationsResponse =
            await fetch(
                "http://127.0.0.1:8000/destinations"
            );

        if (!destinationsResponse.ok) {
            throw new Error(
                "Could not connect to the travel backend."
            );
        }

        const destinations =
            await destinationsResponse.json();


        // 2. Find selected destination

        const selectedDestination = destinations.find(d => {
            const searchQuery = String(trip.destination || "").trim().toLowerCase();
            return d.name.toLowerCase() === searchQuery || 
                   d.city.toLowerCase() === searchQuery;
        });


        if (!selectedDestination) {
            throw new Error(
                `Destination "${trip.destination}" was not found.`
            );
        }


        const destinationId =
            selectedDestination.id;


        step(1);


        // 3. Call Smart Trip API

        const apiURL = `http://127.0.0.1:8000/plan-smart-trip/${destinationId}/${Number(trip.budget)}?days=${trip.days || 3}`;


        const response =
            await fetch(apiURL);


        const data =
            await response.json();


        // 4. Handle backend errors

        if (!response.ok) {

            throw new Error(
                data.detail ||
                `Backend error ${response.status}`
            );

        }


        // 5. Complete planning animation

        for (
            let i = 2;
            i < steps.length;
            i++
        ) {

            step(i);

            await new Promise(
                resolve =>
                    setTimeout(resolve, 300)
            );
        }


        step(
            steps.length - 1,
            "Completed"
        );

        fill.style.width = "100%";
        pct.textContent = "100%";


        // 6. Save API result

        localStorage.setItem(
            "smartYatraPlan",
            JSON.stringify(data)
        );


        // 7. Go to final plan

        location.href = "your-plan.html";


    } catch (e) {

        console.error(
            "SMART YATRA PLANNING ERROR:",
            e
        );

        if (err) {

            err.hidden = false;

            err.innerHTML = `
                <strong>Planning could not be completed.</strong>
                <p>${e.message}</p>
                <button onclick="location.href='trip-details.html'">
                    EDIT TRIP DETAILS
                </button>
            `;
        }

        step(1, "Error");
    }

});