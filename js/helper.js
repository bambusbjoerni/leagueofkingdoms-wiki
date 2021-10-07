(function($){

    function APPHelper() {}

    APPHelper.prototype.hallToHelps = function(hall_level) {
        switch (hall_level) {
            case 1:
            case 2:
                return 10;
            case 3:
            case 4:
                return 11;
            case 5:
            case 6:
                return 12;
            case 7:
            case 8:
                return 13;
            case 9:
            case 10:
                return 14;
            case 11:
            case 12:
                return 15;
            case 13:
            case 14:
                return 16;
            case 15:
            case 16:
                return 17;
            case 17:
            case 18:
                return 18;
            case 19:
            case 20:
                return 19;
            case 21:
            case 22:
                return 20;
            case 23:
            case 24:
                return 21;
            case 25:
            case 26:
                return 22;
            case 27:
            case 28:
                return 23;
            case 29:
                return 24;
            case 30:
                return 25;
        }
    };

    APPHelper.prototype.typeToName = function (type) {
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
            case "castle":
                return "Castle";
            case "academy":
                return "Academy";
            case "treasure_house":
                return "Treasure house";
            case "hospital":
                return "Hospital";
            case "hall_of_alliance":
                return "Hall of alliance";
            case "storage":
                return "Storage";
            case "trading_post":
                return "Trading post";
            case "wall":
                return "Wall";
            case "watch_tower":
                return "Watch tower";
            case "barrack":
                return "Barrack";
            case "farm":
                return "Farm";
            case "lumber_camp":
                return "Lumber camp";
            case "quarry":
                return "Quarry";
            case "gold_mine":
                return "Gold mine";
            case "infantry_hp_1":
                return "Infantry HP 1";
            case "archery_hp_1":
                return "Archery HP 1";
            case "cavalry_hp_1":
                return "Cavalry HP 1";
            case "infantry_def_1":
                return "Infantry Defense 1";
            case "archery_def_1":
                return "Archery Defense 1";
            case "cavalry_def_1":
                return "Cavalry Defense 1";
            case "infantry_atk_1":
                return "Infantry Attack 1";
            case "archery_atk_1":
                return "Archery Attack 1";
            case "cavalry_atk_1":
                return "Cavalry Attack 1";
            case "infantry_spd_1":
                return "Infantry Speed 1";
            case "archery_spd_1":
                return "Archery Speed 1";
            case "cavalry_spd_1":
                return "Cavalry Speed 1";
            case "troops_load":
                return "Troops load";
            case "warrior":
                return "Warrior (T2)";
            case "longbow_man":
                return "Longbow man (T2)";
            case "horseman":
                return "Horseman (T2)";
            case "infantry_training_rate":
                return "Infantry Training Rate";
            case "archery_training_rate":
                return "Archery Training Rate";
            case "cavalry_training_rate":
                return "Cavalry Training Rate";
            case "infantry_training_speed":
                return "Infantry Training Speed";
            case "archery_training_speed":
                return "Archery Training Speed";
            case "cavalry_training_speed":
                return "Cavalry Training Speed";
            case "infantry_training_cost":
                return "Infantry Training Cost";
            case "archery_training_cost":
                return "Archery Training Cost";
            case "cavalry_training_cost":
                return "Cavalry Training Cost";
            case "march_size":
                return "Marching troop capacity";
            case "march_limit":
                return "Troop dispatch queue";
            case "knight":
                return "Knight (T3)";
            case "ranger":
                return "Ranger (T3)";
            case "heavy_cavalry":
                return "Heavy cavalry (T3)";
            default:
                return "ERROR: NOSTRING";
        }
    };

    APPHelper.prototype.numberWithCommas = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    APPHelper.prototype.calcHelpTime = function (time, helps, alliance_help1, alliance_help2) {
        let help_time = 0;
        let remaining = time;
        for (let help = 0; help < helps; help++) {
            // speedup is 1% of remaining time
            let speedup = Math.floor(remaining * 0.01);
            speedup = speedup === 0 ? ++speedup : speedup;
            speedup += alliance_help1 * 10 + alliance_help2 * 10;
            help_time += speedup;
            remaining -= speedup;
            if (remaining <= 0) {
                return time;
            }
        }
        return help_time;
    };

    APPHelper.prototype.prefixZeroIfRequired = function(number) {
        return (String(number).length < 2 ? "0" + number : number)
    };

    APPHelper.prototype.inputFilter = function(inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };

    window.APPHelper = new APPHelper();

})(jQuery);