(function($){
    $(document).ready(function() {
        APPStorage.init();
        APPSettings.init();
        APPBuilding.init();
        document.buildings = {};

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