<template>
    <el-container>
        <el-aside width="200">
            <el-menu :default-openeds="['1','2','3']" router>
                <el-submenu index="1">


                    <template slot="title"><i class="el-icon-user"></i>User</template>
                    <el-menu-item-group>
                        <template slot="title">user</template>
                        <el-menu-item index="/user">User</el-menu-item>
                    </el-menu-item-group>

                </el-submenu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-message"></i>Ssh</template>
                    <el-menu-item-group>
                        <template slot="title">ssh</template>
                        <el-menu-item index="/ssh">SSH</el-menu-item>
                        <el-menu-item index="/term-log">Term Log</el-menu-item>
                    </el-menu-item-group>

                </el-submenu>

                <el-submenu index="3">
                    <template slot="title"><i class="el-icon-rank"></i>Ginbro</template>
                    <el-menu-item-group>
                        <template slot="title">RESTful-cli</template>
                        <el-menu-item index="/ginbro">Generate</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

            </el-menu>
        </el-aside>

        <el-container>
            <el-header>
                <el-dropdown>
                    <i class="el-icon-setting"></i>
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
            <el-footer height="60">
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

<style>

</style>