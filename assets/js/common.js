gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0);

$(window).on("load", function () {
  generatePanelNoise();

  setTimeout(function () {
    const target = document.querySelectorAll(".js-io");
    const targetArray = Array.prototype.slice.call(target);
    const options = {
      root: null,
      rootMargin: "0% 0% 0% 0%",
      threshold: 0,
    };
    const observer = new IntersectionObserver(callback, options);
    targetArray.forEach((tgt) => {
      observer.observe(tgt);
    });

    function callback(entries) {
      entries.forEach(function (entry, i) {
        const target = entry.target;

        if (entry.isIntersecting && !target.classList.contains("_show")) {
          const delay = i * 100;
          setTimeout(function () {
            target.classList.add("_show");
          }, delay);
        }
      });
    }
  }, 400);
});

$(document).ready(function() {
  // loading
  const body = $("body");

  if (body.hasClass("front-page")) {
    $("body").addClass("is-loading");
    $('.loading-txt-logo img').addClass('opening');

    var imgLoad = imagesLoaded("body");
    var loadingNum = $('.loading-txt-num span')
      loadingBar = $('.loading-progress-bar span')
      images = $("img").length,
      loadedCount = 0,
      loadingProgress = 0,
      tlProgress = gsap.timeline();

    imgLoad.on("progress", function (instance, image) {
      loadProgress();
    });
    
    function loadProgress() {
     loadedCount++;
     loadingProgress = loadedCount / images;
    
     gsap.to(tlProgress, { progress: loadingProgress, duration: 1 });
    }
    
    var tlProgress = gsap.timeline({
     paused: true,
     onUpdate: countPercent,
     onComplete: loadComplete,
    });

    tlProgress.to(loadingNum, { width: "100%", duration: 1 });
    tlProgress.to(loadingBar, { width: "100%", duration: 1 });

    function countPercent() {
      var newPercent = (tlProgress.progress() * 100).toFixed();
      loadingNum.text(newPercent);
    }
    
    function loadComplete() {
      // setTimeout(() => {
        // $('.loading-txt-num').addClass('loaded');
        // $('.loading-progress-bar').addClass('loaded');
        setTimeout(() => {
          $(".loading").addClass('hidden');
          $('body').removeClass('is-loading');

          setTimeout(() => {
            $('.top-bg').addClass('loaded');
            setTimeout(() => {
              $('.header').addClass('loaded');
              $('.sec-fv-first').addClass('loaded');
              setTimeout(() => {
                $('.sec-fv-loop-txt').addClass('loaded');
              }, 600);
            }, 600);
          }, 500);
        }, 800);
      // }, 500);
    }
  } else {
    $('body').addClass('loaded');
    $('main').addClass('loaded');
    $('header').addClass('loaded');
  }
});

const service = $('.sec-fv__main');
const mouseCircle = document.getElementById('drawingCircle');

let isFirstSlideActive = true;

if(service.length && mouseCircle) {
  gsap.timeline({
    scrollTrigger: {
      trigger: service,
      start: 'top top',
      end: "+=1800",
      pin: true,
      scrub: true,
      onUpdate: self => {
        const progress = self.progress;
        
        mouseCircle.style.strokeDashoffset = 312.62 * (1 - progress);
  
        if (progress > 0.4 && !isFirstSlideActive) {
          secondSlide();
          isFirstSlideActive = true;
        } else if (progress <= 0.4 && isFirstSlideActive) {
          firstSlide();
          isFirstSlideActive = false;
        }
      }
    }
  });
}

function firstSlide() {
  $('.sec-fv-second').removeClass('show');
  $('.sec-fv-first').addClass('show');

  if ($('.sec-fv-first').hasClass('scrolled')) {
    prevVideo();
  }
}

function secondSlide() {
  $('.sec-fv-second').addClass('show');
  $('.sec-fv-first').removeClass('show');
  $('.sec-fv-first').addClass('scrolled');

  nextVideo();
}

let videoPromise = Promise.resolve();

function enqueueVideoChange(changeFunction) {
  videoPromise = videoPromise.then(() => new Promise((resolve, reject) => {
    changeFunction(resolve, reject);
  }));
}

function nextVideo() {
  enqueueVideoChange((resolve, reject) => {
    console.log('next video');

    const windowWidth = $(window).width();
    let currentVideo;

    if(windowWidth <= 768) {
      currentVideo = $('.top-bg-video-sp._shown').get(0);
    } else {
      currentVideo = $('.top-bg-video._shown').get(0);
    }
    
    // let nextVideo = $(currentVideo).nextAll('.next-video').first().get(0);
    // let nextLoopVideo = $(currentVideo).nextAll('.loop-video').first().get(0);
    let nextVideo;
    let nextLoopVideo;
    if($(currentVideo).hasClass('videopart01')) {
      if (windowWidth <= 768) {
        nextLoopVideo = $('.top-bg-video-sp.videopart02').get(0);
        nextVideo = $('.top-bg-video-sp.next-video01').get(0);
      } else {
        nextLoopVideo = $('.top-bg-video.videopart02').get(0);
        nextVideo = $('.top-bg-video.next-video01').get(0);
      }
    } else if($(currentVideo).hasClass('videopart02')) {
      if (windowWidth <= 768) {
        nextVideo = $('.top-bg-video-sp.next-video02').get(0);
        nextLoopVideo = $('.top-bg-video-sp.videopart03').get(0);
      } else {
        nextVideo = $('.top-bg-video.next-video02').get(0);
        nextLoopVideo = $('.top-bg-video.videopart03').get(0);
      }
    } else if($(currentVideo).hasClass('videopart03')) {
      if (windowWidth <= 768) {
        nextVideo = $('.top-bg-video-sp.next-video03').get(0);
        nextLoopVideo = $('.top-bg-video-sp.videopart04').get(0);
      } else {
        nextVideo = $('.top-bg-video.next-video03').get(0);
        nextLoopVideo = $('.top-bg-video.videopart04').get(0);
      }
    } else if($(currentVideo).hasClass('videopart04')) {
      return;
    }

    if (!nextVideo) {
      // nextVideo = $('.loop-video').first().get(0);
      console.log('no nextvideo');
    }

    let remainingTime = currentVideo.duration - currentVideo.currentTime;
    let targetDuration = 0.3;
    let playbackRate = remainingTime / targetDuration;

    currentVideo.loop = false;

    playbackRate = Math.max(0.25, Math.min(playbackRate, 4.0));
    
    currentVideo.playbackRate = playbackRate;

    $(currentVideo).on('ended', function() {
      $(currentVideo).removeClass('_shown');
      $(nextVideo).addClass('_shown');
      
      nextVideo.currentTime = 0;
      nextVideo.play();

      currentVideo.playbackRate = 1.0;
      
      $(nextVideo).on('ended', function() {
        $(nextVideo).removeClass('_shown');
        $(nextLoopVideo).addClass('_shown');
        nextLoopVideo.currentTime = 0;
        nextLoopVideo.loop = true;
        nextLoopVideo.play();
        resolve();
      });
    });
  });
}

function prevVideo() {
  enqueueVideoChange((resolve, reject) => {
    console.log('prev video');

    const windowWidth = $(window).width();
    let currentVideo;

    if (windowWidth <= 768) {
      currentVideo = $('.top-bg-video-sp._shown').get(0);
    } else {
      currentVideo = $('.top-bg-video._shown').get(0);
    }

    // let prevVideo = $(currentVideo).prevAll('.prev-video').first().get(0);
    // let prevLoopVideo = $(currentVideo).prevAll('.loop-video').first().get(0);

    let prevVideo;
    let prevLoopVideo;

    if($(currentVideo).hasClass('videopart01')) {
      return;
    } else if($(currentVideo).hasClass('videopart02')) {
      if (windowWidth <= 768) {
        prevVideo = $('.top-bg-video-sp.prev-video01').get(0);
        prevLoopVideo = $('.top-bg-video-sp.videopart01').get(0);
      } else {
        prevVideo = $('.top-bg-video.prev-video01').get(0);
        prevLoopVideo = $('.top-bg-video.videopart01').get(0);
      }
    } else if($(currentVideo).hasClass('videopart03')) {
      if (windowWidth <= 768) {
        prevVideo = $('.top-bg-video-sp.prev-video02').get(0);
        prevLoopVideo = $('.top-bg-video-sp.videopart02').get(0);
      } else {
        prevVideo = $('.top-bg-video.prev-video02').get(0);
        prevLoopVideo = $('.top-bg-video.videopart02').get(0);
      }
    } else if($(currentVideo).hasClass('videopart04')) {
      if (windowWidth <= 768) {
        prevVideo = $('.top-bg-video-sp.prev-video03').get(0);
        prevLoopVideo = $('.top-bg-video-sp.videopart03').get(0);
      } else {
        prevVideo = $('.top-bg-video.prev-video03').get(0);
        prevLoopVideo = $('.top-bg-video.videopart03').get(0);
      }
    }

    if (!prevVideo) {
      // prevVideo = $('.loop-video').last().get(0);
      console.log('no prevVideo');
    }

    let remainingTime = currentVideo.duration - currentVideo.currentTime;
    let targetDuration = 0.3;
    let playbackRate = remainingTime / targetDuration;

    currentVideo.loop = false;

    playbackRate = Math.max(0.25, Math.min(playbackRate, 4.0));
    
    currentVideo.playbackRate = playbackRate;

    $(currentVideo).on('ended', function() {
      $(currentVideo).removeClass('_shown');
      $(prevVideo).addClass('_shown');
      prevVideo.currentTime = 0;
      prevVideo.play();

      currentVideo.playbackRate = 1.0;

      $(prevVideo).on('ended', function() {
        $(prevVideo).removeClass('_shown');
        $(prevLoopVideo).addClass('_shown');
        prevVideo.currentTime = 0;
        prevLoopVideo.loop = true;
        prevLoopVideo.play();
        resolve();
      });
    });
  });
}

document.querySelectorAll(".c-ruler__item").forEach(item => {
  ScrollTrigger.create({
    trigger: item,
    start: "top top",
    onEnter: () => handleEnter(item.id),
    onLeaveBack: () => handleLeaveBack(item.id)
  });
});

function handleEnter(id) {
  switch(id) {
    case 'ruler5':
      console.log('Ruler 5 has entered the top');
      nextVideo();
      break;
    case 'ruler6':
      console.log('Ruler 6 has entered the top');
      nextVideo();
      break;
    default:
      console.log(`Unidentified item with ID ${id}`);
  }
}

function handleLeaveBack(id) {
  switch(id) {
    case 'ruler5':
      console.log('Ruler 5 has leaved the top');
      prevVideo();
      break;
    case 'ruler6':
      console.log('Ruler 6 has leaved the top');
      prevVideo();
      break;
    default:
      console.log(`Unidentified item with ID ${id}`);
  }
}

var topics_swiper = new Swiper(".topics-swiper", {
  slidesPerView: 'auto',
  spaceBetween: 0,
  speed: 500,
  navigation: {
    nextEl: ".topics-swiper .swiper-button-next",
    prevEl: ".topics-swiper .swiper-button-prev",
  },
  on: {
    init: function() {
      updateScrollbarPosition();
    },
    slideChange: function() {
      updateScrollbarPosition();
    }
  }
});

function updateScrollbarPosition() {
  var swiper = document.querySelector('.swiper-container').swiper;
  var translate = swiper.translate;
  var swiperWidth = swiper.width;
  var scrollbarWidth = document.querySelector('.swiper-scrollbar').offsetWidth;
  var iconWidth = document.querySelector('.swiper-scrollbar-ico').offsetWidth;
  var position = (-translate / swiperWidth) * (scrollbarWidth - iconWidth);
  position = Math.max(0, Math.min(position, scrollbarWidth - iconWidth));
  document.querySelector('.swiper-scrollbar-ico').style.left = `${position}px`;
}

const scrollbarIcon = document.querySelector('.swiper-scrollbar-ico');
let isDragging = false;
let initialX = 0;

if(scrollbarIcon) {
  scrollbarIcon.addEventListener('mousedown', function(e) {
    isDragging = true;
    initialX = e.clientX - scrollbarIcon.getBoundingClientRect().left;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      var newTranslate = e.clientX - initialX - scrollbarIcon.parentNode.getBoundingClientRect().left;
      var maxTranslate = scrollbarIcon.parentNode.offsetWidth - scrollbarIcon.offsetWidth;
      newTranslate = Math.max(0, Math.min(newTranslate, maxTranslate));
      var positionPercentage = newTranslate / maxTranslate;
      document.querySelector('.swiper-container').swiper.slideTo(Math.round(positionPercentage * (swiper.slides.length - 1)));
      updateScrollbarPosition();
    }
  });
  
  document.addEventListener('mouseup', function() {
    isDragging = false;
  });
}


$(document).ready(function() {
  let mm = gsap.matchMedia();

  // parallax img
  const parallaxImg = $('.parallax-img');

  if(parallaxImg.length) {
    gsap.set('.parallax-img',{
        y: 0
      });
      mm.add("(min-width: 768px)", () => {
        gsap.to('.parallax-img',{
        y: -120,
        scrollTrigger: {
          trigger: '.parallax-img__wrap',
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play reverse play reverse',
          scrub: 1,
        }
      })
    })
  }
});

$(window).scroll(function() {
  if ($(window).scrollTop() > 3250) {
      $('.site-border__wrap').addClass('remove');
  } else {
      $('.site-border__wrap').removeClass('remove');
  }
});


// company
const mvvSec = $('.company-mvv');

if(mvvSec.length) {
  let activeVideoIndex = 0;

  gsap.timeline({
    scrollTrigger: {
      trigger: mvvSec,
      start: 'top top',
      end: "+=2200",
      pin: true,
      scrub: true,
      onUpdate: self => {
        const progress = self.progress;
        if (progress > 0.66) {
          if (activeVideoIndex !== 2) {
            thirdmvv();
            activeVideoIndex = 2;
          }
        } else if (progress > 0.28) {
          if (activeVideoIndex !== 1) {
            secondmvv();
            activeVideoIndex = 1;
          }
        } else {
          if (activeVideoIndex !== 0) {
            firstmvv();
            activeVideoIndex = 0;
          }
        }
      }
    }
  });
}


function firstmvv() {
  $('.company-mvv-txt').removeClass('active');
  $('.company-mvv-txt.mvv01_txt').addClass('active');
  $('.company-mvv-img video').removeClass('active');
  $('.company-mvv-img .mvv01_video').addClass('active');
  const video = $('.company-mvv-img .mvv01_video').get(0);
  video.currentTime = 0;
  video.play();
}

function secondmvv() {
  $('.company-mvv-txt').removeClass('active');
  $('.company-mvv-txt.mvv02_txt').addClass('active');
  $('.company-mvv-img video').removeClass('active');
  $('.company-mvv-img .mvv02_video').addClass('active');
  const video = $('.company-mvv-img .mvv02_video').get(0);
  video.currentTime = 0;
  video.play();
}

function thirdmvv() {
  $('.company-mvv-txt').removeClass('active');
  $('.company-mvv-txt.mvv03_txt').addClass('active');
  $('.company-mvv-img video').removeClass('active');
  $('.company-mvv-img .mvv03_video').addClass('active');
  const video = $('.company-mvv-img .mvv03_video').get(0);
  video.currentTime = 0;
  video.play();
}


// overlap animation
const overLap = $('.overlap-elem');
const overLap_len = overLap.length;

$('.overlap-elem').each(function(i) {
  const card = $(this);

  ScrollTrigger.create({
    trigger: card,
    start: () => card.outerHeight() < window.innerHeight ? "top top" : "bottom bottom",
    endTrigger: '.overlap-elem__wrap',
    end:'bottom bottom',
    // pin: true, 
    // pinSpacing: false,
    onEnter: ()=>{
      card.addClass('--is-inview');
    },
    onEnterBack: ()=>{
      card.addClass('--is-inview');
    },
    onLeave: ()=>{
      card.removeClass('--is-inview');
    },
    onLeaveBack: ()=>{
      card.removeClass('--is-inview');
    },
  });

  const card_inner = card.find('.overlap-elem-container');
  const card_shadow = card.find('.overlap-elem-bg');

  if(i < overLap_len - 1){
    gsap.to(card_inner,{
      y: 200,
      scale: 0.88,
      scrollTrigger:{
        trigger: overLap.eq(i + 1),
        // start: () => card.outerHeight() < window.innerHeight ? "top top" : "bottom bottom",
        start: 'top 50%',
        // endTrigger: overLap.eq(i + 1),
        endTrigger: card_inner,
        end:'bottom -20%',
        scrub: 0.3,
        toggleActions: 'play reverse play reverse',
        // markers: true
      }
    });
    gsap.to(card_shadow,{
      autoAlpha: 1,
      scrollTrigger: {
        trigger: overLap.eq(i + 1),
        start:'top 50%',
        endTrigger: card_inner,
        end:'bottom top',
        scrub: 0.2,
        toggleActions: 'play reverse play reverse',
      }
    });
  }
});


$('.header-sp-btn button').click(function() {
  $('.site-border__wrap').toggleClass('open-menu');
  $('.full-menu').toggleClass('open-menu');
  $(this).toggleClass('active');
});


$('.company-info-history-year ul li').click(function() {
  $('.company-info-history-year ul li').removeClass('active');
  $(this).addClass('active');
});

$('.company-member__elem').click(function() {
  $('.company-member-modal, .full-bg').addClass('open-menu');
});

$('.company-member-modal-close button').click(function() {
  $('.company-member-modal, .full-bg').removeClass('open-menu');
});


const cover_last = $('.js-cover-last');
const company = $('.js-cover-elem');
const footer_shadow = $('.js-cover-shadow');
gsap.set(company, {
  y: -300,
  scale: 0.84,
})
gsap.to(company, {
  y: 0,
  scale: 1,
  scrollTrigger: {
    trigger: cover_last,
    start: 'bottom bottom',
    end: 'bottom 10%',
    scrub: 0.2,
    toggleActions: 'play reverse play reverse',
  }
})
gsap.to(footer_shadow,{
  autoAlpha: 0,
  scrollTrigger:{
    trigger: cover_last,
    start: 'bottom bottom',
    end: 'bottom 30%',
    scrub: 0.2,
    toggleActions: 'play reverse play reverse',
  }
})


// header link hover
$(document).ready(function () {
  const activeMenu = $('.header-link > ul .active');
  const menuHover = $('#js-header__line');

  if(activeMenu.length) {
    menuHover.addClass('active');
  }

  function updateActivePosition() {
    if (activeMenu.length > 0) {
      const activeOffsetLeft = activeMenu.position().left + (activeMenu.outerWidth() / 2);

      menuHover.css({
        left: activeOffsetLeft,
      });
    }
  }

  $('.header-link > ul li').not('.header-link-btn').hover(
    function () {
      const hoveredOffsetLeft = $(this).position().left + ($(this).outerWidth() / 2);

      menuHover.css({
        left: hoveredOffsetLeft,
      });
    },
    function () {
      updateActivePosition();
    }
  );

  updateActivePosition();

  $('.header-link-plus').on('click', function() {
    var $this = $(this);
  
    $('.header-link-plus').not($this).removeClass('clicked');
    $('.header-link-plus-menu').not('.header-' + $this.data('type') + '-menu').removeClass('active');
    
    if($this.hasClass('clicked')) {
      $this.removeClass('active clicked');
      $('.full-bg').removeClass('open-header-menu');
      
      if ($this.hasClass('header-service')) {
        $('.header-service-menu').removeClass('active');
      }
    } else {
      $this.addClass('active clicked');
      $('.full-bg').addClass('open-header-menu');

      if ($this.hasClass('header-service')) {
        $('.header-service-menu').addClass('active');
      }
    }

    updateActivePosition();
  });
  

  $('.full-bg').click(function(){
    $('.header-link-plus').removeClass('clicked');
    $('.header-link-plus-menu').removeClass('active');
    $('.full-bg').removeClass('open-header-menu');
    $('.company-member-modal, .full-bg').removeClass('open-menu');
  });
});



function arrayShuffle(array) {
	for (let i = (array.length - 1); 0 < i; i--) {
		let r = Math.floor(Math.random() * (i + 1));
		let tmp = array[i];

		array[i] = array[r];
		array[r] = tmp;
	}

	return array;
}

// 

function generatePanelNoise() {
	let panelImgWrapper = document.querySelectorAll('.g-panel__imgWrapper, .g-dif__img, .g-career__img');

	if (panelImgWrapper.length === 0) {
		return;
	}

	let width = 10;
	let height = 7;
	let delayMin = 0.25 / (width * height);
	let delayList = [];
	let fragment = document.createDocumentFragment();
	let noiseContainerTmp = document.createElement('div');
	let noiseTmp = document.createElement('span');

	noiseContainerTmp.classList.add('noise__container');
	noiseTmp.classList.add('noise');

	for (let i = 0; i < width * height; i++ ) {

		delayList.push(delayMin * i);
	}

	delayList = arrayShuffle(delayList);


	for (let i = 0; i < width * height; i++) {
		let noise = noiseTmp.cloneNode();
		noise.setAttribute('style', '--panelNoiseDelay:' + delayList[i] + 's;' + '--panelNoiseDelayReseve:' + delayList[(width * height - 1) - i] + 's;');

		fragment.appendChild(noise);
	}

	noiseContainerTmp.appendChild(fragment);

	[...panelImgWrapper].forEach(e => {

		if (e.querySelector('.noise__container') !== null) {
			return;
		}

		let noiseContainer = noiseContainerTmp.cloneNode(true);

		e.appendChild(noiseContainer);
	});
}


// header logo color
$(document).ready(function() {
  var header = $('.header');
  var headerLogo = $('.header-logo');
  
  $(window).scroll(function() {
    var headerBottom = header.offset().top + header.outerHeight();
    
    $('.section, footer').each(function() {
      var sectionTop = $(this).offset().top;
      var sectionBottom = sectionTop + $(this).outerHeight();
      var backgroundColor = $(this).css('background-color');

      if (headerBottom > sectionTop && headerBottom < sectionBottom) {
        if (backgroundColor === 'rgb(51, 51, 51)' || backgroundColor === 'rgb(0, 0, 0)' || backgroundColor === 'var(--g-color-black)') {
          headerLogo.addClass('_white-logo');
        } else {
          headerLogo.removeClass('_white-logo');
        }
      }
    });
  });
});


// news
// var page = 1;
// var year = '';

// var ajaxurl = '/wp-admin/admin-ajax.php';
// const news_wrap = $('.news-main-page-list');

// var page_id = $('body').data('page-id');

// function cvf_load_all_posts(page, year = '') {
//   news_wrap.addClass('--is-loading');

//   // Send the data
//   $.ajax({
//     type: 'POST',
//     url: ajaxurl,
//     dataType: 'html',
//     data: {
//       page: page,
//       year: year,
//       page_id: page_id,
//       action: 'filter_posts',
//     },
//     success: function(res) {
//       news_wrap.html(res);
//       setTimeout(() => {
//         news_wrap.removeClass('--is-loading');
//           generatePanelNoise();
//       }, 400);
//     }
//   })
// }

// cvf_load_all_posts(page, year);


// company line
$(document).ready(function() {
  function updateHeight() {
    var firstElem = $('.company-info-history__elem').first().find('.company-info-history__elem-year').first();
    var lastElem = $('.company-info-history__elem-year').last();
    var firstElemPosition = firstElem.offset().top;
    var lastElemPosition = lastElem.offset().top;
    var distance = lastElemPosition - firstElemPosition;
    
    var styleTag = $('#dynamic-height-style');
    if (styleTag.length === 0) {
        $('head').append(`<style id="dynamic-height-style">:root { --dynamic-height: ${distance}px; }</style>`);
    } else {
        styleTag.html(`:root { --dynamic-height: ${distance}px; }`);
    }
  }

  const companyHistory = $('.company-info-history');
  
  if(companyHistory.length) {
    updateHeight();
  	$(window).resize(function() {
      updateHeight();
    });
  }
});

let mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  const body = $("body");
  const onlink = $("a");
  const fvArea = $('.sec-fv__main');
  
  body.on("mousemove", function(e){
    var $this = $(this);
    const mousePoint = $(this).find('.mouse-point');
    const mousePointer = $(this).find('.mouse-point-wrap');
    var btnX = mousePoint.offset().left + mousePoint.width() / 2 - $(this).offset().left;
    var btnY = mousePoint.offset().top + mousePoint.height() / 2 - $(this).offset().top;
  
    gsap.to(mousePointer, {
      duration: 0.4,
      x: e.pageX - $this.offset().left - btnX,
      y: e.clientY - $this.offset().top + $(window).scrollTop() - btnY,
    });
  });

  onlink.on("mouseenter", function(e){
    const mousePointer = $('.mouse-point-wrap');
    mousePointer.addClass('onlink');
  });

  onlink.on("mouseleave", function(e){
    const mousePointer = $('.mouse-point-wrap');
    mousePointer.removeClass('onlink');
  });

  fvArea.on("mouseenter", function(e){
    const mousePointer = $('.mouse-point-wrap');
    mousePointer.addClass('fvarea');
  });

  fvArea.on("mouseleave", function(e){
    const mousePointer = $('.mouse-point-wrap');
    mousePointer.removeClass('fvarea');
  });
});


const windowWidth = $(window).width();

if (windowWidth <= 768) {
  $('.about-mission-btns li').each(function(index) {
    $(this).on('click', function() {
      if ($(this).hasClass('active')) {
        return;
      }
  
      $('.about-mission-main').addClass('_change');
      $('.about-mission-btns li').removeClass('active');
      $(this).addClass('active');
  
      setTimeout(() => {
        $('.about-mission-item').removeClass('active');
        $('.about-mission-main').removeClass('_change');
  
        $('.about-mission-item').eq(index).addClass('active');
      }, 400);
    });
  });
} else {
  $('.about-mission-btns li').each(function(index) {
    $(this).on('mouseenter', function() {
      if ($(this).hasClass('active')) {
        return;
      }
      $('.about-mission-main').addClass('_change');
      $('.about-mission-btns li').removeClass('active');
      $(this).addClass('active');
  
      setTimeout(() => {
        $('.about-mission-item').removeClass('active');
        $('.about-mission-main').removeClass('_change');
  
        $('.about-mission-item').eq(index).addClass('active');
      }, 400);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const missionSection = document.querySelector('.about-mission');
  const visionButton = document.querySelector('.about-mission-btns ul li:nth-child(2)');
  const buttonList = document.querySelector('.about-mission-btns ul'); 

  if (visionButton && missionSection && buttonList) {
    visionButton.addEventListener('mouseenter', function() {
      missionSection.classList.add('is-vision-active');
      buttonList.classList.add('is-hovering-vision'); 
    });

    visionButton.addEventListener('mouseleave', function() {
      missionSection.classList.remove('is-vision-active');
      buttonList.classList.remove('is-hovering-vision');
    });
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const topTrack = document.querySelector('.slideshow-track-top');
  const bottomTrack = document.querySelector('.slideshow-track-bottom');
  
  if (topTrack && bottomTrack) {
    const topImages = topTrack.querySelectorAll('img');
    const bottomImages = bottomTrack.querySelectorAll('img');

    topImages.forEach(img => topTrack.appendChild(img.cloneNode(true)));
    bottomImages.forEach(img => bottomTrack.appendChild(img.cloneNode(true)));
  }
});