/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 选项卡滚动插件
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var lang = require( 'saber-lang' );
    var dom = require( 'saber-dom' );
    var SaberScroll = require( 'saber-scroll' );
    var plugin = require( 'saber-ui/plugin' );
    var helper = require( 'saber-control/helper' );

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
         * 选项卡控件实例
         * 
         * @public
         * @type {Tab=}
         */
        target: null,

        /**
         * 插件初始化
         * 
         * @protected
         * @param {Object} options 构造函数传入的配置参数
         * 此参数不做加工过滤，直接传给`saber-scroll`构造函数
         */
        initialize: function ( options ) {
            this.options = options || {};

            // 当目标控件是经过静态化构建而来时（`ui.init`）
            // 插件的配置对象的每项值均为字符串，这里需要做下转化以免出现校验错误
            [
                'scrollbar', 'horizontal', 'vertical'
            ].forEach(function ( key ) {
                if ( this.hasOwnProperty( key ) ) {
                    // 静态化构建时，所有属性值从DOM属性而来，均是字符串
                    // 用正则，而没用`!!`，是因为：
                    // 插件的配置项有些是默认为`true`
                    // 如果静态话配置是`'false'`时，`!!'false'`就失效了为`true`
                    // TODO：找到更好的方式后再替换
                    this[ key ] = /\s?true\s?/i.test( this[ key ] );
                }
            }, this.options);

            if ( this.target.rendered ) {
                this.render();
            }
            else {
                this.target.on(
                    'afterrender',
                    this.onRender = lang.bind( this.render, this )
                );
            }
        },

        /**
         * 初始化DOM结构，仅在第一次渲染时调用
         * 
         * @protected
         */
        initStructure: function () {
            var tab = this.target;
            var trigger = dom.g( helper.getId( tab, 'navigator' ) );

            // 初始化前需要确保`saber-scroll`的标准结构复合要求
            // `<container><main>...</main></container>`
            // 
            // 1. 查找`scroller`部件元素，并检查是否为`控件主元素`的`第一子元素`
            //    若没找到，则自动创建并插入到第一子元素位置
            //    若找到，但不是第一子元素，则直接移动到第一子元素位置
            var firstChild = tab.main.children[ 0 ];
            var scroller = dom.query( '[data-role=scroll]', tab.main );
            if ( firstChild !== scroller ) {
                if ( !scroller ) {
                    scroller = document.createElement( 'div' );
                    scroller.setAttribute( 'data-role', 'scroll' );
                }

                tab.main.insertBefore( scroller, firstChild );
                scroller.appendChild( trigger );
            }

            // 确保`scroller`部件元素设置了正确的`id`和`部件样式`
            scroller.id = helper.getId( tab, 'scroller' );
            helper.addPartClasses( tab, 'scroller', scroller );

            // 这里最后检查并确保`navigator`部件元素
            // 是`scroller`部件元素的`第一子元素`
            if ( scroller.children[ 0 ] !== trigger ) {
                scroller.insertBefore( trigger, scroller.children[ 0 ] );
            }

            dom.setStyle( tab.main, 'overflow', 'hidden' );
        },

        /**
         * 初始化所有事件监听
         * 
         * @protected
         */
        attachEvents: function () {
            var tab = this.target;
            var scroller = this.instance;
            var onRepaint = this.onRepaint = lang.bind(
                                                scroller.repaint,
                                                scroller
                                            );
            tab.on( 'add', onRepaint );
            tab.on( 'remove', onRepaint );
            // TODO: 暂时先这么用，待优化
            window.addEventListener( 'resize', onRepaint );

            var onEnable = this.onEnable = lang.bind( this.enable, this );
            tab.on( 'enable', onEnable );
            tab.on( 'show', onEnable );

            var onDisable = this.onDisable = lang.bind( this.disable, this );
            tab.on( 'disable', onDisable );
            tab.on( 'hide', onDisable );
        },

        /**
         * 释放所有事件监听
         * 
         * @protected
         */
        detachEvents: function() {
            var tab = this.target;

            tab.off( 'afterrender', this.onRender );

            // TODO: 暂时先这么用，待优化
            window.removeEventListener( 'resize', this.onRepaint );
            tab.off( 'add', this.onRepaint );
            tab.off( 'remove', this.onRepaint );

            tab.off( 'enable', this.onEnable );
            tab.off( 'show', this.onEnable );
            
            tab.off( 'disable', this.onDisable );
            tab.off( 'hide', this.onDisable );
            
            this.onRender = this.onRepaint
                          = this.onEnable
                          = this.onDisable
                          = null;
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

            this.initStructure();

            this.instance = SaberScroll(
                                this.target.main,
                                this.options
                            );

            this.attachEvents();
        },

        /**
         * 销毁插件
         * 
         * @public
         */
        dispose: function () {
            this.detachEvents();
            this.instance.scrollTo( 0, 0 );
            this.instance.destroy();
            this.target = this.instance = null;
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
