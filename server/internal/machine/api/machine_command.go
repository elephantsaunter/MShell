package api

import (
	"mayfly-go/internal/machine/api/form"
	"mayfly-go/internal/machine/api/vo"
	"mayfly-go/internal/machine/application"
	"mayfly-go/internal/machine/application/dto"
	"mayfly-go/internal/machine/domain/entity"

	"mayfly-go/pkg/biz"
	"mayfly-go/pkg/req"
)

type MachineCommand struct {
	MachineCommandApp application.MachineCommand `inject:""`
}

func (m *MachineCommand) MachineCommand(rc *req.Ctx) {
	cond, pageParam := req.BindQueryAndPage(rc, new(entity.MachineCommand))

	var vos []*vo.MachineCommandVO
	pageRes, err := m.MachineCommandApp.GetPageList(cond, pageParam, &vos)

	biz.ErrIsNil(err)

	rc.ResData = pageRes
}

func (m *MachineCommand) Save(rc *req.Ctx) {
	cmdForm := new(form.MachineCommandForm)
	mcj := req.BindJsonAndCopyTo[*entity.MachineCommand](rc, cmdForm, new(entity.MachineCommand))
	rc.ReqParam = cmdForm

	err := m.MachineCommandApp.SaveCmdConf(rc.MetaCtx, &dto.SaveMachineCommand{
		Command: mcj,
	})
	biz.ErrIsNil(err)
}

func (m *MachineCommand) Delete(rc *req.Ctx) {
	m.MachineCommandApp.DeleteCmdConf(rc.MetaCtx, uint64(rc.PathParamInt("id")))
}
