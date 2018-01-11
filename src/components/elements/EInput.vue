    
<template>
  <el-input 
    size="medium" 
    style="width: 80%" 
    v-model="text" 
  />
</template>
    
<script>
  import axios from 'axios'
  export default {
    data: function () {
      return {
        field: null,
        text: null
      }
    },
    props: ['meta', 'value'],
    methods: {},
    watch: {
      text: function (val) {
        this.$emit('setValue', this.field, val)
      }
    },
    mounted: function () {
      this.field = this.meta.name
      if (this.value) this.text = this.value
    }
  }
</script>