<template>
  <div>
    <Search :columns="columns" @getQuery="getQuery" @refreshData="getData"></Search>
    <el-row style="padding-top: 10px; padding-bottom: 2px">
      <el-col :span="16">
        <el-button size="small" type="info" @click="handleAdd">新建</el-button>
        <el-button size="small" type="info" @click="handleBatchDelete">批量删除</el-button>
        <!-- <el-button size="small" type="info" >导入</el-button>
        <el-button size="small" type="info" >导出</el-button> -->
      </el-col>
      <!-- <el-col :span="4" :offset="4">
        <el-button size="small" type="info" >批量激活</el-button>
        <el-button size="small" type="info" >批量禁用</el-button>
      </el-col> -->
    </el-row>

    <component v-bind:is="currentView"  :rules="rules"
      :tableName="tableName" :curId="curId"
      :model="model"
      :row="row" :colSpan="24"
      @refreshData="getData"
      @setShowTableDialog="setShowTableDialog"
      @setCurrentView="setCurrentView">
    </component>
    
    <el-dialog title="查表数据" :visible.sync="showTableDialog">
      <el-table :data="tableData" border highlight-current-row style="width: 100%" max-height="400" row-key="id" @current-change="handleSelectChange">
        <el-table-column v-for="col in columns" :key="col.name" :prop="col.name" :label="col.label">
        </el-table-column>
      </el-table>
      <div slot="footer" style="text-align: center">
        <el-button @click="showTableDialog=!showTableDialog">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <Grid :tableData="tableData" :tableName="tableName" :columns="columns" :loading="loading" :kvMapping="kvMapping" :tableCount="tableCount" :pageSize="pageSize" :pageNo="pageNo"
      @setCurrentView="setCurrentView" 
      @setCurrentRow="setCurrentRow"
      @setCurrentId="setCurrentId"
      @setCurrentModel="setCurrentModel"
      @setCurrentPageNo="setCurrentPageNo"
      @setCurrentPageSize="setCurrentPageSize"
      @setSelectedIds="setSelectedIds"
      @refreshData="getData">
    </Grid>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  import Search from '@/components/templates/Search.vue'
  import Add from '@/components/templates/Add.vue'
  import Open from '@/components/templates/Open.vue'
  import Edit from '@/components/templates/Edit.vue'
  import Grid from '@/components/templates/Grid.vue'
  export default {
    components: {
      Search,
      Add,
      Open,
      Edit,
      Grid
    },
    data: function () {
      return {
        rules: {},
        query: {},
        showTableDialog: false,
        currentView: '',
        curId: -1,
        row: null,
        model: null,
        kvMapping: {},
        selectedIds: [],
        columns: [],
        tableData: [],
        loading: true,
        pageSize: 10,
        pageNo: 1,
        tableCount: 0,
        innerSelect: '',
        selectKey: ''
      }
    },
    props: ['tableName'],
    methods: {
      getQuery: function (val) {
        this.query = val
      },
      handleBatchDelete: function (index, row) {
        if (this.selectedIds.length > 0) {
          this.$confirm('确认批量删除这' + this.selectedIds.length + '条数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.delete('/api/data/' + this.tableName + '/multiple/' + this.selectedIds.join(','))
              .then(function (response) {
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
      setCurrentView: function (val) {
        this.currentView = val
      },
      setCurrentRow: function (val) {
        this.row = val
      },
      setCurrentModel: function (val) {
        this.model = val
      },
      setCurrentId: function (val) {
        this.curId = val
      },
      setCurrentPageNo: function (val) {
        this.pageNo = val
      },
      setCurrentPageSize: function (val) {
        this.pageSize = val
      },
      setSelectedIds: function (val) {
        this.selectedIds = val
      },
      setShowTableDialog: function (val) {
        this.showTableDialog = val
      },
      handleAdd: function () {
        this.row = []
        this.model = {}
        this.columns.forEach(function (item) {
          this.row.push(item)
        }.bind(this))
        this.currentView = 'Add'
      },
      getColumns: function () {
        axios.get('/api/model/' + this.tableName)
        .then(function (response) {
          this.columns = response.data
          var that = this
          this.columns.forEach(function (item) {
            this.rules[item.name] = item.rules
            if (item.selectMapping) this.kvMapping[item.name] = item.selectMapping
          }.bind(this))
          this.getData()
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
      },
      getData: function () {
        this.loading = true
        let params = ''
        let condition = this.query || {}
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
      openSelectTable: function (val) {
        this.showTableDialog = !this.showTableDialog
        this.selectKey = val
      },
      testSelect: function () {
        this.showTableDialog = !this.showTableDialog
        this.addList[this.selectKey] = this.innerSelect
      },
      handleSelectChange: function (val) {
        this.innerSelect = val.name
      }
    },
    mounted: function () {
      this.getColumns()
    },
    watch: {
      tableName: function (val) {
        this.pageSize = 10
        this.pageNo = 1
        this.query = {}
        this.getColumns()
      }
    }
  }
</script>