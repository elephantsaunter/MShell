<template>
  <div
    id="myTree"
    class="li textColor1"
    v-for="(item, index) in newArr"
    @click.stop="isOpen(item, index)"
    @contextmenu.prevent="rightclick(item)"
  >
    <div
      class="value"
      v-bind:class="{ 'app-item': item.isAppItem }"
      :title="item.basename"
    >
      <template v-if="item.type == 'directory'">
        <right-outlined class="icon arrow" v-if="!item.isOpened" />
        <down-outlined class="icon arrow" v-if="item.isOpened" />
      </template>
      <template v-if="item.type != 'directory'">
      <div v-if="!item.id&&icon.getClassWithColor(item.filename)" :class="icon.getClassWithColor(item.filename)+' icon'">
      </div>
        <file-outlined class="icon" v-if="!item.id&&!icon.getClassWithColor(item.filename)" />
        <LaptopOutlined class="icon" v-if="item.id" />
      </template>

      <loading-outlined class="load" v-show="item.isLoad" />
      <a-tooltip placement="rightBottom" v-if="item.lastmod" color="#9b2020e6">
        <template #title>
          <div>{{ "" + timeFiltering(item.lastmod) }}</div>
          <div>{{ "" + formatBytes(item.size, 0) }}</div>
        </template>
        <InfoCircleOutlined class="icon-info" />
      </a-tooltip>
      <a-tooltip
        placement="rightBottom"
        v-if="route.name == 'list' && item.type == 'file'"
        color="#9b2020e6"
      >
        <template #title> 在新标签页打开 </template>
        <block-outlined class="icon-info" @click.stop="windowOpen(item)" />
      </a-tooltip>
      <div class="title">{{ item.basename }}</div>
      <div class="mask" v-show="store.state.treeId == item.filename"></div>
      <div
        class="maskRight"
        v-show="store.state.itemRight.filename == item.filename"
      ></div>
    </div>

    <div
      class="children borderColor"
      v-show="item.isOpened"
      v-if="item.children"
    >
      <my-tree :treeList="item.children" @selected="selected"></my-tree>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import myTree from "../components/myTree.vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import * as icon from 'file-icons-js'

const props = defineProps({
  treeList: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
watch(
  () => props.treeList,
  (newValue, oldValue) => {
    newArr.value = newValue;
  },
  { deep: true }
);
const route = useRoute();
const store = useStore();
const newArr = ref(props.treeList);
const isOpen = (item, index) => {
  newArr.value[index].isOpened = !item.isOpened;
  store.commit("SET_TREEID", item.filename);
  selected(item);
};
const emit = defineEmits(["selected"]);

const selected = (item) => {
  emit("selected", item);
};
function rightclick(item) {
  store.commit("SET_ITEM_RIGHT", item);
}
const windowOpen = (item) => {
  showModalDialogChrome("#/" + item.filename);
  function showModalDialogChrome(url, name, option) {
    if (window.hasOpenWindowMap && window.hasOpenWindowMap[url]) {
      window.hasOpenWindowMap[url].focus();
    }
    if (option) {
      var re = new RegExp(";", "g");
      var option = option.replace(re, '","');
      var re2 = new RegExp(":", "g");
      option = '{"' + option.replace(re2, '":"') + '"}';
    } else {
      option = "{}";
    }
    option = JSON.parse(option);
    if (!option.dialogWidth) {
      option.dialogWidth = 1280;
      option.dialogHeight = 924;
    }
    var openOption =
      "location=0,width=" +
      parseInt(option.dialogWidth) +
      ",height=" +
      parseInt(option.dialogHeight) +
      ",left=" +
      (window.screen.width - parseInt(option.dialogWidth)) / 2 +
      ",top=" +
      (window.screen.height - 30 - parseInt(option.dialogHeight)) / 2;

    window.hasOpenWindowMap[url] = window.open(url, name, openOption);
    console.log(openOption);
  }
};
//时间过滤
const timeFiltering = (date) => {
  var time = new Date(date); //获取本地计算机时间

  //getMonth() 获得日期对象中的月份 (0 ~ 11)

  //     getDay() 获得日期是周几 (0代表周天，1-6分别代表周1-6)

  // getTime() 获得日期对象中的日期与 1970 年 1 月 1 日相差的毫秒数

  var year = time.getFullYear(); //对象.日期对象函数

  var month = time.getMonth(); //获得月份

  var day = time.getDate(); //获得当前几号

  var hours = time.getHours(); //获得小时

  var min = time.getMinutes(); //获得分钟

  var s = time.getSeconds(); //获得秒

  let times =
    year +
    "年" +
    (month + 1) +
    "月" +
    day +
    "日," +
    hours +
    ":" +
    min +
    ":" +
    s;
  return times;
};
//文件大小过滤
function formatBytes(a, b) {
  if (0 == a) return "0 B";
  var c = 1024,
    d = b || 2,
    e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    f = Math.floor(Math.log(a) / Math.log(c));
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}
</script>
<style lang="less" scoped>
.app-item {
  background: rgb(24 144 255 / 20%);
}
.li {
  font-size: 14px;
  cursor: pointer;
  min-width: 100px;
  width: 100%;
  .value {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 24px;
    position: relative;

    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgb(0 127 212 / 24%);
      border: 1px solid #1c82c7;
      z-index: 1;
    }

    .maskRight {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      border: 1px solid #1c82c7;
      z-index: 1;
    }

    &:hover {
      .icon-info {
        display: inline;
      }
    }

    &:active {
      background-color: rgba(0, 127, 212, 0.4);
    }

    .icon {
      margin: 0 5px;
      
      position: relative;
      z-index: 2;
    }
    .arrow{
      font-size: 10px;
    }
    .load {
      font-size: 16px;
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
    }
    .icon-info {
      font-size: 16px;
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
      z-index: 20;
      display: none;
    }

    .title {
      position: relative;
      z-index: 10;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 28px;
    }
  }
}

.children {
  margin-left: 10px;
  border-left-width: 1px;
  border-left-style: solid;
}


/* ---------------------黑色--------------------- */
/* 基础文字颜色 */
/deep/ .textColor1{
    color: rgba(204, 204, 204, 0.8) !important;           
}
.textColor1{
    color: rgba(204, 204, 204, 0.8) !important;           
}
/* 基础背景 */
#myTree .background1{
    background: #1e1e1e !important;
}
/* 左侧树背景 */
#myTree .background2{
    background-color: #252526 !important;
}
/* 基础边框色 */
#myTree .borderColor{
    border-color: #414141 !important;
}
/deep/ #myTree .borderColor{
    border-color: #414141 !important;
}
/* 标签栏背景 */
#myTree .tabsBackground{
    background-color: #2d2d2d !important;
}
/* 标签栏右边框 */
#myTree .tabsBorderColorRight{
    border-right: 1px solid #252526 !important;
}
/* 标签栏选中状态 */
#myTree #tabs .current{
    background-color: #1e1e1e !important;
}
/* 树列表鼠标经过背景 */
/deep/ #myTree .value:hover{
    background: #2a2d2e !important;
}
#myTree .value:hover{
    background: #2a2d2e !important;
}



</style>
