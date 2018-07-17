# sifating

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

- 组件库使用Vux (https://vux.li/#/zh-CN/README)
- 样式只配置了less/postcss，需要sass请自行配置；团队项目中样式表编写规则照旧
- 增加全局重写样式.g-p,.g-group等，全局重写样式在custom.reset中，具体对应注释；vux预设样式更改在theme.less中配置，具体查询api
- iconfont依旧是原来的方案，开发阶段在index.html中使用在线链接以应对频繁更新
- HTTP库使用了axios
- 数据接入时，config或axios中可配置proxyTable避免跨域问题
- 自定义组件在components下，页面在pages下
- pulltoRefresh考虑使用meScroll.js，和vue不是很搭
- 请注意vue数据双向绑定机制，几乎没有对dom的直接操作
- 配置了FastClick（移动端点透问题），PC端需要双击激活输入框
- svn签入请忽略dist和node_modules
- 发布build将生成的dist文件夹内容放到服务器对应位置即可，访问入口为/index.html?，目前采用hash模式路由
- 配置发布版以配合后台网站子目录设置，需要config中设置对应子目录，生成需手动更改static的相对路径（暂未找到合适解决配置）
- axios基于Promise,添加Polyfill以应对低版本兼容；根据node全局参数process在axios api中添加了对应开发和生产环境不同的配置，不用再手动更改了


# 项目结构
-src
 -api			--数据接口层
 -assets
  -styles 		--分离样式
 -components 	--自定义及扩展组件
 -pages			--页面
 -js
 -router		--路由配置
 -store			--状态管理
 -App.vue		--入口组件
 -main.js		--入口配置
 -theme.less	--vux预设全局配置
-static 		--静态资源文件
-index.html
