(function($){
    $(document).ready(function() {
        $.fn.inputFilter = APPHelper.inputFilter;
        APPStorage.init();
        APPSettings.init();
        APPBuilding.init();
        APPResearch.init();

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