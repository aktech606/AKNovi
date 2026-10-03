<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

header('X-Content-Type-Options: nosniff');

function respond(array $data, int $status = 200): never
{
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function positiveId(string $key): ?int
{
    $value = $_GET[$key] ?? null;
    if (!is_string($value) || filter_var($value, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) === false) {
        return null;
    }

    return (int) $value;
}

function safeBookPath(string $path): ?string
{
    $path = trim($path);
    if ($path === '' || str_contains($path, "\0") || str_contains($path, '\\') || preg_match('/[\x00-\x1F\x7F]/', $path)) {
        return null;
    }

    $root = realpath(studyBooksDirectory());
    if ($root === false) {
        return null;
    }

    // Database paths may be absolute or relative to the private study-material directory.
    $candidate = str_starts_with($path, '/') ? $path : $root . '/' . $path;
    $resolved = realpath($candidate);
    if ($resolved === false || !is_file($resolved) || !is_readable($resolved)) {
        return null;
    }

    $prefix = rtrim($root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    if (!str_starts_with($resolved, $prefix) || strtolower(pathinfo($resolved, PATHINFO_EXTENSION)) !== 'pdf') {
        return null;
    }

    return $resolved;
}

function safeHttpsUrl(?string $url): ?string
{
    if ($url === null || trim($url) === '') {
        return null;
    }

    $parts = parse_url(trim($url));
    if (!is_array($parts) || strtolower($parts['scheme'] ?? '') !== 'https' || empty($parts['host']) || isset($parts['user']) || isset($parts['pass'])) {
        return null;
    }

    return trim($url);
}

function serveStudyBook(PDO $pdo): never
{
    $bookId = positiveId('id');
    if ($bookId === null) {
        http_response_code(400);
        exit;
    }

    $statement = $pdo->prepare('SELECT file_path FROM study_books WHERE id = :id');
    $statement->execute(['id' => $bookId]);
    $book = $statement->fetch();
    $path = $book ? safeBookPath((string) $book['file_path']) : null;
    if ($path === null) {
        http_response_code(404);
        exit;
    }

    header('Content-Type: application/pdf');
    header('Content-Disposition: inline; filename="study-book.pdf"');
    header('Content-Length: ' . (string) filesize($path));
    header('Cache-Control: private, no-store');
    readfile($path);
    exit;
}

try {
    $pdo = database();
    $action = $_GET['action'] ?? 'reference';

    if ($action === 'study_book_file') {
        serveStudyBook($pdo);
    }

    if ($action === 'reference') {
        $subjects = $pdo->query('SELECT id, name FROM subjects ORDER BY id')->fetchAll();
        $mediums = $pdo->query('SELECT id, name FROM mediums ORDER BY id')->fetchAll();
        $questionTypes = $pdo->query('SELECT id, name FROM question_types ORDER BY id')->fetchAll();
        $initialSubjectId = $subjects ? (int) $subjects[0]['id'] : null;
        $initialChapters = [];
        if ($initialSubjectId !== null) {
            $statement = $pdo->prepare(
                'SELECT id, subject_id, chapter_number, chapter_name
                 FROM chapters
                 WHERE subject_id = :subject_id
                 ORDER BY chapter_number, id'
            );
            $statement->execute(['subject_id' => $initialSubjectId]);
            $initialChapters = $statement->fetchAll();
        }
        respond([
            'success' => true,
            'data' => [
                'subjects' => $subjects,
                'mediums' => $mediums,
                'question_types' => $questionTypes,
                'initial_subject_id' => $initialSubjectId,
                'initial_chapters' => $initialChapters,
            ],
        ]);
    }

    if ($action === 'chapters') {
        $subjectId = positiveId('subject_id');
        if ($subjectId === null) {
            respond(['success' => false, 'error' => 'A valid subject_id is required.'], 400);
        }

        $statement = $pdo->prepare(
            'SELECT id, subject_id, chapter_number, chapter_name
             FROM chapters
             WHERE subject_id = :subject_id
             ORDER BY chapter_number, id'
        );
        $statement->execute(['subject_id' => $subjectId]);
        respond(['success' => true, 'data' => $statement->fetchAll()]);
    }

    if ($action === 'study_material') {
        $subjectId = positiveId('subject_id');
        $chapterId = positiveId('chapter_id');
        $questionTypeId = positiveId('question_type_id');
        $medium = isset($_GET['medium']) && is_string($_GET['medium']) ? trim($_GET['medium']) : '';
        if ($subjectId === null || $chapterId === null || $questionTypeId === null || $medium === '' || strlen($medium) > 100) {
            respond(['success' => false, 'error' => 'Choose valid study options and try again.'], 400);
        }

        $statement = $pdo->prepare('SELECT id, name FROM subjects WHERE id = :id');
        $statement->execute(['id' => $subjectId]);
        $subject = $statement->fetch();
        $statement = $pdo->prepare('SELECT id, subject_id, chapter_number, chapter_name FROM chapters WHERE id = :id AND subject_id = :subject_id');
        $statement->execute(['id' => $chapterId, 'subject_id' => $subjectId]);
        $chapter = $statement->fetch();
        $statement = $pdo->prepare('SELECT id, name FROM question_types WHERE id = :id');
        $statement->execute(['id' => $questionTypeId]);
        $questionType = $statement->fetch();
        $statement = $pdo->prepare('SELECT id, name FROM mediums WHERE name = :name');
        $statement->execute(['name' => $medium]);
        $mediumRecord = $statement->fetch();
        if (!$subject || !$chapter || !$questionType || !$mediumRecord) {
            respond(['success' => false, 'error' => 'Choose valid study options and try again.'], 400);
        }

        $statement = $pdo->prepare(
            'SELECT id, question, answer
             FROM questions
             WHERE subject_id = :subject_id
               AND chapter_id = :chapter_id
               AND question_type_id = :question_type_id
               AND medium = :medium
             ORDER BY id'
        );
        $statement->execute([
            'subject_id' => $subjectId,
            'chapter_id' => $chapterId,
            'question_type_id' => $questionTypeId,
            'medium' => $mediumRecord['name'],
        ]);
        $questions = $statement->fetchAll();

        $statement = $pdo->prepare(
            'SELECT id, title, file_path FROM study_books
             WHERE subject_id = :subject_id AND medium = :medium
             ORDER BY id LIMIT 1'
        );
        $statement->execute(['subject_id' => $subjectId, 'medium' => $mediumRecord['name']]);
        $bookRow = $statement->fetch();
        $studyBook = null;
        if ($bookRow) {
            $studyBook = [
                'id' => (int) $bookRow['id'],
                'title' => $bookRow['title'],
                'available' => safeBookPath((string) ($bookRow['file_path'] ?? '')) !== null,
                'url' => safeBookPath((string) ($bookRow['file_path'] ?? '')) !== null
                    ? 'api/data.php?action=study_book_file&id=' . (int) $bookRow['id']
                    : null,
            ];
        }

        $statement = $pdo->prepare(
            'SELECT id, title, video_url, explanation FROM ai_explainers
             WHERE subject_id = :subject_id AND chapter_id = :chapter_id AND medium = :medium
             ORDER BY id LIMIT 1'
        );
        $statement->execute([
            'subject_id' => $subjectId,
            'chapter_id' => $chapterId,
            'medium' => $mediumRecord['name'],
        ]);
        $explainerRow = $statement->fetch();
        $aiExplainer = $explainerRow ? [
            'title' => $explainerRow['title'],
            'video_url' => safeHttpsUrl($explainerRow['video_url']),
            'explanation' => $explainerRow['explanation'],
        ] : null;

        respond([
            'success' => true,
            'data' => [
                'subject' => $subject,
                'chapter' => $chapter,
                'question_type' => $questionType,
                'medium' => $mediumRecord,
                'questions' => $questions,
                'study_book' => $studyBook,
                'ai_explainer' => $aiExplainer,
            ],
        ]);
    }

    if ($action === 'study_explainer') {
        $subjectId = positiveId('subject_id');
        $chapterId = positiveId('chapter_id');
        $medium = isset($_GET['medium']) && is_string($_GET['medium']) ? trim($_GET['medium']) : '';
        if ($subjectId === null || $chapterId === null || $medium === '' || strlen($medium) > 100) {
            respond(['success' => false, 'error' => 'Choose a valid subject, chapter and medium.'], 400);
        }

        $statement = $pdo->prepare('SELECT id, name FROM subjects WHERE id = :id');
        $statement->execute(['id' => $subjectId]);
        $subject = $statement->fetch();
        $statement = $pdo->prepare(
            'SELECT id, subject_id, chapter_number, chapter_name
             FROM chapters
             WHERE id = :chapter_id AND subject_id = :subject_id'
        );
        $statement->execute(['chapter_id' => $chapterId, 'subject_id' => $subjectId]);
        $chapter = $statement->fetch();
        $statement = $pdo->prepare('SELECT id, name FROM mediums WHERE name = :name');
        $statement->execute(['name' => $medium]);
        $mediumRecord = $statement->fetch();
        if (!$subject || !$chapter || !$mediumRecord) {
            respond(['success' => false, 'error' => 'Choose a valid subject, chapter and medium.'], 400);
        }

        $statement = $pdo->prepare(
            'SELECT title, video_url, explanation
             FROM ai_explainers
             WHERE subject_id = :subject_id
               AND chapter_id = :chapter_id
               AND medium = :medium
             ORDER BY id
             LIMIT 1'
        );
        $statement->execute([
            'subject_id' => $subjectId,
            'chapter_id' => $chapterId,
            'medium' => $mediumRecord['name'],
        ]);
        $explainerRow = $statement->fetch();
        $aiExplainer = $explainerRow ? [
            'title' => $explainerRow['title'],
            'video_url' => safeHttpsUrl($explainerRow['video_url']),
            'explanation' => $explainerRow['explanation'],
        ] : null;

        respond([
            'success' => true,
            'data' => [
                'subject' => $subject,
                'chapter' => $chapter,
                'medium' => $mediumRecord,
                'ai_explainer' => $aiExplainer,
            ],
        ]);
    }

    respond(['success' => false, 'error' => 'Unknown data action.'], 404);
} catch (Throwable $error) {
    error_log('AKNovi API failure: ' . $error->getMessage());
    if (($_GET['action'] ?? '') === 'study_book_file') {
        http_response_code(404);
        exit;
    }
    respond(['success' => false, 'error' => 'Study data is temporarily unavailable.'], 500);
}
