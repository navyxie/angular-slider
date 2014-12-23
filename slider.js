'use strict';
angular.module('kaolaApp.sliderDirective',[])
.directive('slider',['$document',function($document){
    var vDown = 'mousedown',vMove = 'mousemove',vEnd = 'mouseup',vCancle = 'mouseout';
    if("ontouchend" in document){
        vDown = 'touchstart';
        vMove = 'touchmove';
        vEnd = 'touchend';
        vCancle = 'touchcancel';
    }
    //move direction
    function moveDirection(x1, x2, y1, y2,direction) {
        direction = direction || 'h';
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
        (direction === 'h') ? xDelta : yDelta;
        return xDelta >= yDelta ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down')
    }
    function getPage(event){
        return event.touches && event.touches.length ? event.touches[0] : event;
        // var touches = event.touches && event.touches.length ? event.touches : [event];
        // var e = (event.changedTouches && event.changedTouches[0]) ||
        //     (event.originalEvent && event.originalEvent.changedTouches &&
        //         event.originalEvent.changedTouches[0]) ||
        //     touches[0].originalEvent || touches[0];
        // return {
        //   pageX: e.clientX,
        //   pageY: e.clientY
        // };
    }
    return {
        restrict:'ECA',
        transclude: true,
        scope:{
            cursorWidth:'@cursorWidth',
            cursorHeight:'@cursorHeight',
            slideWidth:'@slideWidth',
            slideHeight:'@slideHeight',
            slideSpace:'@slideSpace',
            slideStart:'@slideStartpos',
            direction:'@slideDirection',
            endCbf:'&slideEndcbf',
            moveCbf:'&slideMovecbf'
        },
        template:'<div class="slideContainer" style="position:relative;"><div class="slideCursor" style="position:absolute;"></div></div>',
        link:function(scope,element,attr){
            var cursorWidth = scope.cursorWidth || 16;//slide cursor width
            var cursorHeight = scope.cursorHeight || cursorWidth;
            var slideWidth = scope.slideWidth;//slide bar width
            var slideHeight = scope.slideHeight || 12;
            var slideSpace = scope.slideSpace || 1;  //move space
            var slideStart = scope.slideStart ? parseInt(scope.slideStart,10) : undefined;//user custom slide start position
            var direction = direction || 'h'; //slide direction ,default horizontal
            var vDirection = direction === 'h';
            var topHalf = (cursorHeight-slideHeight)/2;
            var leftHalf = (cursorWidth/2);
            var minStart = vDirection ? leftHalf : topHalf;
            var defaultTop = slideStart ? (vDirection ? -topHalf : slideStart) : -topHalf;//slide cursor css top value
            var defaultLeft = slideStart ? (vDirection ? slideStart : -leftHalf) : -leftHalf;//slide cursor css left value
            var endCbf = scope.endCbf || angular.noop();//slide end callback
            var moveCbf = scope.moveCbf || angular.noop();//slide move callback
            var slideMax,slideMin,moveFlag;
            var x1 = 0;
            var x2 = 0;
            var y1 = 0;
            var y2 = 0;
            var moveDistance = 0;
            var startDistance = 0;
            var slideContainer = element.children(); //slide bar angular dom                     
            slideContainer.css({height:slideHeight+'px',width:slideWidth ? slideWidth+'px' : "100%"});
            var slideCursor = slideContainer.children(); // slide cursor angular dom
            slideCursor.css({width:cursorWidth+'px',height:cursorHeight+'px',top:defaultTop + 'px',left:defaultLeft + 'px'});      
            var slideContainerWidth = slideContainer[0].clientWidth;//slide bar width ,not contain borderwidth
            slideMax = slideContainerWidth - minStart;//slide cursor can move max distance
            slideMin = -minStart;//slide cursor can move min distance
            startDistance = slideStart ? slideStart : slideMin;//slide cursor default start move distance

            slideStart && moveCbf({distance:slideStart,slideWidth:slideContainerWidth}) && endCbf({distance:slideStart,slideWidth:slideContainerWidth});//call moveCbf and endCbf, if custom slide start position
            slideCursor.on(vDown,handlerStart); 
            $document.on(vEnd,handlerEnd);

            function handlerStart(e){
                moveFlag = true;
                var pageCursor = getPage(e);
                x1 = pageCursor.pageX;
                y1 = pageCursor.pageY;
                $document.on(vMove,handlerMove);             
            }

            function handlerMove(e){
                if (!moveFlag) return;
                e.preventDefault();    
                var pageCursor = getPage(e);
                x2 = pageCursor.pageX;
                y2 = pageCursor.pageY;
                moveDistance = vDirection ? x2-x1 : y2 - y1;
                if(moveDistance === 0 || moveDistance%slideSpace !== 0){
                    return;
                }    
                var total = startDistance+moveDistance; 
                total = Math.min(total,slideMax);
                if(total <= slideMin){
                    total = slideMin;
                }         
                setSlideCursorPos(total);
                moveCbf({distance:total-slideMin,slideWidth:slideContainerWidth});
            }

            function handlerEnd(e){
                if (!moveFlag) return;
                moveFlag = false;
                startDistance += moveDistance;
                startDistance = Math.min(startDistance,slideMax);
                if(startDistance <= slideMin){
                    startDistance = slideMin;
                }  
                $document.off(vMove,handlerMove);
                endCbf({distance:startDistance-slideMin,slideWidth:slideContainerWidth});
            }
            //set slide cursor css position
            function setSlideCursorPos(distance){          
                vDirection ? slideCursor.css({left:distance+'px'}) : slideCursor.css({'top':distance+'px'});
            }

            // remove event when slide destroy
            element.on('$destroy',function(){
                slideCursor.off(vDown,handlerStart);  
                $document.off(vEnd,handlerEnd);
            });
        }
    }
}]);