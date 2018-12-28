# react-native FlatList

[FlatList](https://reactnative.cn/docs/0.51/flatlist.html#content)

## 简介

高性能的简单列表组件，支持下面这些常用的功能：

* 完全跨平台。
* 支持水平布局模式。
* 行组件显示或隐藏时可配置回调事件。
* 支持单独的头部组件。
* 支持单独的尾部组件。
* 支持自定义行间分隔线。
* 支持下拉刷新。
* 支持上拉加载。
* 支持跳转到指定行（ScrollToIndex）。

> 如果需要分组/类/区（section），请使用[<SectionList>](https://reactnative.cn/docs/0.51/sectionlist.html)。

## 碰到的问题

1、onEndReachedThreshold={0.1}  
决定当距离内容最底部还有多远时触发 onEndReached 回调。注意此参数是一个比值而非像素单位。比如，0.5 表示距离内容最底部的距离为当前列表可见长度的一半时触发。

2、在 A 组件中使用 FlatList, onEndReached 会比 A 的 componentWillMount 先执行，暂未知原因？

## ListView

> 此处穿插一个 ListView 选中行高亮的功能实现...

```
renderRow = (rowData, sectionID, rowID) => {
    const { tabs } = this.state;
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.lastSection) {
            tabs[this.lastSection][this.lastRow] = false;
          } else {
            tabs[0][0] = false;
          }
          if (!tabs[sectionID]) {
            tabs[sectionID] = [];
          }
          tabs[sectionID][rowID] = true;
          this.setState({
            tabs,
          });
          this.lastSection = sectionID; // 将上次点击过的储存起来
          this.lastRow = rowID;
          this.props.didSelect(rowData);
        }}>
        <View style={styles.rowStyle}>
          <Text
            style={[
              {
                paddingLeft: 12,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              },
              {
                color:
                  tabs[sectionID] && tabs[sectionID][rowID]
                    ? '#006cd8'
                    : '#333',
              },
            ]}>
            {rowData}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
```
