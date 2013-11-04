define(function() {

    var Tab = require( 'saber-tab' );

    var type = function ( obj ) {
        return Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase();
    };
    var getText = function( node ) {
        return node.textContent || node.innerText;
    };
    var container = document.getElementById( 'demo' );
    var tabs = [
        { title: 'tab1', panel: 'a' },
        { title: 'tab2', panel: 'b' },
        { title: 'tab3', panel: 'c' }
    ];

    describe( 'Tab', function () {

        it( 'should be a constructor', function () {
            expect( type( Tab ) ).toEqual( 'function' );
        });

        it( 'should be instantiable', function () {
            var t = new Tab();
            expect( type( t ) ).toEqual( 'object' );
            expect( t instanceof Tab ).toBeTruthy();
        });

        describe( 'create via script', function () {
            it( 'should have a `tabs` property even it is not passed via constructor', function () {
                var tab = new Tab();
                expect( type( tab.get( 'tabs' ) ) ).toEqual( 'array' );
            });
        });


        describe( 'created via HTML', function () {

            it( 'should leave existing `[data-role="navigator"]` element forever', function () {
                var main = document.createElement( 'div' );
                var html = [
                    '<ul data-role="navigator" data-test="true">',
                        '<li data-for="a">tab1</li>',
                    '</ul>'
                ];
                main.innerHTML = html.join( '\n' );
                var tab = new Tab( { main: main } );
                expect(
                    main.firstChild.getAttribute( 'data-test' )
                ).toBe( 'true' );
            });

            it( 'should find first child `ul` of main elment as navigator elment if no `[data-role="navigator"]` child exists', function () {
                var main = document.createElement( 'div' );
                var html = [
                    '<ul data-test="1">',
                        '<li data-for="a">tab1</li>',
                    '</ul>',
                    '<ul data-test="2">',
                        '<li data-for="b">tab2</li>',
                    '</ul>'
                ];
                main.innerHTML = html.join( '\n' );
                var tab = new Tab( { main: main } );
                expect( tab.get( 'tabs' ) ).toEqual(
                    [ { title: 'tab1', panel: 'a' } ]
                );
            });

            it( 'should extract `tabs` property from a `[data-role="navigator"]` child if it exists', function () {
                var main = document.createElement( 'div' );
                var html = [
                    '<div title="tab1" id="a"></div>',
                    '<ul data-role="navigator">',
                        '<li data-for="a">tab1</li>',
                        '<li data-for="b">tab2</li>',
                        '<li data-for="c">tab3</li>',
                    '</ul>',
                    '<div title="tab2" id="b"></div>'
                ];
                main.innerHTML = html.join( '\n' );
                var tab = new Tab( { main: main } );
                expect( tab.get( 'tabs' ) ).toEqual( tabs );
            });

            it( 'should extract `tabs` property from first ul child if no `[data-role="navigator"]` child exists', function () {
                var main = document.createElement( 'div' );
                var html = [
                    '<div title="tab1" id="a"></div>',
                    '<ul>',
                        '<li data-for="a">tab1</li>',
                        '<li data-for="b">tab2</li>',
                        '<li data-for="c">tab3</li>',
                    '</ul>',
                    '<div title="tab2" id="b"></div>',
                    '<ul>',
                        '<li data-for="d">tab4</li>',
                        '<li data-for="e">tab5</li>',
                        '<li data-for="f">tab6</li>',
                    '</ul>'
                ];
                main.innerHTML = html.join( '\n' );
                var tab = new Tab( { main: main } );
                expect( tab.get( 'tabs' ) ).toEqual( tabs );
            });

            it( 'should not override `tabs` option given from constructor if the main element has a `[data-role="navigator"]` child', function () {
                var main = document.createElement( 'div' );
                var html = [
                    '<ul data-role="navigator">',
                        '<li data-for="a">tab1</li>',
                        '<li data-for="b">tab2</li>',
                        '<li data-for="c">tab3</li>',
                    '</ul>'
                ];
                main.innerHTML = html.join( '\n' );
                var newTabs = [
                    { title: 'tab1', panel: 'a' }
                ];
                var tab = new Tab( { main: main, tabs: newTabs } );
                expect( tab.get('tabs') ).toEqual( tabs );
            });

            it( 'should add `ui-tab-navigator` class to the existing navigator element', function () {
                var main = document.createElement( 'div' );
                var html = [
                    '<ul data-role="navigator" data-test="true">',
                        '<li data-for="a">tab1</li>',
                    '</ul>'
                ];
                main.innerHTML = html.join( '\n' );
                var tab = new Tab( { main: main } );
                tab.appendTo( container );
                expect(
                    main.querySelector( '[data-role="navigator"]' ).className
                ).toMatch( 'ui-tab-navigator' );
            });

            it( 'should add `ui-tab-item` class to all child of navigator elment', function () {
                var main = document.createElement( 'div' );
                var html = [
                    '<ul data-role="navigator" data-test="true">',
                        '<li data-for="a">tab1</li>',
                        '<li>tab2</li>',
                        '<li title="tab3"></li>',
                    '</ul>'
                ];
                main.innerHTML = html.join( '\n' );
                var tab = new Tab( { main: main } );
                tab.appendTo( container );
                expect(
                    main.querySelectorAll(
                        '[data-role="navigator"] > li.ui-tab-item'
                    ).length
                ).toEqual( 3 );
            });

        });

        describe( 'generally', function () {

            it( 'should create a navigator `<ul>` element', function () {
                var tab = new Tab( { tabs: tabs } );
                tab.appendTo( container );
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                expect( ul ).toBeDefined();
                expect( ul.children.length ).toBe( 3 );
                expect( getText( ul.children[ 0 ] ) ).toBe( 'tab1' );
                expect( getText( ul.children[ 1 ] ) ).toBe( 'tab2' );
                expect( getText( ul.children[ 2 ] ) ).toBe( 'tab3' );
            });

            it( 'should add `ui-tab-navigator` class to the navigator element', function () {
                var tab = new Tab( { tabs: tabs } );
                tab.appendTo( container );
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                expect( ul.className ).toMatch( /ui-tab-navigator/ );
            });

            it( 'should rerender navigator `<ul>` element if `tabs` is changed via `setProperties`', function () {
                var tab = new Tab( { tabs: tabs } );
                tab.appendTo( container );
                tab.setProperties({
                    tabs: [
                        { title: 'tab4', panel: 'd' }
                    ]
                });
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                expect( ul ).toBeDefined();
                expect( ul.children.length ).toBe( 1 );
                expect( getText( ul.children[ 0 ] ) ).toBe( 'tab4' );
            });

            it( 'should reset `activeIndex` to 0 if `tabs` is changed via `setProperties` and current `activeIndex` is out of range', function () {
                var tab = new Tab( { tabs: tabs, activeIndex: 2 } );
                tab.appendTo( container );
                tab.setProperties({
                    tabs: [
                        { title: 'tab4', panel: 'd' }
                    ]
                });
                expect( tab.get( 'activeIndex' ) ).toBe( 0 );
            });

            it( 'should add a `ui-tab-item-active` class for selected tab', function () {
                var tab = new Tab( { tabs: tabs, activeIndex: 1 } );
                tab.appendTo(container);
                var tabElement = tab.get( 'main' ).querySelectorAll( 'li' )[ 1 ];
                expect( tabElement.className ).toMatch( /ui-tab-item-active/ );
            });

            it( 'should change the `display` style of all panel when tab is rendered', function () {
                var html = [
                    '<div id="a"></div>',
                    '<div id="b"></div>',
                    '<div id="c"></div>'
                ];
                container.innerHTML = html.join( '\n' );
                var tab = new Tab( { tabs: tabs, activeIndex: 1 } );
                tab.appendTo( container );
                expect(
                    document.querySelector( '#a' ).style.display
                ).toBe( 'none' );
                expect(
                    document.querySelector( '#b' ).style.display
                ).toBe( '');
                expect(
                    document.querySelector( '#c' ).style.display
                ).toBe( 'none' );
            });

            it( 'should hide all panel if a tab without `panel` property is activated', function () {
                var html = [
                    '<div id="a"></div>',
                    '<div id="b"></div>'
                ];
                container.innerHTML = html.join( '\n' );
                var tab = new Tab({
                    tabs: [
                        { title: 'tab1', panel: 'a' },
                        { title: 'tab2', panel: 'b' },
                        { title: 'tab3' }
                    ], 
                    activeIndex: 2
                });
                tab.appendTo( container );
                expect(
                    document.querySelector( '#a' ).style.display
                ).toBe( 'none' );
                expect(
                    document.querySelector( '#b' ).style.display
                ).toBe( 'none' );
            });

            it( 'should correctly adjust tab element and relative panel when `select` is called', function () {
                var html = [
                    '<div id="a"></div>',
                    '<div id="b"></div>',
                    '<div id="c"></div>'
                ];
                container.innerHTML = html.join( '\n' );
                var tab = new Tab( { tabs: tabs, activeIndex: 1 } );
                tab.appendTo( container );
                tab.select( 2 );
                expect( tab.get( 'activeIndex' ) ).toBe( 2 );
                expect(
                    document.querySelector( '#a' ).style.display
                ).toBe('none');
                expect(
                    document.querySelector( '#b' ).style.display
                ).toBe('none');
                expect(
                    document.querySelector( '#c' ).style.display
                ).toBe('');
            });

            it( 'should activate the tab when it is clicked', function () {
                var tab = new Tab( { tabs: tabs, activeIndex: 1 } );
                tab.appendTo( container );
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                ul.children[0].click();
                expect( tab.get( 'activeIndex' ) ).toBe( 0 );
            });

            it( 'should add a tab config & element at the tail when `add` is called', function () {
                var tab = new Tab( { tabs: tabs.slice() } );
                tab.appendTo( container );
                var newTab = { title: 'tab4', panel: 'd' };
                tab.add( newTab );
                expect( tab.get( 'tabs' )[ 3 ] ).toEqual( newTab );
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                expect( ul.children.length ).toBe( 4 );
                expect( getText( ul.children[ 3 ] ) ).toBe( 'tab4' );
            });

            it( 'should add a tab config & element at the given position when `insert` is called', function () {
                var tab = new Tab( { tabs: tabs.slice() } );
                tab.appendTo( container );
                var newTab = { title: 'tab4', panel: 'd' };
                tab.insert( newTab, 2 );
                expect( tab.get( 'tabs' )[ 2 ] ).toEqual( newTab );
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                expect( ul.children.length ).toBe( 4 );
                expect( getText( ul.children[ 2 ] ) ).toBe( 'tab4' );
            });

            it( 'should add a tab at first if `index` is less than 0 when `insert` is called', function () {
                var tab = new Tab( { tabs: tabs.slice() } );
                tab.appendTo( container );
                var newTab = { title: 'tab4', panel: 'd' };
                tab.insert( newTab, -1 );
                expect( tab.get( 'tabs' )[ 0 ]).toEqual( newTab );
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                expect( ul.children.length ).toBe( 4 );
                expect( getText( ul.children[ 0 ] ) ).toBe( 'tab4' );
            });

            it( 'should add a tab at last if `index` is out of range when `insert` is called', function () {
                var tab = new Tab( { tabs: tabs.slice() } );
                tab.appendTo( container );
                var newTab = { title: 'tab4', panel: 'd' };
                tab.insert( newTab, 10 );
                expect( tab.get( 'tabs' )[ 3 ] ).toEqual( newTab );
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                expect( ul.children.length ).toBe( 4 );
                expect( getText( ul.children[ 3 ] ) ).toBe( 'tab4' );
            });

            it( 'should change `activeIndex` correctly when a tab is inserted', function () {
                var tab = new Tab( { tabs: tabs.slice(), activeIndex: 1 } );
                tab.appendTo( container );
                tab.insert( { title: 'tab4', panel: 'd' }, 0 );
                expect( tab.get( 'activeIndex' ) ).toBe( 2 );
            });

            it( 'should hide a newly added tab\'s target panel', function () {
                container.innerHTML = '<div id="d"></div>';
                var tab = new Tab( { tabs: tabs.slice(), activeIndex: 1 } );
                tab.appendTo( container );
                tab.add( { title: 'tab4', panel: 'd' } );
                expect(
                    document.querySelector( '#d' ).style.display
                ).toBe( 'none' );
            });

            it( 'should remove a tab config & element when `remove` is called', function () {
                var tab = new Tab( { tabs: tabs.slice() } );
                tab.appendTo( container );
                tab.remove( tab.get( 'tabs' )[ 1 ] );
                expect( tab.get( 'tabs' ).length ).toBe( 2 );
                expect( tab.get( 'tabs' )[ 0 ] ).toEqual(
                    { title: 'tab1', panel: 'a' }
                );
                expect( tab.get( 'tabs' )[ 1 ] ).toEqual(
                    { title: 'tab3', panel: 'c' }
                );
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                expect( ul.children.length ).toBe( 2 );
                expect( getText(ul.children[0]) ).toBe( 'tab1' );
                expect( getText(ul.children[1]) ).toBe( 'tab3' );
            });

            it( 'should remove a tab config & element when `removeByIndex` is called', function () {
                var tab = new Tab( { tabs: tabs.slice() } );
                tab.appendTo( container );
                tab.removeByIndex( 1 );
                expect( tab.get( 'tabs' ).length ).toBe( 2 );
                expect( tab.get( 'tabs' )[ 0 ] ).toEqual(
                    { title: 'tab1', panel: 'a' }
                );
                expect( tab.get( 'tabs' )[ 1 ] ).toEqual(
                    { title: 'tab3', panel: 'c' }
                );
                var ul = tab.get( 'main' ).querySelector( 'ul' );
                expect( ul.children.length ).toBe(2);
                expect( getText( ul.children[ 0 ] ) ).toBe( 'tab1' );
                expect( getText( ul.children[ 1 ] ) ).toBe( 'tab3' );
            });

            it( 'should reset `activeIndex` to the next one if the active tab is removed', function () {
                var tab = new Tab( { tabs: tabs.slice(), activeIndex: 1 } );
                tab.appendTo( container );
                tab.removeByIndex( 1 );
                expect( tab.get( 'activeIndex' ) ).toBe( 1 );
                expect(
                    tab.get( 'main' ).querySelectorAll( 'li' )[ 1 ].className
                ).toMatch( /ui-tab-item-active/ );
            });

            it( 'should set active tab to the last one if the last tab is active and removed', function () {
                var tab = new Tab( { tabs: tabs.slice(), activeIndex: 2 } );
                tab.appendTo( container );
                tab.removeByIndex( 2 );
                expect( tab.get( 'activeIndex' ) ).toBe( 1 );
                expect(
                    tab.get( 'main' ).querySelectorAll( 'li' )[ 1 ].className
                ).toMatch( /ui-tab-item-active/ );
            });

            it( 'should keep the current active tab if `tabs` is changed but current active tab still exists', function () {
                var tab = new Tab( { tabs: tabs, activeIndex: 1 } );
                tab.appendTo( container );
                tab.set( 'tabs', tabs.slice( 1, 2 ) );
                expect( tab.get( 'activeIndex' ) ).toBe( 0 );
                expect(
                    tab.get( 'main' ).querySelectorAll( 'li' )[ 0 ].className
                ).toMatch( /ui-tab-item-active/ );
            });

            it( 'should set `activeIndex` to -1 if the last tab is removed', function () {
                var tab = new Tab( { tabs: tabs.slice(0, 1), activeIndex: 0 } );
                tab.appendTo( container );
                tab.removeByIndex( 0 );
                expect( tab.get( 'activeIndex' ) ).toBe( -1 );
            });

            it( 'should hide the related panel if a tab is removed', function () {
                var html = [
                    '<div id="a"></div>',
                    '<div id="b"></div>',
                    '<div id="c"></div>'
                ];
                container.innerHTML = html.join( '\n' );
                var tab = new Tab( { tabs: tabs.slice(), activeIndex: 1 } );
                tab.appendTo( container );
                tab.removeByIndex( 1 );
                expect(
                    document.querySelector( '#b' ).style.display
                ).toBe( 'none' );
            });

            it( 'should set the newly added tab active if it is the only one', function () {
                container.innerHTML = '<div id="a"></div>';
                var tab = new Tab();
                tab.appendTo( container );
                tab.add( tabs.slice( 0, 1 ) );
                expect( tab.get( 'activeIndex' ) ).toBe( 0 );
                expect( document.getElementById( 'a' ).style.display ).toBe( '' );
            });

        });

    });

});
