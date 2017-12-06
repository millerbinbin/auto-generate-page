<template>
  <div id='app'>
    <el-container>
      <el-header style='padding:0; background: #0093D5'>
        <el-row>
          <el-col :span="21" :offset="3">
            <el-menu
              default-active="1"
              mode="horizontal"
              text-color="#fff"
              background-color="#0093D5"
              active-text-color="#ffd04b">
              <el-menu-item index="1">AAA</el-menu-item>
              <el-menu-item index="2">BBB</el-menu-item>
              <el-menu-item index="3">CCC</el-menu-item>
              <el-menu-item index="4">DDD</el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
        
      </el-header>
      <el-container>
        <el-aside width="200px" style='background: #252D2F; height: 100%'>
          <el-menu
            default-active="2"
            background-color="#252D2F"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title"><span>AA1</span></template>
              <el-menu-item-group>
                <el-menu-item index="1-1">A11</el-menu-item>
                <el-menu-item index="1-2">A12</el-menu-item>
                <el-menu-item index="1-3">A13</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><span>BB1</span></template>
              <el-menu-item-group>
                <el-menu-item index="3-1">B11</el-menu-item>
                <el-menu-item index="3-2">B12</el-menu-item>
                <el-menu-item index="3-3">B13</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><span>CC1</span></template>
              <el-menu-item-group>
                <el-menu-item index="3-1">C11</el-menu-item>
                <el-menu-item index="3-2">C12</el-menu-item>
                <el-menu-item index="3-3">C13</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            </el-menu>
          </el-col>
        </el-row>       
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
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

</style>

<script>
export default {
  name: 'app'
}
</script>