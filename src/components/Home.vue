<template>
  <div id="home">
    <el-row :gutter="10">
      <el-col :span="6" v-for="(col, idx) in columns" :key="col.name" v-if="col.filter">
        <el-row :gutter="5">
          <el-col :span="8" style="text-align: right; padding-top: 10px">
            <span style="padding-right: 5px">{{col.label}}:</span>
          </el-col>
          <el-col :span="16">
            <el-input v-if="col.type==='input'" v-model="query[col.name]" style="width: 80%" clearable></el-input>
            <el-select v-if="col.type==='select'" v-model="query[col.name]" placeholder="请选择">
              <el-option v-for="item in col.selection_list" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8" style="text-align: center">
        <el-button size="medium" type="primary" @click="onSearch">查询</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-button size="medium" type="info" @click="handleAdd">新建</el-button>
      </el-col>

      <el-dialog title="新建" :visible.sync="showAddDialog">
        <el-form :rules="rules" :model="addList" ref="addList" :label-position="labelPosition" label-width="30%">
          <el-row>
            <el-col :span="12" v-for="(item, idx) in row" :key="item.name">
              <el-form-item :label="item.label + ':'" :prop="item.name">
                <el-input v-if="item.type==='input'" size="medium" style="width: 80%" v-model="addList[item.name]"></el-input>
                <el-select v-if="item.type==='select'" size="medium" v-model="addList[item.name]">
                  <el-option v-for="item in item.selection_list" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="text-align: center">
          <el-button @click="showAddDialog=!showAddDialog">取 消</el-button>
          <el-button type="primary" @click="Add">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="查看" :visible.sync="showOpenDialog">
        <el-form :rules="rules" :label-position="labelPosition" label-width="30%">
          <el-row>
            <el-col :span="12" v-for="(item, idx) in row" :key="item.name">
              <el-form-item :label="item.label + ':'" :prop="item.name">
                <el-input v-if="item.type==='input'" size="medium" disabled style="width: 80%" :value="item.value"></el-input>
                <el-select v-if="item.type==='select'" size="medium" disabled :value="item.value">
                  <el-option label="" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      
      <el-dialog title="修改" :visible.sync="showEditDialog">
        <el-form :rules="rules" :model="editList" ref="editList" :label-position="labelPosition" label-width="30%">
          <el-row>
            <el-col :span="12" v-for="(item, idx) in row" :key="item.name">
              <el-form-item :label="item.label + ':'" :prop="item.name">
                <el-input v-if="item.type==='input'" size="medium" style="width: 80%" v-model="editList[item.name]"></el-input>
                <el-select v-if="item.type==='select'" size="medium" v-model="editList[item.name]" @change="onSelect">
                  <el-option label="" value=""></el-option>
                  <el-option v-for="item in item.selection_list" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="text-align: center">
          <el-button @click="showEditDialog=!showEditDialog">取 消</el-button>
          <el-button type="primary" @click="Edit">确 定</el-button>
        </div>
      </el-dialog>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column v-for="(col, idx) in columns" :key="col.name" :prop="col.name" :label="col.label"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-col :span="8">
              <el-button size="mini" type="info" @click="handleOpen(scope.$index, scope.row)">查看</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </el-col>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next"
        :total="this.tableData.length">
      </el-pagination>
    </el-row>
  </div>
</template>

<style>
  .el-row{
    padding-bottom: 15px;
  }

  .el-select {
    width: 80%
  }

  .el-button--mini, .el-button--mini.is-round {
    padding: 5px 8px
  }

  .el-form-item__label {
    font-size: 13px;
  }
</style>
<script>
  export default {
    data: function () {
      return {
        ruleForm: {},
        rules: {},
        query: {},
        addList: {},
        editList: {},
        labelPosition: 'right',
        showAddDialog: false,
        showOpenDialog: false,
        showEditDialog: false,
        curIdx: -1,
        row: [],
        kvMapping: {},
        columns: [{
          name: 'userId',
          label: '用户id',
          type: 'input',
          rules: [
            { required: true, message: '请输入用户id', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ]
        },
        {
          name: 'username',
          label: '登录账号',
          type: 'input',
          filter: true,
          search: 'complete',
          rules: [
            { required: true, message: '请输入用户账号', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ]
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
          rules: [
            { required: true, message: '请输入角色', trigger: 'blur' }
          ]
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
          selection_list: [{key: 1, value: '是'}, {key: 0, value: '否'}]
        }],
        tableData: [{
          userId: 'wxh',
          username: '王小虎',
          cellphone: '15000010129',
          role: '管理员',
          level: 1,
          active: '是'
        }, {
          userId: 'fc11',
          username: '方尺',
          cellphone: '18891817376',
          role: '超级管理员',
          level: 2,
          active: '是'
        }, {
          userId: 'zs001',
          username: '周山',
          cellphone: '13388976373',
          role: '普通用户',
          level: 3,
          active: '是'
        }, {
          userId: 'csr001',
          username: '测试人员1',
          cellphone: '15034010129',
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
      ruleCheck: function (key) {
        console.log(this.rules[key])
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
      handleAdd: function () {
        this.row = []
        this.addList = {}
        this.columns.forEach(function (item) {
          this.row.push({name: item.name, label: item.label, type: item.type, selection_list: item.selection_list})
        }.bind(this))
        this.showAddDialog = true
      },
      Add: function () {
        this.$refs['addList'].validate((valid) => {
          if (valid) {
            let tmp = {}
            for (let k in this.addList) {
              tmp[k] = getValueFromKey(this.addList[k], this.kvMapping[k])
            }
            this.tableData.push(tmp)
          } else {
            console.log('error submit!!')
          }
        })
        this.showAddDialog = !this.showAddDialog
      },
      handleEdit: function (index, row) {
        this.curIdx = index
        this.row = []
        this.editList = {}
        this.columns.forEach(function (item) {
          this.row.push({name: item.name, label: item.label, type: item.type, selection_list: item.selection_list})
          this.editList[item.name] = getKeyFromValue(row[item.name], this.kvMapping[item.name])
        }.bind(this))
        this.showEditDialog = true
      },
      Edit: function () {
        this.$refs['editList'].validate((valid) => {
          if (valid) {
            let tmp = {}
            for (let k in this.editList) {
              tmp[k] = getValueFromKey(this.editList[k], this.kvMapping[k])
            }
            this.tableData[this.curIdx] = tmp
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
          } else {
            console.log('error submit!!')
          }
        })
        this.showEditDialog = !this.showEditDialog
      },
      handleOpen: function (index, row) {
        this.row = []
        this.columns.forEach(function (item) {
          this.row.push({name: item.name, label: item.label, type: item.type, value: row[item.name]})
        }.bind(this))
        this.showOpenDialog = true
      },
      onSelect: function () {
        this.editList = JSON.parse(JSON.stringify(this.editList))
      },
      handleSizeChange: function () {},
      handleCurrentChange: function () {}
    },
    mounted: function () {
      this.columns.forEach(function (item) {
        this.rules[item.name] = item.rules
        if (item.selection_list) this.kvMapping[item.name] = item.selection_list
      }.bind(this))
    }
  }

  function getKeyFromValue (value, kvMapping) {
    if (kvMapping) {
      for (let index = 0; index < kvMapping.length; index++) {
        const element = kvMapping[index]
        if (element.value === value) return element.key
      }
      return null
    } else {
      return value
    }
  }

  function getValueFromKey (key, kvMapping) {
    if (kvMapping) {
      if (kvMapping[key]) return kvMapping[key].value
      else return null
    } else return key
  }
</script>