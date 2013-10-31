/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 选项卡控件
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var ui = require( 'saber-ui' );
    var lang = require( 'saber-lang' );
    var string = require( 'saber-string' );
    var dom = require( 'saber-dom' );
    var helper = require( 'saber-control/helper' );
    var Control = require( 'saber-control' );

    /**
     * 选项卡控件
     * 
     * @exports Tab
     * @extends module:Control
     * @requires ui
     * @requires lang
     * @requires dom
     * @requires Control
     * @fires module:Tab#click
     * @fires module:Tab#change
     * @fires module:Tab#close
     */
    var Tab = function() {
        Control.apply( this, arguments );
    };

    Tab.prototype = {

        /**
         * 控件类型标识
         * 
         * @private
         * @type {string}
         */
        type: 'Tab',

        /**
         * 当前活动的标签页的索引
         * 
         * @private
         * @type {number}
         */
        activeIndex: 0,

        /**
         * 标签页内容的模板
         * 
         * @private
         * @type {string}
         */
        itemTemplate: '${title}',

        /**
         * 标签页的列表
         * 
         * @private
         * @type {Array}
         * @example
         * // 每一项是具有title和panel属性的Object。
         * // title属性为字符串，代表显示的标题。
         * // panel属性指定一个容器HTMLElement的id，为可选属性。
         * [
         *      { title: 'one', panel: 'panel1' },
         *      { title: 'two', panel: 'panel2' },
         *      { title: 'three', panel: 'panel3' },
         *      { title: 'four' }
         * ]
         */
        tabs: [],

        init: function ( options ) {
            var properties = lang.extend( {
                tabs: this.tabs
            }, options );

            // 若静态化解析构建时，初始化参数值都是字符串，这里多做下转换
            properties.activeIndex = properties.activeIndex | 0;

            // 找到了`[data-role="navigator"]`的元素，抛弃其它配置，
            // 否则，尝试找到第一个ul子元素，找到同上
            // 且这个配置会覆盖用户传入的`tabs`选项
            var trigger = dom.query( '[data-role=navigator]', this.main )
                || dom.query( 'ul', this.main );
            if ( trigger ) {
                // 清空用户传入的配置数据
                properties.tabs = [];

                // 存储选项卡对应元素，减少后续的dom查询次数
                this.triggers = [].slice.call( dom.queryAll( 'li', trigger ) );

                // 解析DOM重新生成`options`.`tabs`配置数据
                this.triggers.forEach(
                    function ( node ) {
                        // 添加部件相关样式
                        helper.addPartClasses( this, 'item', node );

                        // 生成对应配置参数并存储，待最后更新
                        properties.tabs.push({
                            title: node.innerText,
                            panel: node.getAttribute( 'data-for' )
                        });
                    },
                    this
                );

                // 这里做下存储，给`initStructrue`用下
                this.trigger = trigger;
            }

            this.setProperties( properties );
        },

        /**
         * 初始化DOM结构，仅在第一次渲染时调用
         * 
         * @override
         */
        initStructure: function () {
            var trigger = this.trigger;
            var selectedIndex = this.selectedIndex;

            // 到这里已经没用了
            this.trigger = null;
            delete this.trigger;

            // 若`init`执行后，不存在`trigger`变量，
            // 则需要动态构建必要结构`ul > li * n`
            if ( !trigger ) {
                trigger = document.createElement( 'ul' );
                this.main.insertBefore(
                    trigger,
                    this.main.firstChild || null
                );

                // 根据用户传入配置`options`.`tabs`
                // 自动创建所有tab
                var triggers = [];
                this.tabs.forEach(function ( tabItem, i ) {
                    var li = createTabElement(
                        this,
                        tabItem,
                        i === selectedIndex
                    );
                    triggers.push( li );
                    trigger.appendChild( li );
                }, this);

                // 存储选项卡对应元素，减少后续的dom查询次数
                this.triggers = triggers;
            }

            // 初始化`navigator`元素相关属性、样式及事件
            trigger.id = helper.getId( this, 'navigator' );
            helper.addPartClasses( this, 'navigator', trigger );
            this.addDOMEvent( trigger, 'click', lang.bind( clickTab, this) );

            // 激活默认项
            activateTab( this, this.activeIndex );
        },

        /**
         * 创建控件主元素
         * 
         * @override
         * @param {Object} options 构造函数传入的配置参数
         * @return {HTMLElement}
         */
        createMain: function () {
            return document.createElement('div');
        },

        /**
         * 重新渲染视图
         * 首次渲染时, 不传入 changes 参数
         * 
         * @override
         * @param {Object=} changes 变更过的属性的集合
         */
        repaint: function ( changes ) {
            if ( changes && changes.hasOwnProperty( 'activeIndex' ) ) {
                activateTab( this, changes.activeIndex.newValue );
            }
        },

        /**
         * 切换选项卡前校验
         * 主要给予使用者更多的灵活控制，默认返回true，不允许切换则需返回false
         * 
         * @public
         * @param {number} oldIndex 原选中项索引值
         * @param {number} newIndex 新选中项索引值
         * @return {boolean} 是否执行切换
         */
        onBeforeChange: function ( oldIndex, newIndex ) {
            return true;
        },

        add: function ( tabItem ) {
            // TODO
        },

        insert: function( tabItem, index ) {
            // TODO
        },

        remove: function ( tabItem ) {
            // TODO
        },

        removeByIndex: function ( index ) {
            // TODO
        },

        /**
         * 选择激活标签
         * 
         * @public
         * @param {number} index tab标签索引
         */
        select: function ( index ) {
            if ( index !== this.activeIndex && this.triggers[ index ] ) {
                this.set( 'activeIndex', index );
            }
        },

        /**
         * 获取标签页内容的HTML
         * 
         * @public
         * @param {Object} tabItem 标签页数据项
         * @return {string}
         */
        getItemHTML: function ( tabItem ) {
            return string.format(
                this.itemTemplate,
                {
                    title: string.encodeHTML( tabItem.title )
                }
            );
        }

    };


    /**
     * 点击某个标签时的切换逻辑
     * 
     * @inner
     * @param {Tab} this Tab控件实例
     * @param {Event} ev 触发事件的事件对象
     */
    function clickTab( ev ) {
        var main = this.main;
        var target = ev.target;
        var tabElement = target;
        while ( tabElement && tabElement.nodeName !== 'LI' ) {
            // 尽量减少回溯深度，最多回溯至主控元素
            if ( main === tabElement ) return;
            tabElement = tabElement.parentNode;
        }

        if ( tabElement && tabElement.nodeName === 'LI' ) {
            this.triggers.some(
                function ( tab, i ) {
                    if ( tab === tabElement ) {
                        // 如果点在关闭区域上，则移除这个元素，
                        // 其它情况为激活该元素
                        var cls = helper.getPartClasses( this, 'close' )[ 0 ];
                        if ( dom.hasClass( target, cls ) ) {
                            this.removeByIndex( i );
                        }
                        else {
                            this.set( 'activeIndex', i );
                        }
                        return true;
                    }
                },
                this
            );
        }
    }

    /*
     * 激活指定位置的标签页
     * 
     * @inner
     * @param {Tab} tab Tab控件实例
     * @parma {number} index 待激活的标签页的下标
     */
    function activateTab( tab, index ) {
        if ( tab.onBeforeChange( tab.activeIndex, index ) === false ) {
            return;
        }

        tab.tabs.forEach(function ( tabItem, i ) {
            var panel = tabItem.panel && dom.g( tabItem.panel );
            if ( panel ) {
                dom[ i === index ? 'show' : 'hide' ]( panel );
            }

            helper[
                i === index ? 'addPartClasses' : 'removePartClasses'
            ]( tab, 'item-active', tab.triggers[ i ] );
        });

        tab.emit( 'change', { index: index, tab: tab.tabs[ index ] } );
    }


    /**
     * 创建一个标签元素
     * 
     * @inner
     * @param {Tab} tab 控件实例
     * @param {Object} tabItem 标签页的配置
     * @param {string} tabItem.title 标签页的标题
     * @param {string=} tabItem.panel 标签页对应容器元素的id
     * @param {boolean} isActive 是否自激活状态
     */
    function createTabElement( tab, tabItem, isActive ) {
        var element = document.createElement('li');

        helper.addPartClasses( tab, 'item', element );

        if ( isActive ) {
            helper.addPartClasses( tab, 'item-active', element );
        }

        if ( tabItem.panel ) {
            element.setAttribute( 'data-for', tabItem.panel );
        }

        element.innerHTML = tab.getItemHTML( tabItem );

        return element;
    }

    lang.inherits( Tab, Control );

    ui.register( Tab );

    return Tab;

});
