(function ($) {

    function APPStorage() {
        this.settings = {
            buildingspeed: 0,
            researchspeed: 0,
            hall_level: 1,
            help_speedup_1: 0,
            help_speedup_2: 0
        };
        this.buildings = {};
        this.research = {};

    }

    APPStorage.prototype.init = function () {
        let buildingspeed = localStorage.getItem("buildingspeed");
        if (buildingspeed) {
            this.settings.buildingspeed = buildingspeed;
        }
        let researchspeed = localStorage.getItem("researchspeed");
        if (researchspeed) {
            this.settings.researchspeed = researchspeed;
        }
        let hall_level = localStorage.getItem("hall_level");
        if (hall_level) {
            this.settings.hall_level = hall_level;
        }
        let help_speedup_1 = localStorage.getItem("help_speedup_1");
        if (help_speedup_1) {
            this.settings.help_speedup_1 = help_speedup_1;
        }
        let help_speedup_2 = localStorage.getItem("help_speedup_2");
        if (hall_level) {
            this.settings.help_speedup_2 = help_speedup_2;
        }
    };

    APPStorage.prototype.changeSetting = function (item, value) {
        if (!(item in this.settings)) {
            console.error("Settings " + item + "not changeable.");
            return false;
        }
        this.settings[item] = value;
        localStorage.setItem(item, value);
        return true;
    };

    APPStorage.prototype.getSetting = function (item) {
        if (!(item in this.settings)) {
            console.error("Settings " + item + " not gettable.");
            return false;
        }
        return this.settings[item];
    };

    APPStorage.prototype.clearLocalStorage = function () {
        localStorage.clear();
    };

    APPStorage.prototype.getBuildingInfo = function (building) {
        let deferred = $.Deferred();
        let that = this;
        if (building in this.buildings) {
            deferred.resolve(this.buildings[building])
        } else {
            $.getJSON("buildings/" + building + ".json", function (data) {
                that.buildings[building] = data;
                deferred.resolve(data);
            });
        }
        return deferred.promise();
    };

    APPStorage.prototype.getResearchInfo = function (tree) {
        let deferred = $.Deferred();
        let that = this;
        if (tree in this.research) {
            deferred.resolve(this.research[tree])
        } else {
            $.getJSON("research/" + tree + ".json", function (data) {
                that.research[tree] = data;
                deferred.resolve(data);
            });
        }
        return deferred.promise();
    };

    window.APPStorage = new APPStorage();

})(jQuery);