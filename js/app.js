(function ($) {
    $(document).ready(function () {
        $.fn.inputFilter = APPHelper.inputFilter;
        APPStorage.init();
        APPSettings.init();
        APPBuilding.init();
        APPResearch.init();
        APPRouting.init();

    })
})(jQuery);