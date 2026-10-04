PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
INSERT INTO subjects VALUES(1,'Tamil');
INSERT INTO subjects VALUES(2,'English');
INSERT INTO subjects VALUES(3,'Accountancy');
INSERT INTO subjects VALUES(4,'Computer Applications');
INSERT INTO subjects VALUES(5,'Commerce');
INSERT INTO subjects VALUES(6,'Economics');
CREATE TABLE chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    chapter_number INTEGER NOT NULL,
    chapter_name TEXT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
INSERT INTO chapters VALUES(1,6,1,'Introduction to Macro Economics');
INSERT INTO chapters VALUES(2,6,2,'National Income');
INSERT INTO chapters VALUES(3,6,3,'Theories of Employment and Income');
INSERT INTO chapters VALUES(4,6,4,'Consumption and Investment Functions');
INSERT INTO chapters VALUES(5,6,5,'Monetary Economics');
INSERT INTO chapters VALUES(6,6,6,'Banking');
INSERT INTO chapters VALUES(7,6,7,'International Economics');
INSERT INTO chapters VALUES(8,6,8,'International Economic Organisations');
INSERT INTO chapters VALUES(9,6,9,'Fiscal Economics');
INSERT INTO chapters VALUES(10,6,10,'Environmental Economics');
INSERT INTO chapters VALUES(11,6,11,'Economics of Development and Planning');
INSERT INTO chapters VALUES(12,6,12,'Introduction to Statistical Methods and Econometrics');
INSERT INTO chapters VALUES(13,1,1,'மொழி, கலை');
INSERT INTO chapters VALUES(14,1,2,'இயற்கை, வேளாண்மை, சுற்றுச்சூழல்');
INSERT INTO chapters VALUES(15,1,3,'பண்பாடு');
INSERT INTO chapters VALUES(16,1,4,'கல்வி, அழகியல்');
INSERT INTO chapters VALUES(17,1,5,'நாகரிகம், தொழில், வணிகம், ஆளுமை');
INSERT INTO chapters VALUES(18,1,6,'நாடு, சமூகம், நிருவாகம், மனிதம்');
INSERT INTO chapters VALUES(37,2,1,'Unit 1');
INSERT INTO chapters VALUES(38,2,2,'Unit 2');
INSERT INTO chapters VALUES(39,2,3,'Unit 3');
INSERT INTO chapters VALUES(40,2,4,'Unit 4');
INSERT INTO chapters VALUES(41,2,5,'Unit 5');
INSERT INTO chapters VALUES(42,2,6,'Unit 6');
INSERT INTO chapters VALUES(43,4,1,'Multimedia');
INSERT INTO chapters VALUES(44,4,2,'An Introduction to Adobe PageMaker');
INSERT INTO chapters VALUES(45,4,3,'Introduction to Database Management System');
INSERT INTO chapters VALUES(46,4,4,'PHP: Hypertext Preprocessor');
INSERT INTO chapters VALUES(47,4,5,'Functions and Arrays in PHP');
INSERT INTO chapters VALUES(48,4,6,'Conditional Statements in PHP');
INSERT INTO chapters VALUES(49,4,7,'Loops in PHP');
INSERT INTO chapters VALUES(50,4,8,'Forms and Files');
INSERT INTO chapters VALUES(51,4,9,'Connecting PHP and MYSQL');
INSERT INTO chapters VALUES(52,4,10,'Introduction to Computer Networks');
INSERT INTO chapters VALUES(53,4,11,'Network Examples and Protocols');
INSERT INTO chapters VALUES(54,4,12,'Domain Name System (DNS)');
INSERT INTO chapters VALUES(55,4,13,'Network Cabling');
INSERT INTO chapters VALUES(56,4,14,'Open Source Concepts');
INSERT INTO chapters VALUES(57,4,15,'E-Commerce');
INSERT INTO chapters VALUES(58,4,16,'Electronic Payment Systems');
INSERT INTO chapters VALUES(59,4,17,'E-Commerce Security Systems');
INSERT INTO chapters VALUES(60,4,18,'Electronic Data Interchange- EDI');
INSERT INTO chapters VALUES(61,3,1,'Accounts from incomplete records');
INSERT INTO chapters VALUES(62,3,2,'Accounts of not-for-profit organisation');
INSERT INTO chapters VALUES(63,3,3,'Accounts of partnership firms-fundamentals');
INSERT INTO chapters VALUES(64,3,4,'Goodwill in partnership accounts');
INSERT INTO chapters VALUES(65,3,5,'Admission of a partner');
INSERT INTO chapters VALUES(66,3,6,'Retirement and death of a partner');
INSERT INTO chapters VALUES(67,3,7,'Company accounts');
INSERT INTO chapters VALUES(68,3,8,'Financial Statement Analysis');
INSERT INTO chapters VALUES(69,3,9,'Ratio Analysis');
INSERT INTO chapters VALUES(70,3,10,'Computerised Accounting system-Tally');
INSERT INTO chapters VALUES(71,5,1,'PRINCIPLES OF MANAGEMENT');
INSERT INTO chapters VALUES(72,5,2,'FUNCTIONS OF MANAGEMENT');
INSERT INTO chapters VALUES(73,5,3,'MANAGEMENT BY OBJECTIVES (MBO) and MANAGEMENT BY EXCEPTION (MBE)');
INSERT INTO chapters VALUES(74,5,4,'INTRODUCTION TO FINANCIAL MARKETS');
INSERT INTO chapters VALUES(75,5,5,'CAPITAL MARKET');
INSERT INTO chapters VALUES(76,5,6,'MONEY MARKET');
INSERT INTO chapters VALUES(77,5,7,'STOCK EXCHANGE');
INSERT INTO chapters VALUES(78,5,8,'SECURITIES EXCHANGE BOARD OF INDIA (SEBI)');
INSERT INTO chapters VALUES(79,5,9,'FUNDAMENTALS OF HRM');
INSERT INTO chapters VALUES(80,5,10,'RECRUITMENT METHODS');
INSERT INTO chapters VALUES(81,5,11,'EMPLOYEE SELECTION PROCESS');
INSERT INTO chapters VALUES(82,5,12,'EMPLOYEE TRAINING METHOD');
INSERT INTO chapters VALUES(83,5,13,'CONCEPT OF MARKET AND MARKETER');
INSERT INTO chapters VALUES(84,5,14,'MARKETING AND MARKETING MIX');
INSERT INTO chapters VALUES(85,5,15,'RECENT TRENDS IN MARKETING');
INSERT INTO chapters VALUES(86,5,16,'CONSUMERISM');
INSERT INTO chapters VALUES(87,5,17,'RIGHTS, DUTIES & RESPONSIBILITIES OF CONSUMERS');
INSERT INTO chapters VALUES(88,5,18,'GRIEVANCE REDRESSAL MECHANISM');
INSERT INTO chapters VALUES(89,5,19,'ENVIRONMENTAL FACTORS');
INSERT INTO chapters VALUES(90,5,20,'LIBERALIZATION, PRIVATIZATION AND GLOBALIZATION');
INSERT INTO chapters VALUES(91,5,21,'THE SALE OF GOODS ACT, 1930');
INSERT INTO chapters VALUES(92,5,22,'THE NEGOTIABLE INSTRUMENTS ACT, 1881');
INSERT INTO chapters VALUES(93,5,23,'ELEMENTS OF ENTREPRENEURSHIP');
INSERT INTO chapters VALUES(94,5,24,'TYPES OF ENTREPRENEURS');
INSERT INTO chapters VALUES(95,5,25,'GOVERNMENT SCHEMES FOR ENTREPRENEURIAL DEVELOPMENT');
INSERT INTO chapters VALUES(96,5,26,'COMPANIES ACT, 2013');
INSERT INTO chapters VALUES(97,5,27,'COMPANY MANAGEMENT');
INSERT INTO chapters VALUES(98,5,28,'COMPANY SECRETARY');
CREATE TABLE question_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
INSERT INTO question_types VALUES(1,'One Mark');
INSERT INTO question_types VALUES(2,'Two Marks');
INSERT INTO question_types VALUES(3,'Three Marks');
INSERT INTO question_types VALUES(4,'Five Marks');
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    chapter_id INTEGER NOT NULL,
    question_type_id INTEGER NOT NULL,
    medium TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (chapter_id) REFERENCES chapters(id),
    FOREIGN KEY (question_type_id) REFERENCES question_types(id)
);
INSERT INTO questions VALUES(1,4,43,1,'English','What is multimedia?','The use of multiple forms of media to communicate information.');
INSERT INTO questions VALUES(2,4,43,1,'English','________ has five major components like text, images, sound, video and animation.','Multimedia.');
INSERT INTO questions VALUES(3,4,43,1,'English','What is a raster image?','A type of image made up of pixels.');
INSERT INTO questions VALUES(4,4,43,1,'English','What is a vector image?','A type of image made up of geometric shapes.');
INSERT INTO questions VALUES(5,4,43,1,'English','Which of the following is a raster image file format? (a) JPEG (b) EPS (c) CDR (d) SVG','JPEG.');
INSERT INTO questions VALUES(6,4,43,1,'English','Which of the following is a vector image file format? (a) PSD (b) JPEG (c) EPS (d) BMP','EPS.');
INSERT INTO questions VALUES(7,4,43,1,'English','RTF (Rich Text Format) file format was introduced by ________.','Microsoft.');
INSERT INTO questions VALUES(8,4,43,1,'English','The expansion of JPEG is ________.','Joint Photographic Experts Group.');
INSERT INTO questions VALUES(9,4,43,1,'English','AIFF file format was developed by ________.','Apple Inc.');
INSERT INTO questions VALUES(10,4,43,1,'English','Which of the following is an audio file format? (a) MP3 (b) AVI (c) MPEG (d) PNG','MP3.');
INSERT INTO questions VALUES(11,4,43,2,'English','Define Multimedia.','Multimedia allows users to combine and change data from various sources, such as images, text, graphics, video and audio, on a single platform.');
INSERT INTO questions VALUES(12,4,43,2,'English','List out Multimedia Components.','Text, images, sound, video and animation.');
INSERT INTO questions VALUES(13,4,43,2,'English','Classify the TEXT components in multimedia.','Static text and hypertext. Static text remains as a heading, line or paragraph. Hypertext uses nodes and links to provide non-sequential access to text.');
INSERT INTO questions VALUES(14,4,43,2,'English','Classify the IMAGE components in multimedia.','Raster images and vector images. Raster images are made of pixels; vector images are made of geometric shapes.');
INSERT INTO questions VALUES(15,4,43,2,'English','Define Animation.','Animation is the process of displaying still images quickly so that they give the impression of continuous movement.');
INSERT INTO questions VALUES(16,4,43,3,'English','List out image file formats.','Raster image formats include JPEG, PNG, GIF and BMP. Vector image formats include EPS, SVG and CDR.');
INSERT INTO questions VALUES(17,4,43,3,'English','List out audio file formats.','MP3, WAV, MIDI and AIFF.');
INSERT INTO questions VALUES(18,4,43,3,'English','List out video file formats.','AVI, MPEG, MP4 and MOV.');
INSERT INTO questions VALUES(19,4,43,4,'English','Explain in detail about Production team roles and responsibilities.',unistr('A multimedia production team consists of the following members:\u000a1. Production Manager: Defines and coordinates the project to ensure timely completion and quality. Needs technical, proposal-writing, communication, budgeting and human-resource management skills, and acts as team leader.\u000a2. Content Specialist: Researches the application content, including project information, graphics, data and facts.\u000a3. Script Writer: Plans the sequence of events for video or film scripts, visualizes concepts in a three-dimensional environment and may integrate virtual reality when needed.\u000a4. Text Editor: Ensures the content flows logically and that text is correctly structured and grammatically correct.\u000a5. Multimedia Architect: Integrates graphics, text, audio, music, video, photos and animation using authoring software.\u000a6. Computer Graphic Artist: Creates or edits backgrounds, bullets, buttons, pictures, 3-D objects, animation and logos.\u000a7. Audio and Video Specialist: Records and edits sound effects and handles narration and digitized video.\u000a8. Computer Programmer: Writes code or scripts for special functions, such as controlling video-window size and shape and peripherals.\u000a9. Web Master: Creates and maintains web pages and converts multimedia presentations into web pages.\u000aThe final multimedia product is a joint effort of the entire team.'));
INSERT INTO questions VALUES(20,4,43,4,'English','Explain in detail about different file formats in multimedia files.',unistr('Multimedia uses different file formats for text, images, audio and video.\u000a\u000a1. Text: RTF (Rich Text Format) was introduced by Microsoft.\u000a\u000a2. Images:\u000a   - Raster images are made up of pixels. JPEG is identified as a raster image format.\u000a   - Vector images are made up of geometric shapes. Examples are AI, EPS, SVG and CDR.\u000a\u000a3. Audio:\u000a   - AIFF (Audio Interchange File Format) was developed by Apple Inc. and is used to store sound data.\u000a   - WMA (Windows Media Audio) is owned by Microsoft.\u000a   - RA (Real Audio) is designed for streaming audio over the Internet.\u000a   - WAV and MP3 are also common audio formats.\u000a\u000a4. Video:\u000a   - AVI (Audio/Video Interleave) is a Windows video format in which sound and picture are stored in alternating interleaved chunks.\u000a   - MPEG (Moving Picture Experts Group) is a standard for digital video and audio compression.'));
CREATE TABLE IF NOT EXISTS "study_explainers" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    chapter_id INTEGER NOT NULL,
    medium TEXT NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT,
    explanation TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);
CREATE TABLE mediums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
INSERT INTO mediums VALUES(1,'Tamil');
INSERT INTO mediums VALUES(2,'English');
PRAGMA writable_schema=ON;
CREATE TABLE IF NOT EXISTS sqlite_sequence(name,seq);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('subjects',6);
INSERT INTO sqlite_sequence VALUES('question_types',4);
INSERT INTO sqlite_sequence VALUES('chapters',98);
INSERT INTO sqlite_sequence VALUES('mediums',2);
INSERT INTO sqlite_sequence VALUES('questions',20);
CREATE INDEX idx_chapters_subject_number ON chapters(subject_id, chapter_number);
PRAGMA writable_schema=OFF;
COMMIT;
