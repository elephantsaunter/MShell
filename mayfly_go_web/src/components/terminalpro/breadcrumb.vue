<template>
    <div class="crumbs">
        <a-breadcrumb separator=">">
            <a-breadcrumb-item v-for="item in path" v-if="list.length==0">{{item}}</a-breadcrumb-item>
            <a-breadcrumb-item v-for="item in list" v-else>{{item}}</a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  routeId: {
    type: String,
    default: '',
  },
});
let path = "/home/.note.mshell";
path = path.split('/')
path.shift()
const list = computed(() => {
    let arr = props.routeId.split('/')
    arr.shift()
    return arr
})

</script>
<style lang="less" scoped>
.crumbs {
    padding-left: 16px;
    height: 22px;
    span {
        cursor: pointer;
        font-size: 12px;
    }
}
</style>