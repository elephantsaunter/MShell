package migrations

import (
	"mayfly-go/internal/machine/domain/entity"

	"github.com/go-gormigrate/gormigrate/v2"
	"gorm.io/gorm"
)

func T20240603() *gormigrate.Migration {
	return &gormigrate.Migration{
		ID: "20240603",
		Migrate: func(tx *gorm.DB) error {
			entities := [...]any{
				new(entity.MachineCommand),
			}
			for _, e := range entities {
				if err := tx.AutoMigrate(e); err != nil {
					return err
				}
			}
			return nil
		},
		Rollback: func(tx *gorm.DB) error {
			return nil
		},
	}
}
