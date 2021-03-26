"use strict";
/*
browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.contentScriptQuery == "divInformation") {
            let url = "https://protondb.max-p.me/games/" + request.appid + /reports/;
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        sendResponse({});
                    }
                    return response.json();
                })
                .then(data => sendResponse(data))
                .catch(error => console.log(error))

            return true;

        }
    }
);
*/
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.contentScriptQuery == "queryRating") {
            var url = "https://www.protondb.com/" + "api/v1/reports/summaries/" + request.appid + ".json";

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        if (response.status == 404) {
                            sendResponse("pending");
                        }
                        throw Error(response.status);
                    }

                    return response.json();
                })
                .then(data => sendResponse(data.tier))
                .catch(error => console.log(error))

            return true;
        }
    }
);
