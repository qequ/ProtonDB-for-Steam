class Steam {
    // Return a games appid from the url
    static get_app_id(url) {
        var appid = url.match(/\/(app)\/([0-9]{1,7})/);

        return parseInt(appid[2], 10);
    }

    // Insert the ProtonDB rating below DEVELOPER/PUBLISHER
    static insert_rating(rating, whitelisted = false) {
        var element = document.querySelector(".user_reviews");
        var subtitle = document.createElement("div");
        subtitle.className = "subtitle column'";
        subtitle.textContent = "ProtonDB Rating:";
        var container = ProtonDB.get_rating_container(rating, whitelisted);
        container.prepend(subtitle);

        if (element) {
            element.append(container);
        }
    }

    // append to the right column the data
    static insert_additional_info(div_data, appid) {
        let element = document.getElementsByClassName("rightcol game_meta_data")[0];
        let block_data = document.createElement("div");

        if (div_data["mostUsedprotonVersion"] === div_data["mostUsedos"] && div_data["mostUsedos"] === div_data["mostUsedgpuDriver"]) {
            //i.e all the fields are nill - redirect to the protondb page
            let a_tag = document.createElement("a");
            a_tag.href = "https://www.protondb.com/app/" + appid;
            let p_tag = document.createElement("p");
            p_tag.textContent = "Couldn't find enough info. Check the ProtonDB Page";
            block_data.append(p_tag);
            block_data.append(a_tag);

        }
        else {
            // add divs with os, proton version and gpudriver
            let div_rows = document.createElement("div");

            for (let key in div_data) {
                let p_row = document.createElement("p");
                let span_data = document.createElement("span");
                span_data.textContent = key.slice(8) + ":"; // removing "mostUsed"
                let b_data = document.createElement("b");
                b_data.textContent = div_data[key];
                p_row.append(span_data);
                p_row.append(b_data);

                div_rows.append(p_row);
            }
            block_data.append(div_rows);
        }

        element.prepend(block_data);

    }
}

// Main
var appid = Steam.get_app_id(window.location.href);

if (document.querySelector("span.platform_img.linux") === null) {

    ProtonDB.request_rating(appid, (rating) => {
        if (rating == "pending") {
            Steam.insert_rating("Awaiting reports!");
        } else {
            Steam.insert_rating(rating, whitelist.includes(appid) ? true : false);
        }
    });

    fetch("https://protondb.max-p.me/games/" + appid + /reports/)
        .then(response => {
            return response.json();
        }).then(data => {
            let div_data = Reports.get_information_from_reports(data);
            Steam.insert_additional_info(div_data);
        })
} else {
    Steam.insert_rating("native");
}
