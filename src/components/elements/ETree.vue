    
<template>
<el-row>
  <el-col :span="24">
    <el-card>
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        @check-change="treeChange" 
      />
    </el-card>
  </el-col>
</el-row>
</template>
    
<script>
  import axios from 'axios'
  import qs from 'qs'
  export default {
    data: function () {
      return {
        data: [],
        table: null,
        field: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        checked: []
      }
    },
    props: ['meta', 'value', 'inValue'],
    methods: {
      getRelation: function (saveRelation, inValue) {
        let condition = {inField: saveRelation.inField, inValue: inValue, outField: saveRelation.outField}
        let params = '?' + qs.stringify(condition)
        axios.get('/api/relation/' + saveRelation.tableName + params)
          .then(function (response) {
            let data = response.data
            let keys = []
            data.forEach(element => {
              keys.push(element)
            })
            this.setChecked(keys)
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      getTree: function () {
        axios.get('/api/tree/' + this.table)
          .then(function (response) {
            this.data = response.data
            if (!this.meta.saveRelation) {
              let keys = []
              this.value.split(',').forEach(element => {
                keys.push(parseInt(element))
              })
              this.setChecked(keys)
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      getChecked: function () {
        return this.$refs.tree.getCheckedKeys()
      },
      setChecked: function (keys) {
        this.$refs.tree.setCheckedKeys(keys)
      },
      treeChange: function () {
        if (this.meta.saveRelation) {
          let val = this.meta.saveRelation
          val.inValue = this.inValue
          val.outValueList = this.getChecked().join(',')
          this.$emit('setRelation', this.field, val)
        } else {
          this.$emit('setValue', this.field, this.getChecked())
        }
      }
    },
    mounted: function () {
      this.table = this.meta.treeSource
      this.field = this.meta.name
      this.getTree()
      if (this.meta.saveRelation && this.inValue) this.getRelation(this.meta.saveRelation, this.inValue)
    }
  }
</script>