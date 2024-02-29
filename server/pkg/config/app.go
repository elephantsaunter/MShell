package config

import "fmt"

const (
	AppName = "mayfly-go"
	Version = "v1.7.4"
)

func GetAppInfo() string {
	return fmt.Sprintf("[%s:%s]", AppName, Version)
}
