(function($){

    $.fn.inputFilter = function(inputFilter) {
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

    function APPHelper() {

    }

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

    window.APPHelper = new APPHelper();

})(jQuery);