﻿var ok = true, gNbc; try { if (!gNbc) { var blob = new window.Blob(['<a></a>'], { type: 'text/html' }); ok = ("object" === typeof blob); ok = ok && window.requestAnimationFrame; } } catch (err) { ok = false; }
if (!ok) { window.location.href = "sorry.lua"; }
var jsl, config; jsl = jsl || (function () {
    "use strict"; var lib, entityMap; lib = {}; lib.get = function (idOrElement) {
        if (idOrElement && 'string' === typeof idOrElement) { return document.getElementById(idOrElement); }
        return idOrElement;
    }; lib.find = function (selector, parent) {
        var result; parent = parent || document; if (parent && parent.querySelectorAll) { try { result = parent.querySelectorAll(selector); } catch (err) { lib.log(err.name, "\"", selector, "\""); result = []; } }
        return lib.toArray(result || []);
    }; lib.findFirst = function (selector, parent) {
        var result; parent = parent || document; if (parent && parent.querySelector) { try { result = parent.querySelector(selector); } catch (err) { lib.log(err.name, "\"", selector, "\""); result = null; } }
        return result || null;
    }; lib.matches = function (elem, selector) {
        var parent; if (elem && elem.ownerDocument) {
            parent = elem.parentNode; if (!parent) { parent = document.createDocumentFragment(); parent.appendChild(elem.cloneNode()); }
            return lib.find(selector, parent).some(func.eq(elem));
        }
        return false;
    }; lib.findParent = function (idOrElement, selector) {
        var elem; elem = lib.get(idOrElement); while (elem) {
            if (lib.matches(elem, selector)) { return elem; }
            elem = elem.parentNode;
        }
        return null;
    }; lib.getHead = function () {
        if (document.head) { return document.head; }
        var head = document.getElementsByTagName("head"); if (head && head.length) { return head[0]; }
    }; lib.walkDom = function (idOrElement, tag, callback) {
        var elem = lib.get(idOrElement), result = [], noFunc = null, args = [], i = 0, nodes = null; if (elem) {
            tag = tag || "*"; noFunc = typeof callback !== 'function'; args = [""]; if (!noFunc) { for (i = 3; i < arguments.length; i += 1) { args.push(arguments[i]); } }
            nodes = elem.getElementsByTagName(tag); for (i = 0; i < nodes.length; i += 1) { args[0] = nodes[i]; if (noFunc || callback.apply(null, args)) { result.push(nodes[i]); } }
        }
        return result;
    }; function splitClasses(str) { str = (str || "").trim(); return str.split(/\s+/g); }
    lib.hasClass = function (idOrElement, strClass) {
        var elem; if (strClass) { elem = lib.get(idOrElement); if (elem && elem.classList) { return elem.classList.contains(strClass); } }
        return false;
    }; lib.addClass = function (idOrElement, strClasses) { var elem; elem = lib.get(idOrElement); if (elem && elem.classList) { splitClasses(strClasses).forEach(function (c) { if (c) { elem.classList.add(c); } }); } }; lib.removeClass = function (idOrElement, strClasses) { var elem; elem = lib.get(idOrElement); if (elem && elem.classList) { splitClasses(strClasses).forEach(function (c) { if (c) { elem.classList.remove(c); } }); } }; lib.toggleClass = function (idOrElement, strClass) { var elem; if (strClass) { elem = lib.get(idOrElement); if (elem && elem.classList) { elem.classList.toggle(strClass); } } }; lib.removeClassRegExp = function (idOrElement, reClass) { var elem, i, c; if (reClass instanceof RegExp) { elem = lib.get(idOrElement); if (elem && elem.classList) { i = elem.classList.length || 0; while (i > 0) { i = i - 1; c = elem.classList[i]; if (reClass.test(c)) { elem.classList.remove(c); } } } } }; lib.clearClass = function (idOrElement) { lib.overwriteClass(idOrElement); }; lib.overwriteClass = function (idOrElement, strClasses) { var elem; elem = lib.get(idOrElement); if (elem) { elem.className = strClasses || ""; } }; lib.replaceClass = function (idOrElement, strOldClasses, strNewClasses) { lib.removeClass(idOrElement, strOldClasses); lib.addClass(idOrElement, strNewClasses); }; lib.getByClass = function (strClass, parentIdOrElement, tag) { return lib.walkDom(parentIdOrElement || document, tag || "", function (el) { return lib.hasClass(el, strClass); }); }; function cssStrToCamelCase(str) { str = (str || "").split('-'); return str.slice(1).reduce(function (prev, curr) { return prev + curr.charAt(0).toUpperCase() + curr.slice(1); }, str[0]); }
    lib.setStyle = function (idOrElement, cssName, cssValue) {
        var elem = lib.get(idOrElement); if (elem) {
            if (cssName === 'float') { cssName = 'cssFloat'; }
            elem.style[cssStrToCamelCase(cssName)] = cssValue;
        }
    }; lib.display = function (idOrElement, show) { lib.setStyle(idOrElement, "display", show ? "" : "none"); }; lib.hide = function (idOrElement) { lib.display(idOrElement, false); }; lib.show = function (idOrElement) { lib.display(idOrElement, true); }; lib.loadCss = function (cssPath, name) {
        var head = lib.getHead(), link = null; if (head && "string" === typeof cssPath) {
            link = document.createElement("link"); link.type = "text/css"; link.rel = "stylesheet"; link.href = cssPath; if (name) { link.name = name + "_css"; }
            head.appendChild(link);
        }
    }; lib.unloadCss = function (cssObjOrPath) { var head = lib.getHead(), tmp; if (cssObjOrPath && "object" === typeof cssObjOrPath) { head.removeChild(cssObjOrPath); } else if (cssObjOrPath && "string" === typeof cssObjOrPath) { lib.find("[href=" + cssObjOrPath + "]", head).forEach(function (aktCssObj) { head.removeChild(aktCssObj); }); } else { jsl.find("link[rel=stylesheet]", head).forEach(function (aktCssObj) { if (aktCssObj.name) { head.removeChild(aktCssObj); } }); } }; lib.createStyleTag = function (styles) { var head = lib.getHead(), styleTag = null; if (head && "string" === typeof styles) { styleTag = document.createElement("style"); styleTag.type = "text/css"; styleTag.innerHTML = styles; head.appendChild(styleTag); } }; lib.addEventHandler = function (idOrElement, eventName, handlerFunction) {
        var elem = lib.get(idOrElement); if (elem) { elem.addEventListener(eventName, handlerFunction, false); return true; }
        return false;
    }; lib.removeEventHandler = function (idOrElement, eventName, handlerFunction) { var elem = lib.get(idOrElement); if (elem) { elem.removeEventListener(eventName, handlerFunction, false); } }; lib.evtTarget = function (evt, expectedType) {
        var result = evt.target || evt.srcElement; if (expectedType) { while (result && result.type !== expectedType) { result = result.parentNode; } } else { if (result && result.nodeType === 3) { result = result.parentNode; } }
        return result;
    }; lib.eventTarget = function (evt, selector) {
        var result = evt.target; if (result && selector) { result = lib.findParent(result, selector); }
        return result;
    }; lib.stopBubbling = function (evt) {
        if (evt) {
            if (evt.stopPropagation) { evt.stopPropagation(); }
            evt.cancelBubble = true;
        }
    }; lib.cancelEvent = function (evt) {
        if (evt) {
            if (evt.preventDefault) { evt.preventDefault(); }
            evt.cancel = true; evt.returnValue = false;
        }
        return false;
    }; lib.stopDefaultBubbling = function (evt) { lib.stopBubbling(evt); return lib.cancelEvent(evt); }; lib.setDisabled = function (idOrElement, disable) {
        var elem = lib.get(idOrElement), p = null, labels = null, i = 0; if (elem) {
            elem.disabled = disable; p = elem.parentNode; if (p) { p = p.parentNode; }
            p = p || document; if (p) {
                labels = p.getElementsByTagName('label'); for (i = 0; i < labels.length; i += 1) {
                    if (labels[i].htmlFor === elem.id) {
                        if (disable) { lib.addClass(labels[i], "disabled"); } else { lib.removeClass(labels[i], "disabled"); }
                        break;
                    }
                }
            }
        }
    }; function toDataName(name) { name = name.replace(/^data-/, ""); name = name.replace(/([A-Z])/g, function (m) { return "-" + m.toLowerCase(); }); return "data-" + name; }
    lib.setData = function (idOrElement, jsName, value) { var elem; elem = lib.get(idOrElement); if (elem && jsName) { elem.setAttribute(toDataName(jsName), value || ""); } }; lib.getData = function (idOrElement, jsName) { var elem; elem = lib.get(idOrElement); if (elem && jsName) { return elem.getAttribute(toDataName(jsName)); } }; lib.removeData = function (idOrElement, jsName) { var elem; elem = lib.get(idOrElement); if (elem && jsName) { elem.removeAttribute(toDataName(jsName)); } }; function doDisable(idOrNode, disableNode) {
        var node; node = lib.get(idOrNode); if (!node) { return; }
        if (disableNode && (node.disabled || lib.hasClass(node, "disableNode"))) { lib.setData(node, "jslWasDisabled", "true"); } else if (lib.getData(node, "jslWasDisabled") === "true") { lib.removeData(node, "jslWasDisabled"); } else { return true; }
    }
    function disableNodeSpecials(node, disableNode) {
        if (node) {
            switch ((node.nodeName || "").toLowerCase()) {
                case "a": node.onclick = disableNode ? function (evt) { return false; } : null; break; case "button": case "input": case "select": if (doDisable(node, disableNode)) { node.disabled = disableNode; }
                    break; default: break;
            }
        }
    }
    lib.disableNode = function (idOrNode, disableNode, fogOnly) {
        var setNodeOpacity = disableNode ? lib.addClass : lib.removeClass; if (doDisable(idOrNode, disableNode)) { setNodeOpacity(idOrNode, "disableNode"); }
        if (fogOnly) { return; }
        lib.walkDom(idOrNode, "*", disableNodeSpecials, disableNode); disableNodeSpecials(lib.get(idOrNode), disableNode);
    }; lib.enableNode = function (idOrNode, disableNode, fogOnly) { lib.disableNode(idOrNode, !disableNode, fogOnly); }; lib.disable = function (idOrElement) { lib.setDisabled(idOrElement, true); }; lib.enable = function (idOrElement) { lib.setDisabled(idOrElement, false); }; lib.getEnabled = function (idOrElement) {
        var elem = lib.get(idOrElement); if (elem) { return !elem.disabled; }
        return false;
    }; lib.enableWithFocus = function (idOrElement) { var elem = lib.get(idOrElement); if (elem) { lib.enable(elem); lib.focus(elem); } }; lib.addOption = function (idOrElement, value, text) { var elem = lib.get(idOrElement); if (elem && elem.options) { elem.options[elem.length || 0] = new Option(text, value); } }; lib.getOptionTextOf = function (idOrElement, idx) {
        var elem = lib.get(idOrElement); if (elem && elem.options) { return elem.options[idx].text; }
        return null;
    }; lib.lenSelection = function (idOrElement) {
        var elem = lib.get(idOrElement); if (elem && elem.options) { return elem.length; }
        return 0;
    }; function findOptionIdx(elem, value) {
        var i = elem.options.length || 0; while (i > 0) { i = i - 1; if (elem.options[i].value === value) { return i; } }
        return -1;
    }
    lib.updateOptions = function (idOrElement, value, text) { var elem = lib.get(idOrElement), idx = null; if (elem && elem.options) { idx = findOptionIdx(elem, value); if (idx < 0) { idx = elem.options.length || 0; elem.options[idx] = new Option(text, value); } else { elem.options[idx].text = text; } } }; lib.deleteOption = function (idOrElement, value) { var elem = lib.get(idOrElement), idx = null; if (elem && elem.options) { idx = findOptionIdx(elem, value); if (idx >= 0) { elem.options[idx] = null; if (value === elem.value) { elem.selectedIndex = 0; } } } }; lib.clearSelection = function (idOrElement) { var elem = lib.get(idOrElement), disabled = null; if (elem) { disabled = elem.disabled; elem.disabled = false; elem.length = 0; elem.disabled = disabled; } }; lib.submitForm = function (name) { var frm = document.forms[name]; if (frm) { frm.submit(); } }; lib.getFormElements = function (elementName, formNameOrIdx) {
        var result = [], f = null, elems = null; if (elementName) { f = document.forms[formNameOrIdx || 0]; if (f && f.elements) { elems = f.elements[elementName]; if (elems) { result = [elems]; if (typeof elems.length === 'number') { if (!elems.options || elems[0] !== elems.options[0]) { result = elems; } } } } }
        return result;
    }; lib.getForm = function (idOrElement) {
        var elem = lib.get(idOrElement); if (elem) {
            if (elem.form) { return lib.get(elem.form); }
            return lib.findParent(elem, "form");
        }
        return null;
    }; lib.getByName = function (name, parentIdOrElement) {
        var elem = document; if (parentIdOrElement) { elem = lib.get(parentIdOrElement); }
        if (elem && typeof name === 'string') { return elem.getElementsByName(name); }
        return null;
    }; lib.getHtml = function (idOrElement) {
        var elem = lib.get(idOrElement); if (elem) { return elem.innerHTML; }
        return "";
    }; lib.setHtml = function (idOrElement, txt) { var elem = lib.get(idOrElement); if (elem) { elem.innerHTML = txt; } }; lib.changeImage = function (imageName, newSource, newTitle) {
        var image = document.images[imageName] || lib.get(imageName); if (image) {
            if (newSource !== undefined) { image.src = newSource; }
            if (newTitle !== undefined) { image.title = newTitle; }
        }
    }; lib.setText = function (idOrElement, txt) {
        var elem = lib.get(idOrElement); if (elem) {
            if (elem.hasChildNodes()) { elem.innerHTML = ""; }
            elem.appendChild(document.createTextNode(txt));
        }
    }; lib.getText = function (idOrElement) {
        var elem = lib.get(idOrElement); if (elem) {
            if (elem.textContent) { return elem.textContent; }
            return elem.innerHTML;
        }
        return "";
    }; lib.focus = function (idOrElement) { var elem = lib.get(idOrElement); if (elem && elem.focus) { elem.focus(); } }; lib.blur = function (idOrElement) { var elem = lib.get(idOrElement); if (elem && elem.blur) { elem.blur(); } }; lib.select = function (idOrElement) {
        var elem = lib.get(idOrElement); if (elem) {
            if (elem.setSelectionRange) { elem.setSelectionRange(0, (elem.value || "").length); return true; }
            if (elem.select) { elem.select(); return true; }
        }
    }; lib.getChecked = function (idOrElement) {
        var elem = lib.get(idOrElement); if (elem) { return elem.checked; }
        return false;
    }; lib.setChecked = function (idOrElement, value) { var elem = lib.get(idOrElement); if (elem) { elem.checked = (value !== false); } }; lib.getValue = function (idOrElement) {
        var elem = lib.get(idOrElement); if (elem) { return elem.value; }
        return "";
    }; lib.getSelectValue = lib.getValue; lib.getEvtValue = function (evt) { var elem = lib.evtTarget(evt); return lib.getValue(elem); }; lib.setValue = function (idOrElement, value) { var elem = lib.get(idOrElement); if (elem) { elem.value = value; } }; lib.setSelection = lib.setValue; lib.getRadioValue = function (radioName, formNameOrIdx) {
        var radios = lib.getFormElements(radioName, formNameOrIdx), i = radios.length || 0; while (i > 0) { i = i - 1; if (radios[i].checked) { return radios[i].value; } }
        return "";
    }; lib.getCssText = function (idOrElement) {
        var elem = lib.get(idOrElement); if (!elem || !elem.style) { return ""; }
        if (typeof elem.style.cssText === 'string') { return elem.style.cssText; }
        return elem.getAttribute('style');
    }; lib.setCssText = function (idOrElement, cssText) {
        var elem = lib.get(idOrElement); if (!elem || !elem.style) { return; }
        if (typeof elem.style.cssText === 'string') { elem.style.cssText = cssText; } else { elem.setAttribute('style', cssText); }
    }; lib.changeInputType = function (idOrElement, newType) { var elem = lib.get(idOrElement); if (elem && typeof newType === 'string') { elem.type = newType; } }; lib.moveElement = function (idOrElement, hookIdOrElement) { var elem = lib.get(idOrElement), hook = lib.get(hookIdOrElement); if (elem && hook && hook.parentNode) { hook.parentNode.insertBefore(elem, hook); } }; lib.findParentByTagName = function (idOrElement, tagName) {
        var elem; if (tagName && typeof tagName === 'string') { elem = lib.get(idOrElement); tagName = tagName.toLowerCase(); while (elem && elem.parentNode) { elem = elem.parentNode; if ((elem.tagName || "").toLowerCase() === tagName) { return elem; } } }
        return null;
    }; lib.setHiddenValue = function (name, value, formIdOrElement) {
        var form, inp, isNew; form = lib.get(formIdOrElement) || document.forms[0]; if (form) {
            inp = form.elements[name]; isNew = !inp; if (isNew) { inp = document.createElement("input"); inp.type = "hidden"; inp.name = name; }
            inp.value = value; if (isNew) { form.appendChild(inp); }
        }
    }; lib.removeElements = function (idsOrElements) { var i, elem; i = (idsOrElements || []).length || 0; while (i > 0) { i = i - 1; elem = lib.get(idsOrElements[i]); if (elem && elem.parentNode) { elem.parentNode.removeChild(elem); } } }; lib.scrollIntoView = function (idOrElement) { var elem; elem = lib.get(idOrElement); if (elem && elem.scrollIntoView) { elem.scrollIntoView(); } }; lib.copyToClipboardSupported = function () {
        var result; try { result = document.queryCommandSupported('copy'); } catch (err) { result = false; }
        return result;
    }; function selectElementText(elem) { var range, selection; if (!lib.select(elem)) { range = document.createRange(); range.selectNodeContents(elem); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); } }
    lib.copyToClipboard = function copyToClipboard(elem) {
        var range, selection, success; elem = lib.get(elem); if (elem) {
            lib.focus(elem); selectElementText(elem); try { success = document.execCommand('copy'); } catch (err) { success = false; }
            if (success) { window.getSelection().removeAllRanges(); lib.blur(elem); }
            return success;
        }
    }; lib.sprintf = function (formatstr) {
        var i, exp; for (i = 1; i < arguments.length; i += 1) { formatstr = formatstr || ""; exp = new RegExp("(%" + i + ")(%[a-zA-Z]+%)?", "g"); formatstr = formatstr.replace(exp, "$1"); exp = new RegExp("%" + i, "g"); formatstr = formatstr.replace(exp, arguments[i]); }
        return formatstr;
    }; lib.toArray = Function.prototype.call.bind(Array.prototype.slice); function convertKeypath(keys) {
        keys = keys.replace(/[\.\[\]\/]/g, function repl(match, idx) {
            if (idx === 0 && match === "[") { return ""; }
            if (match === "]") { return ""; }
            return "\/";
        }); return keys.split(/\//);
    }
    lib.keypath = function keypath(keys, root) {
        var i, len; if (typeof keys === 'string') { keys = convertKeypath(keys); }
        if (!Array.isArray(keys)) { return; }
        len = keys.length; for (i = 0; i < len; i += 1) { try { root = root[keys[i]]; } catch (e) { jsl.log("keypath ", e.name, " at: \"", keys.slice(0, i).join("\/"), "\""); return; } }
        return root;
    }; lib.getArrayPart = function (luaTable, doDelete) {
        var array, n; luaTable = luaTable || {}; array = []; n = 1; while (luaTable[n] !== undefined) {
            array.push(luaTable[n]); if (doDelete) { delete luaTable[n]; }
            n = n + 1;
        }
        return array;
    }; entityMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;' }; lib.htmlEscape = function (str) { return String(str).replace(/[&<>"]/g, function (s) { return entityMap[s]; }); }; lib.htmlUnEscape = function (str) {
        var i = 0; for (i in entityMap) { if (entityMap.hasOwnProperty(i)) { str = String(str).replace(new RegExp(entityMap[i], "g"), i); } }
        str = String(str).replace(new RegExp("&apos;", "g"), "'"); return str;
    }; lib.removeHtml = function (str, rep) {
        if (!rep) { rep = " "; }
        str = String(str).replace("&nbsp;", rep); return String(str).replace(/(<([^>]+)>)/ig, rep);
    }; lib.getParams = function (obj) {
        var params = "", i = 0; for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (params !== "") { params += "&"; }
                params += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
            }
        }
        return params;
    }; lib.toFixed = function (num, decimals, decimalPoint) {
        var n = Number(num); if (isNaN(n)) { return num; }
        n = n.toFixed(Number(decimals) || 0); if (decimalPoint) { n = n.replace(".", decimalPoint); }
        return n;
    }; lib.rnd = function (n, m) { return n + Math.floor(Math.random() * (m - n + 1)); }; function funcName(fn) {
        var s, idx; if (config.isDebug > 0) {
            if (typeof fn === 'function') {
                s = String(fn); idx = s.indexOf(")"); if (idx >= 0) { s = s.substr(0, idx + 1); }
                return s;
            }
            return "function ?";
        }
    }
    lib.log = function () {
        var prefix, c, args; if (config.isDebug > 0) {
            c = window.console; if (c) {
                prefix = "JSL: "; args = lib.toArray(arguments).map(function (obj) {
                    if (typeof obj === 'function') { return funcName(obj); }
                    return obj;
                }); c.log.apply(c, [prefix].concat(args));
            }
        }
    }; lib.show_table = function (display, table) {
        var i, len; if (config.isDebug > 0) {
            jsl.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv"); if (!table) { jsl.log("table " + display + " is undefined"); jsl.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"); return; }
            if (!table.length) { jsl.log(display + "=", table); jsl.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"); return; }
            jsl.log("table " + display); for (i = 0, len = table.length; i < len; i += 1) { jsl.log(display + "[" + i + "]=", table[i]); }
            jsl.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        }
    }; lib.setSeparator = function (text, separators) { var replacement; separators.forEach(function (separator) { if (typeof separator === 'string') { replacement = separator + String.fromCharCode(0x200B); separator = separator.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&"); text = text.replace(new RegExp(separator, 'g'), replacement); } }); return text; }; lib.setBusy = function (idOrElement, text) {
        if (!text) { text = ""; }
        lib.setData(idOrElement, "busy", text);
    }; lib.writeDataLabel = function (tableId, contentTableId) {
        var headRows, headTxts, colspan, columnCount, tdText, i, j, l; headTxts = []; columnCount = 0; if (!contentTableId) { contentTableId = tableId; }
        headRows = lib.getByClass("thead", tableId, "tr"); headRows.forEach(function (trHead) {
            j = 0; for (i = 0; i < trHead.childElementCount; i = i + 1) {
                l = j + 1; colspan = trHead.children[i].getAttribute('colspan'); if (colspan) { l = j + parseInt(colspan, 10); }
                for (j; j < l; j = j + 1) {
                    if (!headTxts[j]) { headTxts[j] = ""; }
                    headTxts[j] = headTxts[j] + " " + lib.removeHtml(lib.getHtml(trHead.children[i]));
                }
            }
        }); columnCount = headTxts.length; lib.walkDom(contentTableId, "tr", function (tr) { if (columnCount === tr.childElementCount) { for (i = 0; i < columnCount; i = i + 1) { tdText = lib.getText(tr.children[i]); if (tdText !== "" && tdText !== "&nbsp;") { tr.children[i].setAttribute('datalabel', headTxts[i]); } else { tr.children[i].setAttribute('datalabel', ""); } } } else { for (j = 0; j < tr.childElementCount; j = j + 1) { tr.children[j].setAttribute('datalabel', ''); } } });
    }; lib.catchPulldownRefresh = function () { var startPosY; if (document.body && "number" === typeof document.body.scrollTop) { lib.addEventHandler(document.body, "touchstart", function (evt) { if (0 === document.body.scrollTop && evt && evt.targetTouches && evt.targetTouches[0] && evt.targetTouches[0].screenX && evt.targetTouches[0].screenY) { startPosY = evt.targetTouches[0].screenY; } }); lib.addEventHandler(document.body, "touchend", function () { startPosY = null; }); lib.addEventHandler(document.body, "touchmove", function (evt) { if ("number" === typeof startPosY && evt && evt.targetTouches && evt.targetTouches[0] && evt.targetTouches[0].screenY && evt.targetTouches[0].screenY > startPosY) { return lib.stopDefaultBubbling(evt); } }); } }; return lib;
}());
var md5; md5 = md5 || (function () {
    "use strict"; var lib = {}, hexcase = 0, chrsz = 16; function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", str = "", i = 0; for (i = 0; i < binarray.length * 4; i += 1) { str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF); }
        return str;
    }
    function str2binl(str) {
        var bin = [], i = 0, mask = (1 << chrsz) - 1; for (i = 0; i < str.length * chrsz; i += chrsz) { bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32); }
        return bin;
    }
    function safe_add(x, y) { var lsw = (x & 0xFFFF) + (y & 0xFFFF), msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xFFFF); }
    function bit_rol(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
    function md5_cmn(q, a, b, x, s, t) { return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b); }
    function md5_ff(a, b, c, d, x, s, t) { return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function md5_gg(a, b, c, d, x, s, t) { return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function md5_hh(a, b, c, d, x, s, t) { return md5_cmn(b ^ c ^ d, a, b, x, s, t); }
    function md5_ii(a, b, c, d, x, s, t) { return md5_cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function core_md5(x, len) {
        x[len >> 5] |= 0x80 << ((len) % 32); x[(((len + 64) >>> 9) << 4) + 14] = len; var i = 0, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, olda = 0, oldb = 0, oldc = 0, oldd = 0; for (i = 0; i < x.length; i += 16) { olda = a; oldb = b; oldc = c; oldd = d; a = md5_ff(a, b, c, d, x[i], 7, -680876936); d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586); c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819); b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330); a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897); d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426); c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341); b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983); a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416); d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417); c = md5_ff(c, d, a, b, x[i + 10], 17, -42063); b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162); a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682); d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101); c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290); b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329); a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510); d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632); c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713); b = md5_gg(b, c, d, a, x[i], 20, -373897302); a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691); d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083); c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335); b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848); a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438); d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690); c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961); b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501); a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467); d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784); c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473); b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734); a = md5_hh(a, b, c, d, x[i + 5], 4, -378558); d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463); c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562); b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556); a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060); d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353); c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632); b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640); a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174); d = md5_hh(d, a, b, c, x[i], 11, -358537222); c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979); b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189); a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487); d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835); c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520); b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651); a = md5_ii(a, b, c, d, x[i], 6, -198630844); d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415); c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905); b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055); a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571); d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606); c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523); b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799); a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359); d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744); c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380); b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649); a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070); d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379); c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259); b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551); a = safe_add(a, olda); b = safe_add(b, oldb); c = safe_add(c, oldc); d = safe_add(d, oldd); }
        return [a, b, c, d];
    }
    lib.hex = function (s) { return binl2hex(core_md5(str2binl(s), s.length * chrsz)); }; return lib;
}());
var jsl, html; html = html || (function () {
    "use strict"; var lib = {}; lib.hr = function (data) {
        var hr = document.createElement("hr"); if (data.parent) { data.parent.appendChild(hr); }
        return hr;
    }; lib.br = function (data) {
        var br = document.createElement("br"); if (data.parent) { data.parent.appendChild(br); }
        return br;
    }; lib.label = function (data) { var label = document.createElement("label"); label.setAttribute("for", data.forId || ""); jsl.setText(label, data.txt || ""); if (data.parent) { data.parent.appendChild(label); } }; lib.p = function (data) {
        var p = document.createElement("p"); p.id = data.id || ""; p.setAttribute("name", data.name || ""); p.setAttribute("class", data["class"] || ""); if (data.txt) { jsl.setText(p, data.txt || ""); }
        if (data.parent) { data.parent.appendChild(p); }
        return p;
    }; lib.span = function (data) {
        var span = document.createElement("span"); span.id = data.id || ""; span.setAttribute("name", data.name || ""); span.setAttribute("class", data["class"] || ""); jsl.setText(span, data.txt || ""); if (data.parent) { data.parent.appendChild(span); }
        return span;
    }; lib.header = function (data) {
        var header = document.createElement("header"); header.id = data.id || ""; header.setAttribute("name", data.name || ""); header.setAttribute("class", data["class"] || ""); if (data.parent) { data.parent.appendChild(header); }
        return header;
    }; lib.div = function (data) {
        var div = document.createElement("div"); div.id = data.id || ""; div.setAttribute("name", data.name || ""); div.setAttribute("class", data["class"] || ""); jsl.setText(div, data.txt || ""); if (data.parent) { data.parent.appendChild(div); }
        return div;
    }; lib.a = function (data) {
        var a = document.createElement("a"); a.id = data.id || ""; a.setAttribute("name", data.name || ""); a.setAttribute("class", data["class"] || ""); a.setAttribute("target", data.target || ""); a.href = data.href || ""; jsl.setText(a, data.txt || ""); if ("string" === typeof data.evt && "function" === typeof data.evtFunc) { a.addEventListener(data.evt, data.evtFunc, false); }
        if (data.parent) { data.parent.appendChild(a); }
        return a;
    }; lib.hl = function (data) {
        var hl = document.createElement("h" + (data.level || "1")); hl.id = data.id || ""; hl.setAttribute("name", data.name || ""); hl.setAttribute("class", data["class"] || ""); jsl.setText(hl, data.txt || ""); if (data.parent) { data.parent.appendChild(hl); }
        return hl;
    }; lib.input = function (data) {
        var input = document.createElement("input"); input.type = data.type || "text"; input.id = data.id || ""; input.setAttribute("name", data.name || ""); input.value = data.value || ""; if ("string" === typeof data.evt && "function" === typeof data.evtFunc) { input.addEventListener(data.evt, data.evtFunc, false); }
        input.checked = data.checked || false; if (data.parent) { data.parent.appendChild(input); }
        return input;
    }; lib.button = function (data) {
        var button = document.createElement("button"); button.type = data.type || "button"; button.id = data.id || ""; button.setAttribute("name", data.name || ""); button.setAttribute("class", data["class"] || ""); button.setAttribute("tabindex", data.tabindex || ""); jsl.setText(button, data.txt || ""); if ("string" === typeof data.evt && "function" === typeof data.evtFunc) { button.addEventListener(data.evt, data.evtFunc, false); }
        if (data.parent) { data.parent.appendChild(button); }
        return button;
    }; lib.form = function (data) {
        var form = document.createElement("form"); form.id = data.id || ""; form.setAttribute("name", data.name || ""); form.setAttribute("class", data["class"] || ""); form.setAttribute("method", data.method || "post"); form.setAttribute("action", data.action || ""); if (data.parent) { data.parent.appendChild(form); }
        return form;
    }; function selectOption(data) {
        var option = document.createElement("option"); option.value = data.value || ""; jsl.setText(option, data.txt || ""); option.selected = data.selected || ""; if (data.parent) { data.parent.appendChild(option); }
        return option;
    }
    lib.select = function (data) {
        var select = null; select = document.createElement("select"); select.id = data.id || ""; select.setAttribute("name", data.name || ""); select.setAttribute("class", data.style || ""); if (data.firstOption) { data.firstOption.parent = select; selectOption(data.firstOption); }
        Object.keys(data.options).forEach(function (idx) { selectOption({ parent: select, value: data.options[idx].value || "", txt: data.options[idx].txt || "", selected: (data.selectCompareValue === data.options[idx][data.optAttrToCompare]) || false }); }); if (data.parent) { data.parent.appendChild(select); }
        return select;
    }; lib.inputLabel = function (data) {
        var div; if (data.parent) { div = lib.div({ "class": "ilBox", parent: data.parent }); data.parent.appendChild(div); }
        if (div) { lib.input({ parent: div, type: "checkbox", id: data.id || "", name: data.name || "", evt: data.evt || null, evtFunc: data.evtFunc || null, checked: data.checked || false }); lib.label({ parent: div, forId: data.id || "", txt: data.txt || "" }); if ("string" === typeof data.explain && 0 < data.explain.length) { lib.div({ parent: div, "class": "explain formular", txt: data.explain }); } }
        return div;
    }; lib.blueBarHead = function (data) { var header = null, div = null; header = lib.header({ id: "blueBarBox", parent: data.parent || document.body }); lib.div({ "class": "logoBox", parent: header }); div = lib.div({ "class": "blue_bar_title", id: "blueBarTitel", parent: header }); jsl.setText(div, data.title || ""); lib.div({ "class": "logoBox fake", parent: header }); }; lib.dialog = function (data) { var dialog = null, divHead = null, divContent = null, divInner = null; dialog = lib.div({ id: data.id || "", "class": "dialog_outer", parent: data.parent || document.body }); divInner = lib.div({ id: "dialogInner", "class": "dialog_inner", parent: dialog }); divHead = lib.div({ id: "dialogHeadBox", "class": "dialog_head_box", parent: divInner }); lib.hl({ id: "dialogTitle", level: "2", txt: data.pageTitle || "", parent: divHead }); divContent = lib.div({ id: "dialogContent", "class": "dialog_content", parent: divInner }); return { dialog: dialog, head: divHead, content: divContent }; }; return lib;
}());
var func; func = func || (function () {
    "use strict"; var lib, slice; lib = {}; slice = Function.prototype.call.bind(Array.prototype.slice); lib.noop = function () { return; }; lib.id = function (x) { return x; }; lib.const = function (x) { return function () { return x; }; }; lib.eq = function (x, key) {
        if (key === undefined) { return function (val) { return val === x; }; }
        return function (obj) { return Boolean(obj && obj[key] === x); };
    }; lib.neq = function (x, key) { var eq; eq = lib.eq(x, key); return function (v) { return !eq(v); }; }; lib.lt = function (key) {
        if (key === undefined) { return function (val1, val2) { return val1 < val2; }; }
        return function (obj1, obj2) { return Boolean(obj1 && obj2 && obj1[key] < obj2[key]); };
    }; lib.match = function (regex, key) {
        if (key === undefined) { return function (val) { return (typeof val === 'string' && val.match(regex) !== null); }; }
        return function (obj) { var s; s = obj && obj[key]; return (typeof s === 'string' && s.match(regex) !== null); };
    }; lib.get = function (key, defaultValue) {
        return function (obj) {
            var result; if (obj && typeof obj === 'object') { result = obj[key]; }
            if (result === undefined) { return defaultValue; }
            return result;
        };
    }; lib.restrict = function (n, fn) { n = Math.max(n, 0); return function restricted() { return fn.apply(null, slice(arguments, 0, n)); }; }; lib.partial = function (fn) { var fixedArgs; fixedArgs = slice(arguments, 1); return function () { return fn.apply(null, fixedArgs.concat(slice(arguments))); }; }; lib.rpartial = function (fn) { var fixedArgs; fixedArgs = slice(arguments, 1); return function () { return fn.apply(null, slice(arguments).concat(fixedArgs)); }; }; lib.curry = function curry(n, fn) {
        if (n === 0) { return fn(); }
        return function (arg) { return curry(n - 1, function () { return fn.apply(null, [arg].concat(slice(arguments))); }); };
    }; lib.once = function (fn) { return function () { var result; if (fn) { result = fn.apply(null, slice(arguments)); fn = null; return result; } }; }; lib.memoize = function (fn) {
        var cache; cache = {}; return function memoized() {
            var params; params = JSON.stringify(arguments); if (!cache.hasOwnProperty(params)) { cache[params] = fn.apply(null, slice(arguments)); }
            return cache[params];
        };
    }; return lib;
}());
var jsl, fc; fc = fc || (function () {
    "use strict"; var lib = {}, fields = {}, last_event_char = -1, last_event_elem = null, last_event_content = "", last_coursor_startpos = -1, last_coursor_endpos = -1, keep_pressed_cnt = 0; function setValue(elem, val) {
        var elemId = elem; if ("string" !== typeof elemId) { elemId = elem.id || ""; }
        if ("mac" === fields[elemId].fcType) { val = (val || "").toUpperCase(); }
        jsl.setValue(elem, val || "");
    }
    function check_lenght(content, level, lessthan) { var l = content.length; return (l !== null && ((l >= level && !lessthan) || (l <= level && lessthan))); }
    function ignore_char(cc, evt) {
        if (evt && evt.shiftKey) { return (cc === 8 || cc === 9 || (cc >= 13 && cc <= 57) || cc >= 91); }
        return (cc === 8 || cc === 9 || (cc >= 13 && cc <= 46) || cc === 91 || cc === 92 || cc === 93 || cc >= 106);
    }
    function check_back_char(cc) { return (cc === 8 || cc === 37); }
    function check_foreward_char(cc, evt) { return (cc === 39 || (evt && ("ip" === fields[jsl.evtTarget(evt).id].fcType) && !evt.shiftKey && 190 === cc)); }
    function gotoNextID(evt, akt_id, content, event_char, event_char_code, backward) {
        var next = null; setValue(akt_id, content.substring(0, fields[akt_id].max_char)); if (evt && "ip" === fields[jsl.evtTarget(evt).id].fcType && !evt.shiftKey && 190 === event_char_code) { setValue(akt_id, content.replace(".", "")); }
        next = (backward) ? fields[akt_id].prev : fields[akt_id].next; if (!next && !backward && fields[akt_id].jumpTo) { jsl.focus(fields[akt_id].jumpTo); }
        if (next === null) { return; }
        jsl.focus(next); if (!backward && !check_foreward_char(event_char_code, evt)) { jsl.select(next); if (content === last_event_content && keep_pressed_cnt < 2) { setValue(next, event_char); } }
        jsl.focus(next);
    }
    function del_event_char() { last_event_char = -1; }
    function set_event_char(event) {
        var cc = null; event = (event === null) ? window.event : event; cc = event.keyCode; if (ignore_char(cc, event) && !check_back_char(cc) && !check_foreward_char(cc, event)) { return; }
        if (last_event_char === cc) { keep_pressed_cnt += 1; }
        last_event_elem = jsl.evtTarget(event); last_event_content = jsl.getValue(last_event_elem); if (typeof (last_event_elem.selectionStart) === "number") { last_coursor_startpos = last_event_elem.selectionStart; }
        if (typeof (last_event_elem.selectionEnd) === "number") { last_coursor_endpos = last_event_elem.selectionEnd; }
        last_event_char = cc;
    }
    function get_char_from_charcode(cc) {
        if (cc >= 96 && cc <= 105) { cc = cc - 48; }
        return String.fromCharCode(cc);
    }
    function jump(event) {
        var cc, c, elem, content, forward_char_jump, allowed_char_jump, ip_period_jump; event = (event === null) ? window.event : event; cc = event.keyCode; c = get_char_from_charcode(cc); if (!event.shiftKey) { c = c.toLowerCase(); }
        if (last_event_char !== cc) { return; }
        elem = jsl.evtTarget(event); if (elem.selectionStart === "undefined" || elem.selectionEnd === "undefined") { return; }
        content = jsl.getValue(elem); if (!ignore_char(cc, event)) { setValue(elem, content); }
        forward_char_jump = (check_foreward_char(cc, event) && elem.selectionStart === elem.selectionEnd && last_coursor_startpos === last_coursor_endpos && last_coursor_endpos === content.length); allowed_char_jump = (!check_foreward_char(cc, event) && check_lenght(content, fields[elem.id].max_char, false) && elem.selectionStart === elem.selectionEnd && last_coursor_startpos === last_coursor_endpos && elem.selectionStart === fields[elem.id].max_char); if (event && "ip" === fields[jsl.evtTarget(event).id].fcType && !event.shiftKey && 190 === cc) {
            if (0 < (content.length - 1)) { ip_period_jump = true; } else { content = content.replace(".", ""); setValue(elem, content); ip_period_jump = false; }
            allowed_char_jump = false; forward_char_jump = false;
        }
        if ((!ignore_char(cc, event) || check_foreward_char(cc, event)) && (ip_period_jump || forward_char_jump || allowed_char_jump)) { gotoNextID(event, elem.id, content, c, cc); } else if (check_back_char(cc) && elem.selectionStart === elem.selectionEnd && last_coursor_startpos === last_coursor_endpos && last_coursor_endpos === 0) { gotoNextID(event, elem.id, content, c, cc, true); }
        keep_pressed_cnt = 0;
    }
    function create_event_handler(elem, max_char, fcType, jumpTo) {
        var nodes, i, len; nodes = jsl.walkDom(elem, "input"); for (i = 0, len = nodes.length; i < len; i += 1) {
            fields[nodes[i].id] = {}; if (nodes[i - 1]) { fields[nodes[i].id].prev = nodes[i - 1].id; } else { fields[nodes[i].id].prev = null; }
            if (nodes[i + 1]) { fields[nodes[i].id].next = nodes[i + 1].id; } else { fields[nodes[i].id].next = null; }
            fields[nodes[i].id].fcType = fcType; if (nodes[i].maxLength && nodes[i].maxLength > 0) { max_char = nodes[i].maxLength; }
            fields[nodes[i].id].max_char = max_char; jsl.addEventHandler(nodes[i], "keyup", jump); jsl.addEventHandler(nodes[i], "keydown", set_event_char); jsl.addEventHandler(nodes[i], "blur", del_event_char);
        }
        if (nodes.length && jumpTo) { fields[nodes[nodes.length - 1].id].jumpTo = jsl.get(jumpTo); }
    }
    lib.init = function (id, max_char, fcType, jumpTo) { var elem = jsl.get(id); if (elem && max_char && max_char > 0) { create_event_handler(elem, max_char, fcType || "", jumpTo); } }; return lib;
}());
var html2, func, jsl, main, newval, fc; html2 = html2 || (function () {
    "use strict"; var lib; lib = {}; function createId(name, value) {
        var id; if (name) { id = "ui" + name.charAt(0).toUpperCase() + name.slice(1); if (value) { id = id + ":" + value; } }
        return id;
    }
    function copyDataObj(obj) {
        var result, name, value; obj = obj || {}; result = {}; for (name in obj) { if (obj.hasOwnProperty(name)) { value = obj[name]; if (typeof value === 'object') { result[name] = copyDataObj(value); } else { result[name] = value; } } }
        return result;
    }
    function mergeClasses() {
        var i, tmp; tmp = document.createElement("span"); i = arguments.length; while (i > 0) { i -= 1; jsl.addClass(tmp, arguments[i] || ""); }
        return tmp.className;
    }
    function isElem(el) { return el instanceof window.HTMLElement; }
    function isNode(el) { return el instanceof window.Node; }
    function canHaveChildren(el) {
        if (!isNode(el)) { return false; }
        switch (el.nodeType) { case window.Node.ELEMENT_NODE: return true; case window.Node.DOCUMENT_NODE: return true; case window.Node.DOCUMENT_FRAGMENT_NODE: return true; default: return false; }
    }
    function checkAndSetEventHandler(el, name, value) {
        var evt; if (typeof value === 'function') { evt = name.match(/^on(\w+)$/); if (evt && evt.length === 2) { el.addEventListener(evt[1], value, false); return true; } }
        return false;
    }
    function createAttributes(el, attributes) {
        var name, value; attributes = attributes || {}; for (name in attributes) {
            if (attributes.hasOwnProperty(name)) {
                value = attributes[name]; name = name.toLowerCase(); if (!checkAndSetEventHandler(el, name, value)) {
                    if (value === true) { value = ""; }
                    if (value === null || value === false) { el.removeAttribute(name); } else if (value !== undefined) { el.setAttribute(name, value); }
                }
            }
        }
    }
    function addChildren(el, start, args) {
        var child, i, len; if (!canHaveChildren(el)) { return; }
        len = args.length; for (i = start; i < len; i += 1) { child = args[i]; if (typeof child === 'string' && child) { el.appendChild(document.createTextNode(child)); } else if (isNode(child)) { el.appendChild(child); } }
        el.normalize();
    }
    function defaultCheckboxValues(value) {
        if (value === "1" || value === "0") { return ["1", "0"]; }
        if (value === "yes" || value === "no") { return ["yes", "no"]; }
        return ["on", "off"];
    }
    function extractReplacementIdx(match) { match = match.replace(/^%/, ""); match = match.replace(/^\//, "-"); return parseInt(match, 10) || 0; }
    function checkReplacement(repl, match) {
        if (typeof repl === 'string') { return repl; }
        if (isNode(repl)) { return repl; }
        return match;
    }
    function getPidInfo(pid) {
        var m, p, str, result; result = {}; str = []; p = main.pages[pid]; if (!p) { return result; }
        result.show = p.show; m = main.menu[pid] || {}; if (typeof m.pos !== 'number' || m.pos < 0) { return result; }
        while (m && m.txt) { str.push(m.txt); m = main.menu[m.par] || {}; }
        result.txt = str.reverse().join(" > "); return result;
    }
    function buildInternHref(pid, params) {
        var name, value, href; href = []; href.push("/index.lua?sid=" + main.sid); href.push("lp=" + pid); params = params || {}; for (name in params) {
            if (params.hasOwnProperty(name)) {
                value = params[name]; if (!value && value !== 0) { value = ""; }
                href.push(name + "=" + value);
            }
        }
        return href.join("&");
    }
    function buildExternHref(url) {
        var href; if (/^\/secure_link\.lua/.test(url)) { return url; }
        href = []; href.push("/secure_link.lua?sid=" + main.sid); href.push("lnk=" + url); return href.join("&");
    }
    function createNavHandler(pid, params) {
        return function (evt) {
            if (!evt.defaultPrevented) { main.changePage(null, pid, false, params); }
            return jsl.cancelEvent(evt);
        };
    }
    function createActionHandler(callback) { callback = callback || func.noop; return function (evt) { callback(evt); return jsl.cancelEvent(evt); }; }
    function createToggleCallback(toggleClass, destination) { return function (evt) { var a; a = jsl.eventTarget(evt, "a"); jsl.toggleClass(a, toggleClass); if (destination) { if (jsl.hasClass(a, toggleClass)) { jsl.find(destination).forEach(function (el) { jsl.removeClass(el, "hide"); }); } else { jsl.find(destination).forEach(function (el) { jsl.addClass(el, "hide"); }); } } }; }
    function submitText(name) { switch (name) { case 'apply': return "Übernehmen"; case "cancel": return "Abbrechen"; default: return " "; } }
    function createDownloadSubmitter(form) {
        return function (evt) {
            if (!evt.defaultPrevented) { form.submit(); }
            return jsl.cancelEvent(evt);
        };
    }
    lib.elem = function (tag, attributes) {
        var el; if (!tag || typeof tag !== 'string') { return null; }
        el = document.createElement(tag.toLowerCase()); if (attributes) { createAttributes(el, attributes); }
        if (arguments.length > 2) { addChildren(el, 2, arguments); }
        return el;
    }; lib.fragment = function () {
        var el; el = document.createDocumentFragment(); if (arguments.length > 0) { addChildren(el, 0, arguments); }
        return el;
    }; lib.add = function (el) { if (arguments.length > 1) { addChildren(el, 1, arguments); } }; lib.addTo = function (el) { return lib.add.bind(null, el); }; lib.attr = function (el, attributes) { if (isElem(el)) { createAttributes(el, attributes); } };["a", "audio", "br", "button", "dd", "div", "dl", "dt", "form", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "input", "img", "label", "li", "ol", "option", "optgroup", "p", "script", "select", "span", "strong", "style", "table", "tbody", "td", "th", "thead", "tr", "ul", "video"].forEach(function (tag) { lib[tag] = lib.elem.bind(null, tag); }); lib.printf = function (str) {
        var rex, splitted, matches, index, result, len, i, idx, end, item, subItem; str = str || ""; rex = /%\/?[1-9][0-9]*%[a-zA-Z]\w*%|%\/?[1-9][0-9]*/g; splitted = str.split(rex); matches = str.match(rex) || []; index = matches.map(extractReplacementIdx); result = lib.fragment(splitted[0]); len = index.length; i = 0; while (i < len) {
            idx = index[i]; item = checkReplacement(arguments[idx], matches[i]); lib.add(result, item); if (isNode(item)) { end = index.indexOf(-idx); while (i < end) { i += 1; lib.add(item, splitted[i]); idx = index[i]; if (i !== end) { subItem = checkReplacement(arguments[idx], matches[i]); lib.add(item, subItem); } } }
            i += 1; lib.add(result, splitted[i]);
        }
        return result;
    }; lib.nbsp = function () { return lib.fragment(String.fromCharCode(0x00A0)); }; lib.ellipsis = function (str) { return lib.span({ class: "cut_overflow", title: str }, str); }; lib.downupSpeed = function (down, up) {
        var nbsp, str; str = []; if (down) { str.push(String.fromCharCode(0x2193)); str.push(String(down.speed)); if (down.unit) { str.push(down.unit); } }
        if (up) { str.push(String.fromCharCode(0x2191)); str.push(String(up.speed)); if (up.unit) { str.push(up.unit); } }
        nbsp = String.fromCharCode(0x00A0); return lib.fragment(str.join(nbsp));
    }; lib.hiddenInput = function (data) {
        var attr; if (!data.name || data.value === undefined) { return; }
        attr = copyDataObj(data.attr); attr.type = "hidden"; attr.name = data.name; attr.value = data.value; return lib.input(attr);
    }; lib.fakeTextInput = function (data) {
        var attr = {}; if (data.text === undefined) { return; }
        attr = copyDataObj(data.attr); attr.class = mergeClasses("fakeTextInput", data.class, attr.class); return lib.span(attr, data.text || "");
    }; lib.textInput = function (data) {
        var attr, input, label, prefix, suffix, explain; if (!data.name || data.value === undefined) { return; }
        attr = copyDataObj(data.attr); attr.type = "text"; attr.name = data.name; attr.value = data.value; attr.id = attr.id || data.id; if (data.label) { attr.id = attr.id || createId(data.name); label = lib.label({ for: attr.id }, data.label); }
        if (data.prefix) { prefix = lib.span({ class: "prefix" }, data.prefix); }
        if (data.suffix) { suffix = lib.span({ class: "postfix" }, data.suffix); }
        if (data.explain) { explain = lib.p({ class: "form_input_explain" }, data.explain); }
        input = lib.input(attr); return lib.fragment(label, prefix, input, suffix, explain);
    }; lib.checkbox = function (data) {
        var attr, checkbox, explain, label, values; if (!data.name) { return; }
        attr = copyDataObj(data.attr); attr.name = data.name; attr.type = "checkbox"; values = data.values || defaultCheckboxValues(data.value); if (typeof data.checked === 'boolean') { attr.checked = data.checked; } else if (data.value !== undefined) { attr.checked = data.value === values[0]; }
        attr.value = values.join(";"); if (data.label) { attr.id = data.id || attr.id || createId(data.name); label = lib.label({ for: attr.id }, data.label); }
        if (data.explain) { explain = lib.p({ class: "form_checkbox_explain" }, data.explain); }
        checkbox = lib.input(attr); return lib.fragment(checkbox, label, explain);
    }; lib.radio = function (data) {
        var attr, radio, explain, label; if (!data.name || !data.value) { return; }
        attr = copyDataObj(data.attr); attr.name = data.name; attr.value = data.value; attr.type = "radio"; attr.checked = data.checked || false; if (data.label) { attr.id = data.id || attr.id || createId(data.name, data.value); label = lib.label({ for: attr.id }, data.label); }
        if (data.explain) { explain = lib.p({ class: "form_checkbox_explain" }, data.explain); }
        if (data.explain) { explain = lib.p({ class: "form_checkbox_explain" }, data.explain); }
        radio = lib.input(attr); return lib.fragment(radio, label, explain);
    }; lib.selectBox = function (data) {
        var attr, select, label, options; attr = copyDataObj(data.attr); attr.id = data.id; if (data.label) { attr.id = attr.id || createId(data.name); label = lib.label({ for: attr.id }, data.label); }
        attr.name = data.name; select = lib.select(attr); options = data.options || []; options.forEach(function (item) { lib.add(select, lib.option({ value: item.value, selected: item.value === data.selected, class: item.class }, item.text)); }); if (label) { return lib.fragment(label, select); }
        return select;
    }; lib.radios = function (data) { var div; div = lib.div({ class: "formular" }); data.options.forEach(function (item) { lib.add(div, lib.radio({ value: item.value, name: data.name, checked: item.value === data.selected, label: item.text, explain: item.explain, attr: data.attr }), lib.br()); }); return div; }; lib.checkboxes = function (data) {
        var div, selected; selected = data.selected || []; if (typeof selected === 'string') { selected = selected.split(/\s*,\s*/); }
        div = lib.div({ class: "formular" }); data.options.forEach(function (item) {
            var checked; if (item.hasOwnProperty("checked")) { checked = item.checked; } else { checked = selected.indexOf(item.value) >= 0; }
            lib.add(div, lib.checkbox({ value: item.value, values: item.values, name: item.name, checked: checked, label: item.text, explain: item.explain }), lib.br());
        }); return div;
    }; lib.ipv6Input = function (data) {
        var attr, input, i, len, group, label, value, enumerator; if (!data.name) { return; }
        value = (data.value).split(":"); attr = {}; attr.id = data.id; if (data.label) { attr.id = attr.id || createId(data.name); label = lib.label({ for: attr.id + "0" }, data.label); }
        group = lib.div({ id: data.id + "_ipBox", class: "noBreakGroup" }); enumerator = 1; lib.add(group, lib.label({}, " : "), lib.label({}, " : ")); for (i = 0, len = value.length; i < len; i += 1) { if (value[i] !== "") { value[i] = value[i].trim(); input = lib.input({ type: "text", name: data.name + enumerator, autocomplete: "off", id: attr.id && (attr.id + enumerator), value: value[i] || "", maxlength: "4", size: "4" }); lib.attr(input, data.attr); lib.add(group, input); enumerator += 1; if (i < len - 1) { lib.add(group, lib.label({}, " : ")); } } }
        fc.init(group, 4); return lib.div(attr, label, group);
    }
    lib.ipInput = function (data) {
        var attr, i, group, label, value; if (!data.name) { return; }
        value = (data.value || "").split("."); attr = {}; attr.class = "formular"; attr.id = data.id; if (data.label) { attr.id = attr.id || createId(data.name); label = lib.label({ for: attr.id + "0" }, data.label); }
        group = lib.div({ class: "noBreakGroup" }); for (i = 0; i < 4; i += 1) { lib.add(group, lib.input({ type: "text", name: data.name + i, autocomplete: "off", id: attr.id && (attr.id + i), value: value[i] || "", maxlength: "3", size: "3" })); if (i < 3) { lib.add(group, lib.label({}, " . ")); } }
        return lib.div(attr, label, group);
    }; lib.macInput = function (data) {
        var attr, i, group, label, value; if (!data.name) { return; }
        value = (data.value || "").split(":"); attr = {}; attr.class = "formular"; attr.id = data.id; if (data.label) { attr.id = attr.id || createId(data.name); label = lib.label({ for: attr.id + "0" }, data.label); }
        group = lib.div({ class: "noBreakGroup" }); for (i = 0; i < 6; i += 1) { lib.add(group, lib.input({ type: "text", name: data.name + i, id: attr.id && (attr.id + i), value: value[i] || "", maxlength: "2", size: "2" })); if (i < 5) { lib.add(group, lib.label({}, " : ")); } }
        return lib.div(attr, label, group);
    }; lib.actionLink = function (data) { var a; a = lib.a(data.attr, data.content); lib.attr(a, { href: " ", onclick: createActionHandler(data.callback) }); return a; }; lib.internLink = function (data) {
        var a, pid, page, content, noLink; pid = data.pid || "overview"; content = data.content; page = getPidInfo(pid); noLink = data.noLink || !page.show; if (!content) { content = page.txt; }
        if (noLink) { return lib.fragment(content); }
        a = lib.a(data.attr, content); lib.attr(a, { href: buildInternHref(pid, data.params), onclick: createNavHandler(pid, data.params) }); return a;
    }; lib.externLink = function (data) {
        var a; if (!data.url) { return; }
        a = lib.a(data.attr, data.content); lib.attr(a, { href: buildExternHref(data.url) }); return a;
    }; lib.link = function (data) {
        if (data.pid) { return lib.internLink(data); }
        if (data.url) { return lib.externLink(data); }
        if (data.callback) { return lib.actionLink(data); }
        return lib.a(data.attr, data.content);
    }; lib.toggleLink = function (data) {
        var content, toggleClass, linkClass; toggleClass = data.toggleClass || "open"; linkClass = data.linkClass || "toggleLink"; if (data.initial) { linkClass = mergeClasses(linkClass, toggleClass); }
        content = data.closedText; if (data.openText) { content = lib.fragment(lib.span({ class: "open" }, data.closedText), lib.span({}, data.openText || data.closedText)); }
        return lib.actionLink({ content: content, callback: createToggleCallback(toggleClass, data.destination), attr: { class: linkClass } });
    }; lib.downloadBtn = function (data) {
        var result, params, name; name = data.name || "download"; result = lib.form({ method: "POST", name: name + "form", action: "/cgi-bin/luacgi_notimeout?script=" + data.script }); lib.add(result, lib.hiddenInput({ name: "sid", value: main.sid })); params = data.params || {}; Object.keys(params).forEach(function (name) { lib.add(result, lib.hiddenInput({ name: name, value: params[name] })); }); if (data.asLink) { lib.add(result, lib.actionLink({ content: data.content, callback: createDownloadSubmitter(result) })); lib.add(result, lib.hiddenInput({ name: name, value: "" })); } else { lib.add(result, lib.button({ type: "submit", name: name }, data.content)); }
        return result;
    }; lib.blockTitle = function (txt, className) { return lib.h4({ class: className || "" }, txt); }; lib.sortSpan = function (className, id) { return lib.span({ id: id || null, class: className || "sort_no" }, lib.nbsp()); }; lib.hint = function (data) {
        var div, content, attr; attr = copyDataObj(data.attr); attr.class = mergeClasses("hint", attr.class); div = lib.div(attr); if (data.head) { lib.add(div, lib.h4({}, data.head)); }
        content = data.content; if (typeof content === 'string') { content = lib.p({}, content); }
        lib.add(div, content); return div;
    }; lib.printViewButtons = function (parent) { var btn1 = lib.button({ id: "uiDoPrintBtn", type: "button", class: "print", onClick: function () { window.print(); } }, "Diese Seite drucken"), btn2 = lib.button({ id: "uiClosePrintView", type: "button", class: "print", onClick: main.closePrintView }, "Druckansicht schließen"); if (!parent) { return html2.fragment(btn1, btn2); } else { lib.add(parent, btn1); lib.add(parent, btn2); } }; function createTabclickHandler(tabs, item, callback) {
        return function (evt) {
            var i, n; if (!item.disabled) {
                n = tabs.children.length; for (i = 0; i < n; i = i + 1) { jsl.removeClass(tabs.children[i], "active"); }
                jsl.addClass(jsl.evtTarget(evt), "active"); if ("function" === typeof callback) { callback(evt, item.value); }
            }
            evt.preventDefault(); return jsl.cancelEvent(evt);
        };
    }
    lib.onPageTabs = function (data) {
        var tabBox, tabs, tabclass, attr = copyDataObj(data.attr); attr.id = data.id || ""; attr.class = "tabs onPageTabs" + (data.class ? " " + data.class : ""); tabs = lib.ul(attr); data.tabs.forEach(function (item) {
            tabclass = ""; if (item.value === data.active) { tabclass = "active"; } else if (item.disabled) { tabclass = "disabled"; }
            lib.add(tabs, lib.li({ id: createId(data.id, item.value), class: tabclass, "data-value": item.value, onclick: createTabclickHandler(tabs, item, data.callback), onmouseover: function (evt) { jsl.addClass(jsl.evtTarget(evt), "hover"); }, onmouseout: function (evt) { jsl.removeClass(jsl.evtTarget(evt), "hover"); } }, item.text));
        }); tabBox = lib.div({ id: data.id + "Box", class: "onPageTabsBox" }, tabs); return tabBox;
    }; lib.saveErrorMsg = function (data) {
        var msg; if (data.err) {
            if (data.fullmsg) { return lib.div({ class: "LuaSaveVarError" }, lib.p({}, data.fullmsg)); }
            if (data.msg) { msg = "Fehlerbeschreibung: " + data.msg; } else { msg = "Fehlercode: " + data.err; }
            return lib.div({ class: "LuaSaveVarError" }, lib.p({}, "Es ist ein Fehler aufgetreten."), lib.p({}, msg), lib.p({}, "Bitte geben Sie Ihre Daten noch einmal ein. Sollte der Fehler erneut auftreten, wenden Sie sich bitte an den AVM-Support."));
        }
    }; lib.submitBtn = function (data) {
        var txt; if (!data.name) { return; }
        txt = data.text || submitText(data.name); return lib.button({ type: "button", name: data.name, onclick: newval.createSubmitHandler({ name: data.name, onBeforeSubmit: data.onBeforeSubmit, submitParams: data.submitParams, onAfterSubmit: data.onAfterSubmit, onSaveerror: data.onSaveerror }) }, txt);
    }; lib.footButtons = function (btns) {
        var div = lib.div({ class: "btn_form_foot" }); if (btns) { btns.forEach(function (btnData) { lib.add(div, lib.submitBtn(btnData)); }); }
        return div;
    }; return lib;
}());
var http; http = http || (function () {
    "use strict"; var lib; lib = {}; function readValue(el) {
        var values; switch (el.type || "") {
            case 'submit': break; case 'button': break; case 'file': break; case 'checkbox': values = (el.value || "on").split(";"); if (el.checked) { return values[0]; } else { return values[1] || null; }
                break; case 'radio': if (el.checked) { return el.value || ""; }
                    break; default: return el.value || "";
        }
        return null;
    }
    lib.collectParams = function (parent, addParams) {
        var result, elems, name, value; result = {}; elems = jsl.find("input,select,textarea", parent); elems.forEach(function (el) { name = el.name; if (name && !el.disabled) { value = readValue(el); if (value !== null) { result[name] = value; } } }); if (addParams) { for (name in addParams) { if (addParams.hasOwnProperty(name)) { result[name] = addParams[name] || ""; } } }
        return result;
    }; lib.splitUrl = function (url) {
        var result; result = {}; result.page = ""; result.params = {}; url = url || ""; url = url.split("#"); if (url.length > 1) { result.anchor = url[1]; }
        url = url[0]; url = url.split("?"); result.page = url[0]; if (url.length > 1) { url = url[1].split("&"); url.forEach(function (p) { p = p.split("="); if (p.length > 1) { result.params[p[0]] = p[1]; } }); }
        return result;
    }; function buildParams(params, encodeFunc) {
        var data, name, value; params = params || {}; data = []; for (name in params) {
            if (params.hasOwnProperty(name)) {
                if (name) { value = params[name]; if (value === undefined) { value = ""; } }
                data.push(encodeFunc(name) + "=" + encodeFunc(value));
            }
        }
        return data.join("&");
    }
    lib.buildUrl = function (url) {
        var page, params; url = url || {}; if (!url.page) { return ""; }
        page = encodeURI(url.page); params = buildParams(url.params, encodeURIComponent); if (params) { page = page + "?" + params; }
        if (url.anchor) { page = page + "#" + encodeURIComponent(url.anchor); }
        return page;
    }; function postEncode(str) { var result = encodeURIComponent(str); result = result.replace(/%20/g, '+'); result = result.replace(/(.{0,3})(%0A)/g, function (m, s1, s2) { return s1 + (s1 === '%0D' ? '' : '%0D') + s2; }); result = result.replace(/(%0D)(.{0,3})/g, function (m, s1, s2) { return s1 + (s2 === '%0A' ? '' : '%0A') + s2; }); return result; }
    function mergeObjects(defaultObj, updateObj) {
        var result, name; defaultObj = defaultObj || {}; updateObj = updateObj || {}; result = {}; for (name in defaultObj) { if (defaultObj.hasOwnProperty(name)) { result[name] = defaultObj[name]; } }
        for (name in updateObj) { if (updateObj.hasOwnProperty(name)) { result[name] = updateObj[name]; } }
        return result;
    }
    function stopXhr(xhr) { if (xhr && xhr.readyState && xhr.readyState < 4) { xhr.onreadystatechange = func.noop; xhr.abort(); } }
    function checkLoggedin(xhr, page) {
        var url; if (xhr.status === 403) { url = page ? "?lp=" + page : ""; jsl.log("Forbidden", url); location.href = url; return false; }
        return true;
    }
    function sendXhr(method, url, postData, callback, page) {
        var xhr; xhr = new XMLHttpRequest(); if (!xhr) { return false; }
        method = method.toUpperCase(); if (method === "GET") { url += "&t=" + encodeURIComponent(String((new Date()).getTime())); }
        xhr.open(method, url, true); if (method === "POST") { xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === xhr.HEADERS_RECEIVED) { if (!checkLoggedin(xhr, page)) { xhr.onreadystatechange = function () { return; }; } }
            if (xhr.readyState === xhr.DONE) {
                if (checkLoggedin(xhr, page)) { jsl.log("onreadystatechange", xhr.status, Boolean(xhr.responseText)); if (typeof callback === 'function') { callback(xhr); callback = null; } }
                xhr.onreadystatechange = func.noop;
            }
        }; xhr.send(postData); return xhr;
    }
    lib.request = function (options) {
        var xhr, cfg, page; cfg = {}; cfg.method = (options.method || "GET").toUpperCase(); cfg.url = options.url || ""; cfg.params = mergeObjects({ xhr: "1" }, options.params || {}); cfg.type = (options.type || 'json').toLowerCase(); cfg.callback = options.callback || func.noop; if (options.sidRenew !== true) { cfg.params.no_sidrenew = ""; }
        page = options.params.page || false; function callback(xhr) {
            var answer; switch (cfg.type) { case 'text': answer = xhr.responseText || ""; break; default: try { answer = JSON.parse(xhr.responseText || "null"); } catch (err) { jsl.log(err.name, err.message); answer = { err: true, answer: xhr.responseText }; } }
            cfg.callback(answer);
        }
        function start(addParams) {
            var url, params, data, encodeFunc; url = cfg.url; if (addParams && addParams.page) { page = addParams.page; }
            params = mergeObjects(cfg.params, addParams); encodeFunc = encodeURIComponent; if (cfg.method === "POST") { encodeFunc = postEncode; }
            data = buildParams(params, encodeFunc); if (cfg.method === "GET") { url += "?" + data; data = null; }
            xhr = sendXhr(cfg.method, url, data, callback, page);
        }
        function stop() { stopXhr(xhr); }
        return { start: start, stop: stop };
    }; return lib;
}());