    
<template>
  <el-dialog title="查看" :visible.sync="showDialog" :before-close="handleClose">
    <el-form :label-position="labelPosition" label-width="30%">
      <el-row>
        <el-col :span="12" v-for="(item, idx) in row" :key="item.name">
          <el-form-item :label="item.label + ':'" :prop="item.name">
            <el-input size="medium" disabled style="width: 80%" :value="item.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
    
<script>
  import axios from 'axios'
  export default {
    data: function () {
      return {
        labelPosition: 'right',
        showDialog: true
      }
    },
    props: ['row'],
    methods: {
      handleClose: function () {
        this.$emit('setCurrentView', '')
      }
    }
  }
</script>