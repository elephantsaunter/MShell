<template>
  <div class="content">
    <div class="head">
      <div class="button textColor1" @click="tap(item)" v-for="item in buttonList" >{{item}}</div>
    </div>
    <div class="body">
      <a-table :columns="columns" :data-source="data">
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
            <span>
              <smile-outlined />
              Name
            </span>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a>
              {{ record.name }}
            </a>
          </template>
          <template v-else-if="column.key === 'tags'">
            <span>
              <a-tag
                v-for="tag in record.tags"
                :key="tag"
                :color="
                  tag === 'loser'
                    ? 'volcano'
                    : tag.length > 5
                    ? 'geekblue'
                    : 'green'
                "
              >
                {{ tag.toUpperCase() }}
              </a-tag>
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a>Invite 一 {{ record.name }}</a>
              <a-divider type="vertical" />
              <a>Delete</a>
              <a-divider type="vertical" />
              <a class="ant-dropdown-link">
                More actions
                <down-outlined />
              </a>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, } from "vue";
// import {findFiles} from '../api/api'
const buttonList = ref(['ps aux','netstat -npt'])
const tap = (item)=>{
    findFiles(item).then(res=>{
        console.log(res.Stdout);
    })
    
}
const columns = [
  {
    name: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "Action",
    key: "action",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .head {
    height: 100px;
    .button {
      height: 20px;
      min-width: 50px;
      cursor: pointer;
      font-size: 12px;
      padding: 0px 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      float: left;
    }
  }
  .body {
    flex: 1;
  }
}
</style>
