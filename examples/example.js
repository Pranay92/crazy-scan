/**
 * crazy-scan Examples
 * Demonstrates how to use the HTML compression module
 */

var crazyScan = require('../index.js');
var fs = require('fs');
var path = require('path');

console.log('=== crazy-scan Examples ===\n');

// Example 1: Basic usage
console.log('Example 1: Basic HTML compression');
console.log('----------------------------------');

var sampleHTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
<html>
<head>
    <title>My Website</title>
    <!-- This comment will be removed -->
    <style type="text/css">
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        
        .header {
            background-color: #f0f0f0;
            padding: 10px;
        }
    </style>
    <script type="text/javascript">
        function showAlert() {
            alert("Hello World!");
        }
    </script>
</head>
<body>
    <div class="header">
        <h1>Welcome to My Site</h1>
    </div>
    
    <p>This is a sample paragraph with    extra    spaces.</p>
    
    <form method="get" action="/search">
        <input type="text" name="query" value="" placeholder="Search..." />
        <input type="submit" value="Search" />
    </form>
</body>
</html>`;

var compressed = crazyScan.scan(sampleHTML);
var stats = crazyScan.getStats(sampleHTML, compressed);

console.log('Original HTML:');
console.log(sampleHTML);
console.log('\nCompressed HTML:');
console.log(compressed);
console.log('\nCompression Statistics:');
console.log('- Original size: ' + stats.originalSize + ' bytes');
console.log('- Compressed size: ' + stats.compressedSize + ' bytes');
console.log('- Bytes saved: ' + stats.savedBytes + ' (' + stats.savedPercent + ')');
console.log('- Compression ratio: ' + stats.compressionRatio + ':1');

// Example 2: Custom configuration
console.log('\n\nExample 2: Custom configuration');
console.log('-------------------------------');

var customScanner = crazyScan.create({
    removeComments: false,        // Keep comments
    minifyCSS: false,            // Don't minify CSS
    removeAttributeQuotes: false  // Keep attribute quotes
});

var customCompressed = customScanner.scan(sampleHTML);
var customStats = crazyScan.getStats(sampleHTML, customCompressed);

console.log('With custom settings (comments preserved, CSS not minified):');
console.log(customCompressed);
console.log('\nCustom compression saved: ' + customStats.savedPercent);

// Example 3: File operations
console.log('\n\nExample 3: File operations');
console.log('--------------------------');

// Create a sample HTML file
var sampleFilePath = path.join(__dirname, 'sample-page.html');
var fileContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <!-- Navigation styles -->
    <style type="text/css">
        nav {
            background: #333;
            padding: 1rem;
        }
        
        nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        nav li {
            display: inline-block;
            margin-right: 1rem;
        }
        
        nav a {
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
    
    <main>
        <h1>Welcome</h1>
        <p>This is a sample page for demonstrating file compression.</p>
        
        <section id="content">
            <h2>Features</h2>
            <ul>
                <li>HTML compression</li>
                <li>CSS minification</li>
                <li>JavaScript optimization</li>
            </ul>
        </section>
    </main>
    
    <script type="text/javascript">
        // Simple analytics
        (function() {
            console.log('Page loaded at: ' + new Date().toISOString());
            
            // Track page views
            if (typeof analytics !== 'undefined') {
                analytics.track('page_view', {
                    page: window.location.pathname,
                    title: document.title
                });
            }
        })();
    </script>
</body>
</html>`;

fs.writeFileSync(sampleFilePath, fileContent);

// Synchronous file compression
console.log('Synchronous file compression:');
try {
    var syncResult = crazyScan.scanFileSync(sampleFilePath);
    var syncStats = crazyScan.getStats(fileContent, syncResult);
    
    console.log('✓ File compressed successfully');
    console.log('Original file size: ' + syncStats.originalSize + ' bytes');
    console.log('Compressed size: ' + syncStats.compressedSize + ' bytes');
    console.log('Space saved: ' + syncStats.savedPercent);
    
    // Save compressed version
    var compressedFilePath = path.join(__dirname, 'sample-page.min.html');
    fs.writeFileSync(compressedFilePath, syncResult);
    console.log('✓ Compressed file saved as: sample-page.min.html');
    
} catch (error) {
    console.error('✗ Synchronous compression failed:', error.message);
}

// Asynchronous file compression
console.log('\nAsynchronous file compression:');
crazyScan.scanFile(sampleFilePath, function(err, result) {
    if (err) {
        console.error('✗ Async compression failed:', err.message);
    } else {
        var asyncStats = crazyScan.getStats(fileContent, result);
        console.log('✓ Async compression successful');
        console.log('Compression ratio: ' + asyncStats.compressionRatio + ':1');
    }
    
    // Clean up example files
    try {
        fs.unlinkSync(sampleFilePath);
        fs.unlinkSync(path.join(__dirname, 'sample-page.min.html'));
        console.log('✓ Example files cleaned up');
    } catch (cleanupErr) {
        console.log('Note: Some example files may remain in the examples directory');
    }
});

// Example 4: Batch processing
console.log('\n\nExample 4: Batch processing multiple HTML strings');
console.log('-------------------------------------------------');

var htmlSnippets = [
    '<div class="container">    <h1>Title 1</h1>    </div>',
    '<!-- Comment --><p>Paragraph with <strong>bold</strong> text.</p>',
    '<form method="get"><input type="text" value="" /><input type="submit" /></form>',
    '<script type="text/javascript">var x = 1; var y = 2;</script>'
];

console.log('Processing ' + htmlSnippets.length + ' HTML snippets:');

htmlSnippets.forEach(function(snippet, index) {
    var compressed = crazyScan.scan(snippet);
    var stats = crazyScan.getStats(snippet, compressed);
    
    console.log('\nSnippet ' + (index + 1) + ':');
    console.log('Original:  "' + snippet + '"');
    console.log('Compressed: "' + compressed + '"');
    console.log('Saved: ' + stats.savedPercent + ' (' + stats.savedBytes + ' bytes)');
});

// Example 5: Advanced configuration showcase
console.log('\n\nExample 5: Advanced configuration options');
console.log('----------------------------------------');

var testHTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html>
<head>
    <script type="text/javascript">
        /* This is a comment */
        function test() {
            return true;
        }
    </script>
    <style type="text/css">
        /* CSS comment */
        body { margin: 0; }
    </style>
</head>
<body>
    <form method="get">
        <input type="text" value="" />
    </form>
    <a href="javascript:void(0)">Link</a>
</body>
</html>`;

var configurations = [
    {
        name: 'Maximum compression',
        options: {
            removeComments: true,
            collapseWhitespace: true,
            removeEmptyAttributes: true,
            removeAttributeQuotes: true,
            minifyCSS: true,
            minifyJS: true,
            useShortDoctype: true
        }
    },
    {
        name: 'Conservative compression',
        options: {
            removeComments: false,
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeEmptyAttributes: false,
            removeAttributeQuotes: false,
            minifyCSS: false,
            minifyJS: false
        }
    },
    {
        name: 'Whitespace only',
        options: {
            removeComments: false,
            collapseWhitespace: true,
            removeEmptyAttributes: false,
            removeRedundantAttributes: false,
            removeAttributeQuotes: false,
            minifyCSS: false,
            minifyJS: false,
            useShortDoctype: false
        }
    }
];

configurations.forEach(function(config) {
    console.log('\n' + config.name + ':');
    var scanner = crazyScan.create(config.options);
    var result = scanner.scan(testHTML);
    var stats = crazyScan.getStats(testHTML, result);
    
    console.log('Result: ' + result);
    console.log('Saved: ' + stats.savedPercent + ' (' + stats.savedBytes + ' bytes)');
});

console.log('\n=== Examples completed ===');
console.log('\nTry running: npm test  (to run the test suite)');
console.log('Or explore the source code in index.js for more details.');