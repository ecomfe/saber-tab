/**
 * EDP配置DEMO
 * 
 * @author zfkun(zfkun@msn.com)
 */

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

// 引入archer，需npm配置'archer'依赖
var archer = require( './dep/archer/lib/archer' );

exports.getLocations = function () {
    return [
        { 
            location: /\/$/, 
            handler: home( 'index.html' )
        },
        { 
            location: /^\/redirect-local/, 
            handler: redirect('redirect-target', false) 
        },
        { 
            location: /^\/redirect-remote/, 
            handler: redirect('http://www.baidu.com', false) 
        },
        { 
            location: /^\/redirect-target/, 
            handler: content('redirectd!') 
        },
        { 
            location: '/empty', 
            handler: empty() 
        },
        // 在autocss中使用archer插件
        {
            location: /\.css($|\?)/, 
            handler: [
                autocss({
                    'stylus': archer()
                })
            ]
        },
        // 在stylus中使用archer插件
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file(),
                stylus(archer())
            ]
        },
        { 
            location: /^.*$/, 
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
