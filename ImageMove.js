/* 
 * ImageMove module to add pan event in image with in a container. We can also call this libary in head section of html.
 * To use this libary, no need to use extra libary. This libary written in pure vanila js. This libary support for both 
 * mobile and desktop device. This libary is supported in all browser(including ie-9)
 * @author : Chinmoy Samanta (chinmoysamanta.2010@gmail.com)
 * @example :
 * var movementOfImage = new ImageMove('ImageContainerId', 'ImageElementId');
 * movementOfImage.addEvents();
 * movementOfImage.removeEvents();
 */
"use strict";
(function(win, doc, DomFunctionalityClass) {
    var domFunctionality = new DomFunctionalityClass(doc),
        imgContainer,
        imgElement,
        DRAGGGING_STARTED = 0,
        LAST_MOUSE_POSITION,
        DIV_OFFSET,
        CONTAINER_WIDTH,
        CONTAINER_HEIGHT,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        ImageContainerElement,
        thisObjOfimageMove,
        /*
         * @desc: main core class to add custom events on specied image element. This class contains
         * two methods. 
         * 1.addPanEvents : For adding pan related events on image element.
         * 2.removePanEvents: To remove pan related events from image element.
         * @param {string} imgContainerId - Id of image container
         * @param {string} imgId - Id of image element
         */
        imageMove = function(imgContainerId, imgId) {
            thisObjOfimageMove = this;
            thisObjOfimageMove.imgContainerId = imgContainerId;
            thisObjOfimageMove.imgId = imgId;
            thisObjOfimageMove.addPanEvents = function() {
                thisObjOfimageMove.customeventName = 'pan';
                /*
                 * Call addCustomEvents in the context of instance of imageMove class.
                 * Main reason to do this : 
                 * acess imgContainerId, imgId, customeventName varibale in the callBack function (which pass to 
                 * onready method of domFunctionality class) without passing the variable as parameter. Instead of
                 * passing parameter, we assign the variables in 'this' object of imageMove class and we call the callBack
                 * function in the context of 'this' object of imageMove class.
                 */
                addCustomEvents.call(thisObjOfimageMove);
            };
            thisObjOfimageMove.removePanEvents = function() {
                thisObjOfimageMove.customeventName = 'pan';
                removeCustomEvents.call(thisObjOfimageMove);
            };
        },
        addCustomEvents = function() {
            domFunctionality.onready(function() {
                // Take custom event object from EVENT_MAP.
                var customEventObj = EVENT_MAP[this.customeventName];
                imgContainer = domFunctionality._(this.imgContainerId);
                imgElement = domFunctionality._(this.imgId);
                DIV_OFFSET = imgContainer.getOffSet();
                CONTAINER_WIDTH = imgContainer.getOuterWidth();
                CONTAINER_HEIGHT = imgContainer.getOuterHeight();
                IMAGE_WIDTH = imgElement.getOuterWidth();
                IMAGE_HEIGHT = imgElement.getOuterHeight();
                ImageContainerElement = imgContainer.element;
                domFunctionality.addEventFromElement(ImageContainerElement, customEventObj);
            }, this);
        },
        removeCustomEvents = function() {
            var customEventObj = EVENT_MAP[this.customeventName];
            domFunctionality.removeEventFromElement(ImageContainerElement, customEventObj);
        },
        touchStart = function(event) {
            event.stopPropagation();
            event.preventDefault();
            var xpos,
                ypos;
            event.clientX ? (xpos = event['clientX'], ypos = event['clientY']) : (xpos = event.touches[0].pageX,
                ypos = event.touches[0].pageY);
            DRAGGGING_STARTED = 1;
            LAST_MOUSE_POSITION = { x: xpos - DIV_OFFSET.left, y: ypos - DIV_OFFSET.top };
        },
        touchEnd = function(event) {
            event.stopPropagation();
            event.preventDefault();
            DRAGGGING_STARTED = 0;
        },
        touchMove = function(event) {
            event.stopPropagation();
            event.preventDefault();
            var current_mouse_position,
                change_x,
                change_y,
                img_top,
                img_left,
                img_top_new,
                img_left_new,
                curr_x_pos,
                curr_y_pos;
            if (DRAGGGING_STARTED == 1) {
                event.clientX ? (curr_x_pos = event['clientX'], curr_y_pos = event['clientY']) : (curr_x_pos = event.touches[0].pageX,
                    curr_y_pos = event.touches[0].pageY);
                current_mouse_position = { x: curr_x_pos - DIV_OFFSET.left, y: curr_y_pos - DIV_OFFSET.top };
                change_x = current_mouse_position.x - LAST_MOUSE_POSITION.x;
                change_y = current_mouse_position.y - LAST_MOUSE_POSITION.y;
                LAST_MOUSE_POSITION = current_mouse_position;
                img_top = parseInt(imgElement.getSetCss('top'), 10);
                img_left = parseInt(imgElement.getSetCss('left'), 10);
                img_top_new = img_top + change_y;
                img_left_new = img_left + change_x;
                // Validate top and left, otherwise white space will be seen.
                (img_top_new > 0) && (img_top_new = 0);
                (img_top_new < (CONTAINER_HEIGHT - IMAGE_HEIGHT)) && (img_top_new = CONTAINER_HEIGHT - IMAGE_HEIGHT);
                (img_left_new > 0) && (img_left_new = 0);
                (img_left_new < (CONTAINER_WIDTH - IMAGE_WIDTH)) && (img_left_new = CONTAINER_WIDTH - IMAGE_WIDTH);
                imgElement.getSetCss({ top: img_top_new + 'px', left: img_left_new + 'px' });
                (event.clientX > CONTAINER_WIDTH || event.clientY > CONTAINER_HEIGHT) && (DRAGGGING_STARTED = 0);
            }
        },
        EVENT_MAP = {
            pan: {
                touchstart: touchStart,
                touchend: touchEnd,
                touchmove: touchMove,
                mousedown: touchStart,
                mouseup: touchEnd,
                mousemove: touchMove
            }
        };
    // addEventListener ployfill for IE-8
    (typeof win.addEventListener === 'undefined') && (function() {
        var registry = [],
            addEvent = function(type, listner) {
                var target = this;
                registry.unshift({
                    _listner: function(event) {
                        event.preventDefault = function() {
                            event.returnValue = false;
                        };
                        event.stopPropagation = function() {
                            event.cancelBubble = true;
                        };
                        listner.call(target, event);
                    },
                    listener: listener,
                    target: target,
                    type: type
                });
                target.attachEvent("on" + type, registry[0].__listener);
            },
            removeEvent = function(type, listner) {
                for (var index = 0; index < registry.length; index++) {
                    if (registry[index].target === this && registry[index].type === type && registry[index].listner === listner) {
                        return this.detachEvent("on" + type, registry.splice(index, 1)[0].__listener);
                    }
                }
            };
        win.Element.prototype.addEventListener = addEvent;
        win.Element.prototype.removeEventListener = removeEvent;
    })();
    win['ImageMove'] = imageMove;
})(typeof window !== 'undefined' ? window : null, typeof document !== 'undefined' ? document : null,
    function(doc) {
        var globalObj = this,
            exportedObj = {
                /*
                 * _ use to select element by id.
                 * @param {string} id Element Id
                 * @return {Object} reference of chaining methods.  
                 */
                _: function(id) {
                    var element = doc.getElementById(id),
                        deepCopyOfglobalObj;
                    globalObj.element = element;
                    deepCopyOfglobalObj = deepCopyOfRef(globalObj);
                    return deepCopyOfglobalObj;
                },
                getOffSet: function() {
                    var element = this.element,
                        rect = element.getBoundingClientRect();
                    return {
                        top: rect.top + doc.body.scrollTop,
                        left: rect.left + doc.body.scrollLeft
                    }
                },
                getOuterWidth: function() {
                    var element = this.element;
                    return element.offsetWidth;
                },
                getOuterHeight: function() {
                    var element = this.element;
                    return element.offsetHeight;
                },
                /*
                 * getSetCss use to get css value or either set css style.
                 * @param {string || object} value - It can be rulename or css style.
                 */
                getSetCss: function(value) {
                    var element = this.element,
                        cssValue;
                    if (typeof value === 'object') {
                        convertToJSStyleCss(value);
                        for (var prop in value) {
                            element.style[prop] = value[prop];
                        }
                    } else {
                        cssValue = typeof getComputedStyle !== 'undefined' ? getComputedStyle(element)[value] : element.currentStyle[value];
                        !isNaN(parseInt(cssValue)) ? cssValue = cssValue : cssValue = '0px';
                        return cssValue;
                    }
                },
                /*
                 * onready use to call the function after state is in complete mode.
                 * @parem {Function} callBack- callback function
                 * @param {object} context - on which callback function will be executed.
                 */
                onready: function(callBack, context) {
                    doc.readyState !== "complete" ?
                        doc.onreadystatechange = function() {
                            if (doc.readyState == "complete") {
                                callBack.call(context);
                            }
                        } : callBack.call(context);
                },
                /*
                 */
                addEventFromElement: function(element, events) {
                    var eventName;
                    for (eventName in events) {
                        (events.hasOwnProperty(eventName)) &&
                        (element.addEventListener(eventName, events[eventName]));
                    }
                },
                removeEventFromElement: function(element, events) {
                    var eventName;
                    for (eventName in events) {
                        (events.hasOwnProperty(eventName)) &&
                        (element.removeEventListener(eventName, events[eventName]));
                    }
                }
            },
            convertToUpperCase = function(value) {
                var arr = value.split('-');
                if (arr.length === 1) {
                    return value;
                } else {
                    for (var i = 1; i < arr.length; i++) {
                        arr[i] = capitalize(arr[i]);
                    }
                    arr = arr.join('');
                    return arr;
                }
            },
            deepCopyOfRef = function(obj) {
                var temp = {};
                for (var pro in obj) {
                    if (obj.hasOwnProperty(pro)) {
                        temp[pro] = obj[pro];
                    }
                }
                return temp;
            },
            capitalize = function(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            },
            convertToJSStyleCss = function(obj) {
                var newKey;
                for (var oldKey in obj) {
                    if (obj.hasOwnProperty(oldKey)) {
                        newKey = convertToUpperCase(oldKey);
                        if (newKey !== oldKey) {
                            obj[newKey] = obj[oldKey];
                            delete obj[oldKey];
                        }
                    }
                }
            };
        for (var item in exportedObj) {
            if (exportedObj.hasOwnProperty(item)) {
                globalObj[item] = exportedObj[item];
            }
        }
    }
)
