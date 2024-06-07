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
        <div
          v-if="!item.id && icon.getClassWithColor(item.filename)"
          :class="icon.getClassWithColor(item.filename) + ' icon'"
        ></div>
        <align-left-outlined
          class="icon"
          v-if="!item.id && !icon.getClassWithColor(item.filename)"
        />
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
      <edit-outlined
        class="icon-info"
        v-if="item.isAppItem"
        title="修改"
        @click.stop="xiugai(item)"
      />
      <div class="icon-info" style="font-size: 13px; display: inline"  v-if="item.isApp">
        <reload-outlined
          title="刷新"
          style="margin-right: 5px;"
          @click.stop="refresh(item)"
        />
        <plus-outlined title="新增应用"
          @click.stop="addApp(item)"/>
      </div>
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
      <my-tree
        :treeList="item.children"
        @selected="selected"
        @modifyApp="modifyApp"
      ></my-tree>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import * as icon from "file-icons-js";
const emit = defineEmits(["selected", "modifyApp", "refresh","addApp"]);
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
const addApp = (item) => {
  emit("addApp",item);
}
const selected = (item) => {
  emit("selected", item);
};
const modifyApp = (item) => {
  emit("modifyApp", item);
};
const refresh = (item) => {
  emit("refresh", item);
};
const xiugai = (item) => {
  modifyApp(item);
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
  }
};
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
    .arrow {
      font-size: 10px;
    }
    .load {
      font-size: 16px;
      position: absolute;
      top: 50%;
      right: 30px;
      transform: translate(-100%, -50%);
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
</style>
