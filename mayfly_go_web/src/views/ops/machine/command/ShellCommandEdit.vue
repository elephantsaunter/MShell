<template>
    <div class="mock-data-dialog">
        <el-drawer
            :title="title"
            v-model="dialogVisible"
            :close-on-click-modal="false"
            :before-close="cancel"
            :show-close="true"
            :destroy-on-close="true"
            size="40%"
        >
            <template #header>
                <DrawerHeader :header="title" :back="cancel" />
            </template>

            <el-form :model="form" ref="formRef" :rules="rules" label-width="auto">
                <el-form-item prop="name" label="名称">
                    <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item> 
                <el-form-item prop="command" label="Shell命令">
                    <el-input v-model="form.command" placeholder="请输入单行脚本命令"></el-input> 
                </el-form-item> 
                <el-form-item prop="sort" label="排序">
                    <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-select v-model="form.status" default-first-option style="width: 100%" placeholder="请选择状态">
                        <el-option v-for="item in CronJobStatusEnum" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>  
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel()" :disabled="submitDisabled">关 闭</el-button>
                    <el-button v-auth="'machine:script:save'" type="primary" :loading="btnLoading" @click="btnOk" :disabled="submitDisabled">保 存</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { cmdShellApi } from '../api';
import { CronJobStatusEnum } from '../enums';
import { notEmpty } from '@/common/assert';
import DrawerHeader from '@/components/drawer-header/DrawerHeader.vue';
import { TagResourceTypeEnum } from '@/common/commonEnum';

const props = defineProps({
    visible: {
        type: Boolean,
    },
    data: {
        type: Object,
    },
    title: {
        type: String,
    },
});

const emit = defineEmits(['update:visible', 'cancel', 'submitSuccess']);

const formRef: any = ref(null);

const rules = {
    name: [
        {
            required: true,
            message: '请输入名称',
            trigger: ['change', 'blur'],
        },
    ],
    command: [
        {
            required: true,
            message: '请输入Shell命令',
            trigger: ['change', 'blur'],
        },
    ],
    status: [
        {
            required: true,
            message: '请选择状态',
            trigger: ['change', 'blur'],
        },
    ], 
};

const state = reactive({
    dialogVisible: false,
    submitDisabled: false,
    chooseMachines: [],
    form: {
        id: null,
        name: '',
        command: '',
        sort: 10,
        remark: '',
        status: 1, 
    },
    btnLoading: false,
});

const { dialogVisible, submitDisabled, form, btnLoading } = toRefs(state);

onMounted(async () => {
    
});

watch(props, async (newValue: any) => {
    state.dialogVisible = newValue.visible;
    if (!newValue.visible) {
        return;
    }
    if (newValue.data) {
        state.form = { ...newValue.data };
     } else {
        state.form = { command: '', status: 1 } as any;
        state.chooseMachines = [];
    }
});

const btnOk = () => {
    formRef.value.validate((valid: any) => {
        if (valid) {
            notEmpty(state.form.name, '名称不能为空');
            notEmpty(state.form.command, 'Shell命令不能为空');
            state.form.sort = Number(state.form.sort);
            cmdShellApi.save.request(state.form).then(
                () => {
                    ElMessage.success('保存成功');
                    emit('submitSuccess');
                    state.submitDisabled = false;
                    cancel();
                },
                () => {
                    state.submitDisabled = false;
                }
            );
        } else {
            return false;
        }
    });
};

const cancel = () => {
    emit('update:visible', false);
    emit('cancel');
};
</script>
<style lang="scss"></style>
