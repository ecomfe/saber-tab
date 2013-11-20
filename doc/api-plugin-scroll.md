# TabScroll

Tab控件的`Scroll`插件

## Dependencies

+ [saber-lang](https://github.com/ecomfe/saber-lang)
+ [saber-dom](https://github.com/ecomfe/saber-dom)
+ [saber-scroll](https://github.com/ecomfe/saber-sroll)
+ [saber-ui/plugin](https://github.com/ecomfe/saber-ui)
+ [saber-control/helper](https://github.com/ecomfe/saber-control/blob/master/doc/api-helper.md)


## Option

请参考 [`saber-scroll`](https://github.com/ecomfe/saber-scroll#scrollele-options)


## Property

### target

选项卡控件实例，类型[`Tab`](https://github.com/ecomfe/saber-tab/blob/master/doc/api-tab.md)


## Method

### .initialize([options])

插件初始化

`options`: 构造函数传入的配置参数，类型`Object`，参数`可选`

***注：参数`options`不做加工过滤，直接传给[`saber-scroll`](https://github.com/ecomfe/saber-scroll#scrollele-options)构造函数***


### .render()

渲染插件

### .repaint()

重置插件

### .dispose()

销毁插件

### .enable()

启用插件

### .disable()

禁用插件



===

[![Saber](https://f.cloud.github.com/assets/157338/1485433/aeb5c72a-4714-11e3-87ae-7ef8ae66e605.png)](http://ecomfe.github.io/saber/)