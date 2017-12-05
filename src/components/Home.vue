<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6" v-for="(col, idx) in columns" :key="col.name" v-if="col.filter">
        <span style="padding-right: 10px">{{col.label}}:</span>
        <el-input v-if="col.type==='input'" v-model="query[col.name]" style="width: 50%"></el-input>
        <el-select v-if="col.type==='select'" v-model="query[col.name]" placeholder="请选择">
          <el-option v-for="item in col.selection_list" :key="item.key" :label="item.value" :value="item.key"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-dialog title="用户查看" :visible.sync="visible1">
        <el-row :gutter="10">
          <el-col :span="12" v-for="(item, idx) in row" :key="item.name">
            <span style="padding-right: 10px">{{item.label}}:</span>
            <el-input v-if="item.type==='input'" disabled style="width: 50%" :value="item.value"></el-input>
            <el-select v-if="item.type==='select'" disabled :value="item.value">
            </el-select>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog title="用户修改" :visible.sync="visible2">
        <el-row :gutter="10">
          <el-col :span="12" v-for="(item, idx) in row" :key="item.name">
            <span style="padding-right: 10px">{{item.label}}:</span>
            <el-input v-if="item.type==='input'" style="width: 50%" v-model="modify[item.name]"></el-input>
            <el-select v-if="item.type==='select'" v-model="modify[item.name]" @change="onSelect()">
              <el-option v-for="item in item.selection_list" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-dialog>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column v-for="(col, idx) in columns" :key="col.name" :prop="col.name" :label="col.label"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="handleSearch(scope.$index, scope.row)">查看</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
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
        query: {},
        modify: {},
        visible1: false,
        visible2: false,
        row: [],
        columns: [{
          name: 'userId',
          label: '用户id',
          type: 'input',
          required: true
        },
        {
          name: 'username',
          label: '登录账号',
          type: 'input',
          filter: true,
          search: 'complete',
          required: true
        },
        {
          name: 'cellphone',
          label: '手机号',
          type: 'input',
          filter: true,
          search: 'fuzzy'
        },
        {
          name: 'role',
          label: '角色',
          type: 'select',
          selection_list: [{key: 1, value: '管理员'}, {key: 2, value: '超级管理员'}, {key: 3, value: '普通用户'}],
          filter: true,
          required: true
        },
        {
          name: 'level',
          label: '等级',
          type: 'select',
          selection_list: [{key: 1, value: 1}, {key: 2, value: 2}, {key: 3, value: 3}],
          filter: true
        },
        {
          name: 'active',
          label: '是否激活',
          type: 'select',
          filter: true,
          selection_list: [{key: 1, value: '是'}, {key: 0, value: '否'}],
          required: true
        }],
        tableData: [{
          userId: 'wxh',
          username: '王小虎',
          cellphone: '15000010129',
          roleId: 1,
          role: '管理员',
          level: 1,
          active: '是'
        }, {
          userId: 'fc11',
          username: '方尺',
          cellphone: '18891817376',
          roleId: 2,
          role: '超级管理员',
          level: 2,
          active: '是'
        }, {
          userId: 'zs001',
          username: '周山',
          cellphone: '13388976373',
          roleId: 3,
          role: '普通用户',
          level: 3,
          active: '是'
        }, {
          userId: 'csr001',
          username: '测试人员1',
          cellphone: '15034010129',
          roleId: 3,
          role: '普通用户',
          level: 1,
          active: '否'
        }]
      }
    },
    methods: {
      onSearch: function () {
        console.log('aa')
      },
      handleDelete: function (index, row) {
        this.$confirm('确认删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleEdit: function (index, row) {
        this.row = []
        this.modify = {}
        this.columns.forEach(function (item) {
          this.row.push({name: item.name, label: item.label, type: item.type, selection_list: item.selection_list})
          this.modify[item.name] = row[item.name]
        }.bind(this))
        this.visible2 = true
      },
      handleSearch: function (index, row) {
        this.row = []
        var that = this
        this.columns.forEach(function (item) {
          this.row.push({name: item.name, label: item.label, type: item.type, value: row[item.name]})
        }.bind(this))
        this.visible1 = true
      },
      onSelect: function () {
        this.modify = JSON.parse(JSON.stringify(this.modify))
      }
    },
    mounted: function () {
    }
  }
</script>