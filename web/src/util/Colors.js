const colors = [
    '#F44336', '#e91e63', '#9c27b0', '#673ab7',
    '#ff9800', '#ff5722', '#795548', '#607d8b',
    '#3f51b5', '#2196F3', '#00bcd4', '#009688',
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0',
    '#4CAF50', '#ffeb3b', '#ffc107',
];
const colorNames2 = [
    "warning", "primary", "danger", "success", "info", "rose"
];

const colorValues = [
    "#ffa726", "#ab47bc", "#ef5350", "#66bb6a", "#26c6da", "#ec407a"
];

export function getRandomColor(name) {
    name = name.substr(0, 6);

    var hash = 0;
    for (var i = 0; i < name.length; i++) {
        hash = 31 * hash + name.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

export function getRandomColorValue(name) {
    name = name.substr(0, 6);

    var hash = 0;
    for (var i = 0; i < name.length; i++) {
        hash = 31 * hash + name.charCodeAt(i);
    }
    var index = Math.abs(hash % colorNames2.length);
    return colorValues[index];
}

export function getRandomColorName(name) {
    name = name.substr(0, 6);

    var hash = 0;
    for (var i = 0; i < name.length; i++) {
        hash = 31 * hash + name.charCodeAt(i);
    }
    var index = Math.abs(hash % colorNames2.length);
    return colorNames2[index];
}