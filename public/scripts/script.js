/*----------------------------------------------------*/
// vars
'use strict'
console.log("script added");
var	testim = document.getElementById("testim"),
		testimDots = Array.prototype.slice.call(document.getElementById("testim-dots").children),
    testimContent = Array.prototype.slice.call(document.getElementById("testim-content").children),
    testimLeftArrow = document.getElementById("left-arrow"),
    testimRightArrow = document.getElementById("right-arrow"),
    testimSpeed = 4500,
    currentSlide = 0,
    currentActive = 0,
    testimTimer,
		touchStartPos,
		touchEndPos,
		touchPosDiff,
		ignoreTouch = 30;
;

window.onload = function() {

    // Testim Script
    function playSlide(slide) {
        for (var k = 0; k < testimDots.length; k++) {
            testimContent[k].classList.remove("active");
            testimContent[k].classList.remove("inactive");
            testimDots[k].classList.remove("active");
        }

        if (slide < 0) {
            slide = currentSlide = testimContent.length-1;
        }

        if (slide > testimContent.length - 1) {
            slide = currentSlide = 0;
        }

        if (currentActive != currentSlide) {
            testimContent[currentActive].classList.add("inactive");            
        }
        testimContent[slide].classList.add("active");
        testimDots[slide].classList.add("active");

        currentActive = currentSlide;
    
        clearTimeout(testimTimer);
        testimTimer = setTimeout(function() {
            playSlide(currentSlide += 1);
        }, testimSpeed)
    }

    testimLeftArrow.addEventListener("click", function() {
        playSlide(currentSlide -= 1);
    })

    testimRightArrow.addEventListener("click", function() {
        playSlide(currentSlide += 1);
    })    

    for (var l = 0; l < testimDots.length; l++) {
        testimDots[l].addEventListener("click", function() {
            playSlide(currentSlide = testimDots.indexOf(this));
        })
    }

    playSlide(currentSlide);

    // keyboard shortcuts
    document.addEventListener("keyup", function(e) {
        switch (e.keyCode) {
            case 37:
                testimLeftArrow.click();
                break;
                
            case 39:
                testimRightArrow.click();
                break;

            case 39:
                testimRightArrow.click();
                break;

            default:
                break;
        }
    })
		
		testim.addEventListener("touchstart", function(e) {
				touchStartPos = e.changedTouches[0].clientX;
		})
	
		testim.addEventListener("touchend", function(e) {
				touchEndPos = e.changedTouches[0].clientX;
			
				touchPosDiff = touchStartPos - touchEndPos;
			
				console.log(touchPosDiff);
				console.log(touchStartPos);	
				console.log(touchEndPos);	

			
				if (touchPosDiff > 0 + ignoreTouch) {
						testimLeftArrow.click();
				} else if (touchPosDiff < 0 - ignoreTouch) {
						testimRightArrow.click();
				} else {
					return;
				}
			
		})
}
/* Quote Loop end
------------------------------------------------------ */


/*----------------------------------------------------*/
/* Navigation
------------------------------------------------------ */

$(window).scroll(function() {

    if ($(window).scrollTop() > 300) {
        $('.main_nav').addClass('sticky');
    } else {
        $('.main_nav').removeClass('sticky');
    }
});

// Mobile Navigation
$('.mobile-toggle').click(function() {
    if ($('.main_nav').hasClass('open-nav')) {
        $('.main_nav').removeClass('open-nav');
    } else {
        $('.main_nav').addClass('open-nav');
    }
});

$('.main_nav li a').click(function() {
    if ($('.main_nav').hasClass('open-nav')) {
        $('.navigation').removeClass('open-nav');
        $('.main_nav').removeClass('open-nav');
    }
});


/*----------------------------------------------------*/
/* Smooth Scrolling
------------------------------------------------------ */

jQuery(document).ready(function($) {

   $('.smoothscroll').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash,
	    $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 800, 'swing', function () {
	        window.location.hash = target;
	    });
	});
  
});


TweenMax.staggerFrom(".heading", 0.8, {opacity: 0, y: 20, delay: 0.2}, 0.4);







/*----------------------------------------------------*/
/* Quote Loop
------------------------------------------------------ */

var tw = document.querySelector('#tw');
var lin = document.querySelector('#lin');
var insta = document.querySelector('#insta');
var yt = document.querySelector('#yt');
var gm = document.querySelector('#gm');
var fb = document.querySelector('#fb');
var env = document.querySelector('#env');
var whats = document.querySelector('#whats');


yt.addEventListener("mouseover",function(){
    this.setAttribute("src","images_2/SVG-h/youtube.svg");
});

yt.addEventListener("mouseout",function(){
    this.setAttribute("src","images_2/SVG/youtube.svg");
});

// tw.addEventListener("mouseover",function(){
//     this.setAttribute("src","images_2/SVG-h/twitter.svg");
// });

// tw.addEventListener("mouseout",function(){
//     this.setAttribute("src","images_2/SVG/twitter.svg");
// });

// insta.addEventListener("mouseover",function(){
//     this.setAttribute("src","images_2/SVG-h/instagram.svg");
// });

// insta.addEventListener("mouseout",function(){
//     this.setAttribute("src","images_2/SVG/instagram.svg");
// });

whats.addEventListener("mouseover",function(){
    this.setAttribute("src","images_2/SVG-h/whatsapp.svg");
});

whats.addEventListener("mouseout",function(){
    this.setAttribute("src","images_2/SVG/whatsapp.svg");
});

// env.addEventListener("mouseover",function(){
//     this.setAttribute("src","images_2/SVG-h/envelop.svg");
// });

// env.addEventListener("mouseout",function(){
//     this.setAttribute("src","images_2/SVG/envelop.svg");
// });

fb.addEventListener("mouseover",function(){
    this.setAttribute("src","images_2/SVG-h/facebook2.svg");
});

fb.addEventListener("mouseout",function(){
    this.setAttribute("src","images_2/SVG/facebook2.svg");
});

gm.addEventListener("mouseover",function(){
    this.setAttribute("src","images_2/SVG-h/google-plus2.svg");
});

gm.addEventListener("mouseout",function(){
    this.setAttribute("src","images_2/SVG/google-plus2.svg");
});

// lin.addEventListener("mouseover",function(){
//     this.setAttribute("src","images_2/SVG-h/linkedin.svg");
// });

// lin.addEventListener("mouseout",function(){
//     this.setAttribute("src","images_2/SVG/linkedin.svg");
// });