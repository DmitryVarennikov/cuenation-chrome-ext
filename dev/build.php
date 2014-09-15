<?php

if (!isRoot()) {
    echo 'You are not in the root directory, root directory is where manifest.json located', PHP_EOL;
    exit;
}

if (empty($argv[1]) || !file_exists($argv[1])) {
    echo 'First argument must be a valid output directory, e.g.:', PHP_EOL;
    echo sprintf('php %s <output-dir>', $argv[0]), PHP_EOL;
    exit;
}

$outputDir = rtrim($argv[1], DIRECTORY_SEPARATOR);

compressFiles();
copyFiles($outputDir);
alterContent($outputDir);


function isRoot()
{
    return file_exists(getcwd() . '/manifest.json');
}

function execute($cmd)
{
    $handle = popen($cmd, 'r');
    if (false !== $handle) {
        while (false !== ($buffer = fgets($handle))) {
            echo $buffer;
        }
        $statusCode = pclose($handle);
        if (0 !== $statusCode) {
            echo 'Error while opening process file pointer, status code: ', $statusCode, PHP_EOL;
            exit(1);
        }
    } else {
        echo 'Failed to execute cmd: "', $cmd, '"', PHP_EOL;
        exit(1);
    }
}

function compressFiles()
{
    $cmd = 'r.js -o scripts/build.js';
    execute($cmd);
}

function copyFiles($outputDir)
{
    $cmd = sprintf('rm -rf %s/*', $outputDir);
    execute($cmd);

    $cmd = 'cp -r images ' . $outputDir;
    execute($cmd);

    $cmd = 'cp -r styles ' . $outputDir;
    execute($cmd);

    $cmd = sprintf('mkdir %s/scripts', $outputDir);
    execute($cmd);

    $cmd = sprintf('cp -r scripts/require.js %s/scripts/', $outputDir);
    execute($cmd);

    $cmd = sprintf('cp -r scripts/main-build-%s.js %s/scripts/', date('Y-m-d'), $outputDir);
    execute($cmd);

    $cmd = 'cp -r popup.html ' . $outputDir;
    execute($cmd);

    $cmd = 'cp -r manifest.json ' . $outputDir;
    execute($cmd);
}

function alterContent($outputDir)
{
    $content = file_get_contents($outputDir . DIRECTORY_SEPARATOR . 'popup.html');
    $content = str_replace(
        'data-main="scripts/main"', sprintf('data-main="scripts/main-build-%s"', date('Y-m-d')), $content
    );
    file_put_contents($outputDir . DIRECTORY_SEPARATOR . 'popup.html', $content);


    $content = file_get_contents($outputDir . DIRECTORY_SEPARATOR . 'manifest.json');
    $content = str_replace(
        '"http://localhost:8080/*",', sprintf('', date('Y-m-d')), $content
    );
    file_put_contents($outputDir . DIRECTORY_SEPARATOR . 'manifest.json', $content);
}
