<?php
declare(strict_types=1);

function database(): PDO
{
    static $connection = null;

    if ($connection instanceof PDO) {
        return $connection;
    }

    $databasePath = databasePath();

    $connection = new PDO('sqlite:' . $databasePath, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $connection->exec('PRAGMA foreign_keys = ON');
    $connection->exec('PRAGMA busy_timeout = 3000');
    $connection->exec('PRAGMA temp_store = MEMORY');

    return $connection;
}

function databasePath(): string
{
    return '/data/data/com.termux/files/home/aknovi_internal/database/aknovi.db';
}

function studyBooksDirectory(): string
{
    return dirname(databasePath()) . '/../study_materials';
}
