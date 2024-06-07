<template>
  <a-modal v-model:visible="visible" :title="title">
    <template #footer>
      <a-button id="quxiao">取消</a-button>
      <a-button type="primary" id="tijiao">提交</a-button>
    </template>
    <a-input v-model:value="value" id="input" />
  </a-modal>
</template>
<script setup>
import { ref } from "vue";
const visible = ref(false);
const value = ref("");
const title = ref("输入框");
const prompt = async (data, str) => {
  if (str) {
    value.value = str;
  }
  visible.value = true;
  setTimeout(() => {
    const input = document.getElementById("input");
    input.focus();
  }, 10);
  if (data) {
    title.value = data;
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tijiao = document.getElementById("tijiao");
      const quxiao = document.getElementById("quxiao");
      const input = document.getElementById("input");
      quxiao.onclick = function () {
        visible.value = false;
        resolve(null);
        value.value = "";
      };
      tijiao.onclick = function () {
        visible.value = false;
        resolve(value.value);
        value.value = "";
      };
      input.onkeypress = function (event) {
        if (event.which === 13) {
          visible.value = false;
          resolve(value.value);
          value.value = "";
        }
      };
    }, 10);
  });
};

window.$prompt = prompt;
</script>
