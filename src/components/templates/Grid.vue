    
<template>
  <div>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%" row-key="id" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column v-for="col in columns" :key="col.name" :prop="col.name" :label="col.label">
        <template slot-scope="scope" >
          <span v-if="col.saveValue">{{ scope.row[col.name] }}</span>
          <span v-else-if="col.type==='select'">{{ getValueFromKey(scope.row[col.name], kvMapping[col.name]) }}</span>
          <span v-else-if="col.type==='multi-select' || col.type==='tree-select'">{{ getValueListFromKey(scope.row[col.name], kvMapping[col.name]) }}</span>
          <span v-else>{{ scope.row[col.name] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <el-row slot-scope="scope">
          <el-col :span="8">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </el-col>
        </el-row>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="tableCount">
    </el-pagination>
  </div>
</template>
    
<script>
  import axios from 'axios'
  export default {
    data: function () {
      return {}
    },
    props: ['tableName', 'columns', 'loading', 'tableData', 'kvMapping', 'tableCount', 'pageNo', 'pageSize'],
    methods: {
      // handleOpen: function (index, row) {
      //   let currentRow = []
      //   this.columns.forEach(function (item) {
      //     if (row[item.name]) currentRow.push({name: item.name, label: item.label, type: item.type, value: this.getValueFromKey(row[item.name], this.kvMapping[item.name])})
      //     else currentRow.push({name: item.name, label: item.label, type: item.type})
      //   }.bind(this))
      //   this.$emit('setCurrentRow', currentRow)
      //   this.$emit('setCurrentView', 'Open')
      // },
      handleEdit: function (index, row) {
        let currentId = row.id
        let currentRow = []
        let currentModel = {}
        this.columns.forEach(function (item) {
          currentRow.push(item)
          currentModel[item.name] = row[item.name]
        })
        this.$emit('setCurrentRow', currentRow)
        this.$emit('setCurrentModel', currentModel)
        this.$emit('setCurrentId', currentId)
        this.$emit('setCurrentView', 'Edit')
      },
      handleDelete: function (index, row) {
        this.$confirm('确认删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/data/' + this.tableName + '/' + row.id)
            .then(function (response) {
              this.$emit('refreshData')
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
      handleSizeChange: function (val) {
        this.$emit('setCurrentPageSize', val)
        this.$emit('refreshData')
      },
      handleCurrentChange: function (val) {
        console.log(val)
        this.$emit('setCurrentPageNo', val)
        this.$emit('refreshData')
      },
      handleSelectionChange: function (val) {
        let selectedIds = []
        val.forEach(element => {
          selectedIds.push(element.id)
        })
        this.$emit('setSelectedIds', selectedIds)
      },
      getValueFromKey: function (key, mapping) {
        if (mapping) {
          for (let index = 0; index < mapping.length; index++) {
            const element = mapping[index]
            if (key === element.key) return element.value
          }
          return null
        } else return key
      },
      getValueListFromKey: function (keyList, mapping) {
        let vList = []
        if (keyList) {
          keyList.split(',').forEach(element => {
            let key = parseInt(element)
            if (this.getValueFromKey(key, mapping)) vList.push(this.getValueFromKey(key, mapping))
          })
        }
        return vList.join(',')
      }
    }
  }
</script>