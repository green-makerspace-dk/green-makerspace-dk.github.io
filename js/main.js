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
     INTERNET ARCHIVE ON 17:11:06 Dec 12, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 149.302 (3)
  esindex: 0.008
  captures_list: 167.68
  CDXLines.iter: 12.691 (3)
  PetaboxLoader3.datanode: 219.795 (5)
  exclusion.robots: 0.189
  exclusion.robots.policy: 0.178
  RedisCDXSource: 1.946
  PetaboxLoader3.resolve: 249.243 (3)
  load_resource: 435.18
*/