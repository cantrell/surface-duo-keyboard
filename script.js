const REGULAR_KEY = "regular-key";
const META_KEY    = "meta-key";
const SPACE_BAR   = "space-bar";
const RETURN_KEY  = "return-key";
const SPACER      = "spacer";

const ORIENTATION = {
    PORTRAIT: "portrait",
    LANDSCAPE: "landscape"
};

let fullScreenWidth, singleScreenWidth, screenHeight, contentHeight;
let keyboard;

const KEYS = [
    [
        {id:"q", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"w", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"e", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"r", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"t", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"y", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"u", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"i", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"o", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"p", type:REGULAR_KEY, class:REGULAR_KEY}
    ],
    [
        {type:SPACER},
        {id:"a", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"s", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"d", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"f", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"g", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"h", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"j", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"k", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"l", type:REGULAR_KEY, class:REGULAR_KEY},
        {type:SPACER}
    ],
    [
        {id:"shift", type:META_KEY, class:META_KEY},
        {id:"z", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"x", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"c", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"v", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"b", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"n", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"m", type:REGULAR_KEY, class:REGULAR_KEY},
        {id:"backspace", type:META_KEY, class:META_KEY}
    ],
    [
        {id:"numeric", type:META_KEY, class:META_KEY},
        {id:"comma", type:REGULAR_KEY, class:META_KEY},
        {id:"left-space-bar", type:SPACE_BAR, class:REGULAR_KEY},
        {id:"right-space-bar", type:SPACE_BAR, class:REGULAR_KEY},
        {id:"period", type:REGULAR_KEY, class:META_KEY},
        {id:"return", type:META_KEY, class:RETURN_KEY}
    ]
]

function init() {
    // window.addEventListener("resize", doLayout);
    doLayout();
    updateDate();
    renderKeyboard();
    layKeyboardOut(ORIENTATION.LANDSCAPE);
}

function doLayout() {
    let duo = id("duo");
    let screen = id("screen");

    winW = window.innerWidth;
    winH = window.innerHeight;

    let narrowestDimenstion = (winW > winH) ? winH : winW;
    duo.height = narrowestDimenstion * .70;
    duo.width = duo.height / 0.784477611940299;

    duo.style.top = (winH / 2) - (duo.height / 2) + "px";
    duo.style.left = (winW / 2) - (duo.width / 2) + "px";

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

    id("main").appendChild(screen);
    id("main").appendChild(duo);
    for (e of document.getElementsByClassName("content")) {
        e.style.width = singleScreenWidth.width + "px";
        e.style.height = contentHeight + "px";
    }

    let chat = id("chat");
    let wallpaper = id("wallpaper");

    chat.style.top = "0px";
    wallpaper.style.top = "0px";
    wallpaper.style.left = (fullScreenWidth.width - singleScreenWidth.width) + "px";

    duo.style.visibility = "visible";
    screen.style.visibility = "visible";
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

function getKeyDimensions(orientation) {
    let keyGap, keyWidth, keyHeight;
    if (orientation === ORIENTATION.LANDSCAPE) {
        keyGap = singleScreenWidth.width * 0.015;
        keyWidth = (singleScreenWidth.width / 10) - (keyGap + (keyGap / 10));
        keyHeight = ((parseInt(keyboard.style.height) - (keyGap * 5)) / 4);
    } else { // PORTRAIT
        keyGap = singleScreenWidth.width * 0.025;
        keyWidth = (screenHeight.height / 10) - (keyGap + (keyGap / 10));
        keyHeight = ((singleScreenWidth.width - (keyGap * 5)) / 4);
    }
    return {
        keyGap: keyGap,
        keyHeight: keyHeight,
        [REGULAR_KEY]: keyWidth,
        [META_KEY]: ((keyWidth / 2) + keyWidth) + (keyGap / 2),
        [SPACE_BAR]: (keyWidth * 2.5) + (keyGap * 2),
        [SPACER]: (keyWidth / 2) + (keyGap / 2)
    };
}

function renderKeyboard() {
    let screen = id("screen");
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
            newKey.setAttribute("class", "animatable key " + key.class);
            keyboard.appendChild(newKey);
        })
    })
}

function layKeyboardOut(orientation) {
    keyboard.style.width = ((orientation === ORIENTATION.LANDSCAPE) ? singleScreenWidth.width : screenHeight.height) + "px";
    keyboard.style.height = ((orientation === ORIENTATION.LANDSCAPE) ? (screenHeight.height - contentHeight) : singleScreenWidth.width) + "px";
    let keyData = getKeyDimensions(orientation);
    let top = keyData.keyGap;
    KEYS.forEach(row => {
        let left = keyData.keyGap;
        row.forEach(key => {
            if (key.type === SPACER) {
                left += keyData[SPACER];
                return;
            }
            let newKey = document.getElementById(key.id);
            newKey.setAttribute("data-type", key.type);
            newKey.setAttribute("id", key.id);
            newKey.setAttribute("class", "animatable key " + key.class);
            newKey.style.width = keyData[key.type] + "px";
            // Hack to cover up the occasional gap between spacebars due to pixel rounding.
            if (key.id === "left-space-bar") {
                newKey.style.width = (parseInt(newKey.style.width) + 1) + "px";
            }
            newKey.style.height = keyData.keyHeight + "px";
            newKey.style.top = top + "px";
            newKey.style.left = left + "px";
            left += keyData[key.type];
            if (key.id !== "left-space-bar") left += keyData.keyGap;
        })
        top += (keyData.keyHeight + keyData.keyGap);
    })
}

function hideKeyboard() {
}

function doPortrait() {
    for (let e of document.getElementsByClassName("content")) {
        let translate = ((screenHeight.height - parseInt(e.style.width, 10)) / 2) * -1;
        e.style.width = screenHeight.height + "px";
        e.style.height = singleScreenWidth.width + "px";
        e.style.transform = "rotate(-90deg) translate("+translate+"px, "+translate+"px)";
    }
    id("duo").style.transform = "rotate(90deg)";
    id("screen").style.transform = "rotate(90deg)";

    layKeyboardOut(ORIENTATION.PORTRAIT);
    let keyboard = id("keyboard");
    let translateLeft = (screenHeight.height - singleScreenWidth.width) / 2;
    let translateTop = (fullScreenWidth.width - singleScreenWidth.width) - translateLeft;
    keyboard.classList.toggle("keyboard-opaque");
    keyboard.style.transform = "rotate(-90deg) translate("+translateLeft+"px, "+translateTop+"px)"; // left/x, top/y
}

function doLandscape() {
    for (let e of document.getElementsByClassName("content")) {
        e.style.width = singleScreenWidth.width + "px";
        e.style.height = contentHeight + "px";
        e.style.transform = "rotate(0deg)";
    }
    id("duo").style.transform = "rotate(0deg)";
    id("screen").style.transform = "rotate(0deg)";
    layKeyboardOut(ORIENTATION.LANDSCAPE);
    let keyboard = id("keyboard");
    keyboard.classList.toggle("keyboard-opaque");
    keyboard.style.transform = "rotate(0deg)";
}

function toggleSpeed(e) {
    for (r of document.styleSheets[0].rules) {
        if (r.selectorText === ".animatable") {
            r.style["transition-duration"] = (e.target.checked) ? "2.5s" : ".5s";
            return;
        }
    }
    // keyboard.classList.toggle("keyboard-opaque");


}

function removeAllChildren(e) { while (e.hasChildNodes()) { e.removeChild(e.firstChild);} };
function id(n) { return document.getElementById(n); }

window.onload = init;