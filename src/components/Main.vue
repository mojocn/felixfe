<template>
    <el-container style="height: 100%">
        <el-aside width="200px">
            <el-menu :default-openeds="['1', '3']" router style="height: 100%;background-color: rgb(238, 241, 246)">
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-message"></i>Felix</template>
                    <el-menu-item-group>
                        <el-menu-item index="/ssh">SSH</el-menu-item>
                        <el-menu-item index="/ginbro">Ginbro</el-menu-item>
                        <el-menu-item index="/term-log">Term Log</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

            </el-menu>
        </el-aside>

        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-link @click="doLogout">Logout</el-link>
                        </el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>
                <span>Felix Ericsson Zhou</span>
                <p><a href="https://github.com/dejavuzhou/felix"></a></p>
            </el-header>
            <el-main id="felix">
                <router-view></router-view>
            </el-main>
            <el-footer height="80">
                <p>Felix's frontend and backend are created by Eric Zhou</p>
                <p>more about felix
                    <el-link type="primary" href="//github.com/dejavuzhou/felix">github.com/dejavuzhou/felix</el-link>
                </p>
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Main",
        methods: {
            doLogout() {
                localStorage.removeItem("token");
                localStorage.removeItem("expire_ts");
                localStorage.removeItem("expire");
                this.$router.push({name: "login"});
            }
        },
        mounted() {
            if (this.$route.path === '/') {
                this.$router.push({name: 'ssh'})
            }
        }
    }
</script>

<style scoped>
    #felix {
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
        position: relative;
        bottom: 0;
        right: 0;
        left: 0;
        color: #333;
        background-color: #B3C0D1;
    }
</style>