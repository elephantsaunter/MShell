<template>
  <div class="roll" id="tabs">
    <a-dropdown :trigger="['contextmenu']">
      <div class="tabs">
        <div
          :class="{
            li: true,
            current: '' == props.routeId,
            tabsBackground: true,
            tabsBorderColorRight: true,
            textColor1: true,
          }"
          @click="tabClickMain()"
          style="width: 100px"
          v-if="props.routeIndex==0"
        >
          <div class="icon">
            <align-left-outlined />
          </div>
          <div class="name">备忘录</div>
          <div class="close"></div>
        </div>
        <div
          :class="{
            li: true,
            current: item.filename == props.routeId,
            tabsBackground: true,
            tabsBorderColorRight: true,
            textColor1: true,
          }"
          v-for="item in props.routeList"
          :key="item.filename"
          @click="tabClick(item)"
          @contextmenu.prevent="rightclick(item)"
          :id="'tabs' + item.filename"
        >
          <div class="icon">
            <align-left-outlined
              v-show="!item.isLoad"
              v-if="!icon.getClassWithColor(item.filename)"
            />
            <div
              :class="icon.getClassWithColor(item.filename)"
              v-show="!item.isLoad"
              v-if="icon.getClassWithColor(item.filename)"
            ></div>
            <loading-outlined v-show="item.isLoad" />
          </div>
          <div class="name">{{ item.basename }}</div>
          <close-outlined
            class="close"
            @click.stop="tabDelete(item.filename)"
          />
        </div>
      </div>
      <template #overlay>
        <a-menu class="menu">
          <a-menu-item @click="tabDelete(false)">关闭</a-menu-item>
          <a-menu-item
            @click="closeOther"
            :class="{ prohibit: routeList.length == 1 }"
            >关闭其他
          </a-menu-item>
          <a-menu-item @click="openFile()">打开文件</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>
<script setup>
import * as icon from "file-icons-js";
import { useStore } from "vuex";
const store = useStore();
const props = defineProps({
  routeList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  routeId: {
    type: String,
    default: "",
  },
  routeIndex: {
    type: Number,
  },
});
let rightItem = {};
//点击标签  鼠标左键
const tabClick = (item) => {
  emit("SET_ROUTE_ID", item);
};
const tabClickMain = (id) => {
  emit("SET_ROUTE_ID", { filename: "", basename: "备忘录" });
};
//关闭标签
const tabDelete = (id) => {
  if (id) {
    emit("DEL_ROUTE_LIST", id);
  } else {
    emit("DEL_ROUTE_LIST", rightItem.filename);
  }
};
//鼠标右键获取item
const rightclick = (item) => {
  rightItem = item;
};
//关闭右侧标签
const closeRight = () => {
  store.state.routeList.forEach((item, index) => {
    if (item.filename == rightItem.filename) {
      tabDelete(store.state.routeList[index + 1].filename);
    }
  });
};
//关闭其他标签
const closeOther = () => {
  emit("SET_ROUTE_LIST", [rightItem]);
  emit("SET_ROUTE_ID", rightItem);
};
const emit = defineEmits([
  "SET_ROUTE_ID",
  "DEL_ROUTE_LIST",
  "SET_ROUTE_LIST",
]);

//打开其它文件
const openFile = () => {
  console.log("打开文件");
  //弹出js文件输入项 
  alert("暂未实现");
};
</script>
<style lang="less" scoped>
.roll {
  // height: 35px;
  overflow-x: overlay;
  overflow-y: visible;
  display: flex;
  flex: 1;

  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 2px;
  }
}

.tabs {
  height: 35px;
  display: flex;
  .li {
    width: 120px;
    min-width: fit-content;
    min-width: -moz-fit-content;
    flex-shrink: 0;
    position: relative;
    display: flex;
    white-space: nowrap;
    cursor: pointer;
    height: 35px;
    box-sizing: border-box;
    padding-left: 10px;
    align-items: center;
    font-size: 13px;

    &:hover .close {
      visibility: visible;
    }

    .icon {
      padding-right: 6px;
      width: 16px;
    }

    .name {
      text-overflow: ellipsis;
      flex: 1;
    }

    .close {
      width: 28px;
      align-items: center;
      justify-content: center;
      visibility: hidden;
    }
  }

  .current {
    .close {
      visibility: visible;
    }
  }
}

//右键菜单
.ant-dropdown-menu {
  width: 250px;
}

.menu {
  /deep/ .ant-dropdown-menu-item {
    &:hover {
      background: #007fd4;
    }
  }

  /deep/ .prohibit {
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
  }
}
</style>
