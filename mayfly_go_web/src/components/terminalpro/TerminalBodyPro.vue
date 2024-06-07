<template>
  <div class="home">
    <div class="Sider background2" :style="'width: ' + siderWidth + 'px'">
      <div class="xian" ref="siderMoveLine"></div>
      <div class="tabs">
        <div
          :class="{ textColor1: true, tab: true, current: activeKey == 1 }"
          @click="tabClick(1)"
        >
          应用列表
        </div>
        <div
          :class="{ textColor1: true, tab: true, current: activeKey == 2 }"
          @click="tabClick(2)"
        >
          文件目录
        </div>
      </div>
       
    </div>
    <div class="right background1">
      <div class="headerContent">
        <div
          class="li borderColor"
          v-for="(item, index) in routeList"
          :key="index"
          @mousedown="routeIndex = index"
        >
          <div :class="{ Header: true, hidden: true }">
            <div class="background2">
              <tabs
                :routeList="item.routeList"
                :routeId="item.routeId"
                :routeIndex="index"
                @SET_ROUTE_LIST="SET_ROUTE_LIST"
                @DEL_ROUTE_LIST="DEL_ROUTE_LIST"
                @SET_ROUTE_ID="SET_ROUTE_ID"
              ></tabs>
              <div
                :class="{
                  splitScreen: true,
                  textColor1: true,
                  hidden: routeIndex == index,
                }"
              >
                <border-horizontal-outlined
                  class="icon"
                  title="向右拆分编辑器"
                  @click="splitScreen(item, true)"
                />
              </div>
            </div>
            <breadcrumb :routeId="item.routeId"></breadcrumb>
          </div>
          <div
            class="Content"
            :style="'height: calc(100vh - 57px - ' + footerHeight + 'px);'"
          >
            <markdown-editor
              v-if="index == 0 && store.state.isNodeInfoOk"
              v-show="'' == item.routeId"
            />
            <template v-for="items in item.routeList" :key="items.filename">
              <monaco-editor
                :item="items"
                v-show="items.filename == item.routeId"
                @SET_ROUTE_LIST_ITEM_ISLOAD="SET_ROUTE_LIST_ITEM_ISLOAD"
                @throFunc="throFunc"
                :currentMonacoEditor="currentMonacoEditor"
                :routeList="routeList"
                v-if="!items.mime.includes('image')"
              />
              <div
                class="image"
                v-show="items.filename == item.routeId"
                v-if="items.mime.includes('image')"
              >
                <images :item="items"></images>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="Footer" :style="'height: ' + footerHeight + 'px'">
        <div class="topXian borderColor" ref="footerMoveLine"></div>
        <div class="topBar textColor1">
          <div class="le">
            <div 
              :class="{ li: true, current: tabIndex == item }"
              v-for="(item, index) in tabList"
              :key="item.id"
              @click="tabTap(item)"
            >
              {{ item }}
            </div>
            <div class="li" @click="setTheme">主题切换</div>
            <div
              class="li ip"
              title="点击复制"
              @click="copy(store.state.initData.Ip)"
            >
              本机IP：{{ store.state.initData.Ip }}
            </div>
          </div>
          <div class="ri">
            <plus-outlined @click="add" title="新建终端" />
            <down-outlined
              v-show="!xtermListShow"
              @click="switchShow"
              title="显示终端列表"
            />
            <up-outlined
              v-show="xtermListShow"
              @click="switchShow"
              title="隐藏终端列表"
            />
          </div>
        </div>
        <div v-show="tabIndex == '终端'">
          <div
            :class="{ xterm: true, right: xtermListShow }"
            :style="
              'height: calc(' + footerHeight + 'px - ' + isQuick + '62px);'
            "
          >
            <!-- 20+42 -->
            <div
              class="xtermUl"
              v-for="(t, i) in xtermList"
              :key="i"
              v-show="i == xtermIndex"
            >
              <div
                class="xtermLi borderColor"
                :style="'width: calc(' + 100 / t.length + '% - 4px);'"
                v-for="(item, index) in t"
                :key="item.id"
                @click="choice(item.id, i)"
              >
                <xterm :item="item" :ref="'child' + item.id" />
              </div>
            </div>
            <a v-if="xtermList.length == 0" class="button" @click="add"
              >连接终端</a
            >
            <div
              class="xtermList roll borderColor background1"
              v-show="xtermListShow"
            >
              <div v-for="(t, i) in xtermList" :key="i">
                <div
                  v-for="(item, index) in t"
                  :key="item.id"
                  :class="{
                    li: true,
                    current: item.id == xtermId,
                    textColor1: true,
                  }"
                  @click="choice(item.id, i)"
                >
                  <div style="display: flex">
                    <template v-if="t.length > 1">
                      <div v-if="index == 0">首</div>
                      <div v-else-if="index == t.length - 1">尾</div>
                      <div v-else>中</div>
                    </template>
                    <div class="name">
                      <right-square-outlined class="icon" />shell
                    </div>
                  </div>
                  <div class="ri">
                    <div class="delete">
                      <border-horizontal-outlined
                        title="拆分终端"
                        @click="split(t)"
                      />
                    </div>
                    <div class="delete">
                      <delete-outlined
                        @click.stop="del(i, index)"
                        title="终止"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="quick roll borderColor"
            :style="'height: calc(' + isQuick + '20px);'"
          >
            <div class="icons" @click="switchQuick">
              <arrows-alt-outlined v-if="!isQuick" /><shrink-outlined
                v-if="isQuick"
              />
            </div>

            <div
              class="buttom textColor1"
              v-if="xtermList.length != 0"
              v-for="(item, index) in quickList"
              :key="index"
              @click="quick(item.Value)"
            >
              <a-tooltip placement="top" color="#666">
                <template #title> {{ item.Value }} </template>
                {{ item.Name }}
              </a-tooltip>
            </div>
          </div>
        </div>
        <template v-if="isFirst1">
        
          <a-spin
            tip="Loading..."
            class="load"
            v-show="tabIndex == 'chatgpt' && !iframeLoad1"
          >
          </a-spin>
        </template>
         
        <div class="lookup textColor1" v-show="tabIndex == '查找文件'">
          <a-form
            layout="inline"
            :model="formState"
            @finish="handleFinish"
            class="form background1 borderColor"
          >
            <a-form-item label="查找目录" :rules="[{ required: true }]">
              <a-input v-model:value="formState.directory"> </a-input>
            </a-form-item>
            <a-form-item label="文件名" :rules="[{ required: true }]">
              <a-input v-model:value="formState.file"> </a-input>
            </a-form-item>
            <a-form-item label="查找文字">
              <a-input v-model:value="formState.text"> </a-input>
            </a-form-item>
            <a-form-item label="显示前后行数">
              <a-input v-model:value="formState.num" style="width: 40px">
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit">查找</a-button>
            </a-form-item>
          </a-form>
          <div class="con borderColor background2">
            <span>{{ str }}</span>
            <br />
            <span v-if="result.data.Error"
              >error：执行错误：{{ result.data.Error }}</span
            >
            <span v-if="result.data.Stderr"
              >stderr：命令错误：{{ result.data.Stderr }}</span
            >
            <br />
            <span>{{ result.data.Stdout }}</span>
          </div>
        </div>
        <div
          class="system"
          style="height: 100%"
          v-show="tabIndex == '系统信息'"
        >
          <system></system>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, getCurrentInstance, watch } from "vue";
//import { notification, message } from "ant-design-vue";
import { machineApi } from "./api";
import xterm from "./xterm.vue"
import system from "./system.vue";
import monacoEditor from "./monacoEditor.vue";
import markdownEditor from "./markdownEditor.vue";
import tree from "./tree.vue";
import treeRoot from "./treeRoot.vue";
import tabs from "./tabs.vue";
import breadcrumb from "./breadcrumb.vue";
import System from "./system.vue";

import { storeToRefs } from 'pinia';
import { useMachineInfo } from '@/store/machineInfo';
const { machineInfo } = storeToRefs(useMachineInfo());
//useMachineInfo().setSelectedFileId('',"")

//获取vue实例
const { proxy } = getCurrentInstance();

const paramMachineId = proxy.$route.query.machineId;
const paramName= proxy.$route.query.name;
const paramAc= proxy.$route.query.ac;


onMounted(() => {
  //获取服务器基本信息
  initQuickList();
  
});
//-----------------------routeList---------------------------------
const routeList = ref([{ routeList: [], routeId: "" }]);
const routeIndex = ref(0);
const isRouteList = ref(true);
watch(
  () => routeList.value,
  (newValue, oldValue) => {
    newValue.forEach((item, index) => {
      if (item.routeList.length == 0) {
        if (newValue.length != 1) {
          newValue.splice(index, 1);
        } else {
          routeList.value[0].routeId = "";
        }
        if (routeIndex.value != 0) {
          routeIndex.value--;
        }
      }
    });
  },
  { deep: true }
);
const currentMonacoEditor = reactive({ filename: "", value: "", num: "" });
const throFunc = (data) => {
  currentMonacoEditor.filename = data.filename;
  currentMonacoEditor.value = data.value;
  currentMonacoEditor.num = data.num;
};
//分屏
const splitScreen = (item, is) => {
  if (is) {
    if (routeList.value[0].routeId == "") return;
  }
  let data = {
    routeId: item.routeId,
  };
  item.routeList.forEach((t) => {
    if (t.filename == item.routeId) {
      data.routeList = [t];
    }
  });
  routeList.value.push(data);
};
//打开文件
function ADD_ROUTE_LIST(data) {
  if (isRouteList.value) {
    routeList.value[routeIndex.value].routeList.push(data);
    isRouteList.value = false;
    setTimeout(() => {
      isRouteList.value = true;
    }, 300);
  }
}
//设置已打开文件列表  关闭其他标签用
function SET_ROUTE_LIST(data) {
  routeList.value[routeIndex.value].routeList = data;
}
//设置tabs文件加载状态
function SET_ROUTE_LIST_ITEM_ISLOAD(data) {
  routeList.value[routeIndex.value].routeList.forEach((item) => {
    if (item.filename == data.id) {
      item.isLoad = data.isLoad;
    }
  });
}
//关闭文件
function DEL_ROUTE_LIST(data) {
  // if (isRouteList.value) {
  let index = -1;
  routeList.value[routeIndex.value].routeList.forEach((item, i) => {
    if (item.filename == data) {
      index = i;
    }
  });
  if (routeList.value[routeIndex.value].routeId == data) {
    if (index == routeList.value[routeIndex.value].routeList.length - 1) {
      if (routeList.value[routeIndex.value].routeList.length == 1) {
      } else {
        routeList.value[routeIndex.value].routeId =
          routeList.value[routeIndex.value].routeList[index - 1].filename;
      }
    } else {
      routeList.value[routeIndex.value].routeId =
        routeList.value[routeIndex.value].routeList[index + 1].filename;
    }
  }
  if (index != -1) {
    routeList.value[routeIndex.value].routeList.splice(index, 1);
  }
  //   isRouteList.value = false;
  //   setTimeout(() => {
  //     isRouteList.value = true;
  //   }, 300);
  // }
}
//设置当前正在浏览的文件id
function SET_ROUTE_ID(data) {
  routeList.value[routeIndex.value].routeId = data.filename;
  store.commit("SET_TREEID", data.filename);
  let title = "[" + data.basename + "]-" + store.state.initData.Name;
  document.title = title;
  if (window.parent.setTitle) {
    window.parent.setTitle(title);
  }
}
//-------------------------主题切换---------------------------------
if (localStorage.getItem("theme")) {
  store.commit("SET_THEME", localStorage.getItem("theme"));
}
const setTheme = () => {
  let theme = store.state.theme == "black" ? "white" : "black";
  store.commit("SET_THEME", theme);
  window.parent.setTheme();
};
window.setTheme = function () {
  store.commit("SET_THEME", localStorage.getItem("theme"));
};
//-------------------------树区域tab切换---------------------------------
const treeRootRef = ref(null);
const activeKey = ref(1);
const tabClick = (key) => {
  activeKey.value = key;
  if(key==2){
    treeRootRef.value.init()
  }
};
//------------------------查找-------------------------------
const formState = reactive({
  directory: "",
  file: "",
  text: "",
  num: localStorage.getItem("rows") ? localStorage.getItem("rows") : 5,
});
const result = reactive({
  data: {},
});
const str = ref("");
const handleFinish = (values) => {
  if (formState.directory == "") {
    notification["error"]({
      message: "查找目录不能为空",
    });
    return;
  } else if (formState.file == "") {
    notification["error"]({
      message: "文件名不能为空",
    });
    return;
  }
  if (formState.text == "") {
    str.value = `find ${formState.directory} -type f -name ${formState.file}`;
  } else {
    str.value = `find ${formState.directory} -type f -name ${formState.file} | xargs grep -n -C ${formState.num} ${formState.text}`;
  }
  localStorage.setItem("rows", formState.num);
  findFiles(str).then((res) => {
    result.data = res;
  });
};
//-------------------------终端列表---------------------------------
let xtermListShow = ref(false);
let xtermList = reactive([]); //默认无终端
let xtermIndex = ref("");
let xtermId = ref("");
const tabList = ref(["终端", "查找文件", "系统信息", "chatgpt"]);
const tabIndex = ref("终端");
const iframeLoad1 = ref(false);
const iframeLoad2 = ref(false);
const isFirst1 = ref(false);
const isFirst2 = ref(false);
const tabTap = (index, item) => {
  tabIndex.value = index;
  switch (index) {
    case "终端":
      break;
    case "chatgpt":
      if (!isFirst1.value) {
        isFirst1.value = true;
      }
      break;   
    case "查找文件":
      if (!item) return;
      if (item.type == "file") {
        let path = item.filename.split("/");
        path.shift();
        path.pop();
        path = "/" + path.join("/");
        formState.directory = path;
        formState.file = item.basename;
      } else {
        formState.directory = item.filename;
        formState.file = "*";
      }
      break;
  }
};
//复制
const copy = (str) => {
  // 模拟 输入框
  let cInput = document.createElement("input");
  cInput.value = str;
  document.body.appendChild(cInput);
  // 选取文本框内容
  cInput.select();

  document.execCommand("copy");

  // 复制成功后再将构造的标签 移除
  document.body.removeChild(cInput);
  message.success("复制成功");
};
//开关终端列表
function switchShow() {
  xtermListShow.value = !xtermListShow.value;
  resizeXtermScreen();
}
//删除终端
function del(i, index) {
  var id = xtermList[i][index].id;
  console.log(proxy.$refs["child" + id][0]);
  proxy.$refs["child" + id][0].exit();

  if (xtermList[i][index].id == xtermId.value) {
    if (index == xtermList[i].length - 1) {
      if (i == xtermList.length - 1) {
        if (xtermList[i].length > 1) {
          xtermId.value = xtermList[i][index - 1].id;
        } else {
          if (xtermList.length > 1) {
            xtermId.value = xtermList[i - 1][xtermList[i - 1].length - 1].id;
          }
        }
      } else {
        xtermId.value = xtermList[i + 1][0].id;
      }
    } else {
      xtermId.value = xtermList[i][index + 1].id;
    }
  }
  xtermList[i].splice(index, 1);
  if (xtermList[i].length == 0) {
    xtermList.splice(i, 1);
    if (
      i < xtermIndex.value ||
      (i == xtermList.length && i == xtermIndex.value)
    ) {
      xtermIndex.value = xtermIndex.value - 1;
    }
  }
  //有bug
}
//添加终端
function add(item) {
  let num = Math.random();
  if (xtermList.includes(num)) {
    add(item);
    return;
  }
  let path = item.filename;
  if (item.type == "file") {
    path = item.filename.split("/");
    path.shift();
    path.pop();
    path = "/" + path.join("/");
  }
  xtermList.push([
    {
      id: num,
      path: path,
    },
  ]);
  xtermIndex.value = xtermList.length - 1;
  xtermId.value = num;
  xtermListShow.value = true;
}
//拆分终端
const split = (list) => {
  let num = Math.random();
  if (xtermList.includes(num)) {
    add(list);
    return;
  }
  list.push({
    id: num,
  });
  xtermId.value = num;
};
//切换终端
function choice(id, i) {
  xtermIndex.value = i;
  xtermId.value = id;
  resizeXtermScreen();
}
let xtermTime = null;
//获取当前终端并自适应大小
function resizeXtermScreen() {
  if (xtermTime) {
    clearTimeout(xtermTime);
  }
  xtermTime = setTimeout(() => {
    if (xtermList.length == 0) return;
    xtermList[xtermIndex.value].forEach((item, indexs) => {
      proxy.$refs["child" + item.id][0].resizeScreen();
    });
  }, 300);
}
//快捷操作开关
const isQuick = ref(0);
function switchQuick() {
  if (isQuick.value == 1) {
    isQuick.value = 0;
  } else {
    isQuick.value = 1;
  }
  resizeXtermScreen();
}
//终端快捷操作列表
let quickList = reactive([]);
function initQuickList() {
  let quickListTemp = [];
  store.state.initData.ServerApp.AppList.forEach((item) => {
    quickListTemp = quickListTemp.concat(item.ShortcutList);
  });
  quickListTemp = quickListTemp.concat(
    store.state.initData.ServerApp.ShortcutList
  );
  quickListTemp.forEach((item) => {
    quickList.push(item);
  });
}
//快捷操作事件
function quick(e) {
  if (xtermList.length == 0) return;
  proxy.$refs["child" + xtermId.value][0].quick(e);
}
//-------------------------布局拖拽---------------------------------
onMounted(() => {
  mouseDownAndMove(siderMoveLine.value, (e) => {
    let currWidth = siderWidthCurr - (siderStartMoveX - e.pageX);
    if (currWidth < 105) {
      siderWidth.value = 105;
    } else {
      siderWidth.value = currWidth;
    }
    resizeXtermScreen();
  });
  mouseDownAndMoveHeight(footerMoveLine.value, (e) => {
    let currHeight =
      footerHeightCurr * 1 + (footerMoveEventStartY * 1 - e.pageY * 1);
    if (currHeight < 40) {
      footerHeight.value = 40;
    } else {
      footerHeight.value = currHeight;
    }
    localStorage.setItem("footerHeight", footerHeight.value);
    resizeXtermScreen();
  });
});
const siderMoveLine = ref(null);
let siderStartMoveX = 0;
const siderWidth = ref(300);
let siderWidthCurr = 300;
function mouseDownAndMove(dom, callback) {
  // 添加鼠标按下监听
  dom.addEventListener("mousedown", function (e) {
    siderStartMoveX = e.pageX;
    document.body.style.cursor = "w-resize";
    // 当鼠标按下时, 添加鼠标移动监听
    document.addEventListener("mousemove", callback);
  });
  // 添加鼠标弹起监听 , 即鼠标不在按下
  document.addEventListener("mouseup", function () {
    siderWidthCurr = siderWidth.value;
    document.body.style.cursor = "";
    // 此时移除 鼠标移动监听,移除指定 事件函数
    document.removeEventListener("mousemove", callback);
  });
}
const footerMoveLine = ref(null);
let footerMoveEventStartY = 0;
const footerHeight = ref(300);
if (localStorage.getItem("footerHeight")) {
  footerHeight.value = localStorage.getItem("footerHeight");
}
let footerHeightCurr = footerHeight.value;

function mouseDownAndMoveHeight(dom, callback) {
  // 添加鼠标按下监听
  dom.addEventListener("mousedown", function (e) {
    footerMoveEventStartY = e.pageY;
    document.body.style.cursor = "n-resize";
    // 当鼠标按下时, 添加鼠标移动监听
    document.addEventListener("mousemove", callback);
  });
  // 添加鼠标弹起监听 , 即鼠标不在按下
  document.addEventListener("mouseup", function () {
    footerHeightCurr = footerHeight.value;

    document.body.style.cursor = "";
    // 此时移除 鼠标移动监听,移除指定 事件函数
    document.removeEventListener("mousemove", callback);
  });
}
</script>

<style lang="less" scoped>
.hidden {
  opacity: 1 !important;
}
.home {
  height: 100vh;
  display: flex;
  -moz-user-select: none;
  /*火狐*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -ms-user-select: none;
  /*IE10*/
  user-select: none;

  /*选中文字时避免出现蓝色背景*/
  .Sider {
    position: relative;

    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    .xian {
      position: absolute;
      top: 0;
      right: 0;
      transform: translateX(100%);
      z-index: 10;
      width: 4px;
      height: 100%;
      cursor: w-resize;

      &:hover {
        background: #007fd4;
      }
    }
    .tabs {
      width: 100%;
      height: 40px;
      display: flex;
      .tab {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        cursor: pointer;
      }
      .current {
        border-bottom: 1px solid #1890ff;
        color: #1890ff;
      }
    }
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .headerContent {
      display: flex;
      .li {
        flex: 1;
        overflow: hidden;
        border-right-width: 1px;
        border-right-style: solid;
        .Header {
          opacity: 0;
          .background2 {
            display: flex;
            .splitScreen {
              display: flex;
              align-items: center;
              opacity: 0;
              .icon {
                font-size: 22px;
                margin-right: 10px;
                cursor: pointer;
              }
            }
          }
        }

        .Content {
          .image {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .Footer {
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      flex-shrink: 0;

      .topXian {
        width: 100%;
        height: 4px;
        position: absolute;
        top: 0;
        right: 0;
        cursor: n-resize;
        z-index: 9;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        &:hover {
          background: #007fd4;
        }
      }

      .topBar {
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 10px 0;

        .le {
          display: flex;

          .li {
            margin-left: 20px;
            cursor: pointer;
            font-size: 12px;
          }
          .ip {
            color: #1890ff;
            margin-left: 40px;
          }
          .current {
            border-bottom: 1px solid rgba(204, 204, 204, 0.8);
          }
        }

        .ri {
          cursor: pointer;

          > span {
            margin-right: 10px;
          }
        }
      }
      .xterm {
        padding-left: 10px;
        position: relative;
        .xtermUl {
          width: 100%;
          height: 100%;
          display: flex;
          .xtermLi {
            padding: 0 2px;
            border-right-width: 1px;
            border-right-style: solid;
            &:last-child {
              border: 0px;
            }
          }
        }
        .xtermList {
          width: 150px;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 99999999;
          border-left-width: 1px;
          border-left-style: solid;
          .li {
            font-size: 12px;
            cursor: pointer;
            height: 22px;
            display: flex;
            align-items: center;
            padding-left: 10px;
            justify-content: space-between;
            position: relative;
            > div {
              display: flex;
            }
            > .ri {
              margin-right: 12px;
            }
            &:hover .delete {
              display: block;
            }

            .name {
              display: flex;
              align-items: center;

              .icon {
                font-size: 14px;
                margin-right: 3px;
              }
            }

            .delete {
              display: none;
              margin-left: 5px;
            }
          }
        }
      }
      iframe {
        width: 100%;
      }
      .load {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .right {
        padding-right: 150px;
      }
      .quick {
        width: 100%;
        border-top-width: 1px;
        border-top-style: solid;
        background: rgb(0, 122, 204);
        position: relative;
        padding-right: 50px;
        .buttom {
          height: 20px;
          min-width: 50px;
          cursor: pointer;
          color: #fff;
          font-size: 12px;
          padding: 0px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          float: left;
        }
        .icons {
          position: fixed;
          right: 10px;
          bottom: 0px;
          color: #fff;
          font-size: 12px;
          cursor: pointer;
        }
      }
      .lookup {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .form {
          width: 100%;
          height: 70px;
          display: flex;
          align-items: center;
          border-style: solid;
          border-width: 1px;
        }
        .con {
          flex: 1;
          border-style: solid;
          border-width: 1px;
          border-top: 0;
          user-select: text;
        }
      }
    }
  }
}
</style>
