<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
  body {
    margin: 0;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }

  label {
    font-weight: 700;
  }


  #app {
    height: 100vh;
  }

  #felix {
    border-radius: 4px;
    margin: 8px;
    background: #ffffff;
    height: 100%;
  }

  .el-submenu, .el-menu {
    background: #1f2d3d !important;
  }

  .el-submenu .is-active, .sidebar-container .el-submenu .is-active:hover {
    background-color: #1890ff !important;
  }

  .el-submenu__title {
    color: white !important;
    font-size: 14px;
    color: #f5f7fa;
  }

  .el-submenu__title i {
    color: white !important;
  }

  .el-submenu__title:hover {
    background: black !important;
  }

  .el-container {
    background-color: rgba(144, 146, 152, .3);
  }

  .el-menu-item {
    color: white !important;
  }

  .el-menu {
    border: 0 !important;
  }

  .el-submenu:hover {
    background: #4e6783 !important;
  }

  .el-menu-item:hover {
    background: #3e526a !important;
  }

  .el-aside {
    position: relative;
    top: 0;
    bottom: 0;
    height: 100vh;
    background: #304156;
  }

  .el-header {
    padding: 15px 30px;
    height: 50px !important;
    background: #ffffff;
    text-align: right;
    font-size: 12px;
  }

  .el-footer {
    position: relative;
    bottom: 0;
    right: 0;
    left: 0;
    color: #333;
    background: #ffffff;
  }
</style>
