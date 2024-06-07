<template>
  <div class="tree roll">
    <a-dropdown :trigger="['contextmenu']">
      <div>
        <my-tree :treeList="treeList" @selected="clickCallback"></my-tree>
      </div>
      <template #overlay>
        <a-menu class="menu">
          <a-menu-item @click="newFile"> 新建文件 </a-menu-item>
          <a-menu-item @click="newFolder">新建文件夹 </a-menu-item>
          <a-menu-item
            :class="{
              prohibit: store.state.itemRight.type != 'file',
            }"
            @click="splitScreen"
            >在侧边打开</a-menu-item
          >
          <a-menu-item @click="openXterm" :class="{ xian: true }">
            在集成终端打开
          </a-menu-item>
          <a-menu-item
            @click="addApp"
            :class="{
              prohibit: !store.state.itemRight.lastmod,
            }"
            >添加到应用</a-menu-item
          >
          <a-menu-item
            @click="findFiles"
            :class="{
              xian: true,
              prohibit: !store.state.itemRight.lastmod,
            }"
            >查找文件</a-menu-item
          >
          <a-menu-item @click="showModal1">上传 </a-menu-item>
          <a-menu-item
            @click="download"
            :class="{
              prohibit: store.state.itemRight.type != 'file',
            }"
            >下载
          </a-menu-item>
          <a-menu-item
            @click="refresh"
            :class="{
              xian: true,
              prohibit:
                store.state.itemRight.type == 'file' ||
                store.state.itemRight.isSystem,
            }"
            >刷新</a-menu-item
          >
          <a-menu-item @click="copyPath" class="xian">复制路径</a-menu-item>
          <a-menu-item @click="rename">重命名</a-menu-item>
          <a-menu-item @click="tapDelete">删除</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-modal
      v-model:visible="visible"
      title="应用管理"
      @ok="onFinish"
      @cancel="cancel"
      width="700px"
    >
      <a-form :model="formState" v-bind="layout" name="nest-messages">
        <a-form-item label="选择应用">
          <a-select v-model:value="formState.user.id" @change="select">
            <a-select-option :value="item.Id" v-for="item in appList">{{
              item.Name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="名称" :rules="[{ required: true }]">
          <a-input v-model:value="formState.user.name" />
        </a-form-item>
        <a-form-item label="主目录" :rules="[{ required: true }]">
          <a-input v-model:value="formState.user.main_path" />
        </a-form-item>
        <a-form-item label="相关目录">
          <a-textarea
            v-model:value="formState.user.dir_list"
            style="height: 120px"
          />
        </a-form-item>
        <a-form-item label="快捷指令">
          <a-textarea
            v-model:value="formState.user.shortcut_list"
            style="height: 120px"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <upload v-model:visible="visible1" @uploadOk="uploadOk"></upload>
  </div>
</template>
<script setup>
import myTree from "./myTree.vue";
import upload from "./upload.vue";
// import { message, notification, Modal } from "ant-design-vue";
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
// import {
//   getServerAppInfo,
//   appInfo,
//   addToApp,
//   getDirectoryContents,
//   createDirectory,
//   exists,
//   putFileContents,
//   deleteFile,
//   moveFile,
//   getFileDownloadLink,
// } from "../api/api";
import { formatBytes, recursion } from "./_pro_util";
const emit = defineEmits([
  "openXterm",
  "ADD_ROUTE_LIST",
  "SET_ROUTE_ID",
  "DEL_ROUTE_LIST",
  "splitScreen",
  "findFiles",
]);
const route = useRoute();
const store = useStore();
const props = defineProps({
  routeList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  routeIndex: {
    type: Number,
    default: 0,
  },
});
const treeList = ref([
  {
    basename: "文件目录",
    children: [],
    filename: "/",
    isLoad: false,
    isOpened: true,
    type: "directory",
  },
]);

defineExpose({
  init() {
    if(treeList.value[0].children.length!==0)return
    clickCallback(treeList.value[0]);
  },
});
//点击回调
const clickCallback = async (item) => {
  //清除右键选中的item
  store.commit("SET_ITEM_RIGHT", {});
  //获取目录
  if (item.type == "directory") {
    //isOpend的意思反了
    if (item.isOpened == false) {
      item.children = [];
      return;
    }
    item.isLoad = true;
    let path = item.filename;
    recursion(treeList.value, path, async (item) => {
      try {
        let arr = await getDirectoryContents(path);
        arr.map((item) => {
          item.isOpened = false;
        });
        arr.sort((m, n) => {
          let nameM = m["type"] + "-" + m["basename"];
          let nameN = n["type"] + "-" + n["basename"];
          return nameM.localeCompare(nameN); //升序
        });
        item.isLoad = false;
        item.children = arr;
      } catch (error) {
        item.isLoad = false;
        notification["error"]({
          description: error.message,
          duration: 0,
        });
      }
    });
    return;
  }
  //获取文件内容
  if (
    item.size > 1024 * 1024 * 10 
  ) {
    notification["warning"]({
      description: "文件太大，请下载",
      duration: 5,
    });
    return;
  }
  let isAddObj = true;
  props.routeList[props.routeIndex].routeList.forEach((t) => {
    if (item.filename == t.filename) {
      isAddObj = false;
    }
  });
  if (isAddObj) {
    //不在这里获得文件内容
    emit("ADD_ROUTE_LIST", item);
  }
  emit("SET_ROUTE_ID", item);
  setTimeout(() => {
    document.getElementById(`tabs${item.filename}`).scrollIntoView({
      // behavior:"smooth",   //平滑过渡
    });
  }, 1);
};
//在侧边打开
const splitScreen = () => {
  const item = store.state.itemRight;
  if (
    item.size > 1024 * 1024 * 10 
  ) {
    notification["warning"]({
      description: "文件太大，请下载",
      duration: 5,
    });
    return;
  }
  const data = {
    routeId: item.filename,
    routeList: [item],
  };
  emit("splitScreen", data);
};
//在终端打开
function openXterm() {
  emit("openXterm", store.state.itemRight);
}
//新建文件夹
const newFolder = async (e) => {
  let item = store.state.itemRight;
  let path = item.filename;
  if (item.type == "file") {
    path = item.filename.split("/");
    path.shift();
    path.pop();
    path = "/" + path.join("/");
  }
  let str = await $prompt("请输入文件夹名称");
  if (str) {
    if (await exists(path + "/" + str)) {
      message.error("文件名已存在");
    } else {
      createDirectory(path + "/" + str).then((res) => {
        recursion(treeList.value, path, async (item) => {
          try {
            let arr = await getDirectoryContents(item.filename);
            arr.sort((m, n) => {
              let nameM = m["type"] + "-" + m["basename"];
              let nameN = n["type"] + "-" + n["basename"];
              return nameM.localeCompare(nameN); //升序
            });
            item.children = arr;
            item.isOpened = true;
          } catch (error) {
            notification["error"]({
              description: error.message,
              duration: 0,
            });
          }
        });
      });
    }
  }
};
//新建文件
const newFile = async (e) => {
  let item = store.state.itemRight;
  let path = item.filename;
  if (item.type == "file") {
    path = item.filename.split("/");
    path.shift();
    path.pop();
    path = "/" + path.join("/");
  }
  let str = await $prompt("请输入文件名称");
  if (str) {
    if (await exists(path + "/" + str)) {
      message.error("文件名已存在");
    } else {
      await putFileContents(path + "/" + str, "");
      recursion(treeList.value, path, async (item) => {
        try {
          let arr = await getDirectoryContents(item.filename);
          arr.sort((m, n) => {
            let nameM = m["type"] + "-" + m["basename"];
            let nameN = n["type"] + "-" + n["basename"];
            return nameM.localeCompare(nameN); //升序
          });
          item.children = arr;
          item.isOpened = true;
          arr.forEach((item) => {
            if (item.basename == str) {
              clickCallback(item);
            }
          });
        } catch (error) {
          notification["error"]({
            description: error.message,
            duration: 0,
          });
        }
      });
    }
  }
};
//删除文件
const tapDelete = async () => {
  let item = store.state.itemRight;
  let title =
    item.type == "file"
      ? `确定要删除${item.basename}?`
      : `确定要删除${item.basename}及其内容?`;

  Modal.confirm({
    title: title,
    async onOk() {
      if (item.type == "directory") {
        let arr = await getDirectoryContents(item.filename);
        if (arr.length != 0) {
          notification["error"]({
            description: "不支持删除有内容的文件夹",
          });
          return;
        }
        // try {
        //   let arr = await getDirectoryContents(item.filename, { deep: true });
        //   for (let i = arr.length - 1; i >= 0; i--) {
        //     const item = arr[i];
        //     try {
        //       await deleteFile(item.filename);
        //       emit("DEL_ROUTE_LIST", item.filename);
        //     } catch (error) {
        //       notification["error"]({
        //         description: error.message,
        //         duration: 0,
        //       });
        //     }
        //   }
        // } catch (error) {
        //   notification["error"]({
        //     description: error.message,
        //     duration: 0,
        //   });
        // }
      }
      try {
        await deleteFile(item.filename);
      } catch (error) {
        notification["error"]({
          description: error.message,
          duration: 0,
        });
      }

      let itemPath = item.filename;
      let path = item.filename.split("/");
      path.shift();
      path.pop();
      path = "/" + path.join("/");
      recursion(treeList.value, path, async (item) => {
        try {
          let arr = await getDirectoryContents(item.filename);
          arr.sort((m, n) => {
            let nameM = m["type"] + "-" + m["basename"];
            let nameN = n["type"] + "-" + n["basename"];
            return nameM.localeCompare(nameN); //升序
          });
          item.children = arr;
          emit("DEL_ROUTE_LIST", itemPath);
        } catch (error) {
          notification["error"]({
            description: error.message,
            duration: 0,
          });
        }
      });
      notification["success"]({
        description: "删除成功",
      });
    },

    onCancel() {},
  });
};
//复制路径
const copyPath = () => {
  let item = store.state.itemRight;

  // 模拟 输入框
  let cInput = document.createElement("input");
  cInput.value = item.filename;
  document.body.appendChild(cInput);
  // 选取文本框内容
  cInput.select();

  document.execCommand("copy");

  // 复制成功后再将构造的标签 移除
  document.body.removeChild(cInput);
  message.success("复制成功");
};
//重命名
const rename = async () => {
  let item = store.state.itemRight;
  let path = item.filename.split("/");
  path.shift();
  path.pop();
  path = "/" + path.join("/");
  let str = await $prompt("请输入文件名称", item.basename);
  if (str) {
    try {
      await moveFile(item.filename, path + "/" + str);
    } catch (error) {
      notification["error"]({
        description: error.message,
        duration: 0,
      });
    }
    recursion(treeList.value, path, async (item) => {
      try {
        let arr = await getDirectoryContents(item.filename);
        arr.sort((m, n) => {
          let nameM = m["type"] + "-" + m["basename"];
          let nameN = n["type"] + "-" + n["basename"];
          return nameM.localeCompare(nameN); //升序
        });
        item.children = arr;
      } catch (error) {
        notification["error"]({
          description: error.message,
          duration: 0,
        });
      }
    });
  }
};
//下载
const download = () => {
  let item = store.state.itemRight;
  Modal.confirm({
    title: "是否确认下载",
    content: `文件名：${item.basename}    文件大小：${formatBytes(
      item.size,
      0
    )}`,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      try {
        const downloadLink = getFileDownloadLink(item.filename);
        window.open(downloadLink + "?file_pid=" + store.state.initData.Id);
      } catch (error) {
        notification["error"]({
          description: error.message,
          duration: 0,
        });
      }
    },

    onCancel() {},
  });
};
//-----------------上传---------------------
const visible1 = ref(false);
const showModal1 = () => {
  visible1.value = true;
};
const uploadOk = (path, cancel) => {
  recursion(treeList.value, path, async (item) => {
    try {
      let arr = await getDirectoryContents(item.filename);
      arr.sort((m, n) => {
        let nameM = m["type"] + "-" + m["basename"];
        let nameN = n["type"] + "-" + n["basename"];
        return nameM.localeCompare(nameN); //升序
      });
      item.children = arr;
      item.isOpened = true;
      visible1.value = false;
      cancel();
    } catch (error) {
      notification["error"]({
        description: error.message,
        duration: 0,
      });
    }
  });
};
//刷新
const refresh = () => {
  let item = store.state.itemRight;
  item.isLoad = true;
  let path = item.filename;
  recursion(treeList.value, path, async (item) => {
    try {
      let arr = await getDirectoryContents(path);
      item.isOpened = true;
      arr.sort((m, n) => {
        let nameM = m["Type"] + "-" + m["basename"];
        let nameN = n["Type"] + "-" + n["basename"];
        return nameM.localeCompare(nameN); //升序
      });
      item.isLoad = false;
      item.children = arr;
    } catch (error) {
      notification["error"]({
        description: error.message,
        duration: 0,
      });
    }
  });
};
//添加到应用
const addApp = () => {
  showModal();
};
//查找文件
const findFiles = () => {
  emit("findFiles", "查找文件", store.state.itemRight);
};
//当前右键选中的路径
const currentDirectory = () => {
  let item = store.state.itemRight;
  if (item.type == "file") {
    if (formState.user.id === 0) {
      let path = item.filename.split("/");
      path.shift();
      path.pop();
      path = "/" + path.join("/");
      return path;
    } else {
      return "file:" + item.filename;
    }
  } else {
    return item.filename;
  }
};
//弹窗部分
const appList = ref([]);
const visible = ref(false);
const showModal = async () => {
  let item = store.state.itemRight;
  let res = await getServerAppInfo({ pid: route.params.pid });
  appList.value = res.ServerApp.AppList;
  appList.value.unshift({ Name: "新增应用", Id: 0 });
  formState.user.main_path = currentDirectory();
  visible.value = true;
};
//关闭回调 重置表单
const cancel = () => {
  let user = {
    dir_list: "",
    id: 0,
    main_path: "",
    name: "",
    shortcut_list: "",
  };
  formState.user = user;
};
//表单部分
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

let formState = reactive({
  user: {
    dir_list: "",
    id: 0,
    main_path: "",
    name: "",
    shortcut_list: "",
  },
});

const select = () => {
  if (formState.user.id === 0) {
    cancel();
    formState.user.main_path = currentDirectory();
  } else {
    appInfo({ pid: route.params.pid, id: formState.user.id }).then((res) => {
      formState.user = res;
      formState.user.dir_list +=
        formState.user.dir_list == ""
          ? currentDirectory()
          : "\r\n" + currentDirectory();
    });
  }
};

//ok回调
const onFinish = () => {
  if (formState.user.name == "") {
    notification["error"]({
      message: "名称不能为空",
    });
    return;
  } else if (formState.user.main_path == "") {
    notification["error"]({
      message: "主目录不能为空",
    });
    return;
  }
  addToApp({
    dir_list: formState.user.dir_list,
    id: formState.user.id,
    main_path: formState.user.main_path,
    name: formState.user.name,
    shortcut_list: formState.user.shortcut_list,
    server_id: route.params.pid,
  }).then((res) => {
    visible.value = false;
    cancel();
    notification["success"]({
      message: "添加成功",
    });
  });
};
</script>
<style scoped lang="less">
.tree {
  position: relative;
  width: 100%;
  flex: 1;
  .xian {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(100%);
    z-index: 10;
    width: 4px;
    height: 100%;
    cursor: w-resize;

    &:hover {
      background: #007fd4;
    }
  }
}

//右键菜单
.ant-dropdown-menu {
  width: 250px;
}

.menu {
  /deep/ .ant-dropdown-menu-item {
    &:last-child {
      border: 0;
    }

    &:hover {
      background: #007fd4;
    }
  }

  /deep/ .xian {
    border-bottom: 1px solid #606060;
  }

  /deep/ .prohibit {
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
  }
}
</style>
