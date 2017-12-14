    
<template>
  <el-dialog title="修改" :visible.sync="showDialog" :before-close="handleClose">
    <el-form :rules="rules" :model="formData" ref="formData" :label-position="labelPosition" label-width="30%">
      <el-row>
        <el-col :span="12" v-for="(item, idx) in row" :key="item.name">
          <el-form-item :label="item.label + ':'" :prop="item.name">
            <el-input v-if="item.type==='input'||item.type==='search'" size="medium" style="width: 80%" v-model="formData[item.name]"></el-input>
            <el-select v-else-if="item.type==='select'" size="medium" v-model="formData[item.name]" @change="onSelect">
              <el-option :label="null" :value="null"></el-option>
              <el-option v-for="item in item.selectionList" :key="item.key" :label="item.value" :value="item.key" ></el-option>
            </el-select>
            <el-date-picker v-else-if="item.type==='date'" v-model="formData[item.name]" 
              type="date" value-format="yyyy-MM-dd" size="medium" style="width: 80%" placeholder="选择日期" @change="onSelect">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button @click="Cancel">取 消</el-button>
      <el-button type="primary" @click="Submit">确 定</el-button>
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
    props: ['row', 'model', 'rules', 'tableName', 'curId'],
    methods: {
      handleClose: function () {
        this.$emit('setCurrentView', '')
      },
      onSelect: function () {
        this.formData = JSON.parse(JSON.stringify(this.formData))
      },
      Cancel: function () {
        this.showDialog = false
        this.$emit('setCurrentView', '')
      },
      Submit: function () {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            axios.put('/api/data/' + this.tableName + '/' + this.curId, this.formData)
            .then(function (response) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$emit('refreshData')
              this.showDialog = false
              this.$emit('setCurrentView', '')
            }.bind(this))
            .catch(function (error) {
              this.$message.error('修改失败!' + error)
            }.bind(this))
          }
        })
      }
    },
    mounted: function () {
      this.formData = this.model
    }
  }
</script>