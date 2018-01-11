<template>
  <el-row style="padding-top: 100px">
    <el-col :span="12" :offset="6">
      <el-form :label-position="labelPosition" label-width="80px" :model="formData" ref="form">
        <el-form-item label="用户名:">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input type="password" v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="6" :offset="9"><el-button type="primary" @click="submitForm()">登录</el-button></el-col>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    data: function () {
      return {
        labelPosition: 'right',
        formData: {
          name: '',
          password: ''
        }
      }
    },
    methods: {
      submitForm: function () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$router.push({ name: 'homepage', params: {username: this.formData.name} })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script> 
