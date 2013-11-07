define(function() {

    var ui = {};
    var Tab = gmu.Tabs;
    var task = require( 'performance.test' );

    var wrapper = $( '#setupWrapper' )[0];
    var outputer = $( '#outputer [data-for="gmu"]' )[0];

    // api compatible 
    ui.init = function ( container ) {
        // return [].slice.call(
        //     container.querySelectorAll( '[data-ui]' )
        // ).map(function ( node ) {
        //     return new Tab( node );
        // });

        // return $('.btn').button();

        return $( '[data-ui]', container ).map(function() {
            return new Tab( this );
        });
    };
    Tab.prototype.dispose = Tab.prototype.destroy;

    describe( 'Tab - GMU', function () {

        task({
            ui: ui,
            Tab: Tab,
            wrapper: wrapper,
            outputer: outputer,
            key: 'gmu'
        });

    });


});
