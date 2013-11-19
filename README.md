# saber-tab

[`SaberUI`](https://github.com/ecomfe/saber-ui)的Tab控件。`ECOM UI v1.1`规范实现。


## Dependencies

+ [saber-lang](https://github.com/ecomfe/saber-lang)
+ [saber-string](https://github.com/ecomfe/saber-string)
+ [saber-dom](https://github.com/ecomfe/saber-dom)
+ [saber-scroll](https://github.com/ecomfe/saber-scroll)
+ [saber-ui](https://github.com/ecomfe/saber-ui)
+ [saber-control](https://github.com/ecomfe/saber-control)


## Usage

通过[`edp`](https://github.com/ecomfe/edp)导入

	edp import saber-tab


## API


### Option

+ `activeIndex`: 默认选中标签的索引

+ `orientation`: 标签页排列方向

+ `itemTemplate`: 标签页内容构造模板

+ `scroll`: 是否支持拖动。类型`Boolean`，默认值`false`

	注：此属性为`true`不能保证拖动正确启用，需确保[`saber-scroll`](https://github.com/ecomfe/saber-scroll)模块已正确引入

更多配置项，请参考父类[`Control`](https://github.com/ecomfe/saber-control#option)

### Property

#### activeIndex

当前活动的标签页的索引，类型`Number`，默认值`0`

注：若想改变选中项，请直接使用[`select`](#selectindex)方法，尽量避免直接更改此属性值。

#### orientation

标签页排列方向，类型`String`，默认值`horizontal`，可取值：

+ `horizontal`: 横向排列
+ `vertical`: 纵向排列

#### itemTemplate

标签页页卡内容的模板，类型`String`，默认值`${title}`

#### scroll

是否启用拖动，类型`Boolean`，默认值`false`

注：目前此属性为`ReadOnly`，`set`操作不会如愿的`启用|禁用`拖动。


#### tabs

标签页的列表数据，类型`Array`，默认值`[]`

例子

```javascript
// 每一项是具有title和panel属性的Object。
// title属性为字符串，代表显示的标题。
// panel属性指定一个容器HTMLElement的id，为可选属性。
[
    { title: 'one', panel: 'panel1' },
    { title: 'two', panel: 'panel2' },
    { title: 'three', panel: 'panel3' },
    { title: 'four' }
]
```


更多实例属性，请参考父类[`Control`](https://github.com/ecomfe/saber-control#property)



### Method

#### .add(tabItem)

添加一个标签页

`tabItem`: 标签页配置对象，类型`Object`，包含项：

+ `title`: 标签页的标题，类型`String`
+ `panel`: 标签页对应的容器的id，类型`String`，此属性`可选`

例子

```javascript
var tab = new Tab({ tabs: [ { title: 't1', panel: 'a' } ] });
console.info( tab.get( 'tabs' ) ); // [ { title: 't1', panel: 'a' } ]
tab.add( { title: 't2' } );
console.info( tab.get( 'tabs' ) ); // [ { title: 't1', panel: 'a' }, { title: 't2' } ]
```

#### .insert(tabItem, index)

在指定位置添加一个标签页

`tabItem`: 标签页配置对象，类型`Object`，包含项：

+ `title`: 标签页的标题，类型`String`
+ `panel`: 标签页对应的容器的id，类型`String`，此属性`可选`

`index`: 新标签页要插入的位置索引，类型`Number`

例子

```javascript
var tabItems = [ { title: 't1' }, { title: 't2' } ];
var tab = new Tab({ tabs: tabItems });
console.info( tab.get( 'tabs' ) ); // [ { title: 't1' }, { title: 't2' } ]
tab.insert( { title: 't3' }, 1 );
console.info( tab.get( 'tabs' ) ); // [ { title: 't1' }, { title: 't3' }, { title: 't2' } ]
```


#### .remove(tabItem)

移除一个标签页

`tabItem`: 标签页配置对象，类型`Object`，包含项：

+ `title`: 标签页的标题，类型`String`
+ `panel`: 标签页对应的容器的id，类型`String`，此属性`可选`

注：`tabItem`对比检索使用的是全等(`===`)，使用时需小心

例子

```javascript
var tabItems = [ { title: 't1' }, { title: 't2' } ];
var tab = new Tab({ tabs: tabItems });
console.info( tab.get( 'tabs' ) ); // [ { title: 't1' }, { title: 't2' } ]
tab.remove( { title: 't2' } );
console.info( tab.get( 'tabs' ) ); // [ { title: 't1' } ]
```

#### .removeByIndex(index)

移除指定索引的标签页

`index`: 需要移除标签页的索引，类型`Number`

例子

```javascript
var tabItems = [ { title: 't1' }, { title: 't2' } ];
var tab = new Tab({ tabs: tabItems });
console.info( tab.get( 'tabs' ) ); // [ { title: 't1' }, { title: 't2' } ]
tab.removeByIndex( 1 );
console.info( tab.get( 'tabs' ) ); // [ { title: 't1' } ]
```


#### .select(index)

选择激活标签

`index`: 需要激活的标签页索引，类型`Number`

例子

```javascript
var tabItems = [ { title: 't1' }, { title: 't2' } ];
var tab = new Tab({ tabs: tabItems });
console.info( tab.get( 'activeIndex' ) ); // 0
tab.select( 1 );
console.info( tab.get( 'activeIndex' ) ); // 1
```

#### .getItemHTML(tabItem)

获取标签页内容的HTML

返回以属性`itemTemplate`为模板和参数`tabItem`为数据的渲染结果字符串

`tabItem`: 标签页配置对象，类型`Object`，包含项：

+ `title`: 标签页的标题，类型`String`
+ `panel`: 标签页对应的容器的id，类型`String`，此属性`可选`

例子

```javascript
var tab = new Tab();
var html = tab.getItemHTML( { title: 'tab1', panel: 'p' } );
console.info( html ); // 'tab1'
```

#### .beforeChange(oldIndex, newIndex)

切换选项卡前的校验，主要给予使用者更多的灵活控制

默认返回`true`，不允许切换则需返回`false`

例子

```javascript
var tabItems = [ { title: 'a' }, { title: 'b' } ];
var tab = new Tab( { tabs: tabItems, activeIndex: 1 } );
console.info( tab.get( 'activeIndex' ) ); // 1
tab.beforeChange = function ( oldIndex, newIndex ) {
	return newIndex > 0;
};
tab.select( 0 );
console.info( tab.get( 'activeIndex' ) ); // 1
```

更多实例方法，请参考父类[`Control`](https://github.com/ecomfe/saber-control#api)



### Event

#### add

当添加标签时触发，附带参数依次为`ev`、`data`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的按钮控件对象，类型[`Tab`](https://github.com/ecomfe/saber-tab)

`data`: 当前移除的标签信息，类型`Object`，包含项：

+ `index`: 标签索引，类型`Number`
+ `tab`: 标签数据对象，类型`Object`，包含项：
	+ `title`: 标签的标题，类型`String`
	+ `panel`: 标签对应的容器的id，类型`String`，此属性`可选`

例子

```javascript
var tabItems = [ { title: 'a' }, { title: 'b' } ];
var tab = new Tab( { tabs: tabItems, activeIndex: 1 } );
tab.on( 'add', function ( ev, data ) {
	console.info( ev, data );
});
tab.add( { title: 'c', panel: 'd' } );
```

#### remove

当移除标签时触发，附带参数依次为`ev`、`data`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的按钮控件对象，类型[`Tab`](https://github.com/ecomfe/saber-tab)

`data`: 当前移除的标签信息，类型`Object`，包含项：

+ `index`: 标签索引，类型`Number`
+ `tab`: 标签数据对象，类型`Object`，包含项：
	+ `title`: 标签的标题，类型`String`
	+ `panel`: 标签对应的容器的id，类型`String`，此属性`可选`

例子

```javascript
var tabItems = [ { title: 'a' }, { title: 'b' } ];
var tab = new Tab( { tabs: tabItems, activeIndex: 1 } );
tab.on( 'remove', function ( ev, data ) {
	console.info( ev, data );
});
tab.removeByIndex( 1 );
```

#### change

当切换标签时触发，附带参数依次为`ev`、`data`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的按钮控件对象，类型[`Tab`](https://github.com/ecomfe/saber-tab)

`data`: 当前激活标签的信息对象，类型`Object`，包含项：

+ `index`: 标签索引，类型`Number`
+ `tab`: 标签数据对象，类型`Object`，包含项：
	+ `title`: 标签的标题，类型`String`
	+ `panel`: 标签对应的容器的id，类型`String`，此属性`可选`

例子

```javascript
var tabItems = [ { title: 'a' }, { title: 'b' } ];
var tab = new Tab( { tabs: tabItems, activeIndex: 1 } );
tab.on( 'change', function ( ev, data ) {
	console.info( ev, data );
});
```

更多事件，请参考父类[`Control`](https://github.com/ecomfe/saber-control#event)




===

[![Saber](https://f.cloud.github.com/assets/157338/1485433/aeb5c72a-4714-11e3-87ae-7ef8ae66e605.png)](http://ecomfe.github.io/saber/)