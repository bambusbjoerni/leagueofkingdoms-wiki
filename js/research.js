(function ($) {

    function APPResearch() {
        this.selected_tree = "none";
        this.selected_research = "none";
        this.selected_level = "none";
        this.research_data = {};
    }

    APPResearch.prototype.init = function () {
        this.research_tree_select = $("#research_tree_select");
        this.research_tree_select.change(this._researchTreeSelected.bind(this));

        this.research_research_container = $("#research_research_container");
        this.research_research_select = $("#research_research_select");
        this.research_research_select.change(this._researchSelected.bind(this));

        this.research_level_container = $("#research_level_container");
        this.research_level_select = $("#research_level_select");
        this.research_level_select.change(this._researchLevelSelected.bind(this));

        this.research_result_container = $("#research_result_container");

        this.research_result_resources = $("#research_result_resources");
        this.research_result_requirements = $("#research_result_requirements");
        this.research_result_time = $("#research_result_time");
    };

    APPResearch.prototype.renderPath = async function (data) {
        console.log(data);
        switch (data.length) {
            default:

            case 3:
                this.selected_level = data[2];
            case 2:
                this.selected_research = data[1];
            case 1:
                this.selected_tree = data[0];
                this.research_data = await APPStorage.getResearchInfo(this.selected_tree);
            case 0:

        }
        this.render();
    };

    APPResearch.prototype.render = function () {
        let data = [];
        if (this.selected_tree !== "none") {
            data.push(this.selected_tree);
            this.research_tree_select.val(this.selected_tree);
            this._renderResearchTreeSelected();
            if (this.selected_research !== "none") {
                data.push(this.selected_research);
                this.research_research_select.val(this.selected_research);
                this._renderResearchSelected();
                if (this.selected_level !== "none") {
                    data.push(this.selected_level);
                    this.research_level_select.val(this.selected_level);
                    this.renderResearchResult();
                }
            }
        }
        APPRouting.pageChanged("research", data);
    };

    APPResearch.prototype._researchTreeSelected = function () {
        let that = this;
        this.selected_tree = this.research_tree_select.val();
        if (this.selected_tree === "none") {
            this.research_research_container.hide();
            this.research_level_container.hide();
            this.research_result_container.hide();
            APPRouting.pageChanged("research");
            return;
        }
        APPStorage.getResearchInfo(this.selected_tree).done(function (data) {
            that.research_data = data;
            that._renderResearchTreeSelected();
            APPRouting.pageChanged("research", [that.selected_tree]);
        });
    };

    APPResearch.prototype._renderResearchTreeSelected = function () {
        let that = this;
        this.research_research_select.empty();
        this.research_level_container.hide();
        this.research_result_container.hide();
        this.research_research_select.append(new Option(" ", "none"));
        $.each(this.research_data, function (i, d) {
            that.research_research_select.append(new Option(APPHelper.typeToName(i), i));
        });
        this.research_research_container.show();
    };

    APPResearch.prototype._researchSelected = function () {
        let that = this;
        this.selected_research = this.research_research_select.val();
        if (this.selected_research === "none") {
            this.research_level_container.hide();
            this.research_result_container.hide();
            APPRouting.pageChanged("research", [that.selected_tree]);
            return;
        }
        if (this.research_data[this.selected_research].length === 1) {
            this.selected_level = 1;
            APPRouting.pageChanged("research", [this.selected_tree, this.selected_research, this.selected_level]);
        } else {
            APPRouting.pageChanged("research", [this.selected_tree, this.selected_research]);
        }
        this._renderResearchSelected();
        if (this.research_data[this.selected_research].length === 1) {
            this.renderResearchResult();
        }
    };

    APPResearch.prototype._renderResearchSelected = function () {
        let that = this;
        this.research_level_select.empty();
        this.research_level_select.append(new Option(" ", "none"));
        $.each(this.research_data[this.selected_research], function (i, d) {
            that.research_level_select.append(new Option(i + 1, i + 1));
        });
        this.research_level_container.show();
        this.research_result_container.hide();
        if (this.research_data[this.selected_research].length === 1) {
            this.research_level_container.hide();
        }
    };

    APPResearch.prototype._researchLevelSelected = function () {
        this.selected_level = this.research_level_select.val();
        if (this.selected_level === "none") {
            this.research_result_container.hide();
            return;
            APPRouting.pageChanged("research", [this.selected_tree, this.selected_research]);
        }
        APPRouting.pageChanged("research", [this.selected_tree, this.selected_research, this.selected_level]);
        this.renderResearchResult();
    };

    APPResearch.prototype.renderResearchResult = function () {
        let that = this;
        this.research_result_resources.empty();
        this.research_result_requirements.empty();
        this.research_result_time.empty();

        if (this.selected_tree === "none" || this.selected_research === "none" || this.selected_level === "none") {
            console.info("Don't render research results, since no research tree or research or level selected");
            return;
        }
        let research_data = this.research_data[this.selected_research][this.selected_level - 1];

        // RESOURCE REQUIREMENTS
        $.each(research_data["resources"], function (i, resource) {
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
            that.research_result_resources.append(resource_container);
        });

        // BUILDING REQUIREMENTS
        $.each(research_data["requirements"], function (i, requirement) {
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
            that.research_result_requirements.append(requirement_container);
        });

        // TIME
        let seconds = Number(research_data["time"]);
        this._appendTimeBlock(this.research_result_time, seconds, "Base time:");

        let speedup = APPStorage.getSetting("researchspeed");
        let reduced_seconds = Math.ceil(seconds / (1 + (speedup / 100)));
        this._appendTimeBlock(this.research_result_time, reduced_seconds, "Reduced time (" + speedup + "% speedup):");

        let helps = APPHelper.hallToHelps(Number(APPStorage.getSetting("hall_level")));
        let help_seconds = APPHelper.calcHelpTime(reduced_seconds, helps, Number(APPStorage.getSetting("help_speedup_1")), Number(APPStorage.getSetting("help_speedup_2")));
        this._appendTimeBlock(this.research_result_time, help_seconds, "Help time (" + helps + " helps):");

        let final_time = reduced_seconds - help_seconds;
        this._appendTimeBlock(this.research_result_time, final_time, "Time remaining:", "bold");

        this.research_result_container.show();
    };

    APPResearch.prototype._appendTimeBlock = function (container, time, text, cssclass) {
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

    window.APPResearch = new APPResearch();

})(jQuery);