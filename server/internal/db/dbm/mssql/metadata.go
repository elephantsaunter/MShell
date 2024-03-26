package mssql

import (
	"fmt"
	"mayfly-go/internal/db/dbm/dbi"
	"mayfly-go/pkg/errorx"
	"mayfly-go/pkg/logx"
	"mayfly-go/pkg/utils/anyx"
	"mayfly-go/pkg/utils/collx"
	"mayfly-go/pkg/utils/stringx"
	"regexp"
	"strings"
	"time"

	"github.com/may-fly/cast"
)

const (
	MSSQL_META_FILE      = "metasql/mssql_meta.sql"
	MSSQL_DBS_KEY        = "MSSQL_DBS"
	MSSQL_DB_SCHEMAS_KEY = "MSSQL_DB_SCHEMAS"
	MSSQL_TABLE_INFO_KEY = "MSSQL_TABLE_INFO"
	MSSQL_INDEX_INFO_KEY = "MSSQL_INDEX_INFO"
	MSSQL_COLUMN_MA_KEY  = "MSSQL_COLUMN_MA"
)

type MssqlMetaData struct {
	dbi.DefaultMetaData

	dc *dbi.DbConn
}

func (md *MssqlMetaData) GetDbServer() (*dbi.DbServer, error) {
	_, res, err := md.dc.Query("SELECT @@VERSION as version")
	if err != nil {
		return nil, err
	}
	ds := &dbi.DbServer{
		Version: cast.ToString(res[0]["version"]),
	}
	return ds, nil
}

func (md *MssqlMetaData) GetDbNames() ([]string, error) {
	_, res, err := md.dc.Query(dbi.GetLocalSql(MSSQL_META_FILE, MSSQL_DBS_KEY))
	if err != nil {
		return nil, err
	}

	databases := make([]string, 0)
	for _, re := range res {
		databases = append(databases, cast.ToString(re["dbname"]))
	}

	return databases, nil
}

// 获取表基础元信息, 如表名等
func (md *MssqlMetaData) GetTables(tableNames ...string) ([]dbi.Table, error) {
	meta := md.dc.GetMetaData()
	schema := md.dc.Info.CurrentSchema()
	names := strings.Join(collx.ArrayMap[string, string](tableNames, func(val string) string {
		return fmt.Sprintf("'%s'", meta.RemoveQuote(val))
	}), ",")

	var res []map[string]any
	var err error

	sql, err := stringx.TemplateParse(dbi.GetLocalSql(MSSQL_META_FILE, MSSQL_TABLE_INFO_KEY), collx.M{"tableNames": names})
	if err != nil {
		return nil, err
	}

	_, res, err = md.dc.Query(sql, schema)
	if err != nil {
		return nil, err
	}

	tables := make([]dbi.Table, 0)
	for _, re := range res {
		tables = append(tables, dbi.Table{
			TableName:    cast.ToString(re["tableName"]),
			TableComment: cast.ToString(re["tableComment"]),
			CreateTime:   cast.ToString(re["createTime"]),
			TableRows:    cast.ToInt(re["tableRows"]),
			DataLength:   cast.ToInt64(re["dataLength"]),
			IndexLength:  cast.ToInt64(re["indexLength"]),
		})
	}
	return tables, nil
}

// 获取列元信息, 如列名等
func (md *MssqlMetaData) GetColumns(tableNames ...string) ([]dbi.Column, error) {
	meta := md.dc.GetMetaData()
	tableName := strings.Join(collx.ArrayMap[string, string](tableNames, func(val string) string {
		return fmt.Sprintf("'%s'", meta.RemoveQuote(val))
	}), ",")

	_, res, err := md.dc.Query(fmt.Sprintf(dbi.GetLocalSql(MSSQL_META_FILE, MSSQL_COLUMN_MA_KEY), tableName), md.dc.Info.CurrentSchema())
	if err != nil {
		return nil, err
	}

	columns := make([]dbi.Column, 0)
	for _, re := range res {

		column := dbi.Column{
			TableName:     anyx.ToString(re["TABLE_NAME"]),
			ColumnName:    anyx.ToString(re["COLUMN_NAME"]),
			DataType:      dbi.ColumnDataType(anyx.ToString(re["DATA_TYPE"])),
			CharMaxLength: cast.ToInt(re["CHAR_MAX_LENGTH"]),
			ColumnComment: anyx.ToString(re["COLUMN_COMMENT"]),
			Nullable:      anyx.ToString(re["NULLABLE"]) == "YES",
			IsPrimaryKey:  cast.ToInt(re["IS_PRIMARY_KEY"]) == 1,
			IsIdentity:    cast.ToInt(re["IS_IDENTITY"]) == 1,
			ColumnDefault: cast.ToString(re["COLUMN_DEFAULT"]),
			NumPrecision:  cast.ToInt(re["NUM_PRECISION"]),
			NumScale:      cast.ToInt(re["NUM_SCALE"]),
		}

		md.FixColumn(&column)

		columns = append(columns, column)
	}
	return columns, nil
}

func (md *MssqlMetaData) FixColumn(column *dbi.Column) {
	dataType := strings.ToLower(string(column.DataType))

	if collx.ArrayAnyMatches([]string{"date", "time"}, dataType) {
		// 如果是datetime，精度取NumScale字段
		column.CharMaxLength = column.NumScale
	} else if collx.ArrayAnyMatches([]string{"int", "bit", "real", "text", "xml"}, dataType) {
		// 不显示长度的类型
		column.NumPrecision = 0
		column.CharMaxLength = 0
	} else if collx.ArrayAnyMatches([]string{"numeric", "decimal", "float"}, dataType) {
		// 如果是num，长度取精度和小数位数
		column.CharMaxLength = 0
	} else if collx.ArrayAnyMatches([]string{"nvarchar", "nchar"}, dataType) {
		// 如果是nvarchar，可视长度减半
		column.CharMaxLength = column.CharMaxLength / 2
	}
}

// 获取表主键字段名，不存在主键标识则默认第一个字段
func (md *MssqlMetaData) GetPrimaryKey(tablename string) (string, error) {
	columns, err := md.GetColumns(tablename)
	if err != nil {
		return "", err
	}
	if len(columns) == 0 {
		return "", errorx.NewBiz("[%s] 表不存在", tablename)
	}

	for _, v := range columns {
		if v.IsPrimaryKey {
			return v.ColumnName, nil
		}
	}

	return columns[0].ColumnName, nil
}

func (md *MssqlMetaData) getTableIndexWithPK(tableName string) ([]dbi.Index, error) {
	_, res, err := md.dc.Query(dbi.GetLocalSql(MSSQL_META_FILE, MSSQL_INDEX_INFO_KEY), md.dc.Info.CurrentSchema(), tableName)
	if err != nil {
		return nil, err
	}
	indexs := make([]dbi.Index, 0)
	for _, re := range res {
		indexs = append(indexs, dbi.Index{
			IndexName:    cast.ToString(re["indexName"]),
			ColumnName:   cast.ToString(re["columnName"]),
			IndexType:    cast.ToString(re["indexType"]),
			IndexComment: cast.ToString(re["indexComment"]),
			IsUnique:     cast.ToInt(re["isUnique"]) == 1,
			SeqInIndex:   cast.ToInt(re["seqInIndex"]),
			IsPrimaryKey: cast.ToInt(re["isPrimaryKey"]) == 1,
		})
	}
	// 把查询结果以索引名分组，多个索引字段以逗号连接
	result := make([]dbi.Index, 0)
	key := ""
	for _, v := range indexs {
		// 当前的索引名
		in := v.IndexName
		if key == in {
			// 索引字段已根据名称和字段顺序排序，故取最后一个即可
			i := len(result) - 1
			// 同索引字段以逗号连接
			result[i].ColumnName = result[i].ColumnName + "," + v.ColumnName
		} else {
			key = in
			result = append(result, v)
		}
	}
	return indexs, nil
}

// 获取表索引信息
func (md *MssqlMetaData) GetTableIndex(tableName string) ([]dbi.Index, error) {
	indexs, _ := md.getTableIndexWithPK(tableName)
	result := make([]dbi.Index, 0)
	// 过滤掉主键索引
	for _, v := range indexs {
		if v.IsPrimaryKey {
			continue
		}
		result = append(result, v)
	}
	return result, nil
}

func (md *MssqlMetaData) CopyTableDDL(tableName string, newTableName string) (string, error) {
	if newTableName == "" {
		newTableName = tableName
	}
	meta := md.dc.GetMetaData()
	// 查询表名和表注释, 设置表注释
	tbs, err := md.GetTables(tableName)
	if err != nil || len(tbs) < 1 {
		logx.Errorf("获取表信息失败, %s", tableName)
		return "", err
	}
	tabInfo := &dbi.Table{
		TableName:    newTableName,
		TableComment: tbs[0].TableComment,
	}

	// 查询列信息
	columns, err := md.GetColumns(tableName)
	if err != nil {
		logx.Errorf("获取列信息失败, %s", tableName)
		return "", err
	}
	sqlArr := meta.GenerateTableDDL(columns, *tabInfo, true)

	// 设置索引
	indexs, err := md.GetTableIndex(tableName)
	if err != nil {
		logx.Errorf("获取索引信息失败, %s", tableName)
		return strings.Join(sqlArr, ";"), err
	}
	sqlArr = append(sqlArr, meta.GenerateIndexDDL(indexs, *tabInfo)...)
	return strings.Join(sqlArr, ";"), nil
}

// 获取建索引ddl

func (md *MssqlMetaData) GenerateIndexDDL(indexs []dbi.Index, tableInfo dbi.Table) []string {
	tbName := tableInfo.TableName
	meta := md.dc.GetMetaData()
	sqls := make([]string, 0)
	comments := make([]string, 0)
	for _, index := range indexs {
		unique := ""
		if index.IsUnique {
			unique = "unique"
		}
		// 取出列名，添加引号
		cols := strings.Split(index.ColumnName, ",")
		colNames := make([]string, len(cols))
		for i, name := range cols {
			colNames[i] = meta.QuoteIdentifier(name)
		}

		sqls = append(sqls, fmt.Sprintf("create %s NONCLUSTERED index %s on %s.%s(%s)", unique, index.IndexName, md.dc.Info.CurrentSchema(), tbName, strings.Join(colNames, ",")))
		if index.IndexComment != "" {
			comment := meta.QuoteEscape(index.IndexComment)
			comments = append(comments, fmt.Sprintf("EXECUTE sp_addextendedproperty N'MS_Description', N'%s', N'SCHEMA', N'%s', N'TABLE', N'%s', N'INDEX', N'%s'", comment, md.dc.Info.CurrentSchema(), tbName, index.IndexName))
		}
	}
	if len(comments) > 0 {
		sqls = append(sqls, comments...)
	}

	return sqls
}

func (md *MssqlMetaData) genColumnBasicSql(column dbi.Column) string {
	meta := md.dc.GetMetaData()
	colName := meta.QuoteIdentifier(column.ColumnName)
	dataType := string(column.DataType)

	incr := ""
	if column.IsIdentity {
		incr = " IDENTITY(1,1)"
	}

	nullAble := ""
	if !column.Nullable {
		nullAble = " NOT NULL"
	}

	defVal := "" // 默认值需要判断引号，如函数是不需要引号的 // 为了防止跨源函数不支持 当默认值是函数时，不需要设置默认值
	if column.ColumnDefault != "" && !strings.Contains(column.ColumnDefault, "(") {
		// 哪些字段类型默认值需要加引号
		mark := false
		if collx.ArrayAnyMatches([]string{"char", "text", "date", "time", "lob"}, dataType) {
			// 当数据类型是日期时间，默认值是日期时间函数时，默认值不需要引号
			if collx.ArrayAnyMatches([]string{"date", "time"}, strings.ToLower(dataType)) &&
				collx.ArrayAnyMatches([]string{"DATE", "TIME"}, strings.ToUpper(column.ColumnDefault)) {
				mark = false
			} else {
				mark = true
			}
		}

		if mark {
			defVal = fmt.Sprintf(" DEFAULT '%s'", column.ColumnDefault)
		} else {
			defVal = fmt.Sprintf(" DEFAULT %s", column.ColumnDefault)
		}
	}

	columnSql := fmt.Sprintf(" %s %s%s%s%s", colName, column.GetColumnType(), incr, nullAble, defVal)
	return columnSql
}

// 获取建表ddl
func (md *MssqlMetaData) GenerateTableDDL(columns []dbi.Column, tableInfo dbi.Table, dropBeforeCreate bool) []string {
	tbName := tableInfo.TableName
	meta := md.dc.GetMetaData()

	sqlArr := make([]string, 0)

	// 删除表
	if dropBeforeCreate {
		sqlArr = append(sqlArr, fmt.Sprintf("DROP TABLE IF EXISTS %s", meta.QuoteIdentifier(tbName)))
	}

	// 组装建表语句
	createSql := fmt.Sprintf("CREATE TABLE %s (\n", meta.QuoteIdentifier(tbName))
	fields := make([]string, 0)
	pks := make([]string, 0)
	columnComments := make([]string, 0)

	for _, column := range columns {
		if column.IsPrimaryKey {
			pks = append(pks, meta.QuoteIdentifier(column.ColumnName))
		}
		fields = append(fields, md.genColumnBasicSql(column))
		commentTmp := "EXECUTE sp_addextendedproperty N'MS_Description', N'%s', N'SCHEMA', N'%s', N'TABLE', N'%s', N'COLUMN', N'%s'"

		// 防止注释内含有特殊字符串导致sql出错
		if column.ColumnComment != "" {
			comment := meta.QuoteEscape(column.ColumnComment)
			columnComments = append(columnComments, fmt.Sprintf(commentTmp, comment, md.dc.Info.CurrentSchema(), tbName, column.ColumnName))
		}
	}

	// create
	createSql += strings.Join(fields, ",\n")
	if len(pks) > 0 {
		createSql += fmt.Sprintf(", \n PRIMARY KEY CLUSTERED (%s)", strings.Join(pks, ","))
	}
	createSql += "\n)"

	// comment
	tableCommentSql := ""
	if tableInfo.TableComment != "" {
		commentTmp := "EXECUTE sp_addextendedproperty N'MS_Description', N'%s', N'SCHEMA', N'%s', N'TABLE', N'%s'"

		tableCommentSql = fmt.Sprintf(commentTmp, meta.QuoteEscape(tableInfo.TableComment), md.dc.Info.CurrentSchema(), tbName)
	}

	sqlArr = append(sqlArr, createSql)

	if tableCommentSql != "" {
		sqlArr = append(sqlArr, tableCommentSql)
	}
	if len(columnComments) > 0 {
		sqlArr = append(sqlArr, columnComments...)
	}

	return sqlArr
}

// 获取建表ddl
func (md *MssqlMetaData) GetTableDDL(tableName string, dropBeforeCreate bool) (string, error) {

	// 1.获取表信息
	tbs, err := md.GetTables(tableName)
	tableInfo := &dbi.Table{}
	if err != nil || tbs == nil || len(tbs) <= 0 {
		logx.Errorf("获取表信息失败, %s", tableName)
		return "", err
	}
	tableInfo.TableName = tbs[0].TableName
	tableInfo.TableComment = tbs[0].TableComment

	// 2.获取列信息
	columns, err := md.GetColumns(tableName)
	if err != nil {
		logx.Errorf("获取列信息失败, %s", tableName)
		return "", err
	}
	tableDDLArr := md.GenerateTableDDL(columns, *tableInfo, dropBeforeCreate)
	// 3.获取索引信息
	indexs, err := md.GetTableIndex(tableName)
	if err != nil {
		logx.Errorf("获取索引信息失败, %s", tableName)
		return "", err
	}
	// 组装返回
	tableDDLArr = append(tableDDLArr, md.GenerateIndexDDL(indexs, *tableInfo)...)
	return strings.Join(tableDDLArr, ";\n"), nil
}

func (md *MssqlMetaData) GetSchemas() ([]string, error) {
	_, res, err := md.dc.Query(dbi.GetLocalSql(MSSQL_META_FILE, MSSQL_DB_SCHEMAS_KEY))
	if err != nil {
		return nil, err
	}

	schemas := make([]string, 0)
	for _, re := range res {
		schemas = append(schemas, cast.ToString(re["SCHEMA_NAME"]))
	}
	return schemas, nil
}

func (md *MssqlMetaData) GetIdentifierQuoteString() string {
	return "["
}

func (md *MssqlMetaData) BeforeDumpInsertSql(quoteSchema string, tableName string) string {
	return fmt.Sprintf("set identity_insert %s.%s on ", quoteSchema, tableName)
}

func (md *MssqlMetaData) GetDataConverter() dbi.DataConverter {
	return converter
}

var (
	// 数字类型
	numberRegexp = regexp.MustCompile(`(?i)int|double|float|number|decimal|byte|bit`)
	// 日期时间类型
	datetimeRegexp = regexp.MustCompile(`(?i)datetime|timestamp`)
	// 日期类型
	dateRegexp = regexp.MustCompile(`(?i)date`)
	// 时间类型
	timeRegexp = regexp.MustCompile(`(?i)time`)

	converter = new(DataConverter)

	// mssql数据类型 对应 公共数据类型
	commonColumnTypeMap = map[string]dbi.ColumnDataType{
		"bigint":           dbi.CommonTypeBigint,
		"numeric":          dbi.CommonTypeNumber,
		"bit":              dbi.CommonTypeInt,
		"smallint":         dbi.CommonTypeSmallint,
		"decimal":          dbi.CommonTypeNumber,
		"smallmoney":       dbi.CommonTypeNumber,
		"int":              dbi.CommonTypeInt,
		"tinyint":          dbi.CommonTypeSmallint, // mssql tinyint不支持负数
		"money":            dbi.CommonTypeNumber,
		"float":            dbi.CommonTypeNumber, // 近似数字
		"real":             dbi.CommonTypeVarchar,
		"date":             dbi.CommonTypeDate, // 日期和时间
		"datetimeoffset":   dbi.CommonTypeDatetime,
		"datetime2":        dbi.CommonTypeDatetime,
		"smalldatetime":    dbi.CommonTypeDatetime,
		"datetime":         dbi.CommonTypeDatetime,
		"time":             dbi.CommonTypeTime,
		"char":             dbi.CommonTypeChar, // 字符串
		"varchar":          dbi.CommonTypeVarchar,
		"text":             dbi.CommonTypeText,
		"nchar":            dbi.CommonTypeChar,
		"nvarchar":         dbi.CommonTypeVarchar,
		"ntext":            dbi.CommonTypeText,
		"binary":           dbi.CommonTypeBinary,
		"varbinary":        dbi.CommonTypeBinary,
		"cursor":           dbi.CommonTypeVarchar, // 其他
		"rowversion":       dbi.CommonTypeVarchar,
		"hierarchyid":      dbi.CommonTypeVarchar,
		"uniqueidentifier": dbi.CommonTypeVarchar,
		"sql_variant":      dbi.CommonTypeVarchar,
		"xml":              dbi.CommonTypeText,
		"table":            dbi.CommonTypeText,
		"geometry":         dbi.CommonTypeText, // 空间几何类型
		"geography":        dbi.CommonTypeText, // 空间地理类型
	}

	// 公共数据类型 对应 mssql数据类型

	mssqlColumnTypeMap = map[dbi.ColumnDataType]string{
		dbi.CommonTypeVarchar:    "nvarchar",
		dbi.CommonTypeChar:       "nchar",
		dbi.CommonTypeText:       "ntext",
		dbi.CommonTypeBlob:       "ntext",
		dbi.CommonTypeLongblob:   "ntext",
		dbi.CommonTypeLongtext:   "ntext",
		dbi.CommonTypeBinary:     "varbinary",
		dbi.CommonTypeMediumblob: "ntext",
		dbi.CommonTypeMediumtext: "ntext",
		dbi.CommonTypeVarbinary:  "varbinary",
		dbi.CommonTypeInt:        "int",
		dbi.CommonTypeSmallint:   "smallint",
		dbi.CommonTypeTinyint:    "smallint",
		dbi.CommonTypeNumber:     "decimal",
		dbi.CommonTypeBigint:     "bigint",
		dbi.CommonTypeDatetime:   "datetime2",
		dbi.CommonTypeDate:       "date",
		dbi.CommonTypeTime:       "time",
		dbi.CommonTypeTimestamp:  "timestamp",
		dbi.CommonTypeEnum:       "nvarchar",
		dbi.CommonTypeJSON:       "nvarchar",
	}
)

type DataConverter struct {
}

func (dc *DataConverter) GetDataType(dbColumnType string) dbi.DataType {
	if numberRegexp.MatchString(dbColumnType) {
		return dbi.DataTypeNumber
	}
	// 日期时间类型
	if datetimeRegexp.MatchString(dbColumnType) {
		return dbi.DataTypeDateTime
	}
	// 日期类型
	if dateRegexp.MatchString(dbColumnType) {
		return dbi.DataTypeDate
	}
	// 时间类型
	if timeRegexp.MatchString(dbColumnType) {
		return dbi.DataTypeTime
	}
	return dbi.DataTypeString
}

func (dc *DataConverter) FormatData(dbColumnValue any, dataType dbi.DataType) string {
	// 如果dataType是datetime而dbColumnValue是string类型，则需要根据类型格式化
	str, ok := dbColumnValue.(string)
	if dataType == dbi.DataTypeDateTime && ok {
		// 尝试用时间格式解析
		res, err := time.Parse(time.DateTime, str)
		if err == nil {
			return str
		}
		res, _ = time.Parse(time.RFC3339, str)
		return res.Format(time.DateTime)
	}
	if dataType == dbi.DataTypeDate && ok {
		// 尝试用时间格式解析
		res, _ := time.Parse(time.DateOnly, str)
		return res.Format(time.DateOnly)
	}
	if dataType == dbi.DataTypeTime && ok {
		res, _ := time.Parse(time.TimeOnly, str)
		return res.Format(time.TimeOnly)
	}
	return anyx.ToString(dbColumnValue)
}

func (dc *DataConverter) ParseData(dbColumnValue any, dataType dbi.DataType) any {
	// 如果dataType是datetime而dbColumnValue是string类型，则需要转换为time.Time类型
	_, ok := dbColumnValue.(string)
	if dataType == dbi.DataTypeDateTime && ok {
		res, _ := time.Parse(time.RFC3339, anyx.ToString(dbColumnValue))
		return res
	}
	if dataType == dbi.DataTypeDate && ok {
		res, _ := time.Parse(time.DateOnly, anyx.ToString(dbColumnValue))
		return res
	}
	if dataType == dbi.DataTypeTime && ok {
		res, _ := time.Parse(time.TimeOnly, anyx.ToString(dbColumnValue))
		return res
	}
	return dbColumnValue
}

func (dc *DataConverter) WrapValue(dbColumnValue any, dataType dbi.DataType) string {
	if dbColumnValue == nil {
		return "NULL"
	}
	switch dataType {
	case dbi.DataTypeNumber:
		return fmt.Sprintf("%v", dbColumnValue)
	case dbi.DataTypeString:
		val := fmt.Sprintf("%v", dbColumnValue)
		// 转义单引号
		val = strings.Replace(val, `'`, `''`, -1)
		val = strings.Replace(val, `\''`, `\'`, -1)
		// 转义换行符
		val = strings.Replace(val, "\n", "\\n", -1)
		return fmt.Sprintf("'%s'", val)
	case dbi.DataTypeDate, dbi.DataTypeDateTime, dbi.DataTypeTime:
		return fmt.Sprintf("'%s'", dc.FormatData(dbColumnValue, dataType))
	}
	return fmt.Sprintf("'%s'", dbColumnValue)
}
