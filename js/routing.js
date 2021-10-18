(function ($) {

    function APPRouting() {
    }

    APPRouting.prototype.init = function () {
        window.addEventListener('popstate', this._popEvent.bind(this));

        $("#settings").on("click", (function (ev) {
            let that = this;
            console.log(this);
            let target = $(ev.currentTarget);
            $("#overlays").show(0, function () {
                $("#settings_overlay").addClass("overlay_show");
                that._scrolling(false);
            });
        }).bind(this));

        $(".close_overlay").on("click", (function (ev) {
            let target = $(ev.currentTarget);
            $("#settings_overlay").removeClass("overlay_show");
            this._scrolling(true);
            setTimeout(function () {
                $("#overlays").hide();
            }, 350);
        }).bind(this));

        $("#menu > div").on("click", (function (ev) {
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
        $("#menu > div").removeClass("selected");
        $(`#menu > div[data-tab="${target}"]`).addClass("selected");
        $("#tabs > div").hide();
        $("#" + target + "_tab").show();
    };

    APPRouting.prototype.route = function () {
        let hash = window.location.hash;
        if (!hash.startsWith("#!")) {
            return;
        }
        hash = hash.substring(2, hash.length);
        let hash_split = hash.split("/");
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
        data.unshift(page);
        let new_hash = "#!" + data.join("/");
        if (window.location.hash !== new_hash) {
            window.history.pushState(null, null, new_hash);
        }
        //window.location.hash = ;
    };

    APPRouting.prototype._scrolling = function(scroll) {
        if (scroll) {
            $("body").removeClass("stop-scrolling").unbind("touchmove");
        } else {
            $("body").addClass("stop-scrolling").bind("touchmove", function(e){e.preventDefault()});
        }
    };

    APPRouting.prototype._popEvent = function (ev) {
        this.route();
    };

    window.APPRouting = new APPRouting();

})(jQuery);