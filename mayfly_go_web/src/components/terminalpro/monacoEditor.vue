<template>
  <div
    :id="props.item.filename + num"
    class="container"
    @keyup.prevent="onKey"
  ></div>
</template>
<script setup>
import * as monaco from "monaco-editor";
//import { notification } from "ant-design-vue";
import { onMounted, reactive, toRaw, watch } from "vue";
import { useStore } from "vuex";
// import {
//   putFileContents,
//   getFileDownloadLink,
//   getFileContents,
//   stat,
// } from "../api/api";
const store = useStore();
const emit = defineEmits(["SET_ROUTE_LIST_ITEM_ISLOAD", "throFunc"]);
const num = Math.random();
const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {};
    },
  },
  currentMonacoEditor: {
    type: Object,
    default: () => {
      return {};
    },
  },
  routeList: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
//获取文件内容
const getVal = () => {
  return toRaw(editor.getValue());
};
//更新文件内容
const setValue = (value) => {
  editor.setValue(value);
};
watch(
  () => props.currentMonacoEditor,
  (newValue, oldValue) => {
    if (newValue.filename == props.item.filename && newValue.num != num) {
      isthroFunc = false;
      setValue(newValue.value);
    }
  },
  { deep: true }
);
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
onMounted(() => {
  initEditor();
  // let isOne = true
  // let num = 0
  // props.routeList.forEach(item=>{
  //   item.routeList.forEach(t=>{
  //     if(t.filename==props.item.filename){
  //       num ++
  //       if (num>1) {
  //         isOne = false
  //       }
  //     }
  //   })
  // })
  // isOne ? getFile(props.item, "init") : setValue(props.currentMonacoEditor.value)
  getFile(props.item, "init");
});
let editor = reactive({});
let fileContent = "";
let allowEdit = false;

function initEditor() {
  // 初始化编辑器，确保dom已经渲染
  editor = monaco.editor.create(
    document.getElementById(props.item.filename + num),
    {
      value: "获取中...", //编辑器初始显示文字
      language: getLanguageByExt(props.item.filename), //语言支持自行查阅 todo: 后续支持语言切换
      demoautomaticLayout: true, //自动布局
      theme: store.state.theme == "black" ? "vs-dark" : "vs", //官方自带三种主题vs, hc-black, or vs-dark
      automaticLayout: true,
      readOnly: true, //是否只读
    }
  );
  editor.addAction({
    id: "1", // 菜单项 id
    label: "保存", // 菜单项名称
    contextMenuGroupId: "99_cutcopypaste", // 所属菜单的分组
    run: () => {
      saveFile();
    },
  });
  //增加右键刷新按钮
  editor.addAction({
    id: "2",
    label: "刷新",
    contextMenuGroupId: "99_cutcopypaste", // 所属菜单的分组
    run: async () => {
      let item = props.item;
      getFile(item, "ref");
    },
  });
  editor.addAction({
    id: "3", // 菜单项 id
    label: "允许编辑", // 菜单项名称
    contextMenuGroupId: "99_cutcopypaste", // 所属菜单的分组
    run: () => {
      allowEdit = true;
      editor.updateOptions({
        readOnly: false,
      });
    },
  });
  //增加右键下载按钮
  editor.addAction({
    id: "4", // 菜单项 id
    label: "下载", // 菜单项名称
    contextMenuGroupId: "99_cutcopypaste", // 所属菜单的分组
    run: () => {
      try {
        let item = props.item;
        const downloadLink = getFileDownloadLink(item.filename);
        window.open(downloadLink + "?file_pid=" + store.state.initData.Id);
      } catch (error) {
        notification["error"]({
          description: error.message,
          duration: 0,
        });
      }
    }, // 点击后执行的操作
  });

  editor.onDidChangeModelContent(throFunc);
}
let isthroFunc = false;
const throFunc = () => {
  if (isthroFunc) {
    emit("throFunc", {
      filename: props.item.filename,
      value: getVal(),
      num: num,
    });
  }
  isthroFunc = true;
};

async function getFile(item, source) {
  try {
    emit("SET_ROUTE_LIST_ITEM_ISLOAD", {
      id: item.filename,
      isLoad: true,
    });
    await getFileStatAndUpdate(item, true);
    //获得文件内容
    fileContent = await getFileContents(item.filename, {
      format: "text",
      headers: { "Cache-control": "no-cache" },
    });
    //获取成功
    editor.setValue(fileContent);
    emit("SET_ROUTE_LIST_ITEM_ISLOAD", {
      id: item.filename,
      isLoad: false,
    });
    if (source == "ref") {
      notification.success({
        message: "刷新成功",
        description: "",
        duration: 2,
      });
    }
  } catch (error) {
    emit("SET_ROUTE_LIST_ITEM_ISLOAD", {
      id: item.filename,
      isLoad: false,
    });
    notification["error"]({
      description: error.message,
      duration: 0,
    });
  }
}
//获得文件属性
async function getFileStatAndUpdate(item, isUpdate) {
  try {
    let fileStat = await stat(item.filename);
    if (isUpdate) {
      //并更新到树列表中
      Object.keys(fileStat).forEach((key) => {
        item[key] = fileStat[key];
      });
    }
    return fileStat;
  } catch (error) {
    notification["error"]({
      description: error.message,
      duration: 0,
    });
  }
  return {};
}
//保存文件
async function saveFile() {
  let item = props.item;

  try {
    // 内容是否变化
    let newFileContent = getVal();
    if (fileContent == newFileContent) {
      notification.success({
        message: "文件内容未变化",
        description: "",
        duration: 2,
      });
      return;
    }
    fileContent = newFileContent;
    // 服务端文件是否变化
    let stat = await getFileStatAndUpdate(item, false);
    if (!stat) return;
    if (stat.etag != item.etag) {
      notification["error"]({
        message: "文件已被修改，请先刷新",
        duration: 0,
      });
      return;
    }

    // 更新内容
    emit("SET_ROUTE_LIST_ITEM_ISLOAD", {
      id: item.filename,
      isLoad: true,
    });
    await putFileContents(item.filename, getVal());
    emit("SET_ROUTE_LIST_ITEM_ISLOAD", {
      id: item.filename,
      isLoad: false,
    });

    notification["success"]({
      message: "保存成功",
      duration: 3,
    });

    //重新获得文件信息
    await getFileStatAndUpdate(item, true);
  } catch (error) {
    notification["error"]({
      description: error.message,
      duration: 0,
    });
  }
}

function onKey(e) {
  if (e.ctrlKey && e.keyCode == 83) {
    saveFile();
  }
}

function getLanguageByExt(fileName) {
  const languages = {
    js: "javascript",
    ts: "typescript",
    html: "html",
    htm: "html",
    txt: "text",
    css: "css",
    c: "c",
    h: "h",
    cpp: "cpp",
    dockerfile: "dockerfile",
    go: "go",
    ini: "ini",
    java: "java",
    json: "json",
    lua: "lua",
    sql: "mysql",
    php: "php",
    markdown: "markdown",
    py: "python",
    sh: "shell",
    mshell: "shell",
    xml: "xml",
    yaml: "yaml",
    conf: "ini",
    cnf: "ini",
    toml: "ini",
  };
  const ext = fileName.match(/([^\.])+$/g)[0];

  return languages[ext];
}
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
