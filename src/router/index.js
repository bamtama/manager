import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

//空白页面
const WhitePage = () =>
  import ( /* webpackChunkName: "whitepage" */ '@/pages/WhitePage')

const Login = () =>
  import ( /* webpackChunkName: "home" */ '@/pages/Login')

//首页，我的
const Mine = () =>
  import ( /* webpackChunkName: "home" */ '@/pages/Mine')
const Home = () =>
  import ( /* webpackChunkName: "home" */ '@/pages/Home')
const Index = () =>
  import ( /* webpackChunkName: "home" */ '@/pages/Index')

//公共列表
const CommonList = () =>
  import ( /* webpackChunkName: "commonlist" */ '@/pages/CommonList')
const CommonItemList = () =>
  import ( /* webpackChunkName: "commonlist" */ '@/pages/CommonItemList')

//定位监控
const LocDetail = () =>
  import ( /* webpackChunkName: "loc" */ '@/pages/LocDetail')

//全局统计
const ChartIndex = () =>
  import ( /* webpackChunkName: "chart" */ '@/pages/Chart/index')
const ChartDetail = () =>
  import ( /* webpackChunkName: "chart" */ '@/pages/Chart/detail')

//通讯录
const ContactList = ()=>import ( /* webpackChunkName: "contact" */ '@/pages/Contact/List')

//通知
const AnnouncementList = ()=>import(/* webpackChunkName: "announcement" */'@/pages/Announcement/List')
const AnnouncementDetail = ()=>import(/* webpackChunkName: "announcement" */'@/pages/Announcement/Detail')
const AnnouncementEdit = ()=>import(/* webpackChunkName: "announcement" */'@/pages/Announcement/Edit')

//备忘录
const MemoryList = ()=>import(/* webpackChunkName: "memory" */'@/pages/Memory/List')
const MemoryEdit = ()=>import(/* webpackChunkName: "memory" */'@/pages/Memory/Edit')

//消费记录
const PayList = ()=>import(/* webpackChunkName: "paylist" */'@/pages/Pay/List')

//个人信息
const FileDetail1 = () => import(/* webpackChunkName: "file" */ '@/pages/fileAdmin/FileDetail1')
const FileDetail2 = () => import(/* webpackChunkName: "file" */ '@/pages/fileAdmin/FileDetail2')
const FileDetail3 = () => import(/* webpackChunkName: "file" */ '@/pages/fileAdmin/FileDetail3')
const FileDetail4 = () => import(/* webpackChunkName: "file" */ '@/pages/fileAdmin/FileDetail4')
const FileInTube = () => import(/* webpackChunkName: "file" */ '@/pages/fileAdmin/FileInTube')

//收藏
const FavList = () => import(/* webpackChunkName: "file" */ '@/pages/Fav/List')
const FavDetail = () => import(/* webpackChunkName: "file" */ '@/pages/Fav/Detail')

Vue.use(Router)

var _Router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children: [{
        path: 'Index',
        component: Index,
        meta: {
          cacheSub: true,
          level: 1,
        }
      }, {
        path: 'Mine',
        component: Mine,
      }, {
        path: 'locList',
        component: CommonList,
        meta: {
          cacheSub: true,
        }
      }, {
        path: 'attention',
        component: CommonList,
        meta: {
          cacheSub: true,
        }
      }, {
        path: "*",
        redirect: Index
      }]
    },
    {
      path: '/Address',
      name: 'Address',
      component: WhitePage,
    },
    {
      path: '/LocDetail',
      name:'LocDetail',
      component: LocDetail
    },
    {
      path: '/LocShare',
      name: 'LocShare',
      component: LocDetail
    },
    {
      path: '/FriendList',
      name: 'FriendList',
      component: CommonList,
      meta: {
        cacheSub: true,
        vmname: 'CommonList'
      }
    },
    {
      path: '/LocList',
      name: 'LocList',
      component: CommonList,
      meta: {
        cacheSub: true,
        vmname: 'CommonList'
      }
    },
    {
      path: '/ChartIndex',
      name: 'ChartIndex',
      component: ChartIndex
    },
    {
      path: '/ChartDetail',
      name: 'ChartDetail',
      component: ChartDetail
    },
    {
      path: '/ContactList',
      name: 'ContactList',
      component: ContactList
    },
    {
      path: '/AnnouncementList',
      name: 'AnnouncementList',
      component: AnnouncementList
    },
    {
      path: '/AnnouncementDetail',
      name: 'AnnouncementDetail',
      component: AnnouncementDetail
    },
    {
      path: '/AnnouncementEdit',
      name: 'AnnouncementEdit',
      component: AnnouncementEdit
    },
    {
      path: '/MemoryList',
      name: 'MemoryList',
      component: MemoryList
    },
    {
      path: '/MemoryEdit',
      name: 'MemoryEdit',
      component: MemoryEdit
    },
    {
      path: '/PayList',
      name: 'PayList',
      component: PayList
    },,
    {
      path: '/FileDetail1/:type',
      name: 'filedetail1',
      component: FileDetail1,
      props: true
    },
    {
      path: '/FileDetail2/:type',
      name: 'filedetail2',
      component: FileDetail2,
      props: true
    },
    {
      path: '/FileDetail3/:type',
      name: 'filedetail3',
      component: FileDetail3,
      props: true
    },
    {
      path: '/FileDetail4/:type',
      name: 'filedetail4',
      component: FileDetail4,
      props: true
    },
    {
      path: '/FileInTube',
      name: 'FileInTube',
      component: FileInTube
    },
    {
      path: '/FavList',
      name: 'FavList',
      component: FavList
    },
    {
      path: '/FavDetail',
      name: 'FavDetail',
      component: FavDetail
    },
  ]
})
_Router.beforeEach((to, from, next) => {

  if (!Vue.prototype.$mBack.setVux(Vue.$vux).loop().getState()) {
    //Vue.prototype.$mBack.allow().hide()
    next(false)
  } else {
    //store.dispatch('globalLoading', false);
    //进入页面显示加载界面，并判断当前界面的尺寸
    if (to.name === 'LocDetail') {
      store.dispatch('setLoadingClass', 'full')
    } else {
      store.dispatch('setLoadingClass', '')
    }
    // store.dispatch('globalLoading', true);
    let mask = document.querySelector('.g-mask');
    if (mask) {
      mask.parentNode.removeChild(mask);
      mask = null;
    }

    /**
     * 页面缓存管理说明：
     * 目前页面均为线性操作，跳转页面时进行对应判断
     * cacheSub：此页面的下级页面为缓存目标
     * level：此页面的缓存级别（数字越大，级别越低），根据路由走向动态生成
     * 当从高级别缓存页跳转到低级别缓存页时，不会执行对应删除缓存页的操作
     * 部分特殊页面可能需要组件内路由守卫进行管理，或全局标记管理
     * 部分页面的状态可能需要手动管理（如滚动位置）
     * 添加了home页面缓存，具体见cachePages初始值设置
     **/
    //人员列表出入缓存管理
    // if(from.path === '/Home/index'){
    //   store.dispatch('addCachePage', 'CommonList');
    // }
    // if(to.path === '/Home/index'){
    //   store.dispatch('removeCachePage', 'CommonList')
    // }
    //缓存管理,部分公共组件需要设置实例name;
    // debugger;
    if ((from.meta.level && !to.meta.level) ||
      from.meta.level === to.meta.level) {
      //从根页面开始，起始level必须设置值（如果出现同级，则重置下级的level）
      to.meta.level = from.meta.level + 1;
    }
    if (to.meta.level > from.meta.level) {
      //往下走
      console.log('往下走')
      if (from.meta.cacheSub) {
        if (to.meta.vmname) {
          store.dispatch('addCachePage', to.meta.vmname);
        } else {
          store.dispatch('addCachePage', to.name);
        }
      }
    } else if (to.meta.level < from.meta.level) {
      //往上走
      if (to.meta.cacheSub) {
        if (to.meta.vmname) {
          store.dispatch('removeCachePage', to.meta.vmname);
        } else {
          store.dispatch('removeCachePage', to.name);
        }
      }
      console.log(store.getters.cachePages)
    }

    // if (from.meta.cacheSub) {
    //   if (to.meta.vmname) {
    //     store.dispatch('addCachePage', to.meta.vmname);
    //   } else {
    //     store.dispatch('addCachePage', to.name);
    //   }
    //   if ((from.meta.level && !to.meta.level)
    //     ||from.meta.level === to.meta.level) {
    //     //从根页面开始，起始level必须设置值（如果出现同级，则重置下级的level）
    //     to.meta.level = from.meta.level + 1;
    //   }
    // }
    // if (to.meta.cacheSub) {
    //   if (from.meta.level > to.meta.level) {
    //     if (from.meta.vmname) {
    //       store.dispatch('removeCachePage', from.meta.vmname);
    //     } else {
    //       store.dispatch('removeCachePage', from.name);
    //     }
    //   }
    // }
    /** 页面缓存管理 **/
    next()
  }
})
_Router.afterEach((to, from) => {
  //如果当前有全局loading，则使其消失
  store.dispatch('globalLoading', 0);
})
export default _Router;
