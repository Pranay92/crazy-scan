/**
 * Test file for crazy-scan module
 */

var crazyScan = require('../index.js');
var fs = require('fs');
var path = require('path');

// Test HTML samples
var testHTML = {
  basic: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Test Page</title>
    <!-- This is a comment -->
    <style type="text/css">
        body {
            margin: 0;
            padding: 10px;
            background-color: #ffffff;
        }
        
        .container {
            width: 100%;
            max-width: 1200px;
        }
        
        /* Another comment */
        .header {
            color: red;
        }
    </style>
    <script type="text/javascript">
        // JavaScript comment
        function test() {
            console.log("Hello World");
            
            var x = 1;
            var y = 2;
            
            /* Multi-line
               comment */
            return x + y;
        }
    </script>
</head>
<body>
    
    <div class="container">
        <h1 id="main-title" class="header">Welcome</h1>
        
        <p>This is a test paragraph with    multiple    spaces.</p>
        
        <form method="get" action="/test">
            <input type="text" name="username" value="" />
            <input type="submit" value="Submit" />
        </form>
        
        <pre>
            This content should preserve
            its    formatting    and
                spacing
        </pre>
        
        <a href="javascript:void(0)">Click me</a>
        
    </div>
    
</body>
</html>`,

  complex: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Complex Test</title>
    <!-- Remove this comment -->
    <link rel="stylesheet" type="text/css" href="styles.css">
    <style type="text/css">
        .test {
            color: blue;
            margin: 0px;
            padding: 5px;
        }
    </style>
</head>
<body>
    <div id="wrapper" class="main-wrapper">
        <header>
            <h1>Title</h1>
        </header>
        
        <main>
            <article>
                <p>Content with <strong>bold</strong> text.</p>
            </article>
        </main>
        
        <footer>
            <p>&copy; 2014</p>
        </footer>
    </div>
    
    <script type="text/javascript">
        var data = {
            name: "test",
            value: 123
        };
        
        function init() {
            console.log("Initialized");
        }
    </script>
</body>
</html>`
};

// Test functions
function runTests() {
  console.log('=== crazy-scan Test Suite ===\n');
  
  // Test 1: Basic compression
  console.log('Test 1: Basic HTML compression');
  var compressed = crazyScan.scan(testHTML.basic);
  var stats = crazyScan.getStats(testHTML.basic, compressed);
  
  console.log('Original size:', stats.originalSize, 'bytes');
  console.log('Compressed size:', stats.compressedSize, 'bytes');
  console.log('Saved:', stats.savedBytes, 'bytes (' + stats.savedPercent + ')');
  console.log('Compression ratio:', stats.compressionRatio + ':1');
  console.log('Compressed HTML preview:');
  console.log(compressed.substring(0, 200) + '...\n');
  
  // Test 2: Custom configuration
  console.log('Test 2: Custom configuration (preserve comments)');
  var customScan = crazyScan.create({
    removeComments: false,
    removeAttributeQuotes: false
  });
  
  var customCompressed = customScan.scan(testHTML.basic);
  var customStats = crazyScan.getStats(testHTML.basic, customCompressed);
  
  console.log('With comments preserved:');
  console.log('Compressed size:', customStats.compressedSize, 'bytes');
  console.log('Saved:', customStats.savedPercent);
  console.log('Preview:', customCompressed.substring(0, 150) + '...\n');
  
  // Test 3: Complex HTML
  console.log('Test 3: Complex HTML compression');
  var complexCompressed = crazyScan.scan(testHTML.complex);
  var complexStats = crazyScan.getStats(testHTML.complex, complexCompressed);
  
  console.log('Complex HTML stats:');
  console.log('Original size:', complexStats.originalSize, 'bytes');
  console.log('Compressed size:', complexStats.compressedSize, 'bytes');
  console.log('Saved:', complexStats.savedPercent);
  console.log('Compressed:', complexCompressed + '\n');
  
  // Test 4: File operations
  console.log('Test 4: File operations');
  
  // Create test HTML file
  var testFilePath = path.join(__dirname, 'sample.html');
  fs.writeFileSync(testFilePath, testHTML.basic);
  
  // Test synchronous file reading
  try {
    var fileCompressed = crazyScan.scanFileSync(testFilePath);
    console.log('Sync file compression successful');
    console.log('Length:', fileCompressed.length, 'characters');
  } catch (err) {
    console.error('Sync file compression failed:', err.message);
  }
  
  // Test asynchronous file reading
  crazyScan.scanFile(testFilePath, function(err, result) {
    if (err) {
      console.error('Async file compression failed:', err.message);
    } else {
      console.log('Async file compression successful');
      console.log('Length:', result.length, 'characters');
    }
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    
    console.log('\n=== All tests completed ===');
  });
  
  // Test 5: Error handling
  console.log('\nTest 5: Error handling');
  
  try {
    crazyScan.scan(null);
  } catch (err) {
    console.log('✓ Correctly caught null input error:', err.message);
  }
  
  try {
    crazyScan.scan(123);
  } catch (err) {
    console.log('✓ Correctly caught non-string input error:', err.message);
  }
  
  try {
    crazyScan.scanFile('nonexistent.html', function(err) {
      if (err) {
        console.log('✓ Correctly caught file not found error');
      }
    });
  } catch (err) {
    console.log('✓ File error handling works');
  }
  
  // Test 6: Feature verification
  console.log('\nTest 6: Feature verification');
  
  var featureTest = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html>
<head>
  <script type="text/javascript">var x=1;</script>
  <style type="text/css">body{margin:0;}</style>
</head>
<body>
  <form method="get"><input type="text" value="" /></form>
  <a href="javascript:void(0)">link</a>
</body>
</html>`;
  
  var featureResult = crazyScan.scan(featureTest);
  
  console.log('Feature test results:');
  console.log('✓ Short doctype:', featureResult.includes('<!DOCTYPE html>'));
  console.log('✓ Removed script type:', !featureResult.includes('type="text/javascript"'));
  console.log('✓ Removed style type:', !featureResult.includes('type="text/css"'));
  console.log('✓ Removed method=get:', !featureResult.includes('method="get"'));
  console.log('✓ Cleaned href:', featureResult.includes('href="#"'));
  console.log('✓ Removed empty value:', !featureResult.includes('value=""'));
  
  console.log('\nFinal compressed result:');
  console.log(featureResult);
}

// Run the tests
if (require.main === module) {
  runTests();
}