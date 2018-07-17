###  logline使用及配置

#### 数据库配置

##### tb_page字段配置和说明

> page_id为六位数，例 101100，前两位101对应模块名，例如登录模块，后三位100对应登录模块下面的子页面

- PAGE_ID,当前页面的ID值，Number类型
- PAGE_NAME，当前页面的路由，String类型
- DESCRIPTION,描述说明，String类型

##### tb_event字段配置和说明

- EVENT_ID,事件ID,Number类型，6位数，前三位为模块名，后三位为事件ID序列
- PAGE_ID,页面ID,Number类型,为当前事件发生所在的页面，ID值在tb_page表中定义查找
- REDIRECT_TYPE,事件类型，Number类型,0对应不跳转，1跳转到新页面，2跳转到子页面
- DESCRIPTION,事件描述，String类型

#### logline使用 

##### API使用

- eventStart(evtId|Number),事件开始，evtId：事件ID，在tb_event定义的
- eventEnd(result|Number, desc|String)，事件结束

> result: 1 or 0 ;0成功，1失败
>
> desc：描述，对应返回的error信息

- send(),发送
- 在Vue组件中使用this.$logLine.send(),...eventStart(),...eventEnd()

##### logList 说明
> sysList是页面ID集合,把自己定义的页面ID和路由关联起来
> eventList是特殊事件集合,页面没有事件触发send方法,直接跳转的页面的按钮事件ID和要跳向的路由关联