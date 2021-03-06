'use strict';

const FLICKR_USER_ID = '61817691@N02';
const FLICKR_API_KEY = 'bd5904026d0ec07df8569a4953de0d84';
const FLICKR_REST_API_ENDPOINT = 'https://www.flickr.com/services/rest/';
const FLICKR_REST_API_METHOD_GET_PHOTOS = 'flickr.people.getPublicPhotos';
const FLICKR_REST_API_METHOD_GET_SIZES = 'flickr.photos.getSizes';
const FLICKR_REST_API_METHOD_GET_EXIF = 'flickr.photos.getExif';

var photoIds, photoInfos;
var len, idx;

$(document).ready(function () {
    fetchPhotos();
})

$('#imgTitle').click(function () {
    if ($("header.masthead").hasClass("transition")) return;

    $("header.masthead").toggleClass("transition");
    idx++;
    idx %= len;
    setTimeout(function () {
        setBackground();
        setTimeout(function () {
            $("header.masthead").toggleClass("transition");
        }, 100);
    }, 400);
});

function setBackground() {
    if (photoInfos[idx].url == undefined) {
        $.when(fetchPhotoUrl(idx), fetchPhotoExif(idx)).done(function () {
            setBackground();
        });
    } else {
        $("header.masthead").css("background-image",
            "linear-gradient(to bottom, rgba(0, 0, 0, .2) 0, rgba(0, 0, 0, .2) 100%), url(" + photoInfos[idx].url + ")");
        $("#photoInfo").html(getExif(idx));

        // preload next image
        let nextIdx = (idx + 1) % len;
        if (photoInfos[nextIdx].url == undefined) {
            $.when(fetchPhotoUrl(nextIdx), fetchPhotoExif(nextIdx)).done(function () {
                $("#dummy").css("background-image", "url(" + photoInfos[nextIdx].url + ")");
            });
        }
    }
}

function fetchPhotos() {
    $.ajax({
        type: 'GET',
        dataType: 'xml',
        url: FLICKR_REST_API_ENDPOINT,
        data: {
            method: FLICKR_REST_API_METHOD_GET_PHOTOS,
            api_key: FLICKR_API_KEY,
            user_id: FLICKR_USER_ID
        },
        success: function (response) {
            let jsonResponse = JSON.parse(xml2json(response, ""));
            initPhotoIds(jsonResponse.rsp.photos.photo);
            setBackground();
        }
    });
}

function fetchPhotoUrl(idx) {
    let photoId = photoIds[idx];
    return $.ajax({
        type: 'GET',
        dataType: 'xml',
        url: FLICKR_REST_API_ENDPOINT,
        data: {
            method: FLICKR_REST_API_METHOD_GET_SIZES,
            api_key: FLICKR_API_KEY,
            photo_id: photoId
        },
        success: function (response) {
            let jsonResponse = JSON.parse(xml2json(response, ""));
            let sizes = jsonResponse.rsp.sizes.size;
            let url = sizes.filter(size => size['@label'] === "Large 2048")[0]['@source'];
            photoInfos[idx].url = url;
        }
    });
}

function fetchPhotoExif(idx) {
    let photoId = photoIds[idx];
    return $.ajax({
        type: 'GET',
        dataType: 'xml',
        url: FLICKR_REST_API_ENDPOINT,
        data: {
            method: FLICKR_REST_API_METHOD_GET_EXIF,
            api_key: FLICKR_API_KEY,
            photo_id: photoId
        },
        success: function (response) {
            let jsonResponse = JSON.parse(xml2json(response, ""));
            let exifArr = jsonResponse.rsp.photo.exif;
            var exifMap = {};
            exifArr.forEach(function (element) {
                exifMap[element['@label']] = element['raw'];
            });
            photoInfos[idx].exif = exifMap;
        }
    });
}

function getExif(idx) {
    let exif = photoInfos[idx]['exif'];
    let model = exif['Model'];

    let lens = exif['Lens Model'];
    let focalLength = exif['Focal Length'];
    let lensStr = `${lens} @ ${focalLength}`;
    
    let aperture = exif['Aperture'];
    let shutter = exif['Exposure'];
    let iso = exif['ISO Speed'];
    let exposureBias = exif['Exposure Bias'];
    let exposureStr = `f/${aperture}; ${shutter} sec; ISO ${iso}`;
    if (exposureBias !== '0') {
        exposureStr += `; ${exposureBias}`;
    }

    return `${model}\n${lensStr}\n${exposureStr}`;
}

function initPhotoIds(photos) {
    photoIds = photos.map(photo => photo['@id']);
    len = photoIds.length;
    photoInfos = Array(len);
    for (var i = 0; i < len; i++) {
        photoInfos[i] = {};
    }
    idx = Math.floor(Math.random() * len);
}
