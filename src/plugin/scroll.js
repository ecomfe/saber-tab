/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 选项卡控件
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var lang = require( 'saber-lang' );
    var SaberScroll = require( 'saber-scroll' );
    var plugin = require( 'saber-ui/plugin' );

    var Scroll = function( control ) {
        this.target = control;
        this.initialize.apply( this, [].slice.call( arguments, 1 ) );
    };

    Scroll.prototype = {

        /**
         * 插件类型标识
         * 
         * @private
         * @type {string}
         */
        type: 'Scroll',

        // TODO: 待优化为惰性初始化
        initialize: function ( options ) {
            var control = this.target;
            var scroller = this.instance = SaberScroll( control.main );
            var onRepaint = this.onRepaint = lang.bind(
                                                scroller.repaint,
                                                scroller
                                            );

            control.on( 'add', onRepaint );
            control.on( 'remove', onRepaint );
            control.on( 'afterdispose', lang.bind( this.dispose, this ) );

            // TODO: 暂时先这么用，待优化
            window.addEventListener( 'resize', onRepaint );
        },

        repaint: function () {
            this.instance.repaint();
        },

        dispose: function () {
            // TODO: 暂时先这么用，待优化
            window.removeEventListener( 'resize', this.onRepaint );
            
            this.instance.destroy();
            this.control = this.instance = this.onRepaint = null;
        },

        enable: function () {
            // TODO:
            // this.instance.enable();
        },

        disable: function () {
            // TODO:
            // this.instance.disable();
        }

    };

    plugin.register( Scroll );

    return Scroll;

});
