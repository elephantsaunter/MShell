import { defineStore } from 'pinia';

export const useMachineInfo = defineStore('machineInfo', {
    state: (): MachineState => ({
        machineInfoMap: new Map(),
    }),
    actions: {
        // 获取选择机器信息
        async getMachineInfo(id: string) {
            return this.machineInfoMap.get(id);
        },
        // 设置选择文件id
        async setSelectedFileId(macId: string, fileId: string) {
            const machineInfo = this.machineInfoMap.get(macId);
            if (machineInfo) {
                this.machineInfoMap.set(macId, { ...machineInfo, selectTreeFileId: fileId });
            } else {
                this.machineInfoMap.set(macId, {
                    selectTreeFileId: fileId,
                    id: macId
                });
            }
        },
    },
});
