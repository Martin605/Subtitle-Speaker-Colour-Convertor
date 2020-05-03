var langList = ['en-US','zh-TW'];

function onLoad() {
    $('#footer').load("html_part/footer");
    var lang = localStorage.getItem('lang') || navigator.language || navigator.userLanguage; 
    if (langList.indexOf(lang) < -1) {lang="en-US"}
    for (var i = langList.length; i--;) {
        if (lang.substring(0, 2).match(langList[i])) {
            $.getJSON(`lang/${langList[i]}.json`, function(data) {
                $('langList').append(`<a class="nav-link" href="#" onClick="setLang(${langList[i]});">${data.name}</a>`)
            })
        }}
    navBar().then(setLang(lang));
}
  
async function navBar() {
    var current = window.location.pathname.split('/')
    current = current[current.length-1].replace('.html','')
    if (current=="") {current="index"};
    $('#navBar').load("html_part/navBar",
        function() {
            $(`#${current}nav`).append('<span class="sr-only">(current)</span>')
            $(`#${current}nav`).parent().addClass('active')
        }
    )
}

function setLang(langCode) {
    localStorage.setItem('lang', langCode);
    $("html").attr('lang', langCode)
    $.getJSON(`lang/${langCode}.json`, function(data) {
        $("#lang").text(data.name)
        $("title").html(data["_title"]);
        $("[data-translate]").html(function () {
            var key = $(this).data("translate");
            if (data.hasOwnProperty(key)) {
                return data[key];
            }
        });
    });
    for (var i = langList.length; i--;) {
        $('#langList').text("")
        if (langCode != langList[i]) {
            $.getJSON(`lang/${langList[i]}.json`, function(data) {
                $('#langList').append(`<a class="nav-link" href="#" onClick="setLang('${data.code}');">${data.name}</a>`)
            })
        }
    }
}

function updateTxt() {
    setLang(localStorage.getItem('lang'))
}
