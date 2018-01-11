<template>
  <el-container>
    <el-header style='padding:0; background: #0093D5'>
      <el-menu
        default-active="0"
        mode="horizontal"
        text-color="#fff"
        background-color="#0093D5"
        active-text-color="#ffd04b"
        style="padding-left: 200px">
        <el-menu-item index="0">数据产品管理</el-menu-item>
        <el-menu-item index="1">OMS管理</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px" style='background: #252D2F; height: 750px'>
        <el-menu
          default-active="0"
          background-color="#252D2F"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu v-for="(item, index) in menu" :key="item.name" :index="''+index">
            <template slot="title"><span>{{item.name}}</span></template>
            <el-menu-item-group>
              <el-menu-item v-for="(i_item, i_index) in item.children" :key="i_item.name" :index="index+'-'+i_index" @click="MenuClick(i_item.info)">{{i_item.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <Man v-if="tableName" :tableName="tableName" />
          <Empty v-else />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  import Man from '@/components/pages/Man'
  import Empty from '@/components/pages/Empty'
  import axios from 'axios'
  export default {
    components: {Man, Empty},
    data: function () {
      return {
        tableName: null,
        menu: null,
        username: null
      }
    },
    methods: {
      loadMenu: function () {
        axios.get('/api/sys/menu?username=' + this.username)
          .then(function (response) {
            this.menu = response.data
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      MenuClick: function (val) {
        this.tableName = val
      }
    },
    mounted: function () {
      this.username = this.$route.params.username
      this.loadMenu()
    }
  }
</script>