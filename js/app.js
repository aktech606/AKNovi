/* =========================================================
   AKNOVI
   Learn. Understand. Advance.
   ========================================================= */


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function openPage(pageName) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });


    const targetPage = document.getElementById(pageName);

    if (targetPage) {
        targetPage.classList.add("active-page");
    }


    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function(item) {
        item.classList.remove("active");

        if (item.dataset.page === pageName) {
            item.classList.add("active");
        }
    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   SUBJECT SELECTION
   ========================================================= */

function selectSubject(subject) {

    const subjectSelect =
        document.getElementById("subjectSelect");

    if (subjectSelect) {

        subjectSelect.value = subject;

        loadChapters();
    }


    openPage("study");
}


/* =========================================================
   CHAPTER DATA
   ========================================================= */

const chapterData = {

    "Tamil": [
        "Chapter 1",
        "Chapter 2",
        "Chapter 3",
        "Chapter 4",
        "Chapter 5",
        "Chapter 6"
    ],

    "English": [
        "Unit 1",
        "Unit 2",
        "Unit 3",
        "Unit 4",
        "Unit 5",
        "Unit 6"
    ],

    "Accountancy": [
        "Chapter 1",
        "Chapter 2",
        "Chapter 3",
        "Chapter 4",
        "Chapter 5"
    ],

    "Computer Applications": [
        "Chapter 1",
        "Chapter 2",
        "Chapter 3",
        "Chapter 4",
        "Chapter 5"
    ],

    "Commerce": [
        "Chapter 1",
        "Chapter 2",
        "Chapter 3",
        "Chapter 4",
        "Chapter 5",
        "Chapter 6",
        "Chapter 7",
        "Chapter 8"
    ],

    "Economics": [
        "Chapter 1",
        "Chapter 2",
        "Chapter 3",
        "Chapter 4",
        "Chapter 5",
        "Chapter 6",
        "Chapter 7",
        "Chapter 8",
        "Chapter 9",
        "Chapter 10",
        "Chapter 11",
        "Chapter 12"
    ]

};


/* =========================================================
   LOAD CHAPTERS
   ========================================================= */

function loadChapters() {

    const subjectSelect =
        document.getElementById("subjectSelect");

    const chapterSelect =
        document.getElementById("chapterSelect");


    if (!subjectSelect || !chapterSelect) {
        return;
    }


    const subject = subjectSelect.value;

    const chapters =
        chapterData[subject] || [];


    chapterSelect.innerHTML = "";


    if (chapters.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "No chapters available";

        chapterSelect.appendChild(option);

        return;
    }


    chapters.forEach(function(chapter, index) {

        const option =
            document.createElement("option");

        option.value = index + 1;

        option.textContent = chapter;

        chapterSelect.appendChild(option);

    });
}


/* =========================================================
   START STUDY
   ========================================================= */

function startStudy() {

    const subject =
        document.getElementById("subjectSelect").value;

    const chapter =
        document.getElementById("chapterSelect").value;

    const questionType =
        document.getElementById("questionType").value;


    const mediumElement =
        document.querySelector(
            'input[name="medium"]:checked'
        );


    const medium =
        mediumElement
            ? mediumElement.value
            : "English";


    const result =
        document.getElementById("studyResult");


    const questionNames = {

        one: "One Mark",

        two: "Two Marks",

        three: "Three Marks",

        five: "Five Marks"

    };


    const chapterName =
        document.getElementById("chapterSelect")
            .options[
                document.getElementById("chapterSelect")
                    .selectedIndex
            ]
            ?.textContent || "Chapter";


    result.innerHTML = `

        <div class="result-icon">
            AK<span>•</span>
        </div>

        <h3>
            Ready to Learn
        </h3>

        <p>
            ${escapeHTML(subject)}
            •
            ${escapeHTML(chapterName)}
            •
            ${escapeHTML(questionNames[questionType] || questionType)}
            •
            ${escapeHTML(medium)}
        </p>

    `;

    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


/* =========================================================
   SEARCH
   ========================================================= */

const searchableContent = [

    {
        title: "Tamil",
        type: "Subject"
    },

    {
        title: "English",
        type: "Subject"
    },

    {
        title: "Accountancy",
        type: "Subject"
    },

    {
        title: "Computer Applications",
        type: "Subject"
    },

    {
        title: "Commerce",
        type: "Subject"
    },

    {
        title: "Economics",
        type: "Subject"
    },

    {
        title: "One Mark Questions",
        type: "Study Material"
    },

    {
        title: "Two Marks Questions",
        type: "Study Material"
    },

    {
        title: "Three Marks Questions",
        type: "Study Material"
    },

    {
        title: "Five Marks Questions",
        type: "Study Material"
    },

    {
        title: "AI Chapter Explainer",
        type: "Future Feature"
    }

];


function showSearch() {

    const overlay =
        document.getElementById("searchOverlay");

    overlay.classList.add("visible");

    setTimeout(function() {

        const input =
            document.getElementById("searchInput");

        if (input) {
            input.focus();
        }

    }, 100);
}


function hideSearch() {

    const overlay =
        document.getElementById("searchOverlay");

    overlay.classList.remove("visible");

}


function searchContent(value) {

    const results =
        document.getElementById("searchResults");


    if (!results) {
        return;
    }


    const query =
        value.trim().toLowerCase();


    results.innerHTML = "";


    if (!query) {
        return;
    }


    const matches =
        searchableContent.filter(function(item) {

            return item.title
                .toLowerCase()
                .includes(query);

        });


    if (matches.length === 0) {

        results.innerHTML = `

            <div class="search-result-item">
                No matching content found.
            </div>

        `;

        return;
    }


    matches.forEach(function(item) {

        const result =
            document.createElement("div");

        result.className =
            "search-result-item";

        result.textContent =
            item.title + " — " + item.type;

        results.appendChild(result);

    });
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* =========================================================
   SEARCH OVERLAY ESCAPE
   ========================================================= */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        hideSearch();

    }

});


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function() {

    loadChapters();

});