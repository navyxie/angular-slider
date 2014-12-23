angular-slider
==============
Slider directive implementation for AngularJS, without jQuery dependencies.


Example:

    javascript :

    angular.module('app', ['kaolaApp.sliderDirective']);

    html :

    ```html
    <pre>
        <div class="slider" slide-width=500 cursor-width = 20 cursor-height=30 slide-startpos = 100 slide-movecbf="handlerCbf(distance,slideWidth)"></div>
    </pre>
    
    html attribute config :

        cursorWidth:'@cursorWidth', //slide cursor width
        cursorHeight:'@cursorHeight',//slide cursor height
        slideWidth:'@slideWidth',//slide bar width
        slideHeight:'@slideHeight',//slide bar height 
        slideSpace:'@slideSpace',//slide cursor can move space
        slideStart:'@slideStartpos',//slide cursor default position 
        direction:'@slideDirection',//slide bar direction, default horizontal
        endCbf:'&slideEndcbf',//slide cursor end callback
        moveCbf:'&slideMovecbf'//slide cursor move callback
