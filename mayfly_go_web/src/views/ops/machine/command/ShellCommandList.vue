<template>
    <div>
        <page-table
            ref="pageTableRef"
            :page-api="cmdShellApi.list"
            :query="searchItems"
            v-model:query-form="params"
            :show-selection="true"
            v-model:selection-data="state.selectionData"
            :columns="columns"
        >
            <template #tableHeader>
                <el-button v-auth="perms.saveCommand" type="primary" icon="plus" @click="openFormDialog(false)" plain>添加 </el-button>
                <el-button v-auth="perms.delCommand" :disabled="selectionData.length < 1" @click="deleteCommand()" type="danger" icon="delete">删除</el-button>
            </template> 


            <template #action="{ data }"> 
                <el-button v-auth="perms.saveCommand" type="primary" @click="openFormDialog(data)" link>编辑</el-button> 
            </template>
        </page-table>

        <ShellCommandEdit v-model:visible="commandEdit.visible" v-model:data="commandEdit.data" :title="commandEdit.title" @submit-success="search" />
   
    </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, reactive, onMounted, defineAsyncComponent, Ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { cmdShellApi } from '../api';
import PageTable from '@/components/pagetable/PageTable.vue';
import { TableColumn } from '@/components/pagetable';
import { CronJobStatusEnum } from '../enums';
import { SearchItem } from '@/components/SearchForm';

const ShellCommandEdit = defineAsyncComponent(() => import('./ShellCommandEdit.vue'));


const perms = {
    saveCommand: 'machine:command:save',
    delCommand: 'machine:command:del',
};

const searchItems = [SearchItem.input('name', '名称'), SearchItem.select('status', '状态').withEnum(CronJobStatusEnum)];

const columns = ref([
    TableColumn.new('name', '名称'),
    TableColumn.new('command', 'Shell命令'),
    TableColumn.new('sort', '排序'),
    TableColumn.new('status', '状态').typeTag(CronJobStatusEnum),
    TableColumn.new('remark', '备注'),
    TableColumn.new('action', '操作').isSlot().setMinWidth(180).fixedRight().alignCenter(),
]);

const pageTableRef: Ref<any> = ref(null);

const state = reactive({
    params: {
        pageNum: 1,
        pageSize: 0,
        ip: null,
        name: null,
    },
    selectionData: [], 
    commandEdit: {
        visible: false,
        data: null as any,
        title: '新增机器',
    },
});

const { selectionData, params,commandEdit } = toRefs(state);

onMounted(async () => {});

const openFormDialog = async (data: any) => {
    let dialogTitle;
    if (data) {
        state.commandEdit.data = data;
        dialogTitle = '编辑计划任务';
    } else {
        state.commandEdit.data = null;
        dialogTitle = '添加计划任务';
    }

    state.commandEdit.title = dialogTitle;
    state.commandEdit.visible = true;
};

const deleteCommand = async () => {
    try {
        await ElMessageBox.confirm(`确定删除【${state.selectionData.map((x: any) => x.name).join(', ')}】信息? `, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
        await cmdShellApi.delete.request({ id: state.selectionData.map((x: any) => x.id).join(',') });
        ElMessage.success('操作成功');
        search();
    } catch (err) {
        //
    }
};
 
const search = async () => {
    pageTableRef.value.search();
};
</script>

<style>
.el-dialog__body {
    padding: 2px 2px;
}
</style>
