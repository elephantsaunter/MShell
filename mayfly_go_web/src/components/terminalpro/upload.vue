<template>
  <a-modal
    @ok="handleOk"
    @cancel="cancel"
    cancelText="取消"
    okText="上传"
    :title="'上传文件至目录：' + store.state.itemRight.filename"
  >
    <a-button @click="flagWebkitdirectory=false">上传文件</a-button>
    <a-button @click="flagWebkitdirectory=true">上传文件夹</a-button>
    <div class="con">
      <input
        type="file"
        id="btn"
        @change="onchange"
        :webkitdirectory="flagWebkitdirectory"
        multiple
        ref="inputFile"
      />
      <label for="btn">
        <div class="btn">
          <span><plus-outlined /></span>
          <div>{{flagWebkitdirectory?'拖动文件夹':'拖动文件'}}</div>
        </div>
      </label>
      <div
        v-if="files.files.length != 0"
        v-for="(item, i) in files.files"
        :key="item.name"
      >
        <div><paper-clip-outlined />{{ item.name }}</div>
        <a-progress :percent="speed.speed[i]" v-if="speed.speed[i] != 0" />
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { machineApi } from "./api";
const emit = defineEmits(["uploadOk"]);
const store = useStore();
const files = reactive({ files: [] });
const speed = reactive({ speed: [] });
const flagWebkitdirectory = ref(false);
const inputFile = ref(null)
const handleOk = (e) => {
  if (files.files.length == 0) {
    notification["error"]({
      message: "请先选择文件",
    });
    return;
  }
  upload(0);
};
const upload = (i) => {
  let item = store.state.itemRight;
  let path = item.filename;
  if (item.type == "file") {
    path = item.filename.split("/");
    path.shift();
    path.pop();
    path = "/" + path.join("/");
  }
  let fileReader = new FileReader();
  let file = files.files[i];
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = async () => {
    try {
      await machineApi.updateFileContent(path + "/" + file.name, fileReader.result, {
        overwrite: false,
        onUploadProgress: (progress) => {
          console.log(progress.total, progress.loaded);
          let num = (progress.loaded / progress.total) * 100;
          speed.speed[i] = Math.trunc(num);
        },
      });
    } catch (error) {
      notification["error"]({
        description: error.message,
        duration: 0,
      });
    }
    if (files.files.length - 1 != i) {
      upload(i + 1);
    } else {
      emit("uploadOk", path, cancel);
      inputFile.value.value=null;
    }
  };
};
const onchange = function (e) {
  files.files = e.target.files;
  for (let i = 0; i < files.files.length; i++) {
    speed.speed[i] = 0;
  }
};
const cancel = () => {
  speed.speed = [];
  files.files = [];
};
</script>
<style scoped lang="less">
.con {
  position: relative;
  margin-top: 20px;
  overflow: auto;
  max-height: 300px;
  input {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
    opacity: 0;
  }
  .btn {
    height: 100px;
    border: 1px solid #666;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
    span {
      font-size: 30px;
    }
    div {
      margin-top: -10px;
    }
  }
}
</style>
