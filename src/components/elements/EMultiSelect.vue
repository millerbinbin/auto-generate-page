    
<template>
  <el-select size="medium" 
    multiple
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
  export default {
    data: function () {
      return {
        field: null,
        text: [],
        valueKey: 'key'
      }
    },
    props: ['meta', 'value'],
    methods: {},
    watch: {
      text: function (val) {
        this.$emit('setValue', this.field, val.join(','))
      }
    },
    mounted: function () {
      this.field = this.meta.name
      if (this.meta.saveValue) this.valueKey = 'value'
      if (this.value) {
        this.value.split(',').forEach(element => {
          this.text.push(parseInt(element))
        })
      }
    }
  }
</script>