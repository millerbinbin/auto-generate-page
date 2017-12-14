    
<template>
  <el-dialog title="新建" :visible.sync="showDialog" :before-close="handleClose">
    <el-form :rules="rules" :model="formData" ref="formData" :label-position="labelPosition" label-width="30%">
      <el-row>
        <el-col :span="12" v-for="(item, idx) in row" :key="item.name">
          <el-form-item :label="item.label + ':'" :prop="item.name">
            <el-input v-if="item.type==='input'" size="medium" style="width: 80%" v-model="formData[item.name]"></el-input>
            <el-select v-else-if="item.type==='select'" size="medium" v-model="formData[item.name]">
              <el-option :label="null" :value="null"></el-option>
              <el-option v-for="item in item.selectionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-date-picker v-else-if="item.type==='date'" v-model="formData[item.name]" 
              type="date" value-format="yyyy-MM-dd" size="medium" style="width: 80%" placeholder="选择日期">
            </el-date-picker>
            <el-input v-if="item.type==='search'" size="medium" readonly style="width: 80%" v-model="model[item.name]">
              <el-button slot="append" size="mini" icon="el-icon-search" @click="openSelectTable(item.name)"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button @click="Cancel">取 消</el-button>
      <el-button type="primary" @click="Add">确 定</el-button>
    </div>
  </el-dialog>
</template>
    
<script>
  import axios from 'axios'
  export default {
    data: function () {
      return {
        labelPosition: 'right',
        showDialog: true,
        formData: {}
      }
    },
    props: ['row', 'model', 'rules', 'tableName'],
    methods: {
      handleClose: function () {
        this.$emit('setCurrentView', '')
      },
      Cancel: function () {
        this.showDialog = false
        this.$emit('setCurrentView', '')
      },
      Add: function () {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            axios.post('/api/data/' + this.tableName, this.formData)
            .then(function (response) {
              this.$message({
                type: 'success',
                message: '新建成功!'
              })
              this.$emit('refreshData')
              this.showDialog = false
              this.$emit('setCurrentView', '')
            }.bind(this))
            .catch(function (error) {
              this.$message.error('新增失败!' + error)
            }.bind(this))
          }
        })
      },
      openSelectTable: function (val) {
        this.$emit('setShowTableDialog', true)
      }
    },
    mounted: function () {
      this.formData = this.model
    }
  }
</script>