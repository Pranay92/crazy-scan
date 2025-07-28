/**
 * crazy-scan - HTML compression module
 * Converts HTML files into ultra small strings
 * Part of the crazy-dom library
 * 
 * @author Pranay Dubey
 * @license MIT
 */

'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Main CrazyScan class for HTML compression
 */
function CrazyScan() {
  this.options = {
    removeComments: true,
    removeWhitespace: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeOptionalTags: true,
    removeEmptyElements: false,
    collapseWhitespace: true,
    conservativeCollapse: false,
    preserveLineBreaks: false,
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    useShortDoctype: true,
    removeDoctype: false
  };
}

/**
 * Configure compression options
 * @param {Object} options - Compression options
 * @returns {CrazyScan} - Returns this for chaining
 */
CrazyScan.prototype.configure = function(options) {
  if (options && typeof options === 'object') {
    for (var key in options) {
      if (options.hasOwnProperty(key) && this.options.hasOwnProperty(key)) {
        this.options[key] = options[key];
      }
    }
  }
  return this;
};

/**
 * Remove HTML comments
 * @param {String} html - HTML string
 * @returns {String} - HTML without comments
 */
CrazyScan.prototype.removeComments = function(html) {
  if (!this.options.removeComments) return html;
  return html.replace(/<!--[\s\S]*?-->/g, '');
};

/**
 * Remove unnecessary whitespace
 * @param {String} html - HTML string
 * @returns {String} - HTML with collapsed whitespace
 */
CrazyScan.prototype.collapseWhitespace = function(html) {
  if (!this.options.collapseWhitespace) return html;
  
  // Preserve whitespace in pre, code, textarea, and script tags
  var preserveTags = ['pre', 'code', 'textarea', 'script', 'style'];
  var preserved = [];
  var placeholder = '___CRAZY_SCAN_PRESERVE___';
  
  // Extract and preserve content from specific tags
  preserveTags.forEach(function(tag) {
    var regex = new RegExp('<' + tag + '[^>]*>[\\s\\S]*?<\\/' + tag + '>', 'gi');
    html = html.replace(regex, function(match) {
      preserved.push(match);
      return placeholder + (preserved.length - 1) + placeholder;
    });
  });
  
  // Collapse whitespace
  if (this.options.conservativeCollapse) {
    html = html.replace(/\s+/g, ' ');
  } else {
    html = html.replace(/\s+/g, ' ');
    html = html.replace(/>\s+</g, '><');
    html = html.replace(/^\s+|\s+$/g, '');
  }
  
  if (!this.options.preserveLineBreaks) {
    html = html.replace(/\n/g, '');
  }
  
  // Restore preserved content
  preserved.forEach(function(content, index) {
    html = html.replace(placeholder + index + placeholder, content);
  });
  
  return html;
};

/**
 * Remove empty attributes
 * @param {String} html - HTML string
 * @returns {String} - HTML without empty attributes
 */
CrazyScan.prototype.removeEmptyAttributes = function(html) {
  if (!this.options.removeEmptyAttributes) return html;
  return html.replace(/\s+[\w-]+=""\s*/g, ' ').replace(/\s+[\w-]+=\s*/g, ' ');
};

/**
 * Remove redundant attributes
 * @param {String} html - HTML string
 * @returns {String} - HTML without redundant attributes
 */
CrazyScan.prototype.removeRedundantAttributes = function(html) {
  if (!this.options.removeRedundantAttributes) return html;
  
  // Remove method="get" from forms (default)
  html = html.replace(/\s+method=["']get["']/gi, '');
  
  // Remove javascript: from href
  html = html.replace(/href=["']javascript:void\(0\)["']/gi, 'href="#"');
  
  return html;
};

/**
 * Remove type attributes from script and style tags
 * @param {String} html - HTML string
 * @returns {String} - HTML without type attributes
 */
CrazyScan.prototype.removeTypeAttributes = function(html) {
  if (this.options.removeScriptTypeAttributes) {
    html = html.replace(/(<script[^>]*)\s+type=["']text\/javascript["']([^>]*>)/gi, '$1$2');
  }
  
  if (this.options.removeStyleLinkTypeAttributes) {
    html = html.replace(/(<style[^>]*)\s+type=["']text\/css["']([^>]*>)/gi, '$1$2');
    html = html.replace(/(<link[^>]*)\s+type=["']text\/css["']([^>]*>)/gi, '$1$2');
  }
  
  return html;
};

/**
 * Remove attribute quotes where possible
 * @param {String} html - HTML string
 * @returns {String} - HTML with minimal quotes
 */
CrazyScan.prototype.removeAttributeQuotes = function(html) {
  if (!this.options.removeAttributeQuotes) return html;
  
  // Remove quotes from attributes that don't need them
  return html.replace(/\s+([\w-]+)=["']([a-zA-Z0-9\-_]+)["']/g, function(match, attr, value) {
    // Keep quotes if value contains special characters
    if (/[^a-zA-Z0-9\-_]/.test(value)) {
      return match;
    }
    return ' ' + attr + '=' + value;
  });
};

/**
 * Use short doctype
 * @param {String} html - HTML string
 * @returns {String} - HTML with short doctype
 */
CrazyScan.prototype.useShortDoctype = function(html) {
  if (!this.options.useShortDoctype) return html;
  
  if (this.options.removeDoctype) {
    return html.replace(/<!DOCTYPE[^>]*>/i, '');
  }
  
  return html.replace(/<!DOCTYPE[^>]*>/i, '<!DOCTYPE html>');
};

/**
 * Basic CSS minification
 * @param {String} css - CSS string
 * @returns {String} - Minified CSS
 */
CrazyScan.prototype.minifyCSS = function(css) {
  if (!this.options.minifyCSS) return css;
  
  // Remove comments
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove unnecessary whitespace
  css = css.replace(/\s+/g, ' ');
  css = css.replace(/;\s*}/g, '}');
  css = css.replace(/\s*{\s*/g, '{');
  css = css.replace(/;\s*/g, ';');
  css = css.replace(/,\s*/g, ',');
  css = css.replace(/:\s*/g, ':');
  
  return css.trim();
};

/**
 * Basic JavaScript minification
 * @param {String} js - JavaScript string
 * @returns {String} - Minified JavaScript
 */
CrazyScan.prototype.minifyJS = function(js) {
  if (!this.options.minifyJS) return js;
  
  // Very basic JS minification - remove comments and extra whitespace
  js = js.replace(/\/\*[\s\S]*?\*\//g, '');
  js = js.replace(/\/\/.*$/gm, '');
  js = js.replace(/\s+/g, ' ');
  js = js.replace(/;\s*}/g, ';}');
  js = js.replace(/\s*{\s*/g, '{');
  
  return js.trim();
};

/**
 * Process inline CSS and JavaScript
 * @param {String} html - HTML string
 * @returns {String} - HTML with minified inline CSS/JS
 */
CrazyScan.prototype.processInlineContent = function(html) {
  var self = this;
  
  // Minify inline CSS
  html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, function(match, css) {
    var minifiedCSS = self.minifyCSS(css);
    return match.replace(css, minifiedCSS);
  });
  
  // Minify inline JavaScript
  html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(match, js) {
    // Skip if script has src attribute
    if (/<script[^>]*src=/i.test(match)) {
      return match;
    }
    var minifiedJS = self.minifyJS(js);
    return match.replace(js, minifiedJS);
  });
  
  return html;
};

/**
 * Main scan method - compresses HTML into ultra small string
 * @param {String} html - HTML content to compress
 * @returns {String} - Ultra compressed HTML string
 */
CrazyScan.prototype.scan = function(html) {
  if (typeof html !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Apply all compression techniques in sequence
  html = this.removeComments(html);
  html = this.useShortDoctype(html);
  html = this.removeTypeAttributes(html);
  html = this.removeEmptyAttributes(html);
  html = this.removeRedundantAttributes(html);
  html = this.processInlineContent(html);
  html = this.removeAttributeQuotes(html);
  html = this.collapseWhitespace(html);
  
  return html;
};

/**
 * Scan HTML file and return compressed string
 * @param {String} filePath - Path to HTML file
 * @param {Function} callback - Callback function (err, compressedHTML)
 */
CrazyScan.prototype.scanFile = function(filePath, callback) {
  var self = this;
  
  if (typeof callback !== 'function') {
    throw new Error('Callback function is required');
  }
  
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      return callback(err);
    }
    
    try {
      var compressed = self.scan(data);
      callback(null, compressed);
    } catch (scanErr) {
      callback(scanErr);
    }
  });
};

/**
 * Synchronous version of scanFile
 * @param {String} filePath - Path to HTML file
 * @returns {String} - Compressed HTML string
 */
CrazyScan.prototype.scanFileSync = function(filePath) {
  var data = fs.readFileSync(filePath, 'utf8');
  return this.scan(data);
};

/**
 * Get compression statistics
 * @param {String} original - Original HTML
 * @param {String} compressed - Compressed HTML
 * @returns {Object} - Statistics object
 */
CrazyScan.prototype.getStats = function(original, compressed) {
  var originalSize = Buffer.byteLength(original, 'utf8');
  var compressedSize = Buffer.byteLength(compressed, 'utf8');
  var savedBytes = originalSize - compressedSize;
  var savedPercent = ((savedBytes / originalSize) * 100).toFixed(2);
  
  return {
    originalSize: originalSize,
    compressedSize: compressedSize,
    savedBytes: savedBytes,
    savedPercent: savedPercent + '%',
    compressionRatio: (originalSize / compressedSize).toFixed(2)
  };
};

// Create default instance
var crazyScan = new CrazyScan();

// Export the class and default instance
module.exports = crazyScan;
module.exports.CrazyScan = CrazyScan;
module.exports.create = function(options) {
  return new CrazyScan().configure(options);
};