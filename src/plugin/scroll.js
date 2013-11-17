/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 选项卡滚动插件
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var lang = require( 'saber-lang' );
    var css = require( 'saber-dom/css' );
    var SaberScroll = require( 'saber-scroll' );
    var plugin = require( 'saber-ui/plugin' );

    /**
     * 选项卡滚动插件
     * 
     * @constructor
     * @exports TabScroll
     * @class
     * @requires saber-lang
     * @requires saber-scroll
     * @requires saber-ui/plugin
     * @param {Tab} tab 选项卡控件实例
     * @param {Object=} options 插件配置项
     * 此参数不做加工过滤，直接传给`saber-scroll`构造函数
     */
    var Scroll = function( tab ) {
        this.target = tab;
        this.initialize.apply( this, [].slice.call( arguments, 1 ) );
    };

    Scroll.prototype = {

        /**
         * 插件类型标识
         * 
         * @private
         * @type {string}
         */
        type: 'TabScroll',

        /**
         * 插件初始化
         * 
         * @protected
         * @param {Object} options 构造函数传入的配置参数
         * 此参数不做加工过滤，直接传给`saber-scroll`构造函数
         */
        initialize: function ( options ) {
            this.options = options || {};
            this.target.on( 'afterrender', lang.bind( this.render, this ));
        },

        /**
         * 渲染插件
         * 
         * @public
         */
        render: function () {
            if ( this.rendered ) {
                return;
            }

            this.rendered = !0;

            var tab = this.target;
            css.setStyle( tab.main, 'overflow', 'hidden' );

            var scroller = this.instance = SaberScroll(
                                                tab.main,
                                                this.options
                                            );
            var onRepaint = this.onRepaint = lang.bind(
                                                scroller.repaint,
                                                scroller
                                            );
            tab.on( 'add', onRepaint );
            tab.on( 'remove', onRepaint );
            // TODO: 暂时先这么用，待优化
            window.addEventListener( 'resize', onRepaint );

            var onEnable = lang.bind( this.enable, this );
            tab.on( 'enable', onEnable );
            tab.on( 'show', onEnable );

            var onDisable = lang.bind( this.disable, this );
            tab.on( 'disable', onDisable );
            tab.on( 'hide', onDisable );
        },

        /**
         * 销毁插件
         * 
         * @public
         */
        dispose: function () {
            // TODO: 暂时先这么用，待优化
            window.removeEventListener( 'resize', this.onRepaint );
            
            this.instance.destroy();

            this.target = this.instance = this.onRepaint = null;
        },

        /**
         * 启用插件
         * 
         * @public
         */
        enable: function () {
            // TODO: 待`saber-scroll`实现API
            // this.instance.enable();
            this.instance.repaint();
        },

        /**
         * 禁用插件
         * 
         * @public
         */
        disable: function () {
            // TODO: 待`saber-scroll`实现API
            // this.instance.disable();
        },

        /**
         * 重置插件
         * 
         * @public
         */
        repaint: function () {
            this.instance.repaint();
        }

    };

    plugin.registerPlugin( Scroll );

    return Scroll;

});
