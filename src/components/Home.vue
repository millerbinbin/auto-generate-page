<template>
  <div>
    <el-row :gutter="10" :type="flex">
      <el-col :span="6" v-for="(col, idx) in columns" :key="col.name" v-if="col.filter">
        <span style="padding-right: 10px">{{col.label}}:</span>
        <el-input style="width: 50%"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column v-for="(col, idx) in columns" :key="col.name" :prop="col.name" :label="col.label"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<style>
  .el-row, .el-col {
    padding-bottom: 15px;
  }
</style>
<script>
  export default {
    data: function () {
      return {
        columns: [{
          name: 'userId',
          label: '用户id',
          type: 'string',
          required: true
        },
        {
          name: 'username',
          label: '登录账号',
          type: 'string',
          filter: true,
          search: 'complete',
          required: true
        },
        {
          name: 'cellphone',
          label: '手机号',
          type: 'string',
          filter: true,
          search: 'fuzzy'
        },
        {
          name: 'roleId',
          label: '角色',
          type: 'number',
          filter: true,
          selection_list: {
            type: 'entity',
            value: '{role.name}|{role.id}'
          },
          required: true
        },
        {
          name: 'level',
          label: '等级',
          type: 'number',
          filter: true,
          selection: true,
          selection_list: {
            type: 'list',
            value: '1,2,3,4'
          }
        },
        {
          name: 'active',
          label: '是否激活',
          type: 'boolean',
          filter: true,
          required: true
        }],
        tableData: [{
          userId: 'wxh',
          username: '王小虎',
          cellphone: '15000010129',
          roleId: 3,
          level: 1,
          active: 1
        }, {
          userId: 'fc11',
          username: '方尺',
          cellphone: '18891817376',
          roleId: 3,
          level: 1,
          active: 1
        }, {
          userId: 'zs001',
          username: '周山',
          cellphone: '13388976373',
          roleId: 3,
          level: 1,
          active: 1
        }, {
          userId: 'csr001',
          username: '测试人员1',
          cellphone: '15034010129',
          roleId: 3,
          level: 1,
          active: 1
        }]
      }
    }
  }
</script>