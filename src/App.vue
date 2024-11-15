<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  mounted() {
  }
}
</script>

<style>
.el-button--mini {
  padding: 4px 6px !important;
  font-size: 8px !important;
}

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



.el-submenu, .el-menu {
  background: #1f2d3d !important;
}

.el-submenu .is-active, .sidebar-container .el-submenu .is-active {
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
  background-color: #ebeef5;
}

.el-menu-item {
  color: white !important;
}

.el-menu {
  border: 0 !important;
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
  justify-items: center !important;
  justify-content: space-between !important;
  align-items: center !important;
  display: flex !important;
  padding: 10px 20px 10px 20px !important;
  height: 60px !important;
  background: #ffffff;
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

.toolbar {
  margin: 0px auto 1rem auto;
}

.toolbar .el-button {
  padding: 8px 8px
}

.cell > button {
  font-size: 1.25rem !important;
  padding: 0.25rem 0.5rem;
}

.el-dialog__body > pre {
  border-radius: 0.25rem;
  max-height: 50vh;
  background: black;
  color: #f5f7fa;
  overflow: auto;
}

#nprogress .bar {
  background: #ff5722 !important;
}

/* Remove these to get rid of the spinner */
#nprogress .spinner {
  top: 9px !important;
  right: 21px !important;
}

#nprogress .spinner-icon {
  width: 41px !important;
  height: 41px !important;
  border-top-color: #ff5722 !important;
  border-left-color: #ff5722 !important;
}

.cell > .el-link {
  margin-left: 0.5rem;
}

.el-table td {
  text-align: center !important;
}

.el-table th {
  text-align: center !important;
}

.search-bar {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search-bar > .el-input {
  width: 13rem !important;
  margin-right: 1rem;
}

.search-bar > .el-select {
  width: 14rem !important;
  margin-right: 1rem;
}

.search-bar > .el-range-editor {
  width: 16rem !important;
  margin-right: 1rem;
}

.cell > .el-tag {
  margin-right: 0.4rem;
}

div.el-form-item__content > .el-tag {
  margin-right: 0.5rem;
}

.el-pagination {
  margin-top: 1rem;
}

div.xterm {
  padding: 1rem;
}


form > div.el-form-item > div.el-form-item__content > div.el-select {
  width: 100% !important;
}
</style>