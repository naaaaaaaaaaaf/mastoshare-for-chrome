document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("getsite").addEventListener("click", function () {
        chrome.windows.getCurrent(function (window) {
            chrome.tabs.getSelected(window.id, function (tab) {
                var url = tab.url;
                var title = tab.title;
                var Re = "";
                var now = document.getElementById("contents").value;
                if (now == "") {
                    Re = title + "\n" + url;
                } else {
                    Re = now + "\n" + title + "\n\n" + url;
                }
                document.getElementById("contents").value = Re;
            });
        });
    });
});