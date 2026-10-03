<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function positiveId(string $key): ?int
{
    $value = filter_input(INPUT_GET, $key, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1],
    ]);

    return $value === false || $value === null ? null : $value;
}

try {
    $pdo = database();
    $action = $_GET['action'] ?? 'reference';

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

    respond(['success' => false, 'error' => 'Unknown data action.'], 404);
} catch (Throwable $error) {
    error_log('AKNovi API failure: ' . $error->getMessage());
    respond(['success' => false, 'error' => 'Study data is temporarily unavailable.'], 500);
}
