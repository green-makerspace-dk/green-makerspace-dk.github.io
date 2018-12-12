(function() {

    $('[data-action]').on('click', function (event) {
        var action = this.getAttribute('data-action');
        click_actions[action].call(this, event);
    });

    var click_actions = {
        admin_delete : function (event) {
            if (!confirm('Are you sure you want to delete this member?')) {
                event.preventDefault();
                return false;
            }
        },

        select_enable : function (event) {
            var parent = $(this).parent();
            if (parent.hasClass('select-disabled')) {
                parent.removeClass('select-disabled');
                parent.find('select').removeAttr('disabled');
            } else {
                parent.addClass('select-disabled');
                parent.find('select').attr('disabled', 'disabled');
            }
        }
    }

    var load_actions = [
        function check_enables () {
            $('[data-action="select_enable"]').each(function (argument) {
                var c = $(this);
                var parent = c.parent();

                if (c.prop('checked')) {
                    parent.addClass('select-disabled');
                    parent.find('select').attr('disabled', 'disabled');
                } else {
                    // if (parent.hasClass('select-disabled')) {};
                    parent.removeClass('select-disabled');
                    parent.find('select').removeAttr('disabled');
                }
            });
        }
    ]

    $.each(load_actions, function () {
        this.call();
    });

}());
/*
     FILE ARCHIVED ON 03:45:20 Sep 01, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 17:00:47 Dec 12, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 142.678 (3)
  esindex: 0.011
  captures_list: 192.966
  CDXLines.iter: 17.461 (3)
  PetaboxLoader3.datanode: 306.547 (5)
  exclusion.robots: 0.277
  exclusion.robots.policy: 0.26
  RedisCDXSource: 26.996
  PetaboxLoader3.resolve: 292.378 (3)
  load_resource: 530.089
*/