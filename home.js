/* =========================================================
   SMART YATRA - HOME PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   1. RANDOM HERO BACKGROUND
========================================================= */

const heroImages = [

    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2200&q=90",

    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2200&q=90",

    "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=2200&q=90",

    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2200&q=90",

    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=2200&q=90",

    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2200&q=90"

];


function setRandomHeroBackground() {

    const hero = document.querySelector(".hero");

    if (!hero) {
        return;
    }

    const previousImage =
        localStorage.getItem("smartYatraHeroImage");

    let randomImage;

    do {

        randomImage =
            heroImages[
            Math.floor(
                Math.random() * heroImages.length
            )
            ];

    } while (
        randomImage === previousImage &&
        heroImages.length > 1
    );


    localStorage.setItem(
        "smartYatraHeroImage",
        randomImage
    );


    hero.style.backgroundImage =
        `url("${randomImage}")`;

    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
    hero.style.backgroundRepeat = "no-repeat";
}


/* =========================================================
   2. TRAVELLERS & DAYS
========================================================= */

let travellers = 2;
let days = 5;


const travellersDisplay =
    document.getElementById("travellers");

const daysDisplay =
    document.getElementById("days");


const plusButtons =
    document.querySelectorAll(".plus-btn");

const minusButtons =
    document.querySelectorAll(".minus-btn");


function updateTravellers() {

    if (travellersDisplay) {

        travellersDisplay.textContent =
            travellers +
            (travellers === 1
                ? " Person"
                : " People");

    }

}


function updateDays() {

    if (daysDisplay) {

        daysDisplay.textContent =
            days +
            (days === 1
                ? " Day"
                : " Days");

    }

}


plusButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    this.dataset.target;


                if (target === "travellers") {

                    travellers++;

                    updateTravellers();

                }


                if (target === "days") {

                    days++;

                    updateDays();

                }

            }
        );

    }
);


minusButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    this.dataset.target;


                if (
                    target === "travellers" &&
                    travellers > 1
                ) {

                    travellers--;

                    updateTravellers();

                }


                if (
                    target === "days" &&
                    days > 1
                ) {

                    days--;

                    updateDays();

                }

            }
        );

    }
);


/* =========================================================
   3. DESTINATION
========================================================= */

const destinationInput =
    document.getElementById("destination");

const destinationResult =
    document.getElementById("destinationResult");

const selectedDestination =
    document.getElementById("selectedDestination");

const selectedDestinationName =
    document.getElementById("selectedDestinationName");

const destinationTags =
    document.querySelectorAll(".destination-tag");

const destinationResultCard =
    document.querySelector(".destination-result-card");


function selectDestination(destination) {

    if (destinationInput) {

        destinationInput.value =
            destination;

    }


    if (selectedDestinationName) {

        selectedDestinationName.textContent =
            destination;

    }


    if (selectedDestination) {

        selectedDestination.style.display =
            "flex";

    }


    if (destinationResult) {

        destinationResult.style.display =
            "none";

    }


    destinationTags.forEach(
        function (tag) {

            tag.classList.remove("selected");

        }
    );


    destinationTags.forEach(
        function (tag) {

            if (
                tag.dataset.destination ===
                destination
            ) {

                tag.classList.add("selected");

            }

        }
    );

}


/* Destination typing */

if (destinationInput) {

    destinationInput.addEventListener(
        "input",
        function () {

            const value =
                this.value
                    .trim()
                    .toLowerCase();


            if (value === "") {

                if (destinationResult) {

                    destinationResult.style.display =
                        "none";

                }


                if (selectedDestination) {

                    selectedDestination.style.display =
                        "none";

                }

                return;

            }


            if ("jaipur".includes(value)) {

                if (destinationResult) {

                    destinationResult.style.display =
                        "block";

                }

            } else {

                if (destinationResult) {

                    destinationResult.style.display =
                        "none";

                }

            }

        }
    );

}


/* Destination result */

if (destinationResultCard) {

    destinationResultCard.addEventListener(
        "click",
        function () {

            selectDestination(
                this.dataset.destination
            );

        }
    );

}


/* Destination tags */

destinationTags.forEach(
    function (tag) {

        tag.addEventListener(
            "click",
            function () {

                selectDestination(
                    this.dataset.destination
                );

            }
        );

    }
);


/* =========================================================
   4. BUDGET
========================================================= */

const budgetInput =
    document.getElementById("budgetInput");

const budgetCards =
    document.querySelectorAll(".budget-card");


let selectedBudget = "";


budgetCards.forEach(
    function (card) {

        card.addEventListener(
            "click",
            function () {

                selectedBudget =
                    this.dataset.budget;


                if (budgetInput) {

                    budgetInput.value =
                        selectedBudget;

                }


                budgetCards.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                this.classList.add(
                    "selected"
                );

            }
        );

    }
);


if (budgetInput) {

    budgetInput.addEventListener(
        "input",
        function () {

            selectedBudget =
                this.value;


            budgetCards.forEach(
                function (card) {

                    card.classList.remove(
                        "selected"
                    );

                }
            );

        }
    );

}


/* =========================================================
   5. TRAVEL INTERESTS
========================================================= */

const interestCards =
    document.querySelectorAll(".interest-card");


interestCards.forEach(
    function (card) {

        card.addEventListener(
            "click",
            function () {

                this.classList.toggle(
                    "selected"
                );

            }
        );

    }
);


/* =========================================================
   6. CREATE SMART TRIP
========================================================= */

const createTripButton =
    document.querySelector(".create-trip-btn");


if (createTripButton) {

    createTripButton.addEventListener(
        "click",
        function () {

            const destination =
                destinationInput
                    ? destinationInput.value.trim()
                    : "";


            if (destination === "") {

                alert(
                    "Please select or enter a destination 📍"
                );


                if (destinationInput) {

                    destinationInput.focus();

                }

                return;

            }


            if (
                selectedBudget === "" ||
                Number(selectedBudget) <= 0
            ) {

                alert(
                    "Please enter or select your travel budget 💰"
                );


                if (budgetInput) {

                    budgetInput.focus();

                }

                return;

            }


            const selectedInterests = [];


            interestCards.forEach(
                function (card) {

                    if (
                        card.classList.contains(
                            "selected"
                        )
                    ) {

                        selectedInterests.push(
                            card.dataset.interest
                        );

                    }

                }
            );


            const tripData = {

                destination:
                    destination,

                travellers:
                    travellers,

                days:
                    days,

                budget:
                    Number(selectedBudget),

                interests:
                    selectedInterests

            };


            localStorage.setItem(
                "smartYatraTrip",
                JSON.stringify(tripData)
            );


            createTripButton.innerHTML =
                'CREATING YOUR TRIP <span>✦</span>';

            createTripButton.classList.add(
                "loading"
            );

            createTripButton.disabled = true;


            setTimeout(
                function () {

                    window.location.href =
                        "trip-setup.html";

                },
                700
            );

        }
    );

}


/* =========================================================
   7. HOME SEARCH → TRIP DETAILS
========================================================= */

const searchInput =
    document.getElementById("homeSearchInput");

const searchButton =
    document.getElementById("homeSearchButton");


if (searchButton && searchInput) {

    searchButton.addEventListener(
        "click",
        function () {

            const destination =
                searchInput.value.trim();


            if (destination === "") {

                alert(
                    "Please enter a destination 📍"
                );

                searchInput.focus();

                return;

            }


            window.location.href = "trip-setup.html?destination=" + encodeURIComponent(destination);
        }
    );


    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchButton.click();

            }

        }
    );

}


/* =========================================================
   8. PLAN MY TRIP
========================================================= */

const planButton =
    document.querySelector(".plan-btn");


if (planButton) {

    planButton.removeAttribute("onclick");


    planButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "trip-setup.html";

        }
    );

}


/* =========================================================
   9. START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setRandomHeroBackground();

        updateTravellers();

        updateDays();

    }
);