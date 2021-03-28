"use strict";

class ProtonDB {
    static get HOMEPAGE() { return "https://www.protondb.com/"; }
    static get API_SUMMARY() { return "api/v1/reports/summaries/"; }

    static request_summary(appid, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            callback(request);
        }
        request.open("GET", this.HOMEPAGE + this.API_SUMMARY + appid + ".json", true);
        request.send(null);
    }

    static request_rating(appid, callback) {
        chrome.runtime.sendMessage(
            { contentScriptQuery: "queryRating", appid: appid },
            rating => callback(rating)
        );
    }

    static get_rating_container(rating, whitelisted = false) {
        var container = document.createElement("div");

        container.className = "protondb_rating_row " + "steam_row";
        container.title = "As seen by the community of ProtonDB.com";

        var link = document.createElement("a");
        link.className = "protondb_rating_link protondb_rating_" + rating;

        link.href = ProtonDB.HOMEPAGE + "app/" + Steam.get_app_id(window.location.href);
        link.textContent = rating;
        link.target = "_blank"

        if (whitelisted) {
            var star = document.createElement("span");
            star.className = "protondb_rating_whitelisted"
            star.title = "Whitelisted by Valve";
            star.textContent = " ★"

            link.appendChild(star);
        }

        container.appendChild(link);
        return container;
    }
}

class Reports {

    static request_reports(appid, callback) {
        chrome.runtime.sendMessage(
            { contentScriptQuery: "divInformation", appid: appid },
            reports => callback(reports)
        );
    }

    static mapToProp(data, prop) {
        return data
            .reduce((res, item) => Object
                .assign(res, {
                    [item[prop]]: 1 + (res[item[prop]] || 0)
                }), Object.create(null))
            ;
    }

    static get_max_count(jsoncount) {
        let max = 0;
        let key_max = null
        for (let [key, value] of Object.entries(jsoncount)) {
            if (value > max) {
                key_max = key;
            }
        }

        return key_max;
    }

    static get_information_from_reports(reports) {
        console.log(reports[0])
        let useful_reports = reports.filter(rep => {
            return (rep.rating == "Gold" || rep.rating == "Platinum");
        })
        console.log(useful_reports)
        let div_info = {};
        let keys_needed = ["protonVersion", "os", "gpuDriver"];

        for (let k of keys_needed) {
            let count_proton_ver = this.mapToProp(useful_reports, k);
            div_info["mostUsed" + k] = this.get_max_count(count_proton_ver);
        }

        return div_info;

    }
}