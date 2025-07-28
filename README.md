# crazy-scan

[![npm version](https://img.shields.io/npm/v/crazy-scan.svg)](https://www.npmjs.com/package/crazy-scan)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An npm module to convert HTML files into ultra small strings. A part of the crazy-dom library ecosystem.

## Features

- **Ultra Compression**: Converts HTML into minimal strings while preserving functionality
- **Smart Whitespace Handling**: Collapses unnecessary whitespace while preserving formatting in `<pre>`, `<code>`, `<textarea>`, and `<script>` tags
- **Comment Removal**: Strips HTML comments to reduce file size
- **Attribute Optimization**: Removes empty attributes, redundant attributes, and unnecessary quotes
- **CSS & JavaScript Minification**: Basic minification of inline styles and scripts
- **Doctype Normalization**: Converts verbose doctypes to HTML5 format
- **Configurable Options**: Customize compression settings based on your needs
- **File & String Processing**: Work with HTML strings directly or process files
- **Compression Statistics**: Get detailed stats about compression ratios and space saved

## Installation

```bash
npm install crazy-scan
```

## Quick Start

```javascript
var crazyScan = require('crazy-scan');

// Compress HTML string
var html = `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <!-- This comment will be removed -->
    <style type="text/css">
        body { margin: 0; padding: 20px; }
    </style>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a    test    paragraph.</p>
</body>
</html>`;

var compressed = crazyScan.scan(html);
console.log(compressed);
// Output: <!DOCTYPE html><html><head><title>My Page</title><style>body{margin:0;padding:20px}</style></head><body><h1>Hello World</h1><p>This is a test paragraph.</p></body></html>

// Get compression statistics
var stats = crazyScan.getStats(html, compressed);
console.log('Saved: ' + stats.savedPercent + ' (' + stats.savedBytes + ' bytes)');
```

## API Reference

### Methods

#### `scan(html)`
Compresses an HTML string into an ultra small string.

- **html** `{String}` - HTML content to compress
- **Returns** `{String}` - Compressed HTML string

#### `scanFile(filePath, callback)`
Asynchronously compresses an HTML file.

- **filePath** `{String}` - Path to HTML file
- **callback** `{Function}` - Callback function `(err, compressedHTML)`

#### `scanFileSync(filePath)`
Synchronously compresses an HTML file.

- **filePath** `{String}` - Path to HTML file
- **Returns** `{String}` - Compressed HTML string

#### `configure(options)`
Configure compression options.

- **options** `{Object}` - Configuration options
- **Returns** `{CrazyScan}` - Returns instance for chaining

#### `getStats(original, compressed)`
Get compression statistics.

- **original** `{String}` - Original HTML string
- **compressed** `{String}` - Compressed HTML string
- **Returns** `{Object}` - Statistics object with compression details

### Configuration Options

```javascript
var customScanner = crazyScan.create({
    removeComments: true,              // Remove HTML comments
    removeWhitespace: true,            // Remove unnecessary whitespace
    removeEmptyAttributes: true,       // Remove empty attributes
    removeRedundantAttributes: true,   // Remove redundant attributes
    removeScriptTypeAttributes: true,  // Remove type="text/javascript"
    removeStyleLinkTypeAttributes: true, // Remove type="text/css"
    removeOptionalTags: true,          // Remove optional tags
    removeEmptyElements: false,        // Remove empty elements
    collapseWhitespace: true,          // Collapse whitespace
    conservativeCollapse: false,       // Conservative whitespace collapse
    preserveLineBreaks: false,         // Preserve line breaks
    minifyCSS: true,                   // Minify inline CSS
    minifyJS: true,                    // Minify inline JavaScript
    removeAttributeQuotes: true,       // Remove unnecessary attribute quotes
    useShortDoctype: true,             // Use HTML5 doctype
    removeDoctype: false               // Remove doctype entirely
});
```

## Examples

### Basic Usage
```javascript
var crazyScan = require('crazy-scan');
var compressed = crazyScan.scan('<div>  <p>Hello World</p>  </div>');
console.log(compressed); // <div><p>Hello World</p></div>
```

### File Processing
```javascript
// Async
crazyScan.scanFile('input.html', function(err, result) {
    if (!err) {
        console.log('Compressed:', result);
    }
});

// Sync
var compressed = crazyScan.scanFileSync('input.html');
```

### Custom Configuration
```javascript
var conservative = crazyScan.create({
    removeComments: false,
    minifyCSS: false,
    removeAttributeQuotes: false
});

var result = conservative.scan(htmlString);
```

### Compression Statistics
```javascript
var original = '<div>  <p>Hello</p>  </div>';
var compressed = crazyScan.scan(original);
var stats = crazyScan.getStats(original, compressed);

console.log('Original size:', stats.originalSize, 'bytes');
console.log('Compressed size:', stats.compressedSize, 'bytes');
console.log('Space saved:', stats.savedPercent);
console.log('Compression ratio:', stats.compressionRatio + ':1');
```

## Running Tests

```bash
npm test
```

## Running Examples

```bash
npm run example
```

## License

MIT © [Pranay Dubey](https://github.com/Pranay92)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Part of crazy-dom

This module is part of the larger crazy-dom library ecosystem for DOM manipulation and optimization.
