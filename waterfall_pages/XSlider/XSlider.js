
var imagePath = "/" + Drupal.settings.thisModule.waterfallPath + "/XSlider/";
var helicopter = false;
var slideTimer;
var slideShowTime = 6000;
var slideRetryTime = 2000;
var slideLongWait = 20000;

// YouTube API
var ytAPI = false;
function onYouTubeIframeAPIReady() {
    ytAPI = true;
}

// DOM Ready
jQuery(document).ready(function($) {
    // ==========================================================================================================================
    // ====================================================== SLIDER ============================================================
    // ==========================================================================================================================
    $("#imageSlider").anythingSlider({
        
        onSlideBegin        : function(){ navDot(); }, 
        autoPlay            : false,
        autoPlayLocked      : false,
        pauseOnHover        : false,
        hashTags            : false,
        animationTime       : 300,
        mode                : "fade",   
        resizeContents      : true,
        addWmodeToObject    : 'opaque',
        buildNavigation     : false,
        buildArrows         : false,
        buildStartStop      : false,
        onInitialized       : function(e, slider) { 
            navDot(); 

            // ============================ SWIPE =======================================
            var time = 1000, // allow movement if < 1000 ms (1 sec)
                range = 50,  // swipe movement of 50 pixels triggers the slider
                rangeY = 10,  // swipe movement of 10 pixels triggers the slider
                x = 0, y = 0, t = 0, touch = "ontouchend" in document,
                st = (touch) ? 'touchstart' : 'mousedown',
                mv = (touch) ? 'touchmove' : 'mousemove',
                en = (touch) ? 'touchend' : 'mouseup';

            slider.$window
                .bind(st, function(e){
                    t = (new Date()).getTime();
                    x = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
                    y = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
                })
                .bind(en, function(e){
                    t = 0; x = 0; y = 0;
                })
                .bind(mv, function(e){
                    e.preventDefault();
                    var newx = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX, rx = (x === 0) ? 0 : Math.abs(newx - x), ct = (new Date()).getTime();
                    var newy = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY, ry = (y === 0) ? 0 : Math.abs(newy - y), ct = (new Date()).getTime();
                    if (t !== 0 && ct - t < time && rx > range) {
                        if (newx < x) { swipeSlide(1); }
                        if (newx > x) { swipeSlide(-1); }
                        t = 0; x = 0;
                    }
                    if (t !== 0 && ct - t < time && ry > rangeY && rx < ry) {
                        if ( (ct-t) < 60 ) { $multiplier = 10; }
                        else if ( (ct-t) < 90 ) { $multiplier = 5; }
                        else if ( (ct-t) < 120 ) { $multiplier = 2; }
                        else { $multiplier = 1; }
                        $scrollY = $(window).scrollTop();
                        $newScrollY = Math.floor($scrollY - ($multiplier*(newy - y))) + "px";
                        $("body").animate({ "scrollTop": $newScrollY }, 500);
                        t = 0; y = 0;
                    }
                });        
            // ============================ SWIPE =======================================
        
        }, 

    });

    // REMOVE PADDING from Anything Slider
    $(".anythingSlider-default").css({"padding": "0px", "margin": "0px"});
        
    $("#imageSlider").find('.panel')
        .find('div[class*=caption]').css({ position: 'absolute' }).end()
        .hover(function(){ showCaptions( $(this) ) }, function(){ hideCaptions( $(this) ); });

    showCaptions = function(el){
        var $this = el;
        if ($this.find('.caption-bottom').length) {
            $this.find('.caption-bottom')
            .show()
            .animate({ bottom: 0, opacity: .8 }, 400);
        }
    };
    
    hideCaptions = function(el){
        var $this = el;
        if ($this.find('.caption-bottom').length) {
            $this.find('.caption-bottom')
            .stop()
            .animate({ bottom: -50, opacity: 0 }, 350, function(){
            $this.find('.caption-bottom').hide(); });
        }
    };

    hideCaptions( $('#imageSlider .panel') );

    function externalNavBuilder() {
        var eNav = "<div id='externalNav'>";
        numSlides = $("#imageSlider").children().length
        for(i=1;i<=numSlides;++i) {
            eNav += "<a href='#"+i+"'><img src='" +imagePath+ "dot-off.svg'></a>";
        }
        eNav += "</div>";
        
        // ADD externalNav
        $("#imageSlider").after(eNav);
        
        // CLICK externalNav
        $('#externalNav a').click(function(){
            var regExp = /\#([0-9]+)/;
            var targetPage = regExp.exec($(this).attr('href'));
            gotoSlide(targetPage[1],slideLongWait);
            return false;
        });
        
        // BLUR onFOCUS - stop firefox putting a stupid blue box around the nav buttons
        $('#externalNav a').focus(function(){
            $(this).blur();
        });    
        
        // HOVER externalNav
        $('#externalNav img').hover(function(){ $(this).attr("src", imagePath+ "dot-hover.svg");  }, function(){ navDot(); });
        
        navDot();
        
    }
    
    function navDot() {
        var thisPage = $('#imageSlider').data('AnythingSlider').targetPage;
        $("#externalNav a img").attr("src", imagePath+ "dot-off.svg");
        $("#externalNav a:nth-child("+thisPage+") img").attr("src", imagePath+ "dot-on.svg");
        
        // FIND YOUTUBE SLIDES
        if ($("#imageSlider li:nth-child("+thisPage+") img[id^='youtube-slide']").length) {
            thisID = $("#imageSlider li:nth-child("+thisPage+") img[id^='youtube-slide']").attr("id")
            thisYT = thisID.split(":")[1];
            if (!$("#playButton").length) {
                $("#imageSlider" ).after( "<img id='playButton' src='" +imagePath+ "play.svg'>" );
                $('#playButton').click( function () { 
                    $("#externalNav").after( "<iframe src='https://www.youtube.com/embed/"+thisYT+"?enablejsapi=1&rel=0&autoplay=1&showinfo=0&controls=1&wmode=opaque' id='youtube' width='800' height='450' frameborder=0></iframe><img id='closeButton' src='" +imagePath+ "close.svg'>" ); 
                    $("#closeButton").click( function () { $('#youtube').remove(); $('#closeButton').remove(); });
                    createPlayer(thisYT);
                });
            }
        } else {
            $('#playButton').remove();
        }
    }
    
    externalNavBuilder();
    
    var ytPlayer;
    function createPlayer(vid) {
        if (ytAPI) {
            ytPlayer = new YT.Player('youtube', {
                height: '100%',
                width: '100%',
                videoId: vid,
                playerVars: {rel:0, autoplay:1, showinfo:0, controls:1, wmode: 'opaque'}, 
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    }
    function onPlayerReady(event) {
        // Ready
    }
    function onPlayerStateChange(event) {
        // State Change
        if (event.data == YT.PlayerState.ENDED) {
            $("#closeButton").click();
            clearTimeout(slideTimer);
            slideTimer = setTimeout(function(){nextSlide(); }, slideShowTime);
        }
    }
    
    function nextSlide() {
        var numPages = $('#imageSlider').data('AnythingSlider').pages;
        var thisPage = $('#imageSlider').data('AnythingSlider').currentPage;
        targetPage = thisPage + 1;
        if (targetPage > numPages) {
            targetPage = 1;
        }

        if ($("#youtube").length > 0){
            slideTimer = setTimeout(function(){nextSlide(); }, slideRetryTime);
        } else if (helicopter) {
            slideTimer = setTimeout(function(){nextSlide(); }, slideRetryTime);
        } else {
            gotoSlide(targetPage,slideShowTime);
        }
    }

    function swipeSlide(x) {
        var numPages = $('#imageSlider').data('AnythingSlider').pages;
        var thisPage = $('#imageSlider').data('AnythingSlider').currentPage;
        targetPage = thisPage + x;
        if (targetPage > numPages) {
            targetPage = 1;
        }
        if (targetPage < 1) {
            targetPage = numPages;
        }
        gotoSlide(targetPage,slideLongWait);
    }
    
    function gotoSlide(targetPage,waitTime) {
        $('#imageSlider').anythingSlider(targetPage);
        clearTimeout(slideTimer);
        slideTimer = setTimeout(function(){ nextSlide(); }, waitTime);
    }
    
    $('#XSliderContainer').mouseover(function(event) { 
        helicopter = true;
    });
    $('#XSliderContainer').mouseout(function() {
        helicopter = false;
    });
    
    gotoSlide(1, slideShowTime);
    
    // ==========================================================================================================================
    // ====================================================== CSS ===============================================================
    // ==========================================================================================================================
	$(window).resize( function(){ changeCSS(); });
    $("head").append("<style id='XSliderCSS'></style>");
    
	function changeCSS() {
        
		$XSliderWidth = $("#XSliderContainer").width();
		$XSliderHeight = Math.floor($XSliderWidth * 0.5625);
        $numSlides = $("#imageSlider").children().length;
        
        $styleText = "";
        
        $styleText += "#XSliderContainer { width:"+$XSliderWidth+"px; height:"+$XSliderHeight+"px; position:relative; padding:0px; margin:0px; } "; 

        $navButtonSize =  Math.floor($XSliderHeight/18); 
        if ($navButtonSize < 8) { $navButtonSize=8;}
        if ($navButtonSize > 25) { $navButtonSize=25;}
        $navButtonMarg =  Math.floor($navButtonSize/6);
        $navWidth = ($navButtonSize+$navButtonMarg+$navButtonMarg) * $numSlides;
        $navHeight = ($navButtonSize+$navButtonMarg+$navButtonMarg);
        $navLocationTop = $XSliderHeight - ($navHeight*1.5);
        $navLocationLeft = ($XSliderWidth - $navWidth)/2;
        $styleText += "#externalNav img{ width:"+$navButtonSize+"px; height:"+$navButtonSize+"px; margin:"+$navButtonMarg+"px; } ";
        $styleText += "#externalNav { width:"+$navWidth+"px; height:"+$navHeight+"px; top:"+$navLocationTop+"px; left:"+$navLocationLeft+"px; margin:0px; padding:0px; position: absolute; } ";
        if ($numSlides > 1) {
            $styleText += "#externalNav { z-index: 300; } ";
        } else {
             $styleText += "#externalNav { z-index: -100; } ";
        }
        
        $playButtonSize = Math.floor($XSliderHeight/5);
        $playLocationTop = ($XSliderHeight - ($playButtonSize))/2;
        $playLocationLeft = ($XSliderWidth - ($playButtonSize))/2;
        $styleText += "#playButton { width:"+$playButtonSize+"px; height:"+$playButtonSize+"px; top:"+$playLocationTop+"px; left:"+$playLocationLeft+"px; position:absolute; z-index:500; cursor:pointer; } ";
        
        $closeButtonSize =  Math.floor($XSliderHeight/16);
        if ($closeButtonSize < 16) { $closeButtonSize=16;}
        if ($closeButtonSize > 35) { $closeButtonSize=35;}
        $closeLocationLeft = ($XSliderWidth - $closeButtonSize);
        $styleText += "#closeButton { width:"+$closeButtonSize+"px; width:"+$closeButtonSize+"px; top:0px; left:"+$closeLocationLeft+"px; position:absolute; z-index:700; cursor:pointer; } ";

        
        $styleText += "#youtube { width: "+$XSliderWidth+"px; height:"+$XSliderHeight+"px; position:absolute; top:0; left:0; z-index:600; } ";
        $styleText += "#imageSlider{ width:"+$XSliderWidth+"px; height:"+$XSliderHeight+"px; position:absolute; top:0px; left:0px; } ";
        $styleText += "#imageSlider img{ width:"+$XSliderWidth+"px; height:"+$XSliderHeight+"px; } ";
        
		$fontSize = $XSliderWidth/40;
        $captionHeight = Math.floor($XSliderHeight/8.5);
        $styleText += "#imageSlider .caption-bottom {font-size:"+$fontSize+"px}";
        $styleText += "#imageSlider .caption-bottom { width:"+$XSliderWidth+"px; height:"+$captionHeight+"px; padding:0.5em; background:#000; color:#fff; margin:0px; position:relative; z-index:10; opacity:0.8; filter:alpha(opacity=80); left:0px; bottom:0px; } ";
        
        $("#XSliderCSS").text($styleText);
        $('#imageSlider').anythingSlider();
    }
    $(window).load(function() {
        changeCSS();
    });
});
