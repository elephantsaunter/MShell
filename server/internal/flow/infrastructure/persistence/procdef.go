package persistence

import (
	"mayfly-go/internal/flow/domain/entity"
	"mayfly-go/internal/flow/domain/repository"
	"mayfly-go/pkg/base"
	"mayfly-go/pkg/gormx"
	"mayfly-go/pkg/model"
)

type procdefImpl struct {
	base.RepoImpl[*entity.Procdef]
}

func newProcdefRepo() repository.Procdef {
	return &procdefImpl{base.RepoImpl[*entity.Procdef]{M: new(entity.Procdef)}}
}

func (p *procdefImpl) GetPageList(condition *entity.Procdef, pageParam *model.PageParam, toEntity any, orderBy ...string) (*model.PageResult[any], error) {
	qd := gormx.NewQuery(new(entity.Procdef)).
		Like("name", condition.Name).
		Like("def_key", condition.DefKey)
	return gormx.PageQuery(qd, pageParam, toEntity)
}
