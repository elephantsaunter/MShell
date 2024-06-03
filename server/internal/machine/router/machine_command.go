package router

import (
	"mayfly-go/internal/machine/api"
	"mayfly-go/pkg/biz"
	"mayfly-go/pkg/ioc"
	"mayfly-go/pkg/req"

	"github.com/gin-gonic/gin"
)

func InitMachineCommandRouter(router *gin.RouterGroup) {
	mccs := router.Group("machine/command")

	mcc := new(api.MachineCommand)
	biz.ErrIsNil(ioc.Inject(mcc))

	reqs := [...]*req.Conf{
		req.NewGet("", mcc.MachineCommand), //列表

		req.NewPost("", mcc.Save).Log(req.NewLogSave("快捷命令配置-保存")).RequiredPermissionCode("machine:command:save"),

		req.NewDelete(":id", mcc.Delete).Log(req.NewLogSave("快捷命令配置-删除")).RequiredPermissionCode("machine:command:del"),
	}

	req.BatchSetGroup(mccs, reqs[:])
}
