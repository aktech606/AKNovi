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

    document.querySelector(".app")?.classList.toggle("is-study-workspace", pageName === "studyWorkspace");


    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function(item) {
        item.classList.remove("active");

        if (item.dataset.page === (pageName === "studyWorkspace" ? "study" : pageName)) {
            item.classList.add("active");
        }
    });


    window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
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
const studyWorkspaceState = {
    material: null,
    questionIndex: 0,
    answerVisible: false,
    requestId: 0
};

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
   STUDY WORKSPACE
   ========================================================= */

function makeElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
}

function setWorkspaceLoading(message) {
    const content = document.getElementById("workspaceContent");
    content.replaceChildren();
    const loading = makeElement("div", "workspace-loading");
    loading.setAttribute("role", "status");
    const mark = makeElement("span", "loading-mark", "AK•");
    mark.setAttribute("aria-hidden", "true");
    loading.append(mark, makeElement("p", "", message));
    content.appendChild(loading);
}

function updateWorkspaceHeader(data) {
    const selection = document.getElementById("workspaceSelection");
    selection.replaceChildren();
    const subject = makeElement("p", "workspace-subject", data.subject.name);
    const chapter = makeElement(
        "p",
        "workspace-chapter",
        "CHAPTER " + String(data.chapter.chapter_number).padStart(2, "0") + " · " + data.chapter.chapter_name
    );
    const context = makeElement("p", "workspace-context", data.question_type.name + " · " + data.medium.name);
    selection.append(subject, chapter, context);
}

function createSupplementaryCard(label, title, description) {
    const card = makeElement("article", "supplementary-card");
    card.appendChild(makeElement("p", "supplementary-label", label));
    if (title) card.appendChild(makeElement("h3", "", title));
    if (description) card.appendChild(makeElement("p", "supplementary-description", description));
    return card;
}

function safeExternalUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
        const url = new URL(value);
        return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
    } catch (error) {
        return null;
    }
}

function renderSupplementary(data) {
    const books = data.study_book;
    const explainer = data.ai_explainer;
    if (!books && !explainer) return null;

    const section = makeElement("section", "supplementary-section");
    section.appendChild(makeElement("h2", "", "Supplementary material"));
    const cards = makeElement("div", "supplementary-grid");
    if (books) {
        const card = createSupplementaryCard(
            "STUDY BOOK · " + data.subject.name + " · " + data.medium.name,
            books.title,
            "Subject and medium reference material. This book is not chapter-specific."
        );
        if (books.available && typeof books.url === "string") {
            const link = makeElement("a", "supplementary-link", "Open study book →");
            link.href = books.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            card.appendChild(link);
        } else {
            card.appendChild(makeElement("p", "supplementary-unavailable", "The study book file is not available."));
        }
        cards.appendChild(card);
    }
    if (explainer) {
        const card = createSupplementaryCard("AI EXPLAINER", explainer.title, explainer.explanation);
        const videoUrl = safeExternalUrl(explainer.video_url);
        if (videoUrl) {
            const link = makeElement("a", "supplementary-link", "Watch explainer →");
            link.href = videoUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            card.appendChild(link);
        }
        cards.appendChild(card);
    }
    section.appendChild(cards);
    return section;
}

function renderQuestionWorkspace() {
    const data = studyWorkspaceState.material;
    const content = document.getElementById("workspaceContent");
    content.replaceChildren();
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
        const empty = makeElement("section", "workspace-empty");
        empty.setAttribute("aria-labelledby", "emptyTitle");
        const icon = makeElement("span", "empty-icon", "01");
        icon.setAttribute("aria-hidden", "true");
        empty.append(icon, makeElement("p", "small-label", "AKNOVI LIBRARY"));
        const title = makeElement("h2", "", "Study content is not available yet");
        title.id = "emptyTitle";
        empty.appendChild(title);
        empty.appendChild(makeElement("p", "empty-copy", "There are no questions for this selection yet. Choose another option or come back when content is available."));
        const details = makeElement("dl", "empty-selection");
        details.id = "emptySelection";
        [
            ["Subject", data.subject.name],
            ["Chapter", "Chapter " + String(data.chapter.chapter_number).padStart(2, "0") + " · " + data.chapter.chapter_name],
            ["Question type", data.question_type.name],
            ["Medium", data.medium.name]
        ].forEach(function(entry) {
            details.append(makeElement("dt", "", entry[0]), makeElement("dd", "", entry[1]));
        });
        empty.appendChild(details);
        const back = makeElement("button", "primary-button", "Back to study selector");
        back.type = "button";
        back.addEventListener("click", backToStudy);
        empty.appendChild(back);
        content.appendChild(empty);
        const supplementary = renderSupplementary(data);
        if (supplementary) content.appendChild(supplementary);
        return;
    }

    const index = studyWorkspaceState.questionIndex;
    const question = data.questions[index];
    const panel = makeElement("article", "question-panel");
    panel.setAttribute("aria-labelledby", "questionText");
    const meta = makeElement("div", "question-meta");
    meta.appendChild(makeElement("span", "question-number", String(index + 1).padStart(2, "0")));
    meta.appendChild(makeElement("p", "question-position", "Question " + String(index + 1).padStart(2, "0") + " of " + data.questions.length));
    panel.appendChild(meta);
    const questionText = makeElement("h2", "question-text", question.question);
    questionText.id = "questionText";
    questionText.tabIndex = -1;
    panel.appendChild(questionText);

    const answer = makeElement("div", "answer-panel", question.answer);
    answer.id = "questionAnswer";
    answer.hidden = !studyWorkspaceState.answerVisible;
    answer.setAttribute("aria-live", "polite");
    panel.appendChild(answer);
    const answerToggle = makeElement("button", "answer-toggle", studyWorkspaceState.answerVisible ? "Hide Answer" : "Show Answer");
    answerToggle.type = "button";
    answerToggle.setAttribute("aria-expanded", String(studyWorkspaceState.answerVisible));
    answerToggle.setAttribute("aria-controls", "questionAnswer");
    answerToggle.addEventListener("click", function() {
        studyWorkspaceState.answerVisible = !studyWorkspaceState.answerVisible;
        renderQuestionWorkspace();
        document.querySelector(".answer-toggle")?.focus();
    });
    panel.appendChild(answerToggle);

    const controls = makeElement("div", "question-controls");
    const previous = makeElement("button", "secondary-button", "← Previous");
    previous.type = "button";
    previous.disabled = index === 0;
    previous.addEventListener("click", function() {
        if (studyWorkspaceState.questionIndex > 0) {
            studyWorkspaceState.questionIndex -= 1;
            studyWorkspaceState.answerVisible = false;
            renderQuestionWorkspace();
            document.querySelector(".question-text")?.focus({ preventScroll: true });
        }
    });
    const next = makeElement("button", "secondary-button", "Next →");
    next.type = "button";
    next.disabled = index >= data.questions.length - 1;
    next.addEventListener("click", function() {
        if (studyWorkspaceState.questionIndex < data.questions.length - 1) {
            studyWorkspaceState.questionIndex += 1;
            studyWorkspaceState.answerVisible = false;
            renderQuestionWorkspace();
            document.querySelector(".question-text")?.focus({ preventScroll: true });
        }
    });
    controls.append(previous, next);
    content.append(panel, controls);
    const supplementary = renderSupplementary(data);
    if (supplementary) content.appendChild(supplementary);
}

function renderWorkspaceError(message) {
    const content = document.getElementById("workspaceContent");
    content.replaceChildren();
    const error = makeElement("section", "workspace-empty");
    error.setAttribute("role", "alert");
    error.appendChild(makeElement("p", "small-label", "AKNOVI STUDY"));
    error.appendChild(makeElement("h2", "", "Study material could not be loaded"));
    error.appendChild(makeElement("p", "empty-copy", message));
    const back = makeElement("button", "primary-button", "Back to study selector");
    back.type = "button";
    back.addEventListener("click", backToStudy);
    error.appendChild(back);
    content.appendChild(error);
}

function backToStudy() {
    openPage("study");
}

async function startStudy() {
    const subjectId = document.getElementById("subjectSelect")?.value;
    const chapterId = document.getElementById("chapterSelect")?.value;
    const questionTypeId = document.getElementById("questionType")?.value;
    const medium = document.querySelector('input[name="medium"]:checked')?.value;
    const content = document.getElementById("workspaceContent");
    const subject = referenceData.subjects.find(function(item) { return String(item.id) === subjectId; });
    const chapter = (chapterCache.get(subjectId) || []).find(function(item) { return String(item.id) === chapterId; });
    const questionType = referenceData.question_types.find(function(item) { return String(item.id) === questionTypeId; });

    if (!subject || !chapter || !questionType || !medium) {
        const status = document.getElementById("studySelectorStatus");
        if (status) status.textContent = "Choose an available subject, chapter, question type and medium first.";
        return;
    }
    const selectorStatus = document.getElementById("studySelectorStatus");
    if (selectorStatus) selectorStatus.textContent = "";

    const requestId = ++studyWorkspaceState.requestId;
    studyWorkspaceState.material = null;
    studyWorkspaceState.questionIndex = 0;
    studyWorkspaceState.answerVisible = false;
    openPage("studyWorkspace");
    updateWorkspaceHeader({
        subject: subject,
        chapter: chapter,
        question_type: questionType,
        medium: { name: medium }
    });
    setWorkspaceLoading("Loading questions and supplementary material…");

    try {
        const data = await apiRequest({
            action: "study_material",
            subject_id: subjectId,
            chapter_id: chapterId,
            question_type_id: questionTypeId,
            medium: medium
        });
        if (requestId !== studyWorkspaceState.requestId) return;
        if (!data || !data.subject || !data.chapter || !data.question_type || !data.medium || !Array.isArray(data.questions) || !(data.study_book === null || typeof data.study_book === "object") || !(data.ai_explainer === null || typeof data.ai_explainer === "object")) {
            throw new Error("The server returned incomplete study material.");
        }
        const validQuestions = data.questions.every(function(item) {
            return item && typeof item.question === "string" && typeof item.answer === "string";
        });
        if (!validQuestions) throw new Error("The server returned incomplete study material.");
        studyWorkspaceState.material = data;
        updateWorkspaceHeader(data);
        renderQuestionWorkspace();
    } catch (error) {
        if (requestId !== studyWorkspaceState.requestId) return;
        renderWorkspaceError(error.message || "Study data is temporarily unavailable.");
    }
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
