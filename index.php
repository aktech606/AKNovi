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
                                ECONOMICS
                            </p>

                            <h3>
                                Chapter 1
                            </h3>

                            <p>
                                Introduction to Macro Economics
                            </p>

                        </div>

                        <strong class="continue-percent">
                            35%
                        </strong>

                    </div>

                    <div class="progress-bar">
                        <div
                            class="progress"
                            style="width:35%">
                        </div>
                    </div>

                </div>

            </div>


            <!-- QUICK ACCESS -->

            <div class="section-heading">

                <div>
                    <h2>Quick Access</h2>
                    <p>Your six subjects</p>
                </div>

            </div>


            <!-- SUBJECT GRID -->

            <div class="subject-grid">


                <!-- TAMIL -->

                <button
                    class="subject-card tamil"
                    onclick="selectSubject('Tamil')">

                    <div class="subject-card-top">

                        <span class="subject-number">
                            01
                        </span>

                        <span class="subject-arrow">
                            →
                        </span>

                    </div>

                    <strong>Tamil</strong>

                    <small>தமிழ்</small>

                    <div class="subject-progress">

                        <div class="subject-progress-header">
                            <span>Progress</span>
                            <b>0%</b>
                        </div>

                        <div class="mini-progress">
                            <div style="width:0%"></div>
                        </div>

                    </div>

                </button>


                <!-- ENGLISH -->

                <button
                    class="subject-card english"
                    onclick="selectSubject('English')">

                    <div class="subject-card-top">

                        <span class="subject-number">
                            02
                        </span>

                        <span class="subject-arrow">
                            →
                        </span>

                    </div>

                    <strong>English</strong>

                    <small>English</small>

                    <div class="subject-progress">

                        <div class="subject-progress-header">
                            <span>Progress</span>
                            <b>0%</b>
                        </div>

                        <div class="mini-progress">
                            <div style="width:0%"></div>
                        </div>

                    </div>

                </button>


                <!-- ACCOUNTANCY -->

                <button
                    class="subject-card accountancy"
                    onclick="selectSubject('Accountancy')">

                    <div class="subject-card-top">

                        <span class="subject-number">
                            03
                        </span>

                        <span class="subject-arrow">
                            →
                        </span>

                    </div>

                    <strong>Accountancy</strong>

                    <small>Accounts</small>

                    <div class="subject-progress">

                        <div class="subject-progress-header">
                            <span>Progress</span>
                            <b>0%</b>
                        </div>

                        <div class="mini-progress">
                            <div style="width:0%"></div>
                        </div>

                    </div>

                </button>


                <!-- COMPUTER -->

                <button
                    class="subject-card computer"
                    onclick="selectSubject('Computer Applications')">

                    <div class="subject-card-top">

                        <span class="subject-number">
                            04
                        </span>

                        <span class="subject-arrow">
                            →
                        </span>

                    </div>

                    <strong>Computer Applications</strong>

                    <small>Computer</small>

                    <div class="subject-progress">

                        <div class="subject-progress-header">
                            <span>Progress</span>
                            <b>0%</b>
                        </div>

                        <div class="mini-progress">
                            <div style="width:0%"></div>
                        </div>

                    </div>

                </button>


                <!-- COMMERCE -->

                <button
                    class="subject-card commerce"
                    onclick="selectSubject('Commerce')">

                    <div class="subject-card-top">

                        <span class="subject-number">
                            05
                        </span>

                        <span class="subject-arrow">
                            →
                        </span>

                    </div>

                    <strong>Commerce</strong>

                    <small>Commerce</small>

                    <div class="subject-progress">

                        <div class="subject-progress-header">
                            <span>Progress</span>
                            <b>0%</b>
                        </div>

                        <div class="mini-progress">
                            <div style="width:0%"></div>
                        </div>

                    </div>

                </button>


                <!-- ECONOMICS -->

                <button
                    class="subject-card economics"
                    onclick="selectSubject('Economics')">

                    <div class="subject-card-top">

                        <span class="subject-number">
                            06
                        </span>

                        <span class="subject-arrow">
                            →
                        </span>

                    </div>

                    <strong>Economics</strong>

                    <small>Economics</small>

                    <div class="subject-progress">

                        <div class="subject-progress-header">
                            <span>Progress</span>
                            <b>0%</b>
                        </div>

                        <div class="mini-progress">
                            <div style="width:0%"></div>
                        </div>

                    </div>

                </button>

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


            <div class="subjects-grid-large">


                <button
                    class="large-subject tamil"
                    onclick="selectSubject('Tamil')">

                    <span class="large-number">01</span>

                    <div>
                        <strong>Tamil</strong>
                        <small>தமிழ்</small>
                    </div>

                    <b>→</b>

                </button>


                <button
                    class="large-subject english"
                    onclick="selectSubject('English')">

                    <span class="large-number">02</span>

                    <div>
                        <strong>English</strong>
                        <small>English</small>
                    </div>

                    <b>→</b>

                </button>


                <button
                    class="large-subject accountancy"
                    onclick="selectSubject('Accountancy')">

                    <span class="large-number">03</span>

                    <div>
                        <strong>Accountancy</strong>
                        <small>Accounts</small>
                    </div>

                    <b>→</b>

                </button>


                <button
                    class="large-subject computer"
                    onclick="selectSubject('Computer Applications')">

                    <span class="large-number">04</span>

                    <div>
                        <strong>Computer Applications</strong>
                        <small>Computer</small>
                    </div>

                    <b>→</b>

                </button>


                <button
                    class="large-subject commerce"
                    onclick="selectSubject('Commerce')">

                    <span class="large-number">05</span>

                    <div>
                        <strong>Commerce</strong>
                        <small>Commerce</small>
                    </div>

                    <b>→</b>

                </button>


                <button
                    class="large-subject economics"
                    onclick="selectSubject('Economics')">

                    <span class="large-number">06</span>

                    <div>
                        <strong>Economics</strong>
                        <small>Economics</small>
                    </div>

                    <b>→</b>

                </button>

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

                <div class="radio-group">

                    <label class="radio-option">

                        <input
                            type="radio"
                            name="medium"
                            value="English"
                            checked>

                        <span>English</span>

                    </label>


                    <label class="radio-option">

                        <input
                            type="radio"
                            name="medium"
                            value="Tamil">

                        <span>Tamil</span>

                    </label>

                </div>

            </div>


            <!-- SUBJECT -->

            <div class="study-card">

                <label for="subjectSelect">
                    Subject
                </label>

                <select
                    id="subjectSelect"
                    onchange="loadChapters()">

                    <option value="Tamil">
                        Tamil
                    </option>

                    <option value="English">
                        English
                    </option>

                    <option value="Accountancy">
                        Accountancy
                    </option>

                    <option value="Computer Applications">
                        Computer Applications
                    </option>

                    <option value="Commerce">
                        Commerce
                    </option>

                    <option value="Economics" selected>
                        Economics
                    </option>

                </select>

            </div>


            <!-- CHAPTER -->

            <div class="study-card">

                <label for="chapterSelect">
                    Chapter
                </label>

                <select id="chapterSelect">

                    <option value="1">
                        Chapter 1
                    </option>

                    <option value="2">
                        Chapter 2
                    </option>

                    <option value="3">
                        Chapter 3
                    </option>

                    <option value="4">
                        Chapter 4
                    </option>

                    <option value="5">
                        Chapter 5
                    </option>

                </select>

            </div>


            <!-- QUESTION TYPE -->

            <div class="study-card">

                <label for="questionType">
                    Question Type
                </label>

                <select id="questionType">

                    <option value="one">
                        One Mark
                    </option>

                    <option value="two">
                        Two Marks
                    </option>

                    <option value="three">
                        Three Marks
                    </option>

                    <option value="five">
                        Five Marks
                    </option>

                </select>

            </div>


            <button
                class="primary-button full-button"
                onclick="startStudy()">

                Open Study Material
                <span>→</span>

            </button>


            <!-- AI EXPLAINER FUTURE AREA -->

            <div class="ai-preview">

                <div class="ai-icon">
                    AI
                </div>

                <div>

                    <p class="small-label">
                        COMING WITH STUDY CONTENT
                    </p>

                    <h3>
                        AI Chapter Explainer
                    </h3>

                    <p>
                        Chapter explanations, visual learning
                        and AI-generated explainer videos will
                        be added here.
                    </p>

                </div>

            </div>


            <!-- RESULT -->

            <div
                id="studyResult"
                class="study-result">

                <div class="result-icon">
                    AK<span>•</span>
                </div>

                <h3>
                    Ready to Learn
                </h3>

                <p>
                    Select your options above and open
                    the study material.
                </p>

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
                    <strong>6</strong>
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