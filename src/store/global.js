import * as types from './mutations-types.js'

const state = {
  isLoading: 0,
  loadingClass:'',
  fileItem: '',
  cachePages: ['Home'],
  personListScrollTop: 0,
  itemListScrollTop: 0,
  modifiedItem: null,
  deletedItem: null,
  focusState: false,
  rewardObj: null,
  indexState: false,
  rewardObjState:false,
  indexState: false,
  addressList: null,
  addressDetail:null,
  rewardOption:null //奖惩模块原因列表数据
}
const getters = {
  isLoading: state => state.isLoading,
  loadingClass: state => state.loadingClass,
  fileItem: state => state.fileItem,
  cachePages: state => state.cachePages,
  personListScrollTop: state => state.personListScrollTop,
  itemListScrollTop: state => state.itemListScrollTop,
  modifiedItem: state => state.modifiedItem,
  deletedItem: state => state.deletedItem,
  focusState: state => state.focusState,
  getRewardObj: state => state.rewardObj,
  indexState: state => state.indexState,
  getRewardObjState: state => state.rewardObjState,
  getAddressList: state => state.addressList,
  getAddressDetail: state => state.addressDetail,
  getRewardOption: state => state.rewardOption
}

const mutations = {
  [types.IS_LOADING](state, flag) {
    state.isLoading = flag;
  },
  [types.LOADING_CLASS](state, classname){
    state.loadingClass = classname;
  },
  [types.FILE_ITEM](state, jsonobj) {
    state.fileItem = jsonobj;
  },
  [types.CACHE_PAGES](state, pages) {
    state.cachePages = pages;
  },
  [types.PERSONLIST_SCROLLTOP](state, top) {
    state.personListScrollTop = top;
  },
  [types.ITEMLIST_SCROLLTOP](state, top) {
    state.itemListScrollTop = top;
  },
  [types.MODIFIED_ITEM](state, item) {
    state.modifiedItem = item;
  },
  [types.DELETED_ITEM](state, item) {
    state.deletedItem = item;
  },
  [types.FOCUS_STATE](state, item) {
    state.focusState = item;
  },
  [types.REWARD_OBJ](state, item) {
    state.rewardObj = item;
  },
  [types.INDEX_STATE](state, item) {
    state.indexState = item;
  },
  [types.ADDRESS_LIST](state, listObj) {
    state.addressList = listObj;
  },
  [types.ADDRESS_DETAIL](state, detailObj) {
    state.addressDetail = detailObj;
  },
  [types.REWARD_OBJ_STATE](state, item) {
    state.rewardObjState = item
  },
  [types.REWARD_OPTION](state, item) {
    state.rewardOption = item
  }
}

const actions = {
  globalLoading({commit}, flag) {
    commit(types.IS_LOADING, flag)
  },
  setLoadingClass({commit}, classname){
    commit(types.LOADING_CLASS, classname)
  },
  setFileItem({
    commit
  }, jsonobj) {
    commit(types.FILE_ITEM, jsonobj)
  },
  setPersonListScrollTop({
    commit
  }, top) {
    commit(types.PERSONLIST_SCROLLTOP, top)
  },
  setItemListScrollTop({
    commit
  }, top) {
    commit(types.ITEMLIST_SCROLLTOP, top)
  },
  setModifiedItem({
    commit
  }, item) {
    commit(types.MODIFIED_ITEM, item)
  },
  removeModifiedItem({
    commit
  }) {
    commit(types.MODIFIED_ITEM, null)
  },
  setDeletedItem({
    commit
  }, item) {
    commit(types.DELETED_ITEM, item)
  },
  addCachePage({
    commit,
    state
  }, pagename) {
    let arr = Array.from(new Set([...state.cachePages, pagename]))
    console.log(arr)
    commit(types.CACHE_PAGES, arr)
  },
  removeCachePage({
    commit,
    state
  }, pagename) {
    // let arr = state.cachePages.filter(function (val) {
    //   return val != pagename;
    // });
    let arr = Object.assign([],state.cachePages);
    let len = arr.length;
    let index = state.cachePages.indexOf(pagename);
    if(index !== -1){
      arr.splice(index+1,len-index);
      commit(types.CACHE_PAGES,arr);
    }
    else{
      commit(types.CACHE_PAGES,['Home'])
    }
  },
  clearCachePage({commit}){
    commit(types.CACHE_PAGES, []);
  },
  SetFocusState({
    commit
  }, item) {
    commit(types.FOCUS_STATE, item)
  },
  setRewardObj({
    commit
  }, item) { //用于奖励查看模块的数据传递
    commit(types.REWARD_OBJ, item)
  },
  SetIndexState({
    commit
  }, state) {
    commit(types.INDEX_STATE, state)
  },
  saveAddressList({
    commit
  }, listObj) {
    commit(types.ADDRESS_LIST, listObj)
  },
  saveAddressDetail({
    commit
  }, detailObj) {
    commit(types.ADDRESS_DETAIL, detailObj)
  },
  SetRewardObjState({  //用于设置奖励查看模块的数据状态：是否删除
    commit
  }, item) {
    commit(types.REWARD_OBJ_STATE, item)
  },
  setRewardOption({commit},item){
    commit(types.REWARD_OPTION, item)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
