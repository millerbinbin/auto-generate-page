    
<template>
  <el-dialog title="新建" :visible.sync="showDialog" :before-close="handleClose">
    <el-form :rules="rules" :model="formData" ref="formData" :label-position="labelPosition" label-width="30%">
      <el-row>
        <el-col :span="colSpan" v-for="(item, idx) in row" :key="item.name">
          <el-form-item :label="item.label + ':'" :prop="item.name">
            <EInput v-if="item.type==='input'" :meta="item" @setValue="setValue"/>
            <EDate v-else-if="item.type==='date'" :meta="item" @setValue="setValue"/>
            <ESelect v-else-if="item.type==='select'" :meta="item" @setValue="setValue"/>
            <EMultiSelect v-else-if="item.type==='multi-select'" :meta="item" @setValue="setValue"/>
            <ETree v-else-if="item.type==='tree-select'" :meta="item" @setValue="setValue" @setRelation="setRelation"/>
            <!-- <el-input v-else-if="item.type==='search'" size="medium" readonly style="width: 80%" v-model="formData[item.name]">
              <el-button slot="append" size="mini" icon="el-icon-search" @click="openSelectTable(item.name)"></el-button>
            </el-input> -->
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
    props: ['row', 'model', 'rules', 'tableName', 'colSpan'],
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
      Cancel: function () {
        this.showDialog = false
        this.$emit('setCurrentView', '')
      },
      updateRelation: function (inValue) {
        for (let key in this.relationData) {
          let param = this.relationData[key]
          param['inValue'] = inValue
          let params = '?' + qs.stringify(param)
          axios.put('/api/relation/' + param.tableName + params)
            .then(function (response) {
            })
            .catch(function (error) {
              console.log(error)
            })
        }
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