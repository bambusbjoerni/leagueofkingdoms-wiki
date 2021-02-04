(function($){

    function APPSettings() {
        this.buildingspeed_input = null;
        this.hall_level_input = null;
        this.help_alliance_1_input = null;
        this.help_alliance_2_input = null;
    }

    APPSettings.prototype.init = function() {
        this.buildingspeed_input = $("#buildingspeed_input");
        this.buildingspeed_input.val(APPStorage.getSetting("buildingspeed"));
        this.buildingspeed_input.inputFilter(function(value) {
            return /^(0|[1-9][0-9]{0,2})?$/.test(value);    // Allow digits only, using a RegExp
        }).on("input keydown keyup mousedown mouseup select contextmenu drop", function (ev) {
            APPStorage.changeSetting("buildingspeed", this.value);
            APPBuilding.renderBuildingResult();
        });

        this.help_hall_level = $("#help_hall_level");
        this.help_hall_level.val(APPStorage.getSetting("hall_level"));
        this.help_hall_level.on("change", function () {
            APPStorage.changeSetting("hall_level", this.value);
            APPBuilding.renderBuildingResult();
        });

        this.help_alliance_1_input = $("#help_alliance_1");
        this.help_alliance_1_input.val(APPStorage.getSetting("help_speedup_1"));
        this.help_alliance_1_input.on("change", function () {
            APPStorage.changeSetting("help_speedup_1", this.value);
            APPBuilding.renderBuildingResult();
        });

        this.help_alliance_2_input = $("#help_alliance_2");
        this.help_alliance_2_input.val(APPStorage.getSetting("help_speedup_2"));
        this.help_alliance_2_input.on("change", function () {
            APPStorage.changeSetting("help_speedup_2", this.value);
            APPBuilding.renderBuildingResult();
        });
    };

    window.APPSettings = new APPSettings();

})(jQuery);