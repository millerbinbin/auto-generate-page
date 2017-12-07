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
            <el-select v-else-if="col.type==='select'" v-model="query[col.name]" placeholder="请选择">
              <el-option v-for="item in col.selection_list" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-date-picker v-else-if="col.type==='date'" v-model="query[col.name]" type="date" style="width: 80%" placeholder="选择日期"></el-date-picker>
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
        <el-button size="small" type="info" @click="handleAdd">新建</el-button>
        <el-button size="small" type="info" >批量删除</el-button>
        <el-button size="small" type="info" >导入</el-button>
        <el-button size="small" type="info" >导出</el-button>
      </el-col>

      <el-dialog title="新建" :visible.sync="showAddDialog">
        <el-form :rules="rules" :model="addList" ref="addList" :label-position="labelPosition" label-width="30%">
          <el-row>
            <el-col :span="12" v-for="(item, idx) in row" :key="item.name">
              <el-form-item :label="item.label + ':'" :prop="item.name">
                <el-input v-if="item.type==='input'" size="medium" style="width: 80%" v-model="addList[item.name]"></el-input>
                <el-select v-else-if="item.type==='select'" size="medium" v-model="addList[item.name]">
                  <el-option v-for="key in Object.keys(item.selectionList)" :key="key" :label="item.selectionList[key]" :value="key"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.type==='date'" v-model="addList[item.name]" type="date" style="width: 80%" placeholder="选择日期"></el-date-picker>
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
                <el-select v-else-if="item.type==='select'" size="medium" disabled :value="item.value">
                  <el-option label="" value=""></el-option>
                </el-select>
                <el-date-picker v-else-if="item.type==='date'" :value="item.value" type="date" disabled style="width: 80%" placeholder="选择日期"></el-date-picker>
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
                <el-select v-else-if="item.type==='select'" size="medium" v-model="editList[item.name]" @change="onSelect">
                  <el-option label="" value=""></el-option>
                  <el-option v-for="key in Object.keys(item.selectionList)" :key="key" :label="item.selectionList[key]" :value="key"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.type==='date'" v-model="editList[item.name]" 
                  type="date" style="width: 80%" placeholder="选择日期" @change="onSelect">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="text-align: center">
          <el-button @click="showEditDialog=!showEditDialog">取 消</el-button>
          <el-button type="primary" @click="Edit">确 定</el-button>
        </div>
      </el-dialog>

      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="40"></el-table-column>
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
  .el-button--medium, .el-button--medium.is-round {
    margin: 0px
  }

  .el-form-item__label {
    font-size: 13px;
  }
</style>
<script>
  import axios from 'axios'
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
        key: null,
        selectedId: [],
        columns: [],
        tableData: []
      }
    },
    methods: {
      onSearch: function () {},
      ruleCheck: function (key) {
        console.log(this.rules[key])
      },
      handleDelete: function (index, row) {
        this.$confirm('确认删除 ' + row[this.key] + ' 的数据?', '提示', {
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
      handleBatchDelete: function (index, row) {
        this.$confirm('确认批量删除所有数据?', '提示', {
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
          this.row.push({name: item.name, label: item.label, type: item.type, selectionList: item.selectionList})
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
            this.showAddDialog = !this.showAddDialog
          }
        })
      },
      handleEdit: function (index, row) {
        this.curIdx = index
        this.row = []
        this.editList = {}
        this.columns.forEach(function (item) {
          this.row.push({name: item.name, label: item.label, type: item.type, selectionList: item.selectionList})
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
            this.showEditDialog = !this.showEditDialog
          }
        })
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
      handleCurrentChange: function () {},
      handleSelectionChange: function (val) {
        this.selectedId = []
        val.forEach(element => {
          this.selectedId.push(element.id)
        })
      },
      getColumns: function () {
        axios.get('/api/model/t_user')
        .then(function (response) {
          this.columns = response.data
          var that = this
          this.columns.forEach(function (item) {
            this.rules[item.name] = item.rules
            if (item.selectionList) this.kvMapping[item.name] = item.selectionList
            if (item.key) this.key = item.name
          }.bind(this))
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
      },
      getData: function () {
        axios.get('/api/data/t_user')
        .then(function (response) {
          this.tableData = response.data
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
      },
      rowFormatter: function (row, column) {
        console.log(row)
      }
    },
    mounted: function () {
      this.getColumns()
      this.getData()
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
      for (let index = 0; index < kvMapping.length; index++) {
        const element = kvMapping[index]
        if (element.key === key) return element.value
      }
      return null
    } else return key
  }
</script>