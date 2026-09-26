/* =========================================================
   SMART YATRA - FAQ JAVASCRIPT
========================================================= */

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {

    question.addEventListener("click", function () {

        const currentItem = this.closest(".faq-item");
        const currentAnswer = currentItem.querySelector(".faq-answer");

        /* Close other FAQs */
        document.querySelectorAll(".faq-item").forEach(function (item) {

            if (item !== currentItem) {

                item.classList.remove("active");

                const answer = item.querySelector(".faq-answer");

                if (answer) {
                    answer.style.maxHeight = null;
                }
            }
        });

        /* Toggle current FAQ */
        currentItem.classList.toggle("active");

        if (currentItem.classList.contains("active")) {

            currentAnswer.style.maxHeight =
                currentAnswer.scrollHeight + "px";

        } else {

            currentAnswer.style.maxHeight = null;
        }
    });
});