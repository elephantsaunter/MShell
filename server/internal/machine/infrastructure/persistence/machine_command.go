package persistence

import (
	"mayfly-go/internal/machine/domain/entity"
	"mayfly-go/internal/machine/domain/repository"
	"mayfly-go/pkg/base"
	"mayfly-go/pkg/model"
)

type machineCommandRepoImpl struct {
	base.RepoImpl[*entity.MachineCommand]
}

func newMachineCommandRepo() repository.MachineCommand {
	return &machineCommandRepoImpl{base.RepoImpl[*entity.MachineCommand]{M: new(entity.MachineCommand)}}
}

// 分页获取机器信息列表
func (m *machineCommandRepoImpl) GetPageList(condition *entity.MachineCommand, pageParam *model.PageParam, toEntity any, orderBy ...string) (*model.PageResult[any], error) {
	qd := model.NewCond().Like("name", condition.Name).Eq("status", condition.Status).OrderBy(orderBy...)
	return m.PageByCondToAny(qd, pageParam, toEntity)
}
