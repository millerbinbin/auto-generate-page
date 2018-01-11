    
<template>
  <div>
    <el-row :gutter="10">
    <el-col :span="6" v-for="col in columns" :key="col.name" v-if="col.filter">
      <el-row :gutter="5">
        <el-col :span="8" style="text-align: right; padding-top: 10px">
          <span style="padding-right: 5px">{{col.label}}:</span>
        </el-col>
        <el-col :span="16">
          <el-input v-if="col.type==='input'" v-model="q[col.name]" style="width: 80%" clearable></el-input>
          <el-select v-else-if="col.type==='select'" v-model="q[col.name]" placeholder="请选择">
            <el-option :label="null" :value="null"></el-option>
            <el-option v-for="item in col.selectMapping" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
          <el-date-picker v-else-if="col.type==='date'" v-model="q[col.name]" type="date" style="width: 80%" placeholder="选择日期"></el-date-picker>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <el-row v-if="showSearch" style="padding-top: 20px">
    <el-col :span="8" :offset="8" style="text-align: center" >
      <el-button size="medium" type="primary" @click="handleSearch">查询</el-button>
    </el-col>
  </el-row>
  </div>
</template>
    
<script>
  export default {
    data: function () {
      return {
        q: {},
        showSearch: false
      }
    },
    props: ['columns'],
    methods: {
      handleSearch: function () {
        this.$emit('getQuery', this.q)
        this.$emit('refreshData')
      }
    },
    watch: {
      columns: function (val) {
        this.showSearch = false
        for (let index = 0; index < val.length; index++) {
          const element = val[index]
          if (element.filter) {
            this.showSearch = true
            break
          }
        }
      }
    }
  }
</script>