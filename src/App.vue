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
        padding: 15px !important;
        border-radius: 4px;
        margin: 8px;
        background: #ffffff;
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
        margin: 0px auto 25px auto;
    }

    .toolbar .el-button {
        font-size: 20px;
        padding: 8px 15px

    }

    .el-tree-node__content:hover, .el-tree-node:focus > .el-tree-node__content {
        background-color: #4b4b4b !important;
    }

    .cat-view {
        font-size: 14px;
        color: lightgray;
        background: #0e2231;
        padding: 20px;
        border-radius: 4px
    }

    .cell > button {
        font-size: 1.25rem !important;
        padding: 0.25rem 0.5rem;
    }
</style>
