load();
function load() {
    chrome.storage.sync.get(null, function (items) {
        var an = "";
        for (var id in items) {
            an += "<option value='" + items[id] + "'>" + items[id] + "</option>";
        }
        document.getElementById('instance').innerHTML = an;
    });
}

function check(_url) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open("GET", _url, false);  //同期モード
    xhr.send(null);
    return xhr.status;
}
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("addlistbtn").addEventListener("click", function () {
        var addInstanceurl = document.getElementById("addlist").value;
        var checkUrl = "https://" + document.getElementById("addlist").value + "/api/v1/instance";
        try {
            if (check(checkUrl) == 200) {
                var option = document.createElement("option");
                option.value = addInstanceurl;
                option.text = addInstanceurl;
                chrome.storage.sync.get(null, function (items) {
                    var size = 0;
                    for (var prop in items) {
                        if (items.hasOwnProperty(prop)) {
                            size++;
                        }
                    }
                    chrome.storage.sync.set({ [size]: addInstanceurl }, function () {
                    });
                });
                var target = document.getElementsByName("instance")[0];
                target.add(option);
            } else {
                msg="<div class=\"alert alert-danger error\" role=\"alert\">マストドンインスタンス(v1.6.0以上)ではありません</div>";
                document.getElementById('error').innerHTML = msg;
            }
        }catch (e){
            msg="<div class=\"alert alert-danger error\" role=\"alert\">不正なアドレスです</div>";
            document.getElementById('error').innerHTML = msg;
        }
        
    });

    document.getElementById("Toot").addEventListener("click", function () {
        var text = document.getElementById("contents").value;
        var instanceUrl = document.getElementById("instance").value;
        var openUrl = encodeURIComponent(text);
        window.open("https://" + instanceUrl + "/share?text=" + openUrl, '_blank');
    });
    document.getElementById("del").addEventListener("click", function () {
        chrome.storage.sync.clear()
        load();
    });
});

