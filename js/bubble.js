$(function () {
    $('.bubbleInfo').each(function () {
        var distance = 30;
        var time = 250;
        var hideDelay = 50;

        var hideDelayTimer = null;

        var beingShown = false;
        var shown = false;
        var trigger = $('.trigger', this);
        var info = $('.popup', this).css('opacity', 0);

        $([trigger.get(0), info.get(0)]).mouseover(function () {
            if (hideDelayTimer) clearTimeout(hideDelayTimer);
            if (beingShown || shown) {
                // don't trigger the animation again
                return;
            } else {
                // reset position of info box
                beingShown = true;

                info.css({
                    //top: -40,
                    //left: 20,
                    display: 'block'
                }).animate({
                    //top: '-=' + distance + 'px',
                    opacity: 1
                }, time, 'swing', function() {
                    beingShown = false;
                    shown = true;
                });
            }
            return false;
        }).mouseout(function () {
            if (hideDelayTimer) clearTimeout(hideDelayTimer);
            hideDelayTimer = setTimeout(function () {
                hideDelayTimer = null;
                info.animate({
                    //top: '+=' + distance + 'px',
                    opacity: 0
                }, time, 'swing', function () {
                    shown = false;
                    info.css('display', 'none');
                });
            }, hideDelay);

            return false;
        });
    });
});

$(function () {
    $('.textInfo').each(function () {
        var distance = 30;
        var time = 250;
        var hideDelay = 50;

        var hideDelayTimer = null;

        var beingShown = false;
        var shown = false;
        var trigger = $('.trigger2', this);
        var info = $('.popup2', this).css('opacity', 0);

        $([trigger.get(0), info.get(0)]).mouseover(function () {
            if (hideDelayTimer) clearTimeout(hideDelayTimer);
            if (beingShown || shown) {
                // don't trigger the animation again
                return;
            } else {
                // reset position of info box
                beingShown = true;

                info.css({
                    //top: -40,
                    //left: 20,
                    display: 'block'
                }).animate({
                    //top: '-=' + distance + 'px',
                    opacity: 1
                }, time, 'swing', function() {
                    beingShown = false;
                    shown = true;
                });
            }
            return false;
        }).mouseout(function () {
            if (hideDelayTimer) clearTimeout(hideDelayTimer);
            hideDelayTimer = setTimeout(function () {
                hideDelayTimer = null;
                info.animate({
                    //top: '+=' + distance + 'px',
                    opacity: 0
                }, time, 'swing', function () {
                    shown = false;
                    info.css('display', 'none');
                });
            }, hideDelay);

            return false;
        });
    });
});