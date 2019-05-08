<template>
    <el-container style="border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-openeds="['1', '3']" router>
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-message"></i>Felix</template>
                    <el-menu-item-group>
                        <template slot="title">SSH</template>
                        <el-menu-item index="/ssh/list">SSH list</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

            </el-menu>
        </el-aside>

        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>Login</el-dropdown-item>
                        <el-dropdown-item>Edit</el-dropdown-item>
                        <el-dropdown-item>Info</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>Felix Ericsson Zhou</span>
                <p><a href="https://github.com/dejavuzhou/felix"></a></p>
            </el-header>
            <el-main id="felix">
                <router-view></router-view>
            </el-main>
            <el-footer>
                FrontEnd and BackEnd were created by Eric Zhou
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Main"
    }
</script>

<style scoped>
    #felix {
        height: 800px;
    }
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }
    .el-footer {
        color: #333;
        background-color: #B3C0D1;
    }
</style>