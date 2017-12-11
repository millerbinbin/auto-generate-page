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
              <el-option :label="null" :value="null"></el-option>
              <el-option v-for="item in col.selectionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-date-picker v-else-if="col.type==='date'" v-model="query[col.name]" type="date" style="width: 80%" placeholder="选择日期"></el-date-picker>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8" style="text-align: center">
        <el-button size="medium" type="primary" @click="handleSearch">查询</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-button size="small" type="info" @click="handleAdd">新建</el-button>
        <el-button size="small" type="info" @click="handleBatchDelete">批量删除</el-button>
        <el-button size="small" type="info" >导入</el-button>
        <el-button size="small" type="info" >导出</el-button>
      </el-col>

      <el-dialog title="新建" :visible.sync="showAddDialog">
        <el-form :rules="rules" :model="addList" ref="addList" :label-position="labelPosition" label-width="30%">
          <el-row>
            <el-col :span="12" v-for="(item, idx) in addRow" :key="item.name">
              <el-form-item :label="item.label + ':'" :prop="item.name">
                <el-input v-if="item.type==='input'" size="medium" style="width: 80%" v-model="addList[item.name]"></el-input>
                <el-select v-else-if="item.type==='select'" size="medium" v-model="addList[item.name]">
                  <el-option :label="null" :value="null"></el-option>
                  <el-option v-for="item in item.selectionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.type==='date'" v-model="addList[item.name]" type="date" value-format="yyyy-MM-dd" style="width: 80%" placeholder="选择日期"></el-date-picker>
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
            <el-col :span="12" v-for="(item, idx) in openRow" :key="item.name">
              <el-form-item :label="item.label + ':'" :prop="item.name">
                <el-input size="medium" disabled style="width: 80%" :value="item.value"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      
      <el-dialog title="修改" :visible.sync="showEditDialog">
        <el-form :rules="rules" :model="editList" ref="editList" :label-position="labelPosition" label-width="30%">
          <el-row>
            <el-col :span="12" v-for="(item, idx) in editRow" :key="item.name">
              <el-form-item :label="item.label + ':'" :prop="item.name">
                <el-input v-if="item.type==='input'" size="medium" style="width: 80%" v-model="editList[item.name]"></el-input>
                <el-select v-else-if="item.type==='select'" size="medium" v-model="editList[item.name]" @change="onSelect">
                  <el-option :label="null" :value="null"></el-option>
                  <el-option v-for="item in item.selectionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.type==='date'" v-model="editList[item.name]" 
                  type="date" value-format="yyyy-MM-dd" style="width: 80%" placeholder="选择日期" @change="onSelect">
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

      <el-table v-loading="loading" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column v-for="(col, idx) in columns" :key="col.name" :prop="col.name" :label="col.label">
          <template slot-scope="scope" >
            <span v-if="col.type==='select'">{{ getValueFromKey(scope.row[col.name], kvMapping[col.name]) }}</span>
            <span v-else>{{ scope.row[col.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
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
        :current-page="pageNo"
        :page-sizes="[10, 20, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="this.tableCount">
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

  .el-table {
    font-size: 14px;
  }

  .el-table td, .el-table th {
    padding: 8px 0px;
  }
</style>
<script>
  import axios from 'axios'
  import qs from 'qs'
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
        curId: -1,
        addRow: null,
        openRow: null,
        editRow: null,
        null: null,
        kvMapping: {},
        key: null,
        selectedId: [],
        columns: [],
        tableData: [],
        loading: true,
        pageSize: 10,
        pageNo: 1,
        tableCount: 0,
        tableName: 't_role'
      }
    },
    methods: {
      handleSearch: function () {
        this.getData(this.query)
      },
      handleDelete: function (index, row) {
        this.$confirm('确认删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/data/' + this.tableName + '/' + row.id)
            .then(function (response) {
              console.log(response)
              this.getData()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }.bind(this))
            .catch(function (error) {
              console.log(error)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleBatchDelete: function (index, row) {
        if (this.selectedId.length > 0) {
          this.$confirm('确认批量删除所有数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.delete('/api/data/' + this.tableName + '/multiple/' + this.selectedId.join(','))
              .then(function (response) {
                console.log(response)
                this.getData()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }.bind(this))
              .catch(function (error) {
                console.log(error)
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      handleAdd: function () {
        this.addRow = []
        this.addList = {}
        this.columns.forEach(function (item) {
          this.addRow.push({name: item.name, label: item.label, type: item.type, selectionList: item.selectionList})
        }.bind(this))
        this.showAddDialog = true
      },
      Add: function () {
        this.$refs['addList'].validate((valid) => {
          if (valid) {
            axios.post('/api/data/' + this.tableName, this.addList)
            .then(function (response) {
              console.log(response)
              this.$message({
                type: 'success',
                message: '新建成功!'
              })
              this.getData()
            }.bind(this))
            .catch(function (error) {
              console.log(error)
            })
            this.showAddDialog = !this.showAddDialog
          } else {
            console.log('error submit')
          }
        })
      },
      handleEdit: function (index, row) {
        this.curId = row.id
        this.editRow = []
        this.editList = {}
        this.columns.forEach(function (item) {
          this.editRow.push({name: item.name, label: item.label, type: item.type, selectionList: item.selectionList})
          this.editList[item.name] = row[item.name]
        }.bind(this))
        this.showEditDialog = true
      },
      Edit: function () {
        this.$refs['editList'].validate((valid) => {
          if (valid) {
            axios.put('/api/data/' + this.tableName + '/' + this.curId, this.editList)
            .then(function (response) {
              console.log(response)
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.getData()
            }.bind(this))
            .catch(function (error) {
              console.log(error)
            })
            this.showEditDialog = !this.showEditDialog
          } else {
            console.log('error submit')
          }
        })
      },
      handleOpen: function (index, row) {
        this.openRow = []
        this.columns.forEach(function (item) {
          if (row[item.name]) this.openRow.push({name: item.name, label: item.label, type: item.type, value: this.getValueFromKey(row[item.name], this.kvMapping[item.name])})
          else this.openRow.push({name: item.name, label: item.label, type: item.type})
        }.bind(this))
        this.showOpenDialog = !this.showOpenDialog
      },
      onSelect: function () {
        this.editList = JSON.parse(JSON.stringify(this.editList))
      },
      handleSizeChange: function (val) {
        this.pageSize = val
        this.getData()
      },
      handleCurrentChange: function (val) {
        this.pageNo = val
        this.getData()
      },
      handleSelectionChange: function (val) {
        this.selectedId = []
        val.forEach(element => {
          this.selectedId.push(element.id)
        })
      },
      getColumns: function () {
        axios.get('/api/model/' + this.tableName)
        .then(function (response) {
          this.columns = response.data
          var that = this
          this.columns.forEach(function (item) {
            this.rules[item.name] = item.rules
            if (item.selectionList) this.kvMapping[item.name] = item.selectionList
            if (item.key) this.key = item.name
          }.bind(this))
          this.getData()
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
      },
      getData: function (condition) {
        this.loading = true
        let params = ''
        condition = condition || {}
        condition.pageSize = this.pageSize
        condition.pageNo = this.pageNo
        params = '?' + qs.stringify(condition)
        axios.get('/api/data/' + this.tableName + params)
        .then(function (response) {
          this.tableData = response.data.rows
          this.tableCount = response.data.count
          this.loading = !this.loading
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
      },
      getValueFromKey: function (key, mapping) {
        if (mapping) {
          for (let index = 0; index < mapping.length; index++) {
            const element = mapping[index]
            if (key === element.key) return element.value
          }
          return null
        } else return key
      }
    },
    mounted: function () {
      this.getColumns()
    }
  }
</script>