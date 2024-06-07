<template>
  <div id="note-markdown" class="container" @keyup.prevent="onKey"></div>
</template>
<script setup>
import * as monaco from "monaco-editor";
// import { notification, Modal } from "ant-design-vue";
import { onMounted, reactive, toRaw, watch } from "vue";
// import { exists, getFileContents, putFileContents,getFileDownloadLink, } from "../api/api";
//获取vuex对象
import { useStore } from "vuex";
const store = useStore();
const getVal = () => {
  return toRaw(editor.getValue());
};
const path = "/home/.note.mshell";
onMounted(async () => {
  initEditor();
  if (await exists(path)) {
    getFile();
  }
});
watch(
  () => store.state.theme,
  (newValue, oldValue) => {
    if (newValue == "black") {
      monaco.editor.setTheme("vs-dark");
    } else if (newValue == "white") {
      monaco.editor.setTheme("vs");
    }
  },
  { deep: true }
);
let editor = reactive({});
let fileContent = "";
//获取文件内容
async function getFile(source) {
  try {
    //获得文件内容
    fileContent = await getFileContents(path, {
      format: "text",
      headers: { "Cache-control": "no-cache" },
    });
    //获取成功
    editor.setValue(fileContent);
    if (source == "ref") {
      notification.success({
        message: "刷新成功",
        description: "",
        duration: 2,
      });
    }
  } catch (error) {
    // emit("SET_ROUTE_LIST_ITEM_ISLOAD", {
    //   id: item.filename,
    //   isLoad: false,
    // });
    notification["error"]({
      description: error.message,
      duration: 0,
    });
  }
}
//初始化
function initEditor() {
  // 初始化编辑器，确保dom已经渲染
  editor = monaco.editor.create(document.getElementById("note-markdown"), {
    value: "", //编辑器初始显示文字
    language: "markdown", //语言支持自行查阅 todo: 后续支持语言切换
    demoautomaticLayout: true, //自动布局
    theme: store.state.theme == "black" ? "vs-dark" : "vs", //官方自带三种主题vs, hc-black, or vs-dark
    automaticLayout: true,
  });
  //增加右键刷新按钮
  editor.addAction({
    id: "2",
    label: "刷新",
    contextMenuGroupId: "99_cutcopypaste", // 所属菜单的分组
    run: async () => {
      getFile("ref");
    },
  });
  editor.addAction({
    id: "1", // 菜单项 id
    label: "保存", // 菜单项名称
    contextMenuGroupId: "99_cutcopypaste", // 所属菜单的分组
    run: () => {
      saveFile();
    },
  });
  //增加右键下载按钮
  editor.addAction({
    id: "4", // 菜单项 id
    label: "下载", // 菜单项名称
    contextMenuGroupId: "99_cutcopypaste", // 所属菜单的分组
    run: () => {
      try {
        const downloadLink = getFileDownloadLink(path);
        window.open(downloadLink + "?file_pid=" + store.state.initData.Id);
      } catch (error) {
        notification["error"]({
          description: error.message,
          duration: 0,
        });
      }
    }, // 点击后执行的操作
  });

}
function onKey(e) {
  if (e.ctrlKey && e.keyCode == 83) {
    console.log("ctrl+s");
    saveFile();
  }
}
//保存文件
async function saveFile() {
  let newFileContent = getVal();
  if (fileContent == newFileContent) {
    notification.success({
      message: "文件内容未变化",
      description: "",
      duration: 1,
    });
    return;
  }
  if (await exists(path)) {
    save();
  } else {
    Modal.confirm({
      title: "服务器还没有该文件，是否创建并保存?",
      onOk() {
        save();
      },

      onCancel() {},
    });
  }
  async function save() {
    try {
      // 内容是否变化
      fileContent = newFileContent;
      await putFileContents(path, getVal());
      notification["success"]({
        message: "保存成功",
        duration: 3,
      });
    } catch (error) {
      notification["error"]({
        description: error.message,
        duration: 0,
      });
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
