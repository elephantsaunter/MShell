package router

import "github.com/gin-gonic/gin"

func Init(router *gin.RouterGroup) {
	InitMachineRouter(router)
	InitMachineFileRouter(router)
	InitMachineScriptRouter(router)
	InitMachineCronJobRouter(router)
	InitMachineCommandRouter(router)
	InitMachineCmdConfRouter(router)
}
