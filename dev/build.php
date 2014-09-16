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

$outputDir = rtrim($argv[1], '/');

createBuild();
copyFiles($outputDir);
alterContent($outputDir);
removeBuild();


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

function createBuild()
{
    $cmd = sprintf('r.js -o baseUrl=. name=scripts/popup out=scripts/popup-build-%s.js', date('Y-m-d'));
    execute($cmd);

    $cmd = sprintf(
        'r.js -o baseUrl=. cssIn=styles/popup.css out=styles/popup-build-%s.css optimizeCss=standard', date('Y-m-d')
    );
    execute($cmd);

    $cmd = sprintf('r.js -o baseUrl=. name=scripts/background out=scripts/background-build-%s.js', date('Y-m-d'));
    execute($cmd);
}

function copyFiles($outputDir)
{
    // images
    $cmd = sprintf('rm -rf %s/*', $outputDir);
    execute($cmd);

    $cmd = 'cp -r images ' . $outputDir;
    execute($cmd);

    // styles
    $cmd = sprintf('mkdir %s/styles', $outputDir);
    execute($cmd);

    $cmd = sprintf('cp styles/popup-build-%s.css %s/styles/', date('Y-m-d'), $outputDir);
    execute($cmd);

    // scripts
    $cmd = sprintf('mkdir %s/scripts', $outputDir);
    execute($cmd);

    $cmd = sprintf('cp scripts/require.js %s/scripts/', $outputDir);
    execute($cmd);

    $cmd = sprintf('cp scripts/popup-build-%s.js %s/scripts/', date('Y-m-d'), $outputDir);
    execute($cmd);

    $cmd = sprintf('cp scripts/background-build-%s.js %s/scripts/', date('Y-m-d'), $outputDir);
    execute($cmd);

    // the rest
    $cmd = 'cp popup.html ' . $outputDir;
    execute($cmd);

    $cmd = 'cp background.html ' . $outputDir;
    execute($cmd);

    $cmd = 'cp manifest.json ' . $outputDir;
    execute($cmd);
}

function alterContent($outputDir)
{
    $change = function ($filename, $searchContent, $replaceContent) {
        $content = file_get_contents($filename);
        $content = str_replace($searchContent, $replaceContent, $content);
        file_put_contents($filename, $content);
    };


    $change(
        $outputDir . '/popup.html', 'data-main="scripts/popup"',
        sprintf('data-main="scripts/popup-build-%s"', date('Y-m-d'))
    );

    $change(
        $outputDir . '/popup.html', 'href="styles/popup.css"',
        sprintf('href="styles/popup-build-%s.css"', date('Y-m-d'))
    );

    $change(
        $outputDir . '/background.html', 'data-main="scripts/background"',
        sprintf('data-main="scripts/background-build-%s"', date('Y-m-d'))
    );

    // let's put it aside as we can't properly test packed extensions locally
//    $change($outputDir . '/manifest.json', '"http://localhost:8080/*",', '');
}

function removeBuild()
{
    $cmd = sprintf('rm scripts/popup-build-%s.js', date('Y-m-d'));
    execute($cmd);

    $cmd = sprintf('rm styles/popup-build-%s.css', date('Y-m-d'));
    execute($cmd);

    $cmd = sprintf('rm scripts/background-build-%s.js', date('Y-m-d'));
    execute($cmd);
}
