package repository

import (
	"mayfly-go/internal/machine/domain/entity"
	"mayfly-go/pkg/base"
	"mayfly-go/pkg/model"
)

type MachineCommand interface {
	base.Repo[*entity.MachineCommand]

	GetPageList(condition *entity.MachineCommand, pageParam *model.PageParam, toEntity any, orderBy ...string) (*model.PageResult[any], error)
}
