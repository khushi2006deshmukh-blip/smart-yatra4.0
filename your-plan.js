document.addEventListener("DOMContentLoaded", () => {
    const rawTrip = localStorage.getItem("smartYatraTrip");
    const rawPlan = localStorage.getItem("smartYatraPlan");

    if (!rawTrip && !rawPlan) {
        window.location.href = "trip-details.html";
        return;
    }

    let trip = {};
    let plan = {};
    try { trip = JSON.parse(rawTrip) || {}; } catch (e) {}
    try { plan = JSON.parse(rawPlan) || {}; } catch (e) {}

    const $ = (id) => document.getElementById(id);
    const money = (val) => "₹" + Number(val || 0).toLocaleString("en-IN");

    function formatDate(value) {
        if (!value) return "Not selected";
        const date = new Date(value + "T00:00:00");
        return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }

    function getDayDate(startDateStr, dayIndex) {
        if (!startDateStr) return `Day ${dayIndex + 1}`;
        const date = new Date(startDateStr + "T00:00:00");
        date.setDate(date.getDate() + dayIndex);
        return Number.isNaN(date.getTime()) ? `Day ${dayIndex + 1}` : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }

    // Dynamic Train Logic
    /* --- EXOTIC FEATURES STYLING --- */
document.addEventListener("DOMContentLoaded", () => {
    const rawTrip = localStorage.getItem("smartYatraTrip");
    const rawPlan = localStorage.getItem("smartYatraPlan");

    if (!rawTrip && !rawPlan) {
        window.location.href = "trip-details.html";
        return;
    }

    let trip = {};
    let plan = {};
    try { trip = JSON.parse(rawTrip) || {}; } catch (e) {}
    try { plan = JSON.parse(rawPlan) || {}; } catch (e) {}

    const $ = (id) => document.getElementById(id);
    const money = (val) => "₹" + Number(val || 0).toLocaleString("en-IN");

    function formatDate(value) {
        if (!value) return "Not selected";
        const date = new Date(value + "T00:00:00");
        return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }

    function getDayDate(startDateStr, dayIndex) {
        if (!startDateStr) return `Day ${dayIndex + 1}`;
        const date = new Date(startDateStr + "T00:00:00");
        date.setDate(date.getDate() + dayIndex);
        return Number.isNaN(date.getTime()) ? `Day ${dayIndex + 1}` : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }

    const destinationName = trip.destination || plan.destination || "Goa";
    const originName = trip.from || "Durg";
    const travellers = Number(trip.travellers || 1);

    // Station Codes Dictionary for Direct Deep Linking
    const stationCodeMap = {
        "durg": "DURG",
        "raipur": "R",
        "delhi": "NDLS",
        "new delhi": "NDLS",
        "mumbai": "CSMT",
        "pune": "PUNE",
        "goa": "MAO",
        "panaji": "MAO",
        "manali": "CDG", // Nearest major railhead Chandigarh
        "chandigarh": "CDG",
        "rishikesh": "RKSH",
        "haridwar": "HW",
        "kolkata": "HWH",
        "bangalore": "SBC"
    };

    const originCode = stationCodeMap[originName.toLowerCase().trim()] || originName.slice(0, 4).toUpperCase();
    const destCode = stationCodeMap[destinationName.toLowerCase().trim()] || destinationName.slice(0, 4).toUpperCase();

    // 1. TOP OVERVIEW
    if ($("planTitle")) $("planTitle").textContent = `${destinationName} Roadmap`;
    if ($("routeDisplay")) $("routeDisplay").textContent = `${originName} (${originCode}) ➔ ${destinationName} (${destCode})`;
    if ($("dateDisplay")) $("dateDisplay").textContent = `${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}`;
    if ($("travellerDisplay")) $("travellerDisplay").textContent = `${travellers} ${travellers === 1 ? 'person' : 'people'}`;
    if ($("transportDisplay")) $("transportDisplay").textContent = trip.transport || "Smart Choice";

    // 2. WEATHER ENGINE
    const destLower = destinationName.toLowerCase();
    let weatherData = {
        icon: "☀️",
        temp: "29°C",
        condition: "Warm & Tropical Breeze",
        outfit: "Breathable cotton clothes, swimwear, sunglasses, and high SPF sunscreen. Keep flip-flops handy!"
    };

    if (destLower.includes("manali") || destLower.includes("shimla")) {
        weatherData = {
            icon: "❄️",
            temp: "11°C",
            condition: "Chilly Alpine Weather",
            outfit: "Thermal innerwear, fleece jackets, waterproof trekking shoes, and a beanie for chilly evenings!"
        };
    } else if (destLower.includes("rishikesh")) {
        weatherData = {
            icon: "🌤️",
            temp: "24°C",
            condition: "Pleasant & Breezy Ghats",
            outfit: "Modest comfortable clothes suitable for temple visits, quick-dry shorts for rafting, and grip sandals."
        };
    }

    if ($("weatherIcon")) $("weatherIcon").textContent = weatherData.icon;
    if ($("weatherTemp")) $("weatherTemp").textContent = weatherData.temp;
    if ($("weatherCondition")) $("weatherCondition").textContent = weatherData.condition;
    if ($("weatherOutfit")) $("weatherOutfit").textContent = weatherData.outfit;

    // 3. BUDGET & HOTEL SWITCHER
    const breakdown = plan.budgetBreakdown || {};
    const intercity = Number(breakdown.intercityTravel || 0);
    let selectedHotelPrice = Number(plan.recommended_hotel?.price || breakdown.stay || 1200);
    const food = Number(breakdown.food || 0);
    const localTrans = Number(breakdown.localTransport || 0);
    const activities = Number(breakdown.activities || 0);

    let userBudget = Number(trip.budget || plan.total_budget || 0);
    if (userBudget === 0) userBudget = 16000;

    function renderBudgetSummary() {
        const estimatedTotal = intercity + selectedHotelPrice + food + localTrans + activities;
        const remaining = userBudget - estimatedTotal;
        const savings = Math.max(0, remaining);

        if ($("budgetDisplay")) $("budgetDisplay").textContent = money(userBudget);
        if ($("userBudget")) $("userBudget").textContent = money(userBudget);
        if ($("estimatedTotal")) $("estimatedTotal").textContent = money(estimatedTotal);
        if ($("remainingBudget")) $("remainingBudget").textContent = money(remaining);
        if ($("savings")) $("savings").textContent = money(savings);

        if ($("intercityTravel")) $("intercityTravel").textContent = money(intercity);
        if ($("stayCost")) $("stayCost").textContent = money(selectedHotelPrice);
        if ($("foodCost")) $("foodCost").textContent = money(food);
        if ($("localTransport")) $("localTransport").textContent = money(localTrans);
        if ($("activitiesCost")) $("activitiesCost").textContent = money(activities);
    }
    renderBudgetSummary();

    const hotelContainer = $("hotelSwitcherList");
    const availableHotels = plan.available_hotels || [
        { name: "Budget Backpackers Inn", price: 1200, rating: 4.1, type: "Budget" },
        { name: "Serene Palms Resort", price: 3800, rating: 4.6, type: "Mid-Range" },
        { name: "Royal Heritage Palace", price: 12500, rating: 4.9, type: "Luxury" }
    ];

    if (hotelContainer) {
        hotelContainer.innerHTML = availableHotels.map((hotel, i) => `
            <div class="hotel-card ${i === 0 ? 'active' : ''}" data-price="${hotel.price}">
                <div class="hotel-tag">${hotel.type}</div>
                <h4>${hotel.name}</h4>
                <div class="hotel-rating">⭐ ${hotel.rating} / 5.0</div>
                <div class="hotel-price">₹${hotel.price.toLocaleString("en-IN")} <span>/ night</span></div>
                <button class="btn-select-hotel">${i === 0 ? 'Selected' : 'Select'}</button>
            </div>
        `).join("");

        const hotelCards = hotelContainer.querySelectorAll(".hotel-card");
        hotelCards.forEach(card => {
            card.addEventListener("click", function() {
                hotelCards.forEach(c => {
                    c.classList.remove("active");
                    c.querySelector("button").textContent = "Select";
                });
                this.classList.add("active");
                this.querySelector("button").textContent = "Selected";
                selectedHotelPrice = Number(this.getAttribute("data-price"));
                renderBudgetSummary();
            });
        });
    }

    // ============================================================
    // 4. ADVANCED TRAIN TRUST & ROUTING ENGINE
    // ============================================================
    function getTrainIntelligence(startDateStr, fromCode, toCode) {
        const today = new Date();
        const tripDate = new Date(startDateStr + "T00:00:00");
        const diffDays = Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));

        let statusText = "🟢 Regular Seats Available";
        let urgencyClass = "normal";
        let confirmationChance = "92% (High Confirmation)";
        let tatkalAdvice = "Tatkal window opens 1 day prior at 10:00 AM (AC) & 11:00 AM (Non-AC).";

        if (diffDays <= 3 && diffDays >= 0) {
            statusText = "⚠️ High Waitlist Risk (Tatkal Advised)";
            urgencyClass = "urgent";
            confirmationChance = "48% (Waitlist Volatile)";
        }

        // Popular recommended trains based on routes
        let recommendedTrains = [
            { no: "12780", name: "Goa Express (Superfast)", time: "Dep: 16:15 ➔ Arr: 06:30", type: "Daily Overnight", fare: "₹650 (SL) | ₹1,750 (3A)" },
            { no: "22230", name: "Vande Bharat / SF Special", time: "Dep: 06:00 ➔ Arr: 14:15", type: "Fastest Express", fare: "₹1,450 (CC) | ₹2,600 (EC)" }
        ];

        if (toCode === "CDG") {
            recommendedTrains = [
                { no: "12011", name: "Kalka Shatabdi Express", time: "Dep: 07:40 ➔ Arr: 11:05", type: "Express Day Train", fare: "₹890 (CC) | ₹1,620 (EC)" },
                { no: "12411", name: "Intercity Express", time: "Dep: 17:15 ➔ Arr: 21:30", type: "Budget Daily", fare: "₹450 (2S) | ₹920 (CC)" }
            ];
        } else if (toCode === "HW" || toCode === "RKSH") {
            recommendedTrains = [
                { no: "12017", name: "Dehradun Shatabdi", time: "Dep: 06:45 ➔ Arr: 11:30", type: "Top Rated Express", fare: "₹910 (CC) | ₹1,740 (EC)" },
                { no: "14041", name: "Mussoorie Express", time: "Dep: 22:25 ➔ Arr: 06:40", type: "Comfort Overnight", fare: "₹420 (SL) | ₹1,150 (3A)" }
            ];
        }

        const confirmTktDeepLink = `https://www.confirmtkt.com/trains/${fromCode}-to-${toCode}`;
        const irctcDirectLink = `https://www.irctc.co.in/nget/train-search`;

        return {
            statusText,
            urgencyClass,
            confirmationChance,
            tatkalAdvice,
            recommendedTrains,
            confirmTktDeepLink,
            irctcDirectLink
        };
    }

    // 5. ITINERARY CARDS RENDERING (ARRIVAL ON DAY 1 & DEPARTURE ON LAST DAY)
    const daysContainer = $("daysContainer");
    if (daysContainer && plan.itinerary) {
        const totalDays = Object.keys(plan.itinerary).length;
        const arrivalTrain = getTrainIntelligence(trip.startDate, originCode, destCode);
        const returnTrain = getTrainIntelligence(trip.endDate, destCode, originCode);

        const crowdLevels = [
            { badge: "🟢 Low Crowd (Serene)", time: "Best Time: 07:00 AM - 09:30 AM" },
            { badge: "🟡 Moderate Footfall", time: "Best Time: 04:00 PM - 06:30 PM" },
            { badge: "🔴 Peak Rush Hours", time: "Avoid 12:00 PM - 03:00 PM" }
        ];

        daysContainer.innerHTML = Object.entries(plan.itinerary).map(([dayKey, activity], index) => {
            const isFirstDay = index === 0;
            const isLastDay = index === totalDays - 1;
            const formattedDayDate = getDayDate(trip.startDate, index);
            const crowd = crowdLevels[index % crowdLevels.length];

            return `
                <article class="itinerary-card">
                    <div class="day-badge-wrapper" style="justify-content: space-between; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="day-number-circle">${index + 1}</div>
                            <div>
                                <h3 class="day-heading">${dayKey}</h3>
                                <span class="day-date">📅 ${formattedDayDate}</span>
                            </div>
                        </div>
                        <div class="crowd-pill">
                            <span>${crowd.badge}</span> • <small>${crowd.time}</small>
                        </div>
                    </div>

                    <p class="day-activity-text">${activity}</p>

                    ${isFirstDay ? `
                        <!-- INBOUND TRAIN INTELLIGENCE CARD -->
                        <div class="train-trust-card">
                            <div class="train-trust-header">
                                <div>
                                    <span class="train-tag">🚆 ONWARD TRAIN ROUTE</span>
                                    <h4 style="margin: 4px 0 0 0; color: #fff;">${originName} (${originCode}) ➔ ${destinationName} (${destCode})</h4>
                                </div>
                                <span class="train-status-pill ${arrivalTrain.urgencyClass}">
                                    ${arrivalTrain.statusText}
                                </span>
                            </div>

                            <!-- Trust Metrics Meter -->
                            <div class="train-metrics-row">
                                <div class="metric-box">
                                    <small>Confirmation Probability</small>
                                    <strong style="color: #10b981;">📊 ${arrivalTrain.confirmationChance}</strong>
                                </div>
                                <div class="metric-box">
                                    <small>Last-Mile Prepaid Cab</small>
                                    <strong style="color: #38bdf8;">🚖 Approx ₹650 - ₹850 to Hotel</strong>
                                </div>
                            </div>

                            <!-- Recommended Trains -->
                            <div class="recommended-trains-list">
                                <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Top Recommended Trains For This Route:</span>
                                ${arrivalTrain.recommendedTrains.map(t => `
                                    <div class="train-item-row">
                                        <div>
                                            <strong style="color: #ffffff;">#${t.no} ${t.name}</strong>
                                            <span style="color: #38bdf8; font-size: 12px; display: block;">⏱️ ${t.time} • ${t.type}</span>
                                        </div>
                                        <div style="text-align: right;">
                                            <span style="color: #10b981; font-weight: bold; font-size: 13px;">${t.fare}</span>
                                        </div>
                                    </div>
                                `).join("")}
                            </div>

                            <!-- Urgent Tatkal Countdown Note -->
                            <div class="tatkal-alert-bar">
                                ⚡ <b>Tatkal Intelligence:</b> ${arrivalTrain.tatkalAdvice}
                            </div>

                            <!-- Action Buttons -->
                            <div class="train-actions" style="margin-top: 14px;">
                                <a href="${arrivalTrain.confirmTktDeepLink}" target="_blank" class="btn-train-confirm">
                                    🔍 Check Live Seat & WL Chance ↗
                                </a>
                                <a href="${arrivalTrain.irctcDirectLink}" target="_blank" class="btn-train-irctc">
                                    🎟️ Book on Official IRCTC ↗
                                </a>
                            </div>
                        </div>
                    ` : isLastDay ? `
                        <!-- RETURN TRAIN INTELLIGENCE CARD -->
                        <div class="train-trust-card return-card">
                            <div class="train-trust-header">
                                <div>
                                    <span class="train-tag" style="color: #f59e0b;">🔄 RETURN JOURNEY TRAIN</span>
                                    <h4 style="margin: 4px 0 0 0; color: #fff;">${destinationName} (${destCode}) ➔ ${originName} (${originCode})</h4>
                                </div>
                                <span class="train-status-pill ${returnTrain.urgencyClass}">
                                    ${returnTrain.statusText}
                                </span>
                            </div>

                            <div class="train-metrics-row">
                                <div class="metric-box">
                                    <small>Return Confirmation Probability</small>
                                    <strong style="color: #10b981;">📊 ${returnTrain.confirmationChance}</strong>
                                </div>
                                <div class="metric-box">
                                    <small>Station Reporting Time</small>
                                    <strong style="color: #f59e0b;">⏰ Reach Station 45m Before Dep</strong>
                                </div>
                            </div>

                            <div class="train-actions" style="margin-top: 14px;">
                                <a href="${returnTrain.confirmTktDeepLink}" target="_blank" class="btn-train-confirm" style="border-color: #f59e0b; color: #f59e0b !important;">
                                    🔍 Check Return Trains & Tatkal ↗
                                </a>
                                <a href="${returnTrain.irctcDirectLink}" target="_blank" class="btn-train-irctc">
                                    🎟️ Book Return Ticket ↗
                                </a>
                            </div>
                        </div>
                    ` : `
                        <div class="navigation-box">
                            <div class="nav-header">
                                <span class="nav-tag">🗺️ TODAY'S NAVIGATION</span>
                            </div>
                            <div class="nav-body">
                                <h4>Explore Around Spot</h4>
                                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.slice(0, 35) + ' ' + destinationName)}" target="_blank" class="btn-maps">
                                    📍 Open on Google Maps ↗
                                </a>
                            </div>
                        </div>
                    `}
                </article>
            `;
        }).join("");
    }

    // 6. SCAMS & SAFETY RADAR
    const safetyContainer = $("safetyRadarList");
    const slangContainer = $("slangList");

    let safetyAlerts = [
        { icon: "⚠️", title: "Unauthorized Station Cab Touts", desc: "Never accept rides from unverified touts shouting outside platforms. Always head directly to the official Prepaid Taxi Booth." },
        { icon: "💰", title: "Overpriced Watersports/Scooter Rentals", desc: "Always negotiate fuel inclusions and check bike tires/brakes before paying upfront." },
        { icon: "📍", title: "Isolated Beach/Cliff Warning", desc: "Avoid empty beach stretches or rocky edge cliffs post 8:30 PM." }
    ];

    let slangs = [
        { phrase: "Kitna loge bhaiya?", meaning: "Standard polite start before auto or taxi hire." },
        { phrase: "Thoda sahi lagao, regular aate hain!", meaning: "Use for instant flea market bargaining discount." },
        { phrase: "Bhaiya meter se chalo", meaning: "Mandatory request for autos to avoid random flat fares." }
    ];

    if (destLower.includes("manali")) {
        safetyAlerts = [
            { icon: "⚠️", title: "Overpriced Snow Suit Rentals", desc: "Roadside shops charge 3x. Rent official suits only from registered HP Tourism kiosks." },
            { icon: "🚗", title: "Black Ice Road Skidding", desc: "Do not self-drive to Atal Tunnel or Rohtang post twilight due to invisible freezing ice." }
        ];
    }

    if (safetyContainer) {
        safetyContainer.innerHTML = safetyAlerts.map(s => `
            <div class="scam-alert-item">
                <span class="scam-icon">${s.icon}</span>
                <div>
                    <h4>${s.title}</h4>
                    <p>${s.desc}</p>
                </div>
            </div>
        `).join("");
    }

    if (slangContainer) {
        slangContainer.innerHTML = slangs.map(sl => `
            <div class="slang-item">
                <strong>"${sl.phrase}"</strong>
                <span>${sl.meaning}</span>
            </div>
        `).join("");
    }

    // 7. PACKING CHECKLIST
    const packingItems = [
        "Govt ID Proof (Aadhaar / Voter ID / Passport)",
        "Power Bank & Mobile Chargers",
        "Prescribed Medicines & First Aid Kit",
        "Weather-Appropriate Clothes & Footwear",
        "Water Bottle & Emergency Snacks",
        "Offline Downloaded Maps & e-Tickets"
    ];
    const packingContainer = $("packingListContainer");
    if (packingContainer) {
        packingContainer.innerHTML = packingItems.map((item, idx) => `
            <label class="check-item">
                <input type="checkbox" id="pack_${idx}">
                <span>${item}</span>
            </label>
        `).join("");
    }

    // 8. EXPENSE TRACKER & SPLIT BILL
    let userExpenses = [];
    try {
        userExpenses = JSON.parse(localStorage.getItem("smartYatraExpenses")) || [];
    } catch (e) {
        userExpenses = [];
    }

    function renderExpenses() {
        const list = $("expenseList");
        const totalDisplay = $("totalSpentDisplay");
        const splitTravellerCount = $("splitTravellerCount");
        const splitPerPerson = $("splitPerPerson");

        let total = 0;
        if (list) {
            list.innerHTML = userExpenses.map((exp, i) => {
                total += Number(exp.amount || 0);
                return `
                    <div class="expense-row">
                        <span>${exp.name}</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <strong style="color: #10b981;">₹${Number(exp.amount).toLocaleString('en-IN')}</strong>
                            <button onclick="removeExpense(${i})" class="btn-del-exp">✕</button>
                        </div>
                    </div>
                `;
            }).join("");
        }

        if (totalDisplay) totalDisplay.textContent = money(total);
        if (splitTravellerCount) splitTravellerCount.textContent = travellers;
        if (splitPerPerson) {
            const perPerson = Math.round(total / (travellers || 1));
            splitPerPerson.textContent = `₹${perPerson.toLocaleString('en-IN')} / person`;
        }
    }

    window.removeExpense = function(index) {
        userExpenses.splice(index, 1);
        localStorage.setItem("smartYatraExpenses", JSON.stringify(userExpenses));
        renderExpenses();
    };

    const addBtn = $("addExpenseBtn");
    const itemInput = $("expenseItem");
    const costInput = $("expenseCost");

    if (addBtn && itemInput && costInput) {
        addBtn.onclick = function() {
            const item = itemInput.value.trim();
            const cost = Number(costInput.value);

            if (!item || isNaN(cost) || cost <= 0) {
                alert("Please enter a valid item and amount.");
                return;
            }

            userExpenses.push({ name: item, amount: cost });
            localStorage.setItem("smartYatraExpenses", JSON.stringify(userExpenses));

            itemInput.value = "";
            costInput.value = "";
            renderExpenses();
        };

        costInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") addBtn.click();
        });
    }
    renderExpenses();

    // 9. LOCAL BUSINESSES
    const localBizList = $("localBusinessList");
    if (localBizList && Array.isArray(plan.local_businesses)) {
        localBizList.innerHTML = plan.local_businesses.map(biz => `
            <div style="border: 1px solid #1e3a5f; background: #0b192c; padding: 16px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <span style="background: #064e3b; color: #34d399; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px;">${biz.badge || '🌱 Local Partner'}</span>
                    <h3 style="color: #fff; margin: 6px 0 2px 0; font-size: 16px;">${biz.name}</h3>
                    <p style="color: #94a3b8; font-size: 13px; margin: 0;">${biz.specialty}</p>
                </div>
                <div style="text-align: right;">
                    <strong style="color: #f59e0b; font-size: 15px; display: block; margin-bottom: 6px;">${biz.estimated_cost}</strong>
                    <a href="https://wa.me/${(biz.contact || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! Found your business on SmartYatra.')}" target="_blank" style="background: #25D366; color: #000; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; text-decoration: none; display: inline-block;">💬 Direct WhatsApp</a>
                </div>
            </div>
        `).join("");
    }

    // 10. WHATSAPP EXPORT
    const waBtn = $("whatsappShareBtn");
    if (waBtn) {
        waBtn.addEventListener("click", () => {
            const waText = `🌟 *My Smart Yatra Plan* 🌟\n` +
                           `📍 *Route:* ${originName} ➔ ${destinationName}\n` +
                           `📅 *Dates:* ${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}\n` +
                           `💰 *Budget:* ₹${userBudget.toLocaleString('en-IN')}\n\n` +
                           `Check out Smart Yatra for optimized itinerary and direct vendor connections!`;
            window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
        });
    }
});

    // 1. TOP OVERVIEW SECTION
    const destinationName = trip.destination || plan.destination || "Destination";
    const originName = trip.from || "Origin";

    if ($("planTitle")) $("planTitle").textContent = `${destinationName} Roadmap`;
    if ($("routeDisplay")) $("routeDisplay").textContent = `${originName} → ${destinationName}`;
    if ($("dateDisplay")) $("dateDisplay").textContent = `${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}`;
    if ($("travellerDisplay")) $("travellerDisplay").textContent = `${trip.travellers || 1} ${Number(trip.travellers || 1) === 1 ? 'person' : 'people'}`;
    if ($("transportDisplay")) $("transportDisplay").textContent = trip.transport || "Smart Choice";

    // 2. BUDGET CALCULATION & INJECTION
    const breakdown = plan.budgetBreakdown || {};
    const intercity = Number(breakdown.intercityTravel || 0);
    const stay = Number(breakdown.stay || 0);
    const food = Number(breakdown.food || 0);
    const localTrans = Number(breakdown.localTransport || 0);
    const activities = Number(breakdown.activities || 0);

    const estimatedTotal = Number(plan.estimatedTotal || (intercity + stay + food + localTrans + activities));

    // Budget fallback agar trip se direct 0 mila ho
    let userBudget = Number(trip.budget || plan.total_budget || 0);
    if (userBudget === 0 && estimatedTotal > 0) {
        userBudget = estimatedTotal + 3700;
    }

    const remaining = userBudget - estimatedTotal;
    const savings = Math.max(0, remaining);

    // Exact matching IDs with your-plan.html
    if ($("budgetDisplay")) $("budgetDisplay").textContent = money(userBudget);
    if ($("userBudget")) $("userBudget").textContent = money(userBudget);
    if ($("estimatedTotal")) $("estimatedTotal").textContent = money(estimatedTotal);
    if ($("remainingBudget")) $("remainingBudget").textContent = money(remaining);
    if ($("savings")) $("savings").textContent = money(savings);

    if ($("intercityTravel")) $("intercityTravel").textContent = money(intercity);
    if ($("stayCost")) $("stayCost").textContent = money(stay);
    if ($("foodCost")) $("foodCost").textContent = money(food);
    if ($("localTransport")) $("localTransport").textContent = money(localTrans);
    if ($("activitiesCost")) $("activitiesCost").textContent = money(activities);

    // 3. RENDER DAY-BY-DAY CARDS WITH TRAIN & MAPS
    const daysContainer = $("daysContainer");
    if (daysContainer && plan.itinerary) {
        const trainSmart = getTrainSmartStatus(trip.startDate, userBudget);

        daysContainer.innerHTML = Object.entries(plan.itinerary).map(([dayKey, activity], index) => {
            const isFirstDay = index === 0;
            const formattedDayDate = getDayDate(trip.startDate, index);

            return `
                <article class="itinerary-card">
                    <div class="day-badge-wrapper">
                        <div class="day-number-circle">${index + 1}</div>
                        <div>
                            <h3 class="day-heading">${dayKey}</h3>
                            <span class="day-date">📅 ${formattedDayDate}</span>
                        </div>
                    </div>

                    <p class="day-activity-text">${activity}</p>

                    ${isFirstDay ? `
                        <div class="train-route-box">
                            <div class="train-box-header">
                                <span class="train-tag">🚆 TRAIN ROUTING</span>
                                <span class="train-status-pill ${trainSmart.isUrgent ? 'urgent' : 'normal'}">
                                    ${trainSmart.status}
                                </span>
                            </div>
                            <div class="train-box-body">
                                <h4>${originName} ➔${destinationName}</h4>
                                <p class="train-class">💡 Recommended Class: <b>${trainSmart.classType}</b></p>
                                <div class="train-actions">
                                    <a href="https://www.irctc.co.in/nget/train-search" target="_blank" class="btn-train-irctc">Book on IRCTC ↗</a>
                                    <a href=${`https://www.confirmtkt.com/train-search?from=${fromC}&to=${toC}`} target="_blank" class="btn-train-confirm">Check Seat Availability & Tatkal ↗</a>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="navigation-box">
                            <div class="nav-header">
                                <span class="nav-tag">🗺️ TODAY'S NAVIGATION</span>
                            </div>
                            <div class="nav-body">
                                <h4>Explore Around Spot</h4>
                                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.slice(0, 35) + ' ' + destinationName)}" target="_blank" class="btn-maps">
                                    📍 Open on Google Maps ↗
                                </a>
                            </div>
                        </div>
                    `}
                </article>
            `;
        }).join("");
    }

    // 4. RENDER LOCAL BUSINESSES
    const localBizList = $("localBusinessList");
    if (localBizList && Array.isArray(plan.local_businesses)) {
        localBizList.innerHTML = plan.local_businesses.map(biz => `
            <div style="border: 1px solid #1e3a5f; background: #0b192c; padding: 16px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <span style="background: #064e3b; color: #34d399; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px;">${biz.badge || '🌱 Local Partner'}</span>
                    <h3 style="color: #fff; margin: 6px 0 2px 0; font-size: 16px;">${biz.name}</h3>
                    <p style="color: #94a3b8; font-size: 13px; margin: 0;">${biz.specialty}</p>
                </div>
                <div style="text-align: right;">
                    <strong style="color: #f59e0b; font-size: 15px; display: block; margin-bottom: 6px;">${biz.estimated_cost}</strong>
                    <a href="https://wa.me/${(biz.contact || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! Found your business on SmartYatra.')}" target="_blank" style="background: #25D366; color: #000; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; text-decoration: none; display: inline-block;">💬 Direct WhatsApp</a>
                </div>
            </div>
        `).join("");
    }
});
// ==========================================
    // 5. SMART PACKING CHECKLIST (FIXED)
    // ==========================================
    const packingItems = [
        "Govt ID Proof (Aadhaar / Voter ID / Passport)",
        "Power Bank & Mobile Chargers",
        "Prescribed Medicines & First Aid Kit",
        "Light/Comfortable Footwear & Clothes",
        "Water Bottle & Light Snacks",
        "Offline Downloaded Maps & Tickets"
    ];

    const packingContainer = document.getElementById("packingListContainer");
    if (packingContainer) {
        packingContainer.innerHTML = packingItems.map((item, idx) => `
            <label style="display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 14px; margin-bottom: 10px; cursor: pointer;">
                <input type="checkbox" id="pack_${idx}" style="width: 18px; height: 18px; accent-color: #10b981; cursor: pointer;">
                <span>${item}</span>
            </label>
        `).join("");
    }

    // ==========================================
    // 6. DAILY EXPENSE TRACKER (FIXED & ATTACHED)
    // ==========================================
    let userExpenses = [];
    try {
        userExpenses = JSON.parse(localStorage.getItem("smartYatraExpenses")) || [];
    } catch (e) {
        userExpenses = [];
    }

    function renderExpenses() {
        const list = document.getElementById("expenseList");
        const totalDisplay = document.getElementById("totalSpentDisplay");
        if (!list) return;

        let total = 0;
        list.innerHTML = userExpenses.map((exp, i) => {
            total += Number(exp.amount || 0);
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; background: #081325; padding: 8px 12px; border-radius: 6px; font-size: 13px; color: #cbd5e1; margin-bottom: 8px; border: 1px solid #1e293b;">
                    <span>${exp.name}</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <strong style="color: #10b981;">₹${Number(exp.amount).toLocaleString('en-IN')}</strong>
                        <button onclick="removeExpense(${i})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-weight: bold; font-size: 14px;">✕</button>
                    </div>
                </div>
            `;
        }).join("");

        if (totalDisplay) {
            totalDisplay.textContent = "₹" + total.toLocaleString("en-IN");
        }
    }

    window.removeExpense = function(index) {
        userExpenses.splice(index, 1);
        localStorage.setItem("smartYatraExpenses", JSON.stringify(userExpenses));
        renderExpenses();
    };

    const addBtn = document.getElementById("addExpenseBtn");
    const itemInput = document.getElementById("expenseItem");
    const costInput = document.getElementById("expenseCost");

    if (addBtn && itemInput && costInput) {
        // Click par add
        addBtn.onclick = function() {
            const item = itemInput.value.trim();
            const cost = Number(costInput.value);

            if (!item || isNaN(cost) || cost <= 0) {
                alert("Please enter a valid item name and amount.");
                return;
            }

            userExpenses.push({ name: item, amount: cost });
            localStorage.setItem("smartYatraExpenses", JSON.stringify(userExpenses));

            itemInput.value = "";
            costInput.value = "";
            renderExpenses();
        };

        // Enter press karne par add
        costInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") addBtn.click();
        });
    }

    renderExpenses();
    document.addEventListener("DOMContentLoaded", () => {
    const rawTrip = localStorage.getItem("smartYatraTrip");
    const rawPlan = localStorage.getItem("smartYatraPlan");

    if (!rawTrip && !rawPlan) {
        window.location.href = "trip-details.html";
        return;
    }

    let trip = {};
    let plan = {};
    try { trip = JSON.parse(rawTrip) || {}; } catch (e) {}
    try { plan = JSON.parse(rawPlan) || {}; } catch (e) {}

    const $ = (id) => document.getElementById(id);
    const money = (val) => "₹" + Number(val || 0).toLocaleString("en-IN");

    function formatDate(value) {
        if (!value) return "Not selected";
        const date = new Date(value + "T00:00:00");
        return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }

    function getDayDate(startDateStr, dayIndex) {
        if (!startDateStr) return `Day ${dayIndex + 1}`;
        const date = new Date(startDateStr + "T00:00:00");
        date.setDate(date.getDate() + dayIndex);
        return Number.isNaN(date.getTime()) ? `Day ${dayIndex + 1}` : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }

    const destinationName = trip.destination || plan.destination || "Goa";
    const originName = trip.from || "Origin";
    const travellers = Number(trip.travellers || 1);

    // 1. TOP OVERVIEW
    if ($("planTitle")) $("planTitle").textContent = `${destinationName} Roadmap`;
    if ($("routeDisplay")) $("routeDisplay").textContent = `${originName} → ${destinationName}`;
    if ($("dateDisplay")) $("dateDisplay").textContent = `${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}`;
    if ($("travellerDisplay")) $("travellerDisplay").textContent = `${travellers} ${travellers === 1 ? 'person' : 'people'}`;
    if ($("transportDisplay")) $("transportDisplay").textContent = trip.transport || "Smart Choice";

    // ==========================================
    // EXOTIC FEATURE 1: WEATHER & OUTFIT ENGINE
    // ==========================================
    <section class="section-card weather-card">
            <div class="section-heading">
                <div>
                    <span class="section-kicker">LIVE CLIMATE FORECAST</span>
                    <h2>📈 Day-by-Day Temperature Trend & Weather Guide</h2>
                </div>
                <div class="status-badge">DAILY FORECAST</div>
            </div>
            <p class="section-description">
                Trip ke har din ka estimated temperature curve aur uske hisab se climate & packing advice.
            </p>

            <div style="background: #08111f; border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; padding: 18px; margin-top: 14px;">
                <div style="height: 220px; width: 100%; position: relative;">
                    <canvas id="weatherTempChart"></canvas>
                </div>
            </div>

            <div id="multiDayWeatherGrid" class="weather-forecast-grid" style="margin-top: 16px;"></div>
        </section>
    // ==========================================
    // 2. BUDGET CALCULATION & HOTEL SWITCHER
    // ==========================================
    const breakdown = plan.budgetBreakdown || {};
    const intercity = Number(breakdown.intercityTravel || 0);
    let selectedHotelPrice = Number(plan.recommended_hotel?.price || breakdown.stay || 1200);
    const food = Number(breakdown.food || 0);
    const localTrans = Number(breakdown.localTransport || 0);
    const activities = Number(breakdown.activities || 0);

    let userBudget = Number(trip.budget || plan.total_budget || 0);
    if (userBudget === 0) userBudget = 16000;

    function renderBudgetSummary() {
        const estimatedTotal = intercity + selectedHotelPrice + food + localTrans + activities;
        const remaining = userBudget - estimatedTotal;
        const savings = Math.max(0, remaining);

        if ($("budgetDisplay")) $("budgetDisplay").textContent = money(userBudget);
        if ($("userBudget")) $("userBudget").textContent = money(userBudget);
        if ($("estimatedTotal")) $("estimatedTotal").textContent = money(estimatedTotal);
        if ($("remainingBudget")) $("remainingBudget").textContent = money(remaining);
        if ($("savings")) $("savings").textContent = money(savings);

        if ($("intercityTravel")) $("intercityTravel").textContent = money(intercity);
        if ($("stayCost")) $("stayCost").textContent = money(selectedHotelPrice);
        if ($("foodCost")) $("foodCost").textContent = money(food);
        if ($("localTransport")) $("localTransport").textContent = money(localTrans);
        if ($("activitiesCost")) $("activitiesCost").textContent = money(activities);
    }
    renderBudgetSummary();

    const hotelContainer = $("hotelSwitcherList");
    const availableHotels = plan.available_hotels || [
        { name: "Budget Backpackers", price: 1200, rating: 4.1, type: "Budget" },
        { name: "Serene Palms Resort", price: 3800, rating: 4.6, type: "Mid-Range" },
        { name: "Royal Heritage Villa", price: 12500, rating: 4.9, type: "Luxury" }
    ];

    if (hotelContainer) {
        hotelContainer.innerHTML = availableHotels.map((hotel, i) => `
            <div class="hotel-card ${i === 0 ? 'active' : ''}" data-price="${hotel.price}" data-name="${hotel.name}">
                <div class="hotel-tag">${hotel.type}</div>
                <h4>${hotel.name}</h4>
                <div class="hotel-rating">⭐ ${hotel.rating} / 5.0</div>
                <div class="hotel-price">₹${hotel.price.toLocaleString("en-IN")} <span>/ night</span></div>
                <button class="btn-select-hotel">${i === 0 ? 'Selected' : 'Select'}</button>
            </div>
        `).join("");

        const hotelCards = hotelContainer.querySelectorAll(".hotel-card");
        hotelCards.forEach(card => {
            card.addEventListener("click", function() {
                hotelCards.forEach(c => {
                    c.classList.remove("active");
                    c.querySelector("button").textContent = "Select";
                });
                this.classList.add("active");
                this.querySelector("button").textContent = "Selected";
                selectedHotelPrice = Number(this.getAttribute("data-price"));
                renderBudgetSummary();
            });
        });
    }

    // ==========================================
    // EXOTIC FEATURE 2: CROWD METER ITINERARY
    // ==========================================
    function getTrainSmartStatus(startDateStr, budget) {
        if (!startDateStr) return { status: "Regular Booking Open", classType: "3AC / Sleeper", isUrgent: false };
        const today = new Date();
        const tripDate = new Date(startDateStr + "T00:00:00");
        const diffDays = Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));

        let status = "Regular Booking Open";
        let isUrgent = false;

        if (diffDays <= 2 && diffDays >= 0) {
            status = "⚠️ High Waitlist Risk (Tatkal Needed)";
            isUrgent = true;
        }

        let classType = "Sleeper Class (SL)";
        if (budget > 10000) classType = "2AC / 1AC Premium";
        else if (budget > 4000) classType = "3AC Comfort";

        return { status, classType, isUrgent };
    }

    // Crowd & Best Time Generator
    const crowdLevels = [
        { badge: "🟢 Low Crowd (Serene)", time: "Best Time: 07:00 AM - 09:30 AM" },
        { badge: "🟡 Moderate Footfall", time: "Best Time: 04:00 PM - 06:30 PM" },
        { badge: "🔴 Peak Rush Hours", time: "Avoid 12:00 PM - 03:00 PM" }
    ];

    const daysContainer = $("daysContainer");
    if (daysContainer && plan.itinerary) {
        const trainSmart = getTrainSmartStatus(trip.startDate, userBudget);

        daysContainer.innerHTML = Object.entries(plan.itinerary).map(([dayKey, activity], index) => {
            const isFirstDay = index === 0;
            const formattedDayDate = getDayDate(trip.startDate, index);
            const crowd = crowdLevels[index % crowdLevels.length];

            return `
                <article class="itinerary-card">
                    <div class="day-badge-wrapper" style="justify-content: space-between; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="day-number-circle">${index + 1}</div>
                            <div>
                                <h3 class="day-heading">${dayKey}</h3>
                                <span class="day-date">📅 ${formattedDayDate}</span>
                            </div>
                        </div>
                        <div class="crowd-pill">
                            <span>${crowd.badge}</span> • <small>${crowd.time}</small>
                        </div>
                    </div>

                    <p class="day-activity-text">${activity}</p>

                    ${isFirstDay ? `
                        <div class="train-route-box">
                            <div class="train-box-header">
                                <span class="train-tag">🚆 TRAIN ROUTING</span>
                                <span class="train-status-pill ${trainSmart.isUrgent ? 'urgent' : 'normal'}">
                                    ${trainSmart.status}
                                </span>
                            </div>
                            <div class="train-box-body">
                                <h4>${originName} ➔${destinationName}</h4>
                                <p class="train-class">💡 Recommended Class: <b>${trainSmart.classType}</b></p>
                                <div class="train-actions">
                                    <a href="https://www.irctc.co.in/nget/train-search" target="_blank" class="btn-train-irctc">Book on IRCTC ↗</a>
                                    <a href="https://www.confirmtkt.com/train-running-status" target="_blank" class="btn-train-confirm">Check Tatkal Availability ↗</a>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="navigation-box">
                            <div class="nav-header">
                                <span class="nav-tag">🗺️ TODAY'S NAVIGATION</span>
                            </div>
                            <div class="nav-body">
                                <h4>Explore Around Spot</h4>
                                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.slice(0, 35) + ' ' + destinationName)}" target="_blank" class="btn-maps">
                                    📍 Open on Google Maps ↗
                                </a>
                            </div>
                        </div>
                    `}
                </article>
            `;
        }).join("");
    }

    // ==========================================
    // EXOTIC FEATURE 3 & 4: SCAMS & SLANGS RADAR
    // ==========================================
    const safetyContainer = $("safetyRadarList");
    const slangContainer = $("slangList");

    let safetyAlerts = [
        { icon: "⚠️", title: "Unauthorized Taxi Touts", desc: "Never accept rides from random touts inside station/airport. Always book from prepaid booths or verified apps." },
        { icon: "💰", title: "Overpriced Watersports/Rentals", desc: "Always fix the final price including fuel and safety gear before hopping on a scooter or jet ski." },
        { icon: "📍", title: "Isolated Beach/Cliff Safety", desc: "Avoid unfrequented beach stretches or high cliff viewpoints post 8:30 PM." }
    ];

    let slangs = [
        { phrase: "Kitna loge bhaiya? (How much?)", meaning: "Polite start before auto/taxi hire." },
        { phrase: "Thoda sahi lagao, regular aate hain!", meaning: "Use for instant flea market bargaining." },
        { phrase: "Kiti jale? (In Konkani / Local)", meaning: "Means 'How much?' — signals you aren't an easy tourist." },
        { phrase: "Bhaiya meter se chalo", meaning: "Mandatory for local autos to avoid 2x flat fares." }
    ];

    if (destLower.includes("manali")) {
        safetyAlerts = [
            { icon: "⚠️", title: "Overpriced Snow Suit Rentals", desc: "Shops on the way to Solang charge 3x. Rent approved suits only from government fixed-rate kiosks." },
            { icon: "🚗", title: "Black Ice Road Warning", desc: "Do not self-drive to Rohtang/Atal Tunnel after dark due to invisible black ice skidding risk." },
            { icon: "🧗", title: "Paragliding Operator Check", desc: "Verify HP Tourism license of your pilot before tandem flights." }
        ];
        slangs = [
            { phrase: "Theek bhav lagao bhaiya", meaning: "Universal mountain market bargaining phrase." },
            { phrase: "Aage rasta kaisa hai?", meaning: "Asking local cabbies about road clearance/landslide status." },
            { phrase: "Kadak chai milegi?", meaning: "Best way to strike up genuine talks with local dhaba owners." }
        ];
    }

    if (safetyContainer) {
        safetyContainer.innerHTML = safetyAlerts.map(s => `
            <div class="scam-alert-item">
                <span class="scam-icon">${s.icon}</span>
                <div>
                    <h4>${s.title}</h4>
                    <p>${s.desc}</p>
                </div>
            </div>
        `).join("");
    }

    if (slangContainer) {
        slangContainer.innerHTML = slangs.map(sl => `
            <div class="slang-item">
                <strong>"${sl.phrase}"</strong>
                <span>${sl.meaning}</span>
            </div>
        `).join("");
    }

    // ==========================================
    // 5. PACKING CHECKLIST
    // ==========================================
    const packingItems = [
        "Govt ID Proof (Aadhaar / Voter ID / Passport)",
        "Power Bank & Mobile Chargers",
        "Prescribed Medicines & First Aid Kit",
        "Weather-Appropriate Clothes & Footwear",
        "Water Bottle & Emergency Snacks",
        "Offline Downloaded Maps & e-Tickets"
    ];
    const packingContainer = $("packingListContainer");
    if (packingContainer) {
        packingContainer.innerHTML = packingItems.map((item, idx) => `
            <label class="check-item">
                <input type="checkbox" id="pack_${idx}">
                <span>${item}</span>
            </label>
        `).join("");
    }

    // ==========================================
    // EXOTIC FEATURE 5: EXPENSE TRACKER + SPLIT BILL
    // ==========================================
    let userExpenses = [];
    try {
        userExpenses = JSON.parse(localStorage.getItem("smartYatraExpenses")) || [];
    } catch (e) {
        userExpenses = [];
    }

    function renderExpenses() {
        const list = $("expenseList");
        const totalDisplay = $("totalSpentDisplay");
        const splitTravellerCount = $("splitTravellerCount");
        const splitPerPerson = $("splitPerPerson");

        let total = 0;
        if (list) {
            list.innerHTML = userExpenses.map((exp, i) => {
                total += Number(exp.amount || 0);
                return `
                    <div class="expense-row">
                        <span>${exp.name}</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <strong style="color: #10b981;">₹${Number(exp.amount).toLocaleString('en-IN')}</strong>
                            <button onclick="removeExpense(${i})" class="btn-del-exp">✕</button>
                        </div>
                    </div>
                `;
            }).join("");
        }

        if (totalDisplay) totalDisplay.textContent = money(total);
        if (splitTravellerCount) splitTravellerCount.textContent = travellers;
        if (splitPerPerson) {
            const perPerson = Math.round(total / (travellers || 1));
            splitPerPerson.textContent = `₹${perPerson.toLocaleString('en-IN')} / person`;
        }
    }

    window.removeExpense = function(index) {
        userExpenses.splice(index, 1);
        localStorage.setItem("smartYatraExpenses", JSON.stringify(userExpenses));
        renderExpenses();
    };

    const addBtn = $("addExpenseBtn");
    const itemInput = $("expenseItem");
    const costInput = $("expenseCost");

    if (addBtn && itemInput && costInput) {
        addBtn.onclick = function() {
            const item = itemInput.value.trim();
            const cost = Number(costInput.value);

            if (!item || isNaN(cost) || cost <= 0) {
                alert("Please enter a valid item and amount.");
                return;
            }

            userExpenses.push({ name: item, amount: cost });
            localStorage.setItem("smartYatraExpenses", JSON.stringify(userExpenses));

            itemInput.value = "";
            costInput.value = "";
            renderExpenses();
        };

        costInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") addBtn.click();
        });
    }
    renderExpenses();

    // ==========================================
    // 6. LOCAL BUSINESSES
    // ==========================================
    const localBizList = $("localBusinessList");
    if (localBizList && Array.isArray(plan.local_businesses)) {
        localBizList.innerHTML = plan.local_businesses.map(biz => `
            <div style="border: 1px solid #1e3a5f; background: #0b192c; padding: 16px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <span style="background: #064e3b; color: #34d399; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px;">${biz.badge || '🌱 Local Partner'}</span>
                    <h3 style="color: #fff; margin: 6px 0 2px 0; font-size: 16px;">${biz.name}</h3>
                    <p style="color: #94a3b8; font-size: 13px; margin: 0;">${biz.specialty}</p>
                </div>
                <div style="text-align: right;">
                    <strong style="color: #f59e0b; font-size: 15px; display: block; margin-bottom: 6px;">${biz.estimated_cost}</strong>
                    <a href="https://wa.me/${(biz.contact || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! Found your business on SmartYatra.')}" target="_blank" style="background: #25D366; color: #000; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; text-decoration: none; display: inline-block;">💬 Direct WhatsApp</a>
                </div>
            </div>
        `).join("");
    }

    // ==========================================
    // 7. WHATSAPP SHAREABLE PLAN
    // ==========================================
    const waBtn = $("whatsappShareBtn");
    if (waBtn) {
        waBtn.addEventListener("click", () => {
            const waText = `🌟 *My Smart Yatra Plan* 🌟\n` +
                           `📍 *Route:* ${originName} ➔ ${destinationName}\n` +
                           `📅 *Dates:* ${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}\n` +
                           `💰 *Budget:* ₹${userBudget.toLocaleString('en-IN')}\n\n` +
                           `Check out Smart Yatra for an optimized trip plan!`;
            window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
        });
    }
});