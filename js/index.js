var bgData;
var idx;

$(document).ready(function () {
    jQuery.getJSON("../bg.json", function (data) {
        bgData = data;

        var len = data.length;
        idx = Math.floor(Math.random() * len);
        setBg();
    })

})

$('#imgTitle').click(function () {
    $("header.masthead").toggleClass("transition");
    idx++;
    idx %= bgData.length;
    setTimeout(function () {
        setBg();
        setTimeout(function () {
            $("header.masthead").toggleClass("transition");
        }, 100);
    }, 400);
});

function setBg() {
    $("header.masthead").css("background-image",
        "linear-gradient(to bottom, rgba(0, 0, 0, .2) 0, rgba(0, 0, 0, .2) 100%), url(" + bgData[idx].url + ")");
    $("#photoInfoContainer").html(unescape(bgData[idx].exif));

    // preload next image
    var nextIdx = (idx + 1) % bgData.length;
    $("#dummy").css("background-image", "url(" + bgData[nextIdx].url + ")");
}
