package entity

import (
	"mayfly-go/pkg/model"
)

// 快捷命令
type MachineCommand struct {
	model.Model

	Name    string `json:"name"`
	Command string `json:"command"`  // 命令配置
	Sort    int8   `json:"sort"`     // 排序
	Status  int8   `json:"execCmds"` // 状态
	Remark  string `json:"remark"`   // 备注
}
