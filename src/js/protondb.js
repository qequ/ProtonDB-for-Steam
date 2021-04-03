"use strict";

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