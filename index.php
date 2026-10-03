<?php
// AKNovi — Main Application
// Learn. Understand. Advance.
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="theme-color" content="#071b14">

    <title>AKNovi — Learn. Understand. Advance.</title>

    <link rel="stylesheet" href="css/style.css">
</head>

<body>

<div class="app">

    <!-- =========================
         TOP HEADER
    ========================== -->

    <header class="top-header">

        <div class="brand">

            <div class="brand-logo">
                <span>AK</span><b>•</b>
            </div>

            <div class="brand-text">
                <h1>AKNovi</h1>
                <p>Learn. Understand. Advance.</p>
            </div>

        </div>

        <button
            class="header-button"
            onclick="showSearch()"
            aria-label="Search">

            <span class="search-symbol">⌕</span>
            <span>Search</span>

        </button>

    </header>


    <!-- =========================
         MAIN CONTENT
    ========================== -->

    <main class="main-content">


        <!-- =====================
             HOME
        ====================== -->

        <section id="home" class="page active-page">

            <!-- HERO -->

            <div class="welcome-card">

                <div class="welcome-content">

                    <p class="small-label">
                        AKNOVI STUDY
                    </p>

                    <h2>
                        Learn smarter.<br>
                        Move forward.
                    </h2>

                    <p class="welcome-description">
                        Your personal learning platform for
                        Class 12 Tamil Nadu State Board.
                    </p>

                    <button
                        class="primary-button"
                        onclick="openPage('subjects')">

                        Start Studying
                        <span>→</span>

                    </button>

                </div>

                <div class="hero-mark">
                    <span>AK</span>
                    <b>•</b>
                </div>

            </div>


            <!-- CONTINUE -->

            <div class="section-heading">

                <div>
                    <h2>Continue Learning</h2>
                    <p>Pick up where you left off</p>
                </div>

                <button
                    class="text-button"
                    onclick="openPage('study')">

                    View all →

                </button>

            </div>


            <div class="continue-card">

                <div class="chapter-icon">
                    <span>01</span>
                </div>

                <div class="continue-info">

                    <div class="continue-top">

                        <div>

                            <p class="subject-label">
                                Loading…
                            </p>

                            <h3 id="continueChapter">Loading chapter…</h3>

                            <p id="continueChapterName">Select a subject to begin</p>

                        </div>

                        <strong class="continue-percent">
                            0%
                        </strong>

                    </div>

                    <div class="progress-bar">
                        <div
                            class="progress"
                            style="width:0%">
                        </div>
                    </div>

                </div>

            </div>


            <!-- QUICK ACCESS -->

            <div class="section-heading">

                <div>
                    <h2>Quick Access</h2>
                    <p>Your subjects</p>
                </div>

            </div>


            <!-- SUBJECT GRID -->

            <div class="subject-grid" id="homeSubjects" aria-live="polite">
                <p class="data-state">Loading subjects…</p>
            </div>

        </section>



        <!-- =====================
             SUBJECTS
        ====================== -->

        <section id="subjects" class="page">

            <div class="page-title">

                <p class="small-label">
                    AKNOVI LIBRARY
                </p>

                <h2>Subjects</h2>

                <p>
                    Select a subject to start studying.
                </p>

            </div>


            <div class="subjects-grid-large" id="librarySubjects" aria-live="polite">
                <p class="data-state">Loading subjects…</p>
            </div>

        </section>



        <!-- =====================
             STUDY
        ====================== -->

        <section id="study" class="page">

            <div class="page-title">

                <p class="small-label">
                    AKNOVI STUDY
                </p>

                <h2>Study Material</h2>

                <p>
                    Choose your medium, chapter and question type.
                </p>

            </div>


            <!-- MEDIUM -->

            <div class="study-card">

                <h3>Medium</h3>

                <div class="radio-group" id="mediumOptions" aria-live="polite">
                    <p class="data-state">Loading mediums…</p>
                </div>

            </div>


            <!-- SUBJECT -->

            <div class="study-card">

                <label for="subjectSelect">
                    Subject
                </label>

                <select id="subjectSelect" aria-describedby="subjectStatus" disabled>
                    <option value="">Loading subjects…</option>
                </select>
                <p id="subjectStatus" class="data-state" role="status" aria-live="polite"></p>

            </div>


            <!-- CHAPTER -->

            <div class="study-card">

                <label for="chapterSelect">
                    Chapter
                </label>

                <select id="chapterSelect" disabled>
                    <option value="">Select a subject first</option>
                </select>

            </div>


            <!-- QUESTION TYPE -->

            <div class="study-card">

                <label for="questionType">
                    Question Type
                </label>

                <select id="questionType" disabled>
                    <option value="">Loading question types…</option>
                </select>

            </div>


            <button
                class="primary-button full-button"
                type="button"
                onclick="startStudy()">

                Open Study Material
                <span>→</span>

            </button>
            <button
                class="primary-button full-button explainer-open-button"
                type="button"
                onclick="startStudyExplainer()">

                Open Study Explainer
                <span>→</span>

            </button>
            <p id="studySelectorStatus" class="selector-status" role="status" aria-live="polite"></p>


        </section>


        <!-- =====================
             STUDY WORKSPACE
        ====================== -->

        <section id="studyWorkspace" class="page" aria-label="Study Material workspace">
            <header class="workspace-header">
                <button class="workspace-back" type="button" onclick="backToStudy()" aria-label="Back to study selector">
                    <span aria-hidden="true">←</span>
                    <span>Back</span>
                </button>
            </header>

            <div id="workspaceContent" class="workspace-content" aria-live="polite">
                <div class="workspace-loading" role="status">
                    <span class="loading-mark" aria-hidden="true">AK<span>•</span></span>
                    <p>Loading your study material…</p>
                </div>
            </div>
        </section>


        <!-- =====================
             STUDY EXPLAINER WORKSPACE
        ====================== -->

        <section id="studyExplainerWorkspace" class="page" aria-label="Study Explainer workspace">
            <header class="workspace-header">
                <button class="workspace-back" type="button" onclick="backToStudy()" aria-label="Back to study selector">
                    <span aria-hidden="true">←</span>
                    <span>Back</span>
                </button>
            </header>

            <div id="explainerWorkspaceContent" class="workspace-content" aria-live="polite">
                <div class="workspace-loading" role="status">
                    <span class="loading-mark" aria-hidden="true">AK<span>•</span></span>
                    <p>Loading chapter explainer…</p>
                </div>
            </div>
        </section>



        <!-- =====================
             PROFILE
        ====================== -->

        <section id="profile" class="page">

            <div class="profile-header">

                <div class="profile-avatar">
                    AK<span>•</span>
                </div>

                <h2>AKNovi Student</h2>

                <p>
                    Class 12 • Tamil Nadu State Board
                </p>

            </div>


            <div class="profile-card">

                <div>
                    <strong id="subjectCount">—</strong>
                    <span>Subjects</span>
                </div>

                <div>
                    <strong id="completedCount">0</strong>
                    <span>Completed</span>
                </div>

                <div>
                    <strong id="overallProgress">0%</strong>
                    <span>Progress</span>
                </div>

            </div>


            <div class="information-card">

                <h3>About AKNovi</h3>

                <p>
                    AKNovi is a student-focused learning
                    platform designed to organize study
                    materials, questions, answers,
                    explanations and future AI-powered
                    learning tools in one place.
                </p>

            </div>

        </section>

    </main>



    <!-- =========================
         BOTTOM NAVIGATION
    ========================== -->

    <nav class="bottom-navigation">

        <button
            class="nav-item active"
            data-page="home"
            onclick="openPage('home')">

            <span class="nav-icon">
                Home
            </span>

            <small>Home</small>

        </button>


        <button
            class="nav-item"
            data-page="subjects"
            onclick="openPage('subjects')">

            <span class="nav-icon">
                Books
            </span>

            <small>Subjects</small>

        </button>


        <button
            class="nav-item"
            data-page="study"
            onclick="openPage('study')">

            <span class="nav-icon">
                Study
            </span>

            <small>Study</small>

        </button>


        <button
            class="nav-item"
            data-page="profile"
            onclick="openPage('profile')">

            <span class="nav-icon">
                Me
            </span>

            <small>Profile</small>

        </button>

    </nav>

</div>



<!-- =========================
     SEARCH OVERLAY
========================== -->

<div
    id="searchOverlay"
    class="search-overlay">

    <div class="search-box">

        <button
            class="close-search"
            onclick="hideSearch()">

            ×

        </button>

        <div class="search-brand">
            AK<span>•</span>
        </div>

        <h2>Search AKNovi</h2>

        <input
            id="searchInput"
            type="search"
            placeholder="Search subjects, chapters..."
            oninput="searchContent(this.value)">

        <div id="searchResults"></div>

        <p class="search-note">
            Search will connect to study content and
            database records as the platform grows.
        </p>

    </div>

</div>



<script src="js/app.js"></script>

</body>
</html>
