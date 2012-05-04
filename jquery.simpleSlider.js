/*
* Written by Simon Taggart @sitaggart 2012
* Use at your own will
*/
(function($) {

	$.simpleSlider = function(element, options) {

		var defaults = {
			sliderWidth: 0,
			slideWidth: 0,
			totalSlides: 0,
			currentPosition: 0,
			currentSlide: 0,
			slideHeight: 0,
			buttons: 'true',
			rotation: 'false',
			interval: 500
		}

		var plugin = this;

		plugin.settings = {}

		var $element = $(element),
			element = element,
			$listContainer = $element,
			$list = $listContainer.find('.om-slider-list'),
			$nextSlide = '',
			$prevSlide = '',
			sliderTimer;

		plugin.init = function() {
			plugin.settings = $.extend({}, defaults, options);
			
			var self = this;

			plugin.settings.totalSlides = $list.find('> li').length;

			plugin.getDataAttributes();

			if(plugin.settings.buttons === 'true') plugin.createButtons();
			plugin.setSlides();  
			
			$listContainer.addClass('om-slider-loaded');

			if(plugin.settings.rotation === 'true') {
				plugin.setTimer();
			}
		}

		plugin.getDataAttributes = function() {
			plugin.settings.buttons = ($element.attr('data-buttons')) ? $element.attr('data-buttons') : plugin.settings.buttons ;
			plugin.settings.rotation = ($element.attr('data-rotation')) ? $element.attr('data-rotation') : plugin.settings.rotation ;
			plugin.settings.interval = ($element.attr('data-interval')) ? $element.attr('data-interval') : plugin.settings.interval ;
		}

		plugin.createButtons = function() {

			$nextSlide = $('<button />', { 
				'class': 'om-slider-next',
				text: 'Next case study',
				click: function(e){
					e.preventDefault();
					plugin.nextSlide();
				}
			});
			$prevSlide = $('<button />', { 
				'class': 'om-slider-prev om-slider-button-inactive',
				text: 'Previous case study',
				click: function(e){
					e.preventDefault();
					plugin.prevSlide();
				}
			});
			
			$listContainer.append($prevSlide).append($nextSlide);  
		}

		plugin.setSlides = function() {

			//wrap it for sliding
			$list.wrap($('<div />', {'class': 'om-slider-list-container'}));

			plugin.setSliderWidth();

			plugin.setSlidePosition(plugin.settings.currentPosition);        
	
		}

		plugin.setSliderWidth = function() {
			plugin.settings.slideWidth = $listContainer.outerWidth();
			plugin.settings.sliderWidth = plugin.settings.totalSlides*plugin.settings.slideWidth;
			$list.css('width', plugin.settings.sliderWidth)
		}

		plugin.setSlidePosition = function(pos) {
			var newPosition = pos;
			if(newPosition == undefined) newPosition = plugin.settings.currentPosition;
			if($('html').hasClass('csstransitions')){
				$list.css('left', newPosition);    
			} else {
				$list.animate({
					left: newPosition
				}, 500);
			}        
			if(plugin.settings.buttons === 'true') plugin.setButtonStates();
		}

		plugin.nextSlide = function() {
			if($nextSlide.hasClass('om-slider-button-inactive')) return;
			window.clearInterval(sliderTimer);
			plugin.settings.currentPosition -= plugin.settings.slideWidth;
			plugin.settings.currentSlide ++;
			plugin.setSlidePosition();
		}

		plugin.prevSlide = function() {
			if($prevSlide.hasClass('om-slider-button-inactive')) return;
			window.clearInterval(sliderTimer);
			plugin.settings.currentPosition += plugin.settings.slideWidth;
			plugin.settings.currentSlide --;
			plugin.setSlidePosition();
		}

		plugin.setButtonStates = function() {
			if(plugin.settings.currentPosition == 0) $prevSlide.addClass('om-slider-button-inactive');
			else $prevSlide.removeClass('om-slider-button-inactive');
			if(plugin.settings.sliderWidth + plugin.settings.currentPosition === plugin.settings.slideWidth) $nextSlide.addClass('om-slider-button-inactive');
			else $nextSlide.removeClass('om-slider-button-inactive');
		}

		plugin.setTimer = function() {
			sliderTimer = window.setInterval(function(){
				plugin.incrementSlide()
			}, plugin.settings.interval);
		}

		plugin.clearSliderInterval = function() {
			window.clearInterval(sliderTimer);
		}

		plugin.incrementSlide = function() {
			var newIndex = plugin.settings.currentSlide+1; 
			if(newIndex > plugin.settings.totalSlides) newIndex = 1;

			if(plugin.settings.sliderWidth + plugin.settings.currentPosition === plugin.settings.slideWidth) plugin.settings.currentPosition = 0;
			else plugin.settings.currentPosition -= plugin.settings.slideWidth;
			
			plugin.setSlidePosition();

		}

		plugin.foo_public_method = function() {
			// code goes here
		}

		var foo_private_method = function() {
			// code goes here
		}

		plugin.init();

	}

	$.fn.simpleSlider = function(options) {
		return this.each(function() {
			if (undefined == $(this).data('simpleSlider')) {
				var plugin = new $.simpleSlider(this, options);
				$(this).data('simpleSlider', plugin);
			}
		});

	}

})(jQuery);
/*
	attach the plugin to an element
	$('#element').simpleSlider({'foo': 'bar'});
	call a public method
	$('#element').data('simpleSlider').foo_public_method();
	get the value of a property
	$('#element').data('simpleSlider').settings.foo;
*/ 
