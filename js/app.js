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
        syncCustomSelect(subjectSelect);
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
        syncCustomSelect(chapterSelect);
        return;
    }


    chapters.forEach(function(chapter, index) {

        const option =
            document.createElement("option");

        option.value = index + 1;

        option.textContent = chapter;

        chapterSelect.appendChild(option);

    });

    syncCustomSelect(chapterSelect);
}

/* =========================================================
   CUSTOM STUDY SELECTS
   Native selects remain the source of truth for existing study logic.
   ========================================================= */

function syncCustomSelect(select) {
    if (!select || !select._customSelect) return;
    const ui = select._customSelect;
    const optionsChanged = ui.list.children.length !== select.options.length ||
        Array.from(ui.list.children).some(function(option, index) {
            return !select.options[index] || option.textContent !== select.options[index].textContent.trim();
        });
    if (ui.refreshOptions && optionsChanged) {
        ui.refreshOptions();
        return;
    }
    const selected = select.options[select.selectedIndex];
    ui.value.textContent = selected ? selected.textContent.trim() : "Select an option";
    ui.list.querySelectorAll('[role="option"]').forEach(function(option, index) {
        const active = select.options[index] && select.options[index].value === select.value;
        option.setAttribute("aria-selected", active ? "true" : "false");
        option.classList.toggle("is-selected", !!active);
        if (active) ui.button.setAttribute("aria-activedescendant", option.id);
    });
    if (!select.options.length) ui.button.removeAttribute("aria-activedescendant");
}

function buildCustomSelect(select) {
    if (!select || select._customSelect) return;
    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add("native-select-proxy");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "custom-select-trigger";
    button.id = select.id + "CustomButton";
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", select.id + "CustomList");
    const value = document.createElement("span");
    value.className = "custom-select-value";
    const arrow = document.createElement("span");
    arrow.className = "custom-select-arrow";
    arrow.setAttribute("aria-hidden", "true");
    button.append(value, arrow);

    const list = document.createElement("div");
    list.className = "custom-select-list";
    list.id = select.id + "CustomList";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-labelledby", select.id + "CustomButton");
    wrapper.append(button, list);
    select._customSelect = { wrapper, button, value, list, open: false };

    function refreshOptions() {
        list.replaceChildren();
        Array.from(select.options).forEach(function(nativeOption, index) {
            const option = document.createElement("div");
            option.className = "custom-select-option";
            option.id = select.id + "Option" + index;
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", "false");
            option.textContent = nativeOption.textContent.trim();
            option.addEventListener("click", function() {
                select.selectedIndex = index;
                select.dispatchEvent(new Event("change", { bubbles: true }));
                close(false);
                button.focus();
            });
            list.appendChild(option);
        });
        syncCustomSelect(select);
    }
    select._customSelect.refreshOptions = refreshOptions;
    function close(returnFocus) {
        select._customSelect.open = false;
        wrapper.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
        if (returnFocus) button.focus();
    }
    function open() {
        document.querySelectorAll(".custom-select.is-open").forEach(function(other) {
            const otherSelect = other.querySelector("select");
            if (otherSelect && otherSelect._customSelect) {
                otherSelect._customSelect.open = false;
                other.classList.remove("is-open");
                otherSelect._customSelect.button.setAttribute("aria-expanded", "false");
            }
        });
        select._customSelect.open = true;
        wrapper.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        const selected = list.querySelector('[aria-selected="true"]');
        if (selected) selected.scrollIntoView({ block: "nearest" });
    }
    button.addEventListener("click", function() {
        select._customSelect.open ? close(false) : open();
    });
    button.addEventListener("keydown", function(event) {
        const options = Array.from(list.querySelectorAll('[role="option"]'));
        let index = Number.isInteger(select._customSelect.activeIndex)
            ? select._customSelect.activeIndex
            : select.selectedIndex;
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key)) event.preventDefault();
        if (event.key === "ArrowDown") index = Math.min(index + 1, options.length - 1);
        else if (event.key === "ArrowUp") index = Math.max(index - 1, 0);
        else if (event.key === "Home") index = 0;
        else if (event.key === "End") index = options.length - 1;
        else if (event.key === "Enter" || event.key === " ") {
            if (!select._customSelect.open) open();
            else if (options[index]) options[index].click();
            return;
        } else if (event.key === "Escape") {
            if (select._customSelect.open) { event.preventDefault(); close(false); }
            return;
        } else if (event.key === "Tab") { close(false); return; }
        else if (event.key.length === 1 && /\S/.test(event.key)) {
            const found = Array.from(select.options).findIndex(function(opt) {
                return opt.textContent.trim().toLowerCase().startsWith(event.key.toLowerCase());
            });
            if (found >= 0) index = found;
            else return;
        } else return;
        select._customSelect.activeIndex = index;
        if (!select._customSelect.open) open();
        else if (options[index]) options[index].scrollIntoView({ block: "nearest" });
        if (options[index]) {
            options.forEach(function(option, optionIndex) {
                option.classList.toggle("is-active", optionIndex === index);
            });
            button.setAttribute("aria-activedescendant", options[index].id);
        }
    });
    select.addEventListener("change", function() {
        refreshOptions();
        if (select.id === "subjectSelect") loadChapters();
    });
    document.addEventListener("pointerdown", function(event) {
        if (!wrapper.contains(event.target) && select._customSelect.open) close(false);
    });
    refreshOptions();
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
    ["subjectSelect", "chapterSelect", "questionType"].forEach(function(id) {
        buildCustomSelect(document.getElementById(id));
    });

});
