(function ($) {

    function APPRouting() {
    }

    APPRouting.prototype.init = function () {
        window.addEventListener('popstate', this._popEvent.bind(this));

        $("#heading > div").on("click", (function (ev) {
            let target = $(ev.currentTarget);
            if (target.hasClass("selected")) {
                return;
            }
            let tab = target.data("tab");
            switch (tab) {
                case "research":
                    APPResearch.render();
                    break;
                case "building":
                    APPBuilding.render();
                    break;
                default:
                //this.pageChanged(tab);
            }
            this.switchTab(tab);

        }).bind(this));

        this.route();
    };

    APPRouting.prototype.switchTab = function (target) {
        $("#heading > div").removeClass("selected");
        $(`#heading > div[data-tab="${target}"]`).addClass("selected");
        $("#tabs > div").hide();
        $("#" + target + "_tab").show();
    };

    APPRouting.prototype.route = function () {
        let hash = window.location.hash;
        if (!hash.startsWith("#!")) {
            return;
        }
        console.log(hash);
        hash = hash.substring(2, hash.length);
        let hash_split = hash.split("/");
        console.log(hash_split);
        $("#heading > div").removeClass("selected");
        let page = hash_split.shift();
        switch (page) {
            case "research":
                APPResearch.renderPath(hash_split);
                break;
            case "building":
                APPBuilding.renderPath(hash_split);
                break;
            default:
                return;
        }
        this.switchTab(page)
    };

    APPRouting.prototype.pageChanged = function (page, data = []) {
        console.log(window.location);
        let new_hash = "#!" + page + "/" + data.join("/");
        console.log(window.location.hash);
        console.log(new_hash);
        if (window.location.hash !== new_hash) {
            console.log("lol");
            window.history.pushState(null, null, new_hash);
        }
        //window.location.hash = ;
    };

    APPRouting.prototype._popEvent = function (ev) {
        this.route();
    };

    window.APPRouting = new APPRouting();

})(jQuery);