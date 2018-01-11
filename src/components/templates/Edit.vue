    
<template>
  <el-dialog title="修改" :visible.sync="showDialog" :before-close="handleClose">
    <el-form :rules="rules" :model="formData" ref="formData" :label-position="labelPosition" label-width="30%">
      <el-row>
        <el-col :span="colSpan" v-for="(item, idx) in row" :key="item.name">
          <el-form-item :label="item.label + ':'" :prop="item.name">
            <EInput v-if="item.type==='input'" :meta="item" :value="formData[item.name]" @setValue="setValue"/>
            <EDate v-else-if="item.type==='date'" :meta="item" :value="formData[item.name]" @setValue="setValue"/>
            <ESelect v-else-if="item.type==='select'" :meta="item" :value="formData[item.name]" @setValue="setValue"/>
            <EMultiSelect v-else-if="item.type==='multi-select'" :meta="item" :value="formData[item.name]" @setValue="setValue"/>
            <ETree v-else-if="item.type==='tree-select'" :meta="item" :inValue="curId" :value="formData[item.name]" @setValue="setValue" @setRelation="setRelation"/>
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
  import qs from 'qs'
  import EInput from '@/components/elements/EInput.vue'
  import EDate from '@/components/elements/EDate.vue'
  import ESelect from '@/components/elements/ESelect.vue'
  import EMultiSelect from '@/components/elements/EMultiSelect.vue'
  import ETree from '@/components/elements/ETree.vue'
  export default {
    components: {EInput, EDate, ESelect, EMultiSelect, ETree},
    data: function () {
      return {
        labelPosition: 'right',
        showDialog: true,
        formData: {},
        relationData: {}
      }
    },
    props: ['row', 'model', 'rules', 'tableName', 'curId', 'colSpan'],
    methods: {
      setValue: function (key, val) {
        this.formData[key] = val
      },
      setRelation: function (key, val) {
        this.relationData[key] = val
      },
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
      updateRelation: function () {
        for (let key in this.relationData) {
          let param = this.relationData[key]
          let params = '?' + qs.stringify(param)
          console.log(params)
          axios.put('/api/relation/' + param.tableName + params)
            .then(function (response) {
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      },
      Submit: function () {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            axios.put('/api/data/' + this.tableName + '/' + this.curId, this.formData)
            .then(function (response) {
              this.updateRelation()
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