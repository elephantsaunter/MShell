package application

import (
	"context"
	"mayfly-go/internal/machine/application/dto"
	"mayfly-go/internal/machine/domain/entity"
	"mayfly-go/internal/machine/domain/repository"
	"mayfly-go/pkg/base"
	"mayfly-go/pkg/errorx"
	"mayfly-go/pkg/model"
)

type MachineCommand interface {
	base.App[*entity.MachineCommand]

	// 分页列表信息
	GetPageList(condition *entity.MachineCommand, pageParam *model.PageParam, toEntity any, orderBy ...string) (*model.PageResult[any], error)

	SaveCmdConf(ctx context.Context, cmd *dto.SaveMachineCommand) error

	DeleteCmdConf(ctx context.Context, id uint64) error
}

type MachineCommandAppImpl struct {
	base.AppImpl[*entity.MachineCommand, repository.MachineCommand]
}

var _ (MachineCommand) = (*MachineCommandAppImpl)(nil)

// 注入MachineCmdConfRepo
func (m *MachineCommandAppImpl) InjectMachineCommandRepo(repo repository.MachineCommand) {
	m.Repo = repo
}

// 分页列表
func (m *MachineCommandAppImpl) GetPageList(condition *entity.MachineCommand, pageParam *model.PageParam, toEntity any, orderBy ...string) (*model.PageResult[any], error) {
	return m.GetRepo().GetPageList(condition, pageParam, toEntity, orderBy...)
}

func (m *MachineCommandAppImpl) SaveCmdConf(ctx context.Context, cmdConfParam *dto.SaveMachineCommand) error {
	cmdConf := cmdConfParam.Command

	return m.Tx(ctx, func(ctx context.Context) error {
		return m.Save(ctx, cmdConf)
	})
}

func (m *MachineCommandAppImpl) DeleteCmdConf(ctx context.Context, id uint64) error {
	_, err := m.GetById(id)
	if err != nil {
		return errorx.NewBiz("该命令配置不存在")
	}

	return m.Tx(ctx, func(ctx context.Context) error {
		return m.DeleteById(ctx, id)
	})
}
