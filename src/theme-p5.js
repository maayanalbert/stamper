import ace from "ace-builds"
ace.define("ace/theme/p5",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-p5";
exports.cssText = ".ace-p5 .ace_gutter {\
background: #fbf1d3;\
color: #333\
}\
.ace-p5 .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-p5 {\
background-color: #FDF6E3;\
color: #586E75\
}\
.ace-p5 .ace_cursor {\
color: #000000\
}\
.ace-p5 .ace_marker-layer .ace_selection {\
background: rgba(7, 54, 67, 0.09)\
}\
.ace-p5.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #FDF6E3;\
}\
.ace-p5 .ace_marker-layer .ace_step {\
background: rgb(255, 255, 0)\
}\
.ace-p5 .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(147, 161, 161, 0.50)\
}\
.ace-p5 .ace_marker-layer .ace_active-line {\
background: #EEE8D5\
}\
.ace-p5 .ace_gutter-active-line {\
background-color : #EDE5C1\
}\
.ace-p5 .ace_marker-layer .ace_selected-word {\
border: 1px solid #7f9390\
}\
.ace-p5 .ace_invisible {\
color: rgba(147, 161, 161, 0.50)\
}\
.ace-p5 .ace_keyword,\
.ace-p5 .ace_meta,\
.ace-p5 .ace_support.ace_class,\
.ace-p5 .ace_support.ace_type {\
color: #859900\
}\
.ace-p5 .ace_constant.ace_character,\
.ace-p5 .ace_constant.ace_other {\
color: #CB4B16\
}\
.ace-p5 .ace_constant.ace_language {\
color: #B58900\
}\
.ace-p5 .ace_constant.ace_numeric {\
color: #D33682\
}\
.ace-p5 .ace_fold {\
background-color: #268BD2;\
border-color: #586E75\
}\
.ace-p5 .ace_entity.ace_name.ace_function,\
.ace-p5 .ace_entity.ace_name.ace_tag,\
.ace-p5 .ace_support.ace_function,\
.ace-p5 .ace_variable,\
.ace-p5 .ace_variable.ace_language {\
color: #268BD2\
}\
.ace-p5 .ace_storage {\
color: #073642\
}\
.ace-p5 .ace_string {\
color: #2AA198\
}\
.ace-p5 .ace_string.ace_regexp {\
color: #D30102\
}\
.ace-p5 .ace_comment,\
.ace-p5 .ace_entity.ace_other.ace_attribute-name {\
color: #93A1A1\
}\
.ace-p5 .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHjy8NJ/AAjgA5fzQUmBAAAAAElFTkSuQmCC) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
                    ace.require(["ace/theme/p5"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            