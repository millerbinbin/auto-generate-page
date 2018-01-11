<template>
  <div id='app'>
    <router-view />
  </div>
</template>


<style>

body {
  background-color: white;
  margin: 0;
  font-size: 13px;
}
.application {
  padding-top: 0px;
  background-color: white;
  color: black;
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
export default {
  name: 'app',
  mounted: function () {
    this.$router.push({ name: 'login' })
  }
}
</script>