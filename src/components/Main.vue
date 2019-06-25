<template>
    <el-container>
        <el-aside width="200">
            <el-menu :default-openeds="['1','2','3','4','5']" router>
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-user"></i>User</template>
                    <el-menu-item-group>
                        <template slot="title">User Management</template>
                        <el-menu-item index="/user">User</el-menu-item>
                    </el-menu-item-group>

                </el-submenu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-message"></i>Ssh</template>
                    <el-menu-item-group>
                        <template slot="title">Ssh & Sftp helper</template>
                        <el-menu-item index="/ssh">Ssh/Sftp</el-menu-item>
                        <el-menu-item index="/term-log">SshReplay</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

                <el-submenu index="3">
                    <template slot="title"><i class="el-icon-rank"></i>Ginbro</template>
                    <el-menu-item-group>
                        <template slot="title">RESTful Cli</template>
                        <el-menu-item index="/ginbro">Generate</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title"><i class="el-icon-rank"></i>Nes</template>
                    <el-menu-item-group>
                        <template slot="title">Nes</template>
                        <el-menu-item index="/nes">Nes</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title"><i class="el-icon-message"></i>Tlog</template>
                    <el-menu-item-group>
                        <template slot="title">Tlog</template>
                        <el-menu-item index="/tlog">Tlog</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>

        <el-container style="height: 100vh">
            <el-header>
                <el-breadcrumb separator="/">
                    <template v-if="breads">
                        <el-breadcrumb-item v-for="bc in breads" :key="bc.name" :to="{ name: bc.name }">{{bc.title}}
                        </el-breadcrumb-item>
                    </template>
                </el-breadcrumb>

                <div class="header-addons">

                    <el-tooltip content="Help" placement="top">
                        <el-link icon="el-icon-question" class="addon-icon" :underline="false" target="_blank"
                                 href="https://github.com/dejavuzhou/felix"></el-link>
                    </el-tooltip>

                    <el-tooltip content="Feedback" placement="top">
                        <el-link icon="el-icon-s-comment" class="addon-icon" :underline="false" target="_blank"
                                 href="https://join.slack.com/t/360-co/shared_invite/enQtNjQyNDQ5NzUwMDY1LTBhOTAxOTM1MDA4YTU4YmI4ZGUxMGM4MWYxYzhkYmM2ZWM4NjA1NWY4Y2JkMjEwNzdiYWU1MWNiNzM3ZTg5ZTY"></el-link>
                    </el-tooltip>
                    <el-dropdown>

                        <img v-if="user" :src="user.avatar"
                             style="width: 40px;height: 40px;border: 1px solid #d6d6d6;border-radius: 20px"
                             title="user.username">

                        <i v-if="!user" class="el-icon-setting"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <el-link @click="doLogout" type="danger">Logout</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-link :href="'mailto:'+user.email" v-text="user.email" type="primary"></el-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-link href="https://github.com/mojocn" v-text="'Github'" type="success"></el-link>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

            </el-header>
            <el-main id="felix">
                <router-view></router-view>
            </el-main>
            <!--<el-footer height="30">-->
            <!--<p>Felix's frontend and backend are created by Eric Zhou</p>-->
            <!--<p>more about felix-->
            <!--<el-link type="primary" href="//github.com/dejavuzhou/felix">github.com/dejavuzhou/felix</el-link>-->
            <!--</p>-->
            <!--</el-footer>-->
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Main",
        computed: {
            user() {
                let js = localStorage.getItem("user");
                if (!js) {
                    return {email: "neochau@gmail.com", username: 'felix'}
                }
                return JSON.parse(js) || {email: "neochau@gmail.com"}
            },
            breads() {
                return this.$route.meta.breads || null;
            }
        },
        beforeUpdate() {
            window.document.title = this.$route.meta.title || "Felix"
        },
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
    .header-addons {
        display: flex;
        align-items: center;
    }

    .addon-icon > i {
        margin: auto 20px auto auto;
        font-size: 22px;
    }

</style>