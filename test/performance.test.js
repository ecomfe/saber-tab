define(function() {


    return function ( options ) {
        var ui = options.ui;
        var Tab = options.Tab;
        var wrapper = options.wrapper;
        var outputer = options.outputer;

        describe( 'created via HTML', function () {
            // tabs.length := Math.pow( 2, POWER )
            var POWER = options.power || 7;
            var EXPECT_TIME = options.expectTime || 1000; // ms
            var logs = []; // logs of result
            var tabs = []; // instances of Tab
            var rIndex = /\${i}/ig;

            // AOP
            afterEach(function () {
                // dispose all tabs & empty wrapper
                tabs.forEach(function ( tab ) {
                    tab.dispose && tab.dispose();
                });
                tabs = [];
                wrapper.innerHTML = '';

                // output result stat
                var log = logs[ logs.length - 1 ];
                outputer.innerHTML += ''
                    + '<li>'
                    + log.size + ' : ' + log.time + '<i>ms</i>'
                    + '</li>';
            });


            function doTask( html, power ) {
                html = html || '';
                power = power || 0;
                
                var _html = html.replace( rIndex, power );
                while ( power-- > 0 ) {
                    html += html.replace( rIndex, new Array( power + 1 ).join( '${i}' ) );
                    _html += html.replace( rIndex, power );
                }
                wrapper.innerHTML = _html;

                var time = Date.now();
                tabs = ui.init( wrapper );
                time = Date.now() - time;
                
                logs.push({
                    size: tabs.length,
                    time: time
                });

                return logs[ logs.length - 1 ];
            }


            it( 'basic structure HTML', function () {
                var html = '<div '
                    + ' data-ui=" '
                        + 'type:Tab;'
                    + ' " '
                    + '>'
                    + '<ul data-role="navigator">'
                    + '<li data-for="a${i}"><a href="#a${i}">a${i}</a></li>'
                    + '<li data-for="b${i}"><a href="#b${i}">b${i}</a></li>'
                    + '<li data-for="c${i}"><a href="#c${i}">c${i}</a></li>'
                    + '</ul>'
                    + '<div id="a${i}">a${i}</div>'
                    + '<div id="b${i}">b${i}</div>'
                    + '<div id="c${i}">c${i}</div>'
                    + '</div>';
                var log = doTask( html, POWER );

                expect( log.time ).toBeLessThan( EXPECT_TIME );
            });

            it('basic structure HTML with `skin` option', function () {
                var html = '<div '
                    + ' data-ui=" '
                        + 'type:Tab;'
                        + 'skin:winter;'
                    + ' " '
                    + '>'
                    + '<ul data-role="navigator">'
                    + '<li data-for="a${i}"><a href="#a${i}">a${i}</a></li>'
                    + '<li data-for="b${i}"><a href="#b${i}">b${i}</a></li>'
                    + '<li data-for="c${i}"><a href="#c${i}">c${i}</a></li>'
                    + '</ul>'
                    + '<div id="a${i}">a${i}</div>'
                    + '<div id="b${i}">b${i}</div>'
                    + '<div id="c${i}">c${i}</div>'
                    + '</div>';
                var log = doTask( html, POWER );

                expect( log.time ).toBeLessThan( EXPECT_TIME );
            });

            it('basic structure HTML with `activeIndex` option', function () {
                var html = '<div '
                    + ' data-ui=" '
                        + 'type:Tab;'
                        + 'activeIndex:1;'
                    + ' " '
                    + '>'
                    + '<ul data-role="navigator">'
                    + '<li data-for="a${i}"><a href="#a${i}">a${i}</a></li>'
                    + '<li data-for="b${i}"><a href="#b${i}">b${i}</a></li>'
                    + '<li data-for="c${i}"><a href="#c${i}">c${i}</a></li>'
                    + '</ul>'
                    + '<div id="a${i}">a${i}</div>'
                    + '<div id="b${i}">b${i}</div>'
                    + '<div id="c${i}">c${i}</div>'
                    + '</div>';
                var log = doTask( html, POWER );

                expect( log.time ).toBeLessThan( EXPECT_TIME );
            });

            it('basic structure HTML with `skin` and `activeIndex` option', function () {
                var html = '<div '
                    + ' data-ui=" '
                        + 'type:Tab;'
                        + 'skin:winter;'
                        + 'activeIndex:1;'
                    + ' " '
                    + '>'
                    + '<ul data-role="navigator">'
                    + '<li data-for="a${i}"><a href="#a${i}">a${i}</a></li>'
                    + '<li data-for="b${i}"><a href="#b${i}">b${i}</a></li>'
                    + '<li data-for="c${i}"><a href="#c${i}">c${i}</a></li>'
                    + '</ul>'
                    + '<div id="a${i}">a${i}</div>'
                    + '<div id="b${i}">b${i}</div>'
                    + '<div id="c${i}">c${i}</div>'
                    + '</div>';
                var log = doTask( html, POWER );

                expect( log.time ).toBeLessThan( EXPECT_TIME );
            });

            it('basic structure HTML with more options', function () {
                var html = '<div '
                    + ' data-ui=" '
                        + 'type:Tab;'
                        + 'skin:winter;'
                        + 'disabel:true;'
                        + 'hidden:true;'
                        + 'orientation:vertical;'
                        + 'activeIndex:1;'
                    + ' " '
                    + '>'
                    + '<ul data-role="navigator">'
                    + '<li data-for="a${i}"><a href="#a${i}">a${i}</a></li>'
                    + '<li data-for="b${i}"><a href="#b${i}">b${i}</a></li>'
                    + '<li data-for="c${i}"><a href="#c${i}">c${i}</a></li>'
                    + '</ul>'
                    + '<div id="a${i}">a${i}</div>'
                    + '<div id="b${i}">b${i}</div>'
                    + '<div id="c${i}">c${i}</div>'
                    + '</div>';
                var log = doTask( html, POWER );

                expect( log.time ).toBeLessThan( EXPECT_TIME );
            });

            it('basic structure HTML with more options and custom attribute/class', function () {
                var html = '<div '
                    + ' class="btn a b c d e" '
                    + ' data-myattr="test" '
                    + ' data-ui=" '
                        + 'type:Tab;'
                        + 'skin:winter;'
                        + 'disabel:true;'
                        + 'hidden:true;'
                        + 'orientation:vertical;'
                        + 'activeIndex:1;'
                    + ' " '
                    + '>'
                    + '<ul data-role="navigator">'
                    + '<li data-for="a${i}"><a href="#a${i}">a${i}</a></li>'
                    + '<li data-for="b${i}"><a href="#b${i}">b${i}</a></li>'
                    + '<li data-for="c${i}"><a href="#c${i}">c${i}</a></li>'
                    + '</ul>'
                    + '<div id="a${i}">a${i}</div>'
                    + '<div id="b${i}">b${i}</div>'
                    + '<div id="c${i}">c${i}</div>'
                    + '</div>';
                var log = doTask( html, POWER );

                expect( log.time ).toBeLessThan( EXPECT_TIME );
            });

        });

    };

});
