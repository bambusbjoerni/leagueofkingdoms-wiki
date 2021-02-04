(function($){
    $(document).ready(function() {
        document.buildings = {};

        let level_container = $("#level_container");
        let result_container = $("#result_container");
        let building_select = $("#building");
        let level_select = $("#level");

        let result_resources = $("#result_resources");
        let result_requirements = $("#result_requirements");
        let result_time = $("#result_time");

        let selectBuilding = function () {
            let building = building_select.val();
            level_select.empty();
            if (building === "none"){
                level_container.hide();
                return;
            }
            result_container.hide();
            if (building in document.buildings) {
                fillLevelSelect(building);
            } else {
                $.getJSON("buildings/" + building + ".json",function (data) {
                    console.log(data);
                    document.buildings[building] = data;
                    fillLevelSelect(building)
                });
            }
        };

        let fillLevelSelect = function (building) {
            level_select.append(new Option(" ", "none"));
            $.each(document.buildings[building], function(i, d) {
                if (d.valid) {
                    level_select.append(new Option(i, i));
                    console.log(i, d);
                }
            });
            level_container.show();

        };

        let selectLevel = function () {
            let building = building_select.val();
            let level = level_select.val();

            let building_data = document.buildings[building][level];
            fillBuildingResults(building_data);

        };

        let fillBuildingResults = function (building_data) {
            result_resources.empty();
            result_requirements.empty();
            result_time.empty();

            // RESOURCE REQUIREMENTS
            $.each(building_data["resources"], function (i, resource) {
                let resource_container = $("<div></div>", {
                    class: "resource_container"
                }).css({
                    "background-image": "url(sprites/" + resource["type"] + ".png)"
                });
                resource_container.append($("<span></span>", {
                    text: typeToName(resource["type"])
                }));
                resource_container.append($("<span></span>", {
                    text: resource["value"].toLocaleString()
                }));
                result_resources.append(resource_container);
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
                    text: "Level " + requirement["level"]
                }));
                result_requirements.append(requirement_container);
            });

            // TIME
            let seconds = Number(building_data["time"]);
            appendTimeBlock(result_time, seconds, "Base time:");

            let speedup = 38;
            let reduced_seconds = seconds / (1 + (speedup / 100));
            appendTimeBlock(result_time, reduced_seconds, "Reduced time (" + speedup + "% speedup):");

            let helps = 22;
            let help_seconds = calcHelpTime(reduced_seconds, helps, 10, 10);
            appendTimeBlock(result_time, help_seconds, "Help time (" +helps + "helps):");

            let final_time = reduced_seconds - help_seconds;
            appendTimeBlock(result_time, final_time, "Time remaining:");

            result_container.show();
        };

        let appendTimeBlock = function(container, time, text) {
            let d = Math.floor(time / (3600 * 24));
            let h = Math.floor(time % (3600 * 24) / 3600);
            let m = Math.floor(time % 3600 / 60);
            let s = Math.floor(time % 60);
            let block_container = $("<div></div>", {
                class: "time_block_container"
            });
            block_container.append($("<span></span>", {
                text: text
            })).append($("<span></span>", {
                text: prefixZeroIfRequired(d) + "d " + prefixZeroIfRequired(h) + ":" + prefixZeroIfRequired(m) + ":" + prefixZeroIfRequired(s)
            }));
            result_time.append(block_container);
        };

        let prefixZeroIfRequired = function(number) {
            return (String(number).length < 2 ? "0" + number : number)
        };

        let calcHelpTime = function (time, helps, alliance_help1, alliance_help2) {
            let help_time = 0;
            let remaining = time;
            for (let help = 0; help < helps; help++) {
                // speedup is 1% of remaining time
                let speedup = Math.floor(remaining * 0.01);
                speedup += alliance_help1 * 10 + alliance_help2 * 10;
                help_time += speedup;
                remaining -= speedup;
            }
            return help_time;
        };

        let typeToName = function (type) {
            switch(type) {
                case "food":
                    return "Food";
                case "lumber":
                    return "Lumber";
                case "stone":
                    return "Stone";
                case "gold":
                    return "Gold";
                case "alliance_badge":
                    return "Alliance badge";
                case "golden_pillar":
                    return "Golden pillar";
                default:
                    return "ERROR: NOSTRING";
            }
        };

        building_select.change(selectBuilding);
        level_select.change(selectLevel);


        $("#heading > div").on("click", (function(ev) {
            let target = $(ev.currentTarget);
            if (target.hasClass("selected")) {
                return;
            }
            $("#heading > div").removeClass("selected");
            target.addClass("selected");
            $("#tabs > div").hide();
            $("#" + target.data("tab") + "_tab").show();

        }));

    })
})(jQuery);