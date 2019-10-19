const REGULAR_KEY  = "regular-key";
const META_KEY     = "meta-key";
const SPACE_BAR    = "space-bar";
const FUNCTION_KEY = "function-key";
const RETURN_KEY   = "return-key";
const SPACER       = "spacer";

const MODES = {
    PORTRAIT: "portrait",
    LANDSCAPE: "landscape",
    SPLIT: "split"
}

let fullScreenWidth, singleScreenWidth, screenHeight, contentHeight, winTimerId = -1, mode = MODES.LANDSCAPE;

const KEYS = [
    [
        {id:"func-1", type:FUNCTION_KEY, class:[FUNCTION_KEY]},
        {id:"func-2", type:FUNCTION_KEY, class:[FUNCTION_KEY]},
        {id:"func-3", type:FUNCTION_KEY, class:[FUNCTION_KEY]},
        {id:"func-4", type:FUNCTION_KEY, class:[FUNCTION_KEY]},
        {id:"func-5", type:FUNCTION_KEY, class:[FUNCTION_KEY]}
    ],
    [
        {id:"q", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"w", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"e", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"r", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"t", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"y", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"u", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"i", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"o", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"p", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]}
    ],
    [
        {type:SPACER},
        {id:"a", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"s", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"d", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"f", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"g", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"h", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"j", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"k", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"l", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {type:SPACER}
    ],
    [
        {id:"shift", type:META_KEY, class:[META_KEY]},
        {id:"z", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"x", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"c", type:REGULAR_KEY, class:[REGULAR_KEY]},
        {id:"v", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"b", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"n", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"m", type:REGULAR_KEY, class:[REGULAR_KEY, "splittable"]},
        {id:"backspace", type:META_KEY, class:[META_KEY, "splittable"]}
    ],
    [
        {id:"numeric", type:META_KEY, class:[META_KEY]},
        {id:"comma", type:REGULAR_KEY, class:[META_KEY]},
        {id:"left-space-bar", type:SPACE_BAR, class:[REGULAR_KEY]},
        {id:"right-space-bar", type:SPACE_BAR, class:[REGULAR_KEY, "splittable"]},
        {id:"period", type:REGULAR_KEY, class:[META_KEY, "splittable"]},
        {id:"return", type:META_KEY, class:[RETURN_KEY, "splittable"]}
    ]
]

function init() {
    window.addEventListener("resize", () => {
        clearTimeout(winTimerId);
        winTimerId = setTimeout(() => {
            doLayout();
        }, 500);
    });
    evalMenu();
    doLayout();
    setInterval(updateDate, (60*1000));
    updateDate();
}

function doLayout() {
    toggleAnimationOnOff();
    let duo = id("duo");
    let screen = id("screen");

    winW = window.innerWidth;
    winH = window.innerHeight;

    let narrowestDimenstion = (winW > winH) ? winH : winW;
    duo.height = narrowestDimenstion * .80;
    duo.width = duo.height / 0.784477611940299;

    duo.style.top = (winH / 2) - (duo.height / 2) + "px";
    duo.style.left = (winW / 2) - (duo.width / 2) + "px";

    // Use the rulers embedded inside the SVG to measure screen size.
    fullScreenWidth = duo.contentDocument.getElementById("Full_Screen_Width").getBoundingClientRect();
    singleScreenWidth = duo.contentDocument.getElementById("Single_Screen_Width").getBoundingClientRect();
    screenHeight = duo.contentDocument.getElementById("Screen_Height").getBoundingClientRect();
    contentHeight = screenHeight.height * .6;

    // Add some bleeding by rounding up.
    fullScreenWidth.width = Math.ceil(fullScreenWidth.width);
    singleScreenWidth.width = Math.ceil(singleScreenWidth.width);
    screenHeight.height = Math.ceil(screenHeight.height);

    screen.style.width = fullScreenWidth.width + "px";
    screen.style.height = screenHeight.height + "px";

    screen.style.top = (winH / 2) - (screen.offsetHeight / 2) + "px";
    screen.style.left = (winW / 2) - (screen.offsetWidth / 2) + "px";

    for (e of document.getElementsByClassName("content")) {
        e.style.width = singleScreenWidth.width + "px";
        e.style.height = contentHeight + "px";
    }

    for (e of document.getElementsByClassName("time")) {
        let fontSize = (e.id !== "date") ? (contentHeight / 6) : (contentHeight / 25);
        e.style["font-size"] = ((e.id !== "date") ? (contentHeight / 6) : (contentHeight / 25)) + "px";
        e.style["line-height"] = fontSize + "px";
    }

    let chat = id("chat");
    let wallpaper = id("wallpaper");

    chat.style.top = "0px";
    wallpaper.style.top = "0px";
    wallpaper.style.left = (fullScreenWidth.width - singleScreenWidth.width) + "px";

    duo.style.visibility = "visible";
    screen.style.visibility = "visible";

    renderKeyboard();
    layKeyboardOut(MODES.LANDSCAPE);

    toggleAnimationOnOff();
}

function updateDate() {
    let date = new Date();
    let h = date.getHours();
    h = (h === 0) ? 12 : ((h > 12) ? h-12 : h);
    id("hour").innerText = pad(h);
    id("minute").innerText = pad(date.getMinutes());
    id("date").innerText = pad(date.getMonth() + 1) + " / " + pad(date.getDate()) + " / " + date.getFullYear();
}

function pad(value) {
    return (value > 9) ? value : "0" + value;
}

const ANI_FUNCS = {
    [MODES.PORTRAIT]: function() {ani(rotatePortrait)},
    [MODES.LANDSCAPE]: function() {ani(rotateLandscape)},
    simple: function() {ani(ak, "simple")},
    top_to_bottom: function() {ani(ak, "top-to-bottom")},
    bottom_to_top: function() {ani(ak, "bottom-to-top")},
    right_to_left_top: function() {ani(ak, "right-to-left-top")},
    right_to_left_bottom: function() {ani(ak, "right-to-left-bottom")},
    random: function() {ani(ak, "random")},
    join: function() {ani(jk)}
};

function evalMenu() {
    [MODES.PORTRAIT, MODES.LANDSCAPE].forEach(orientation => {
        let oElement = id(orientation);
        if (mode !== orientation && mode !== MODES.SPLIT) {
            oElement.addEventListener("click", ANI_FUNCS[orientation]);
            oElement.setAttribute("class", "menu-active");
        } else {
            oElement.removeEventListener("click", ANI_FUNCS[orientation]);
            oElement.setAttribute("class", "menu-inactive");
        }    
    });

    ["simple", "top_to_bottom", "bottom_to_top", "right_to_left_top", "right_to_left_bottom", "random"].forEach(split => {
        let splitElement = id(split);
        if (mode === MODES.LANDSCAPE && mode !== MODES.SPLIT) {
            splitElement.addEventListener("click", ANI_FUNCS[split]);
            splitElement.setAttribute("class", "menu-active");
        } else {
            splitElement.removeEventListener("click", ANI_FUNCS[split]);
            splitElement.setAttribute("class", "menu-inactive");
        }    
    })

    let join = id("join");
    if (mode === MODES.SPLIT) {
        join.addEventListener("click", ANI_FUNCS.join);
        join.setAttribute("class", "menu-active");
    } else {
        join.removeEventListener("click", ANI_FUNCS.join);
        join.setAttribute("class", "menu-inactive");
    }
}

function getKeyDimensions(orientation) {
    let keyGap, keyWidth, keyHeight, funcKeyHeight;
    if (orientation === MODES.LANDSCAPE) {
        keyGap = singleScreenWidth.width * 0.015;
        keyWidth = (singleScreenWidth.width / 10) - (keyGap + (keyGap / 10));
        keyHeight = ((parseInt(id("keyboard").style.height) - (keyGap * 5)) / 4);
        funcKeyHeight = 0;
    } else { // PORTRAIT
        keyGap = singleScreenWidth.width * 0.015;
        keyWidth = (screenHeight.height / 10) - (keyGap + (keyGap / 10));
        keyHeight = ((singleScreenWidth.width - (keyGap * 6)) / 5);
        funcKeyHeight = keyHeight;
    }
    return {
        keyGap: keyGap,
        [REGULAR_KEY]: {w:keyWidth, h:keyHeight},
        [META_KEY]: {w:((keyWidth / 2) + keyWidth) + (keyGap / 2), h:keyHeight},
        [FUNCTION_KEY]: {w:(keyWidth * 2) + keyGap, h:funcKeyHeight},
        [SPACE_BAR]: {w:(keyWidth * 2.5) + (keyGap * 2), h:keyHeight},
        [SPACER]: {w:(keyWidth / 2) + (keyGap / 2), h:keyHeight}
    };
}

function renderKeyboard() {
    let screen = id("screen");
    let keyboard = id("keyboard");
    if (keyboard) {
        screen.removeChild(keyboard);
    }
    keyboard = document.createElement("div");
    keyboard.style.position = "absolute";
    keyboard.style.bottom = "0px";
    keyboard.style.left = "0px";
    keyboard.setAttribute("id", "keyboard");
    keyboard.setAttribute("class", "animatable");
    screen.appendChild(keyboard);

    KEYS.forEach(row => {
        row.forEach(key => {
            let newKey = document.createElement("div");
            newKey.setAttribute("data-type", key.type);
            newKey.setAttribute("id", key.id);
            let classList = "animatable key";
            if (key.class) classList += (" " + key.class.join(" "));
            newKey.setAttribute("class", classList);
            newKey.addEventListener("transitionend", (e) => {
                e.target.style['transition-delay'] = "0s";
            })
            keyboard.appendChild(newKey);
        })
    })
}

function layKeyboardOut(orientation) {
    let keyboard = id("keyboard");
    keyboard.style.width = ((orientation === MODES.LANDSCAPE) ? singleScreenWidth.width : screenHeight.height) + "px";
    keyboard.style.height = ((orientation === MODES.LANDSCAPE) ? (screenHeight.height - contentHeight) : singleScreenWidth.width) + "px";
    let keyData = getKeyDimensions(orientation);
    let top = keyData.keyGap, lastKeyHeight;
    KEYS.forEach(row => {
        let left = keyData.keyGap;
        row.forEach(key => {
            if (key.type === SPACER) {
                left += keyData[SPACER].w;
                return;
            }
            let newKey = document.getElementById(key.id);
            newKey.style.width = keyData[key.type].w + "px";
            // Hack to cover up the occasional gap between spacebars due to pixel rounding.
            if (key.id === "left-space-bar") {
                newKey.style.width = (parseInt(newKey.style.width) + 1) + "px";
            }
            newKey.style.height = keyData[key.type].h + "px";
            newKey.style.top = top + "px";
            newKey.style.left = left + "px";
            left += keyData[key.type].w;
            if (key.id !== "left-space-bar") left += keyData.keyGap;
            lastKeyHeight = keyData[key.type].h;            
        });
        // Compensate for 0-height function keys.
        if (lastKeyHeight !== 0) top += (lastKeyHeight + keyData.keyGap);
    })
}

function ani(func, args) { // animate
    func.apply(this, [args]);
    evalMenu();
}

function rotatePortrait() {
    mode = MODES.PORTRAIT;
    for (let e of document.getElementsByClassName("content")) {
        let translate = ((screenHeight.height - parseInt(e.style.width, 10)) / 2) * -1;
        e.style.width = screenHeight.height + "px";
        e.style.height = singleScreenWidth.width + "px";
        e.style.transform = "rotate(-90deg) translate("+translate+"px, "+translate+"px)";
    }
    id("duo").style.transform = "rotate(90deg)";
    id("screen").style.transform = "rotate(90deg)";
    layKeyboardOut(MODES.PORTRAIT);
    let keyboard = id("keyboard");
    let translateLeft = (screenHeight.height - singleScreenWidth.width) / 2;
    let translateTop = (fullScreenWidth.width - singleScreenWidth.width) - translateLeft;
    keyboard.classList.toggle("keyboard-opaque");
    keyboard.style.transform = "rotate(-90deg) translate("+Math.floor(translateLeft)+"px, "+translateTop+"px)";
}

function rotateLandscape() {
    mode = MODES.LANDSCAPE;
    for (let e of document.getElementsByClassName("content")) {
        e.style.width = singleScreenWidth.width + "px";
        e.style.height = contentHeight + "px";
        e.style.transform = "rotate(0deg)";
    }
    id("duo").style.transform = "rotate(0deg)";
    id("screen").style.transform = "rotate(0deg)";
    layKeyboardOut(MODES.LANDSCAPE);
    let keyboard = id("keyboard");
    keyboard.classList.toggle("keyboard-opaque");
    keyboard.style.transform = "rotate(0deg)";
}

let keyboardAnimationData = {
    keyList:[],
    transitionIncrement: 0,
    patterns: {
        topToBottom: ["p", "o", "i", "u", "y", "l", "k", "j", "h", "backspace", "m", "n", "b", "v", "return", "period", "right-space-bar"],
        bottomToTop: ["return", "period", "right-space-bar", "backspace", "m", "n", "b", "v", "l", "k", "j", "h", "p", "o", "i", "u", "y"],
        rightToLeftTop: ["p", "l", "backspace", "return", "o", "k", "m", "period", "i", "j", "n", "right-space-bar", "u", "h", "b", "y", "v"],
        rightToLeftBottom: ["return", "backspace", "l", "p", "period", "m", "k", "o", "right-space-bar", "n", "j", "i", "b", "h", "u", "v", "y"]
    }
};

function ak(order) { // animate keyboard
    mode = MODES.SPLIT;
    let keyList, transitionIncrement;
    switch (order) {
        case 'simple':
            keyboardAnimationData.keyList = keyboardAnimationData.patterns.topToBottom.slice();
            keyboardAnimationData.transitionIncrement = 0;
            break;
        case 'top-to-bottom':
            keyboardAnimationData.keyList = keyboardAnimationData.patterns.topToBottom.slice();
            keyboardAnimationData.transitionIncrement = .1;
            break;
        case 'bottom-to-top':
            keyboardAnimationData.keyList = keyboardAnimationData.patterns.bottomToTop.slice();
            keyboardAnimationData.transitionIncrement = .1;
            break;
        case 'right-to-left-top':
            keyboardAnimationData.keyList = keyboardAnimationData.patterns.rightToLeftTop.slice();
            keyboardAnimationData.transitionIncrement = .1;
            break;
        case 'right-to-left-bottom':
            keyboardAnimationData.keyList = keyboardAnimationData.patterns.rightToLeftBottom.slice();
            keyboardAnimationData.transitionIncrement = .1;
            break;
        case 'random':
            let allKeys = keyboardAnimationData.patterns.topToBottom.slice(), randomKeys = [];
            while (allKeys.length > 0) {
                let rnd = Math.floor(Math.random() * allKeys.length);
                randomKeys[randomKeys.length] = allKeys.splice(rnd, 1)[0];
            }
            keyboardAnimationData.keyList = randomKeys;
            keyboardAnimationData.transitionIncrement = .1;
            break;
        }

    let transitionDelay = 0;
    keyboardAnimationData.keyList.forEach(keyId => {
        let key = id(keyId);
        key.style["transition-delay"] = (transitionDelay+=keyboardAnimationData.transitionIncrement) + "s";
        key.style.left = (parseInt(key.style.left) + (fullScreenWidth.width - singleScreenWidth.width) + "px");
    });
}

function jk() { // join keyboard
    mode = MODES.LANDSCAPE;
    keyboardAnimationData.keyList.reverse();
    let transitionDelay = 0;
    keyboardAnimationData.keyList.forEach(keyId => {
        let key = id(keyId);
        key.style["transition-delay"] = (transitionDelay+=keyboardAnimationData.transitionIncrement) + "s";
        key.style.left = (parseInt(key.style.left) - (fullScreenWidth.width - singleScreenWidth.width) + "px");
    });    
}

function toggleSpeed(e) {
    getAnimatable().style["transition-duration"] = (e.target.checked) ? "2.5s" : ".5s";
}

function toggleAnimationOnOff() {
    let r = getAnimatable();
    r.style["transition-property"] = (r.style["transition-property"] === "all") ? "none" : "all";
}

function getAnimatable() {
    for (r of document.styleSheets[0].cssRules) {
        if (r.selectorText === ".animatable") {
            return r;
        }
    }
}

function removeAllChildren(e) { while (e.hasChildNodes()) { e.removeChild(e.firstChild);} };
function id(n) { return document.getElementById(n); }

window.onload = init;