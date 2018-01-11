    
<template>
  <el-select 
    size="medium"
    :filterable="meta.autoComplete"
    v-model="text">
    <el-option 
      v-for="item in meta.selectMapping" 
      :key="item.key" 
      :label="item.value" 
      :value="item[valueKey]">
    </el-option>
  </el-select>
</template>
    
<script>
  import axios from 'axios'
  import qs from 'qs'
  export default {
    data: function () {
      return {
        text: null,
        field: null,
        valueKey: 'key',
        inField: null
      }
    },
    props: ['meta', 'value'],
    methods: {
      getRelation: function (tableName) {
        let condition = {inField: 'user_role', inValue: this.text, outField: 'metric_id'}
        let params = '?' + qs.stringify(condition)
        axios.get('/api/relation/' + tableName + params)
          .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    watch: {
      text: function (val) {
        this.$emit('setValue', this.field, val)
      }
    },
    mounted: function () {
      this.field = this.meta.name
      if (this.meta.saveValue) this.valueKey = 'value'
      if (this.value) this.text = this.value
    }
  }
</script>