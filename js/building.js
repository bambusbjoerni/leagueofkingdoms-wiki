(function ($) {

    function APPBuilding() {
        this.selected_building = "none";
        this.selected_level = "none";
        this.building_data = {};
    }

    APPBuilding.prototype.init = function () {
        this.building_select = $("#building_select");
        this.building_select.change(this._buildingSelected.bind(this));

        this.building_level_container = $("#building_level_container");
        this.building_level_select = $("#building_level_select");
        this.building_level_select.change(this._buildingLevelSelected.bind(this));

        this.building_result_container = $("#building_result_container");

        this.building_result_resources = $("#building_result_resources");
        this.building_result_requirements = $("#building_result_requirements");
        this.building_result_time = $("#building_result_time");
    };

    APPBuilding.prototype.renderPath = async function (data) {
        switch (data.length) {
            default:

            case 2:
                this.selected_level = data[1];
            case 1:
                this.selected_building = data[0];
                this.building_data = await APPStorage.getBuildingInfo(this.selected_building);
            case 0:

        }
        this.render();
    };

    APPBuilding.prototype.render = function () {
        let data = [];
        if (this.selected_building !== "none") {
            data.push(this.selected_building);
            this.building_select.val(this.selected_building);
            this._renderBuildingSelected();
            if (this.selected_level !== "none") {
                data.push(this.selected_level);
                this.building_level_select.val(this.selected_level);
                this.renderBuildingResult();
            }
        }
        APPRouting.pageChanged("building", data);
    };

    APPBuilding.prototype._buildingSelected = function () {
        let that = this;
        this.selected_building = this.building_select.val();
        this.building_level_select.empty();
        if (this.selected_building === "none") {
            this.building_level_container.hide();
            this.building_result_container.hide();
            APPRouting.pageChanged("building");
            return;
        }
        this.building_result_container.hide();
        APPStorage.getBuildingInfo(this.selected_building).done(function (data) {
            that.building_data = data;
            that._renderBuildingSelected();
            APPRouting.pageChanged("building", [that.selected_building]);
        })
    };

    APPBuilding.prototype._renderBuildingSelected = function () {
        let that = this;
        this.building_level_select.append(new Option(" ", "none"));
        $.each(this.building_data, function (i, d) {
            if (d.valid) {
                that.building_level_select.append(new Option(i, i));
            }
        });
        this.building_level_container.show();
    };

    APPBuilding.prototype._buildingLevelSelected = function () {
        this.selected_level = this.building_level_select.val();
        if (this.selected_level === "none") {
            this.building_result_container.hide();
            APPRouting.pageChanged("building", [this.selected_building]);
            return;
        }
        APPRouting.pageChanged("building", [this.selected_building, this.selected_level]);
        this.renderBuildingResult();
    };

    APPBuilding.prototype.renderBuildingResult = function () {
        let that = this;
        this.building_result_resources.empty();
        this.building_result_requirements.empty();
        this.building_result_time.empty();

        if (this.selected_building === "none" || this.selected_level === "none") {
            console.info("Don't render building results, since no building or level selected");
            return;
        }
        let building_data = this.building_data[this.selected_level];

        // RESOURCE REQUIREMENTS
        $.each(building_data["resources"], function (i, resource) {
            let resource_container = $("<div></div>", {
                class: "resource_container flex_row justify_between"
            }).css({
                "background-image": "url(sprites/" + resource["type"] + ".png)"
            });
            resource_container.append($("<span></span>", {
                text: APPHelper.typeToName(resource["type"])
            }));
            resource_container.append($("<span></span>", {
                text: APPHelper.numberWithCommas(resource["value"])
            }));
            that.building_result_resources.append(resource_container);
        });

        // BUILDING REQUIREMENTS
        $.each(building_data["requirements"], function (i, requirement) {
            let requirement_container = $("<div></div>", {
                class: "requirement_container"
            });
            requirement_container.append(jQuery("<img>", {
                src: "sprites/" + requirement["type"] + ".png"
            }));
            requirement_container.append(jQuery("<div></div>", {
                text: APPHelper.typeToName(requirement["type"])
            }));
            requirement_container.append(jQuery("<div></div>", {
                text: "Level " + requirement["level"]
            }));
            that.building_result_requirements.append(requirement_container);
        });

        // TIME
        let seconds = Number(building_data["time"]);
        this._appendTimeBlock(this.building_result_time, seconds, "Base time:");

        let speedup = APPStorage.getSetting("buildingspeed");
        let reduced_seconds = Math.ceil(seconds / (1 + (speedup / 100)));
        this._appendTimeBlock(this.building_result_time, reduced_seconds, "Reduced time (" + speedup + "% speedup):");

        let helps = APPHelper.hallToHelps(Number(APPStorage.getSetting("hall_level")));
        let help_seconds = APPHelper.calcHelpTime(reduced_seconds, helps, Number(APPStorage.getSetting("help_speedup_1")), Number(APPStorage.getSetting("help_speedup_2")));
        this._appendTimeBlock(this.building_result_time, help_seconds, "Help time (" + helps + " helps):");

        let final_time = reduced_seconds - help_seconds;
        this._appendTimeBlock(this.building_result_time, final_time, "Time remaining:", "bold");

        this.building_result_container.show();
    };

    APPBuilding.prototype._appendTimeBlock = function (container, time, text, cssclass) {
        let d = Math.floor(time / (3600 * 24));
        let h = Math.floor(time % (3600 * 24) / 3600);
        let m = Math.floor(time % 3600 / 60);
        let s = Math.floor(time % 60);
        let block_container = $("<div></div>", {
            class: "time_block_container flex_row justify_between"
        });
        block_container.append($("<span></span>", {
            text: text
        })).append($("<span></span>", {
            text: APPHelper.prefixZeroIfRequired(d) + "d " + APPHelper.prefixZeroIfRequired(h) + ":" + APPHelper.prefixZeroIfRequired(m) + ":" + APPHelper.prefixZeroIfRequired(s)
        }).addClass(cssclass));
        container.append(block_container);
    };

    window.APPBuilding = new APPBuilding();

})(jQuery);