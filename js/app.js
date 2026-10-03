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

const API_URL = new URL("../api/data.php", document.currentScript.src).href;
const referenceData = { subjects: [], mediums: [], question_types: [] };
const chapterCache = new Map();
const chapterRequests = new Map();
let activeChapterRequest = null;

async function apiRequest(params, options) {
    const url = new URL(API_URL, window.location.href);
    Object.entries(params).forEach(function(entry) {
        url.searchParams.set(entry[0], entry[1]);
    });
    const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: options?.signal
    });
    let payload;
    try {
        payload = await response.json();
    } catch (error) {
        throw new Error("The server returned an invalid response.");
    }
    if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Study data is temporarily unavailable.");
    }
    return payload.data;
}

function subjectStyle(name) {
    const styles = {
        "Tamil": "tamil",
        "English": "english",
        "Accountancy": "accountancy",
        "Computer Applications": "computer",
        "Commerce": "commerce",
        "Economics": "economics"
    };
    return styles[name] || "";
}

function setSelectOptions(select, records, valueKey, labelKey, placeholder) {
    if (!select) return;
    select.replaceChildren();
    if (!records.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = placeholder;
        select.appendChild(option);
        select.disabled = true;
    } else {
        records.forEach(function(record) {
            const option = document.createElement("option");
            option.value = String(record[valueKey]);
            option.textContent = record[labelKey];
            select.appendChild(option);
        });
        select.disabled = false;
    }
    syncCustomSelect(select);
}

function renderSubjectCards() {
    const home = document.getElementById("homeSubjects");
    const library = document.getElementById("librarySubjects");
    [home, library].forEach(function(container) {
        if (!container) return;
        container.replaceChildren();
        if (!referenceData.subjects.length) {
            container.textContent = "No subjects are available.";
            return;
        }
        referenceData.subjects.forEach(function(subject, index) {
            const card = document.createElement("button");
            const style = subjectStyle(subject.name);
            card.type = "button";
            card.className = (container === home ? "subject-card " : "large-subject ") + style;
            card.addEventListener("click", function() { selectSubject(subject.id); });
            if (container === home) {
                const top = document.createElement("div");
                top.className = "subject-card-top";
                const number = document.createElement("span");
                number.className = "subject-number";
                number.textContent = String(index + 1).padStart(2, "0");
                const arrow = document.createElement("span");
                arrow.className = "subject-arrow";
                arrow.textContent = "→";
                top.append(number, arrow);
                const title = document.createElement("strong");
                title.textContent = subject.name;
                const progress = document.createElement("div");
                progress.className = "subject-progress";
                progress.innerHTML = '<div class="subject-progress-header"><span>Progress</span><b>0%</b></div><div class="mini-progress"><div style="width:0%"></div></div>';
                card.append(top, title, progress);
            } else {
                const number = document.createElement("span");
                number.className = "large-number";
                number.textContent = String(index + 1).padStart(2, "0");
                const content = document.createElement("div");
                const title = document.createElement("strong");
                title.textContent = subject.name;
                content.appendChild(title);
                const arrow = document.createElement("b");
                arrow.textContent = "→";
                card.append(number, content, arrow);
            }
            container.appendChild(card);
        });
    });
}

function renderMediums(records) {
    const group = document.getElementById("mediumOptions");
    if (!group) return;
    group.replaceChildren();
    if (!records.length) {
        group.textContent = "No mediums are available.";
        return;
    }
    records.forEach(function(medium, index) {
        const label = document.createElement("label");
        label.className = "radio-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "medium";
        input.value = medium.name;
        input.checked = index === 0;
        const text = document.createElement("span");
        text.textContent = medium.name;
        label.append(input, text);
        group.appendChild(label);
    });
}

function renderReferenceData(data) {
    referenceData.subjects = data.subjects || [];
    referenceData.mediums = data.mediums || [];
    referenceData.question_types = data.question_types || [];
    renderSubjectCards();
    renderMediums(referenceData.mediums);

    const subjectSelect = document.getElementById("subjectSelect");
    setSelectOptions(subjectSelect, referenceData.subjects, "id", "name", "No subjects available");
    if (referenceData.subjects.length) {
        subjectSelect.value = String(data.initial_subject_id || referenceData.subjects[0].id);
    }
    syncCustomSelect(subjectSelect);

    setSelectOptions(
        document.getElementById("questionType"),
        referenceData.question_types,
        "id",
        "name",
        "No question types available"
    );
    const status = document.getElementById("subjectStatus");
    if (status) status.textContent = "";
    updateSubjectCount();
    const initialChapters = data.initial_chapters;
    if (
        Array.isArray(initialChapters) &&
        String(data.initial_subject_id) === subjectSelect.value
    ) {
        chapterCache.set(subjectSelect.value, initialChapters);
        renderChapterOptions(subjectSelect.value, initialChapters);
    } else {
        loadChapters();
    }
}

function setReferenceError(message) {
    ["homeSubjects", "librarySubjects"].forEach(function(id) {
        const node = document.getElementById(id);
        if (node) node.textContent = message;
    });
    ["mediumOptions"].forEach(function(id) {
        const node = document.getElementById(id);
        if (node) node.textContent = message;
    });
    const status = document.getElementById("subjectStatus");
    if (status) status.textContent = message;
    setSelectOptions(document.getElementById("subjectSelect"), [], "id", "name", "Subjects unavailable");
    setSelectOptions(document.getElementById("questionType"), [], "id", "name", "Question types unavailable");
}

function updateSubjectCount() {
    const profileCount = document.getElementById("subjectCount");
    if (profileCount) profileCount.textContent = String(referenceData.subjects.length);
}

function updateContinueCard(chapters) {
    const subjectId = document.getElementById("subjectSelect")?.value;
    const subject = referenceData.subjects.find(function(item) {
        return String(item.id) === subjectId;
    });
    const chapterSelect = document.getElementById("chapterSelect");
    const chapter = chapters?.find(function(item) {
        return String(item.id) === chapterSelect?.value;
    });
    const subjectLabel = document.querySelector(".continue-card .subject-label");
    const chapterTitle = document.getElementById("continueChapter");
    const chapterLabel = document.getElementById("continueChapterName");
    if (subjectLabel) subjectLabel.textContent = subject ? subject.name.toUpperCase() : "";
    if (chapterTitle) chapterTitle.textContent = chapter ? chapter.chapter_name : "Select a subject";
    if (chapterLabel) chapterLabel.textContent = chapter ? "Chapter " + chapter.chapter_number : "No chapter selected";
}

function renderChapterOptions(subjectId, chapters) {
    const subjectSelect = document.getElementById("subjectSelect");
    const chapterSelect = document.getElementById("chapterSelect");
    if (!subjectSelect || !chapterSelect || subjectSelect.value !== subjectId) return;

    const status = document.getElementById("subjectStatus");
    if (chapters.length === 0) {
        setSelectOptions(
            chapterSelect,
            [],
            "id",
            "chapter_name",
            "No chapters available for this subject"
        );
        chapterSelect.selectedIndex = 0;
        chapterSelect.value = "";
        chapterSelect.disabled = true;
        if (chapterSelect._customSelect?.refreshOptions) {
            chapterSelect._customSelect.refreshOptions();
        } else {
            syncCustomSelect(chapterSelect);
        }
        if (status) status.textContent = "No chapters are available for this subject.";
        updateContinueCard([]);
        return;
    }

    const chapterOptions = chapters.map(function(chapter) {
        return {
            ...chapter,
            display_name: String(chapter.chapter_number).padStart(2, "0") + "  " + chapter.chapter_name
        };
    });
    setSelectOptions(chapterSelect, chapterOptions, "id", "display_name", "No chapters available for this subject");
    if (status) status.textContent = "";
    updateContinueCard(chapters);
}

function selectSubject(subjectId) {

    const subjectSelect =
        document.getElementById("subjectSelect");

    if (subjectSelect) {

        subjectSelect.value = String(subjectId);
        syncCustomSelect(subjectSelect);
        subjectSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }


    openPage("study");
}


/* =========================================================
   LOAD CHAPTERS
   ========================================================= */

async function loadChapters() {

    const subjectSelect =
        document.getElementById("subjectSelect");

    const chapterSelect =
        document.getElementById("chapterSelect");


    if (!subjectSelect || !chapterSelect) {
        return;
    }


    const subjectId = subjectSelect.value;
    if (!subjectId) {
        if (activeChapterRequest) {
            if (chapterRequests.get(activeChapterRequest.subjectId) === activeChapterRequest) {
                chapterRequests.delete(activeChapterRequest.subjectId);
            }
            activeChapterRequest.controller.abort();
            activeChapterRequest = null;
        }
        setSelectOptions(chapterSelect, [], "id", "chapter_name", "Select a subject first");
        updateContinueCard([]);
        return;
    }

    if (activeChapterRequest && activeChapterRequest.subjectId !== subjectId) {
        if (chapterRequests.get(activeChapterRequest.subjectId) === activeChapterRequest) {
            chapterRequests.delete(activeChapterRequest.subjectId);
        }
        activeChapterRequest.controller.abort();
        activeChapterRequest = null;
    }

    setSelectOptions(chapterSelect, [], "id", "chapter_name", "Loading chapters…");
    chapterSelect.disabled = true;
    const status = document.getElementById("subjectStatus");
    if (status) status.textContent = "";
    let request = null;
    try {
        let chapters = chapterCache.get(subjectId);
        if (!chapters) {
            request = chapterRequests.get(subjectId);
            if (!request) {
                const controller = new AbortController();
                request = {
                    controller,
                    promise: apiRequest(
                        { action: "chapters", subject_id: subjectId },
                        { signal: controller.signal }
                    )
                };
                chapterRequests.set(subjectId, request);
                request.promise.then(function(data) {
                    if (!Array.isArray(data)) {
                        throw new Error("The server returned invalid chapter data.");
                    }
                    chapterCache.set(subjectId, data);
                }).finally(function() {
                    if (chapterRequests.get(subjectId) === request) {
                        chapterRequests.delete(subjectId);
                    }
                }).catch(function() {});
            }
            request.subjectId = subjectId;
            activeChapterRequest = request;
            chapters = await request.promise;
            if (activeChapterRequest === request) activeChapterRequest = null;
            if (!Array.isArray(chapters)) {
                throw new Error("The server returned invalid chapter data.");
            }
            chapterCache.set(subjectId, chapters);
        }
        if (subjectSelect.value !== subjectId) return;

        renderChapterOptions(subjectId, chapters);
    } catch (error) {
        if (activeChapterRequest === request) activeChapterRequest = null;
        if (subjectSelect.value !== subjectId) return;
        if (error.name === "AbortError") return;
        setSelectOptions(chapterSelect, [], "id", "chapter_name", "Chapters unavailable");
        if (status) status.textContent = error.message;
        updateContinueCard([]);
    }
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
    ui.button.disabled = select.disabled || select.options.length === 0;
    ui.button.removeAttribute("aria-activedescendant");
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
        select._customSelect.activeIndex = select.selectedIndex;
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
        if (button.disabled) return;
        document.querySelectorAll(".custom-select.is-open").forEach(function(other) {
            const otherSelect = other.querySelector("select");
            if (otherSelect && otherSelect._customSelect) {
                otherSelect._customSelect.open = false;
                other.classList.remove("is-open");
                otherSelect._customSelect.button.setAttribute("aria-expanded", "false");
            }
        });
        select._customSelect.open = true;
        const bounds = wrapper.getBoundingClientRect();
        const spaceBelow = window.innerHeight - bounds.bottom - 12;
        const spaceAbove = bounds.top - 12;
        const openUp = spaceBelow < Math.min(260, list.scrollHeight) && spaceAbove > spaceBelow;
        wrapper.classList.toggle("opens-up", openUp);
        list.style.maxHeight = Math.max(120, Math.min(440, openUp ? spaceAbove : spaceBelow)) + "px";
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
        if (select.id === "chapterSelect") {
            updateContinueCard(chapterCache.get(document.getElementById("subjectSelect").value) || []);
        }
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

    const subjectId = document.getElementById("subjectSelect").value;
    const subject = referenceData.subjects.find(function(item) {
        return String(item.id) === subjectId;
    });
    const chapterSelect = document.getElementById("chapterSelect");
    const questionSelect = document.getElementById("questionType");
    const result = document.getElementById("studyResult");

    if (!subject || !chapterSelect.value || !questionSelect.value) {
        result.textContent = "Choose an available subject, chapter and question type first.";
        return;
    }


    const mediumElement =
        document.querySelector(
            'input[name="medium"]:checked'
        );


    const medium = mediumElement ? mediumElement.value : "";


    const chapterName = chapterSelect.selectedOptions[0]?.textContent || "Chapter";
    const questionType = questionSelect.selectedOptions[0]?.textContent || "";


    result.innerHTML = `

        <div class="result-icon">
            AK<span>•</span>
        </div>

        <h3>
            Ready to Learn
        </h3>

        <p>
            ${escapeHTML(subject.name)}
            •
            ${escapeHTML(chapterName)}
            •
            ${escapeHTML(questionType)}
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


    const searchableContent = [
        ...referenceData.subjects.map(function(subject) {
            return { title: subject.name, type: "Subject" };
        }),
        ...referenceData.question_types.map(function(questionType) {
            return { title: questionType.name + " Questions", type: "Study Material" };
        })
    ];
    const matches = searchableContent.filter(function(item) {

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

function initializeApp() {
    ["subjectSelect", "chapterSelect", "questionType"].forEach(function(id) {
        buildCustomSelect(document.getElementById(id));
    });
    apiRequest({ action: "reference" })
        .then(renderReferenceData)
        .catch(function(error) { setReferenceError(error.message); });
}

if (document.readyState === "loading" && !document.getElementById("subjectSelect")) {
    document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
    initializeApp();
}
