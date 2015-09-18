;(function(){
	function setEqualHeight(columns) {
	    var tallestcolumn = 0;

	    columns.each(function() {
	        currentHeight = $(this).height();
	        if(currentHeight > tallestcolumn) {
	            tallestcolumn  = currentHeight;
	            }
	        }
	    );

		columns.height(tallestcolumn);
	}

	var delay = (function(){
		var timer = 0;
		
		return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		};
	})();

	var app = {
		init: function(){
			// Smooth scroll and auto close the menu
			$('a[href^="#"]').bind('click.smoothscroll',function (e) {
				e.preventDefault();

				var target = this.hash,
				$target = $(target);

				if($target.offset() == undefined) return;

				$('html, body').stop().animate({
					'scrollTop': $target.offset().top-0
				}, 900, 'swing').promise().done(function(){
					if($('body').hasClass('auto-close-menu') && $('.menu-open').length > 0){
						$('#menuToggle, #menuToggleLeft').click();
					}
					window.location.hash = target;
				});
			});

			// Menu settings default
			$('#menuToggle, .menu-close').on('click', function(){
				$('#menuToggle').toggleClass('active');
				$('body').toggleClass('body-push-toleft');
				$('#theMenu').toggleClass('menu-open');
			});

			// Menu settings for displaying the menu on the left
			$('#menuToggleLeft, .menu-close-left').on('click', function(){
				$('#menuToggle').toggleClass('active');
				$('body').toggleClass('body-push-toright');
				$('#theMenu').toggleClass('menu-open');
			});

			// Scrollable menu on small devices
			$(window).bind("load resize", function(){
				if($(window).height() < 400){
					$(".menu").css("overflow-y","scroll");
				}
				else {
					$(".menu").css("overflow-y","hidden");
				}
			});

			// Preload the fullscreen images
			$('.fullscreen-image:not(:first)').each(function(){
				var img = $('<img />'),
					bgSrc = $(this).css('backgroundImage').match(/[^\(]+\.(gif|jpg|jpeg|png)/g);

				if(bgSrc && bgSrc.length){
					img.attr('src', bgSrc[0]);
				}
			});

			$(document).on('animating.slides', function(a){
				// Fittxt
				setTimeout(function(){
					$('.fittext').fitText(0.78, { minFontSize: '40px', maxFontSize: '100px' });
					$('.hugetext').fitText(0.5, { minFontSize: '100px', maxFontSize: '180px' });
					$('.fitticker').fitText(2, { minFontSize: '16px', maxFontSize: '50px' });
				}, 100)
			});

			$('.fittext').fitText(0.78, { minFontSize: '40px', maxFontSize: '100px' });
			$('.hugetext').fitText(0.5, { minFontSize: '100px', maxFontSize: '180px' });
			$('.fitticker').fitText(2, { minFontSize: '16px', maxFontSize: '50px' });

			// Superslides fullscreen slider
			$('#slides').superslides({
				animation: 'fade' // Choose between slide or fade
			});

			// Sudoslider services slider
			$("#services-slider").sudoSlider({
				customLink:'a.servicesLink',
				speed: 400,
				responsive: true,
				prevNext: true,
				prevHtml: '<a href="#" class="services-arrow-prev"><i class="icon-angle-left"></i></a>', 
				nextHtml: '<a href="#" class="services-arrow-next"><i class="icon-angle-right"></i></a>', 
				useCSS: true,
				continuous: true,
				updateBefore: true
			});

			// Sudoslider quote slider
			$("#quote-slider").sudoSlider({
				customLink:'a.quoteLink',
				speed: 400,
				responsive: true,
				prevNext: true, // Set this to false if you only want to show one quote
				prevHtml: '<a href="#" class="quote-arrow-prev"><i class="icon-angle-left"></i></a>', 
				nextHtml: '<a href="#" class="quote-arrow-next"><i class="icon-angle-right"></i></a>', 
				useCSS: true,
				continuous: true,
				updateBefore: true
			});

			// Sudoslider contact slider
			$("#contact-slider").sudoSlider({
				customLink:'a.contactLink',
				speed: 400,
				responsive: true,
				prevNext: false,
				useCSS: false, // Better performance for this slider
				continuous: false,
				updateBefore: true
			});

			// Sudoslider portfolio slider
			$("#portfolio-slider").sudoSlider({
				customLink:'a.portfolioLink',
				speed: 400,
				numeric: true,
				responsive: true,
				prevNext: true,
				prevHtml: '<a href="#" class="portfolio-arrow-prev"><i class="icon-angle-left"></i></a>', 
				nextHtml: '<a href="#" class="portfolio-arrow-next"><i class="icon-angle-right"></i></a>', 
				useCSS: true,
				continuous: true,
				updateBefore: true
			});

			// Mixitup
			$('#portfolio-grid').mixitup({
				onMixStart: function(a){
					$('#filter-container').addClass('filtered');
				}
			});

			// Magnific popup for images
			$('.popup').magnificPopup({ 
			type: 'image',
			fixedContentPos: false,
			mainClass: 'mfp-with-zoom',
				zoom: {
					enabled: true,
					duration: 300,
					easing: 'ease-in-out', 
					opener: function(openerElement) {
						return openerElement.is('img') ? openerElement : openerElement.find('img');
					}
				}
			});
			
			// Magnific popup for soundcloud
			$('.popup-soundcloud').magnificPopup({ 
				type: 'iframe',
				mainClass: 'soundcloud-popup',
				fixedContentPos: false
			});

			// Magnific popup for videos
			$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
				disableOn: 700,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				fixedContentPos: false
			});

			// Contact form
			$('#contact').submit(function(e) {
				e.preventDefault();

				$.ajax({
					url: 'inc/contact.php',
					data: 'name='+ escape($('#contactName').val()) +'&email=' + escape($('#contactEmail').val()) + '&phone=' + escape($('#contactPhone').val()) + '&message='+escape($('#contactMessage').val()),
					dataType: 'json',
					success: function(resp) {
						$('#contactName, #contactEmail, #contactMessage').removeClass('error');

						if(resp.success == 1){
							$('#modalContent').text(resp.message);
							$('#modal, #modalOverlay').fadeIn(500);

							$('#contactName, #contactEmail, #contactMessage, #contactPhone').val('');
						}
						else {
							if(resp.errorCode == 1){
								$('#contactName').addClass('error').focus();
							}
							else if(resp.errorCode == 2){
								$('#contactEmail').addClass('error').focus();
							}
							else if(resp.errorCode == 3){
								$('#contactMessage').addClass('error').focus();
							}	
						}					
					}
				});
			
				return false;
			});

			$('#modal').on('click touchstart', function(e){
				e.stopPropagation();
			});

			$('#modalClose, #modalOverlay').on('click touchstart', function(){
				$('#modal, #modalOverlay').fadeOut(500);
			});
		},
		domReady: function(){},
		windowLoad: function(){
			$('#loader').fadeOut();
			
			$('a.popup').each(function(){
                var t = $(this),
                    img = $('<img />');
                 
                    img.attr('src', t.attr('href'));
            });
			
			// IE9 text-ticker animation
            if($('html').hasClass('no-cssanimations')){
            	var count = 0;
            	setInterval(function(){
            		var margin = $('.text-ticker ul').css('marginTop') == '-200px' ? 0 : '-=50px';

            		$('.text-ticker ul').animate({
            			marginTop: margin
            		}, 200);

            		if(count == 4){
            			count = 0;
            		}
            	}, 1000);
            }
		}
	};

	app.init();
	$(function(){
		app.domReady();

		$(window).load(app.windowLoad);
	});

	$(window).resize(function() {
	    delay(function(){
	        $('.same-height').css('height','auto'); //solve for all you browser stretchers out there!
	        setEqualHeight($('.same-height'));
	    }, 500);
	});

})(jQuery)