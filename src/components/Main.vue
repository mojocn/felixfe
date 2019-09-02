<template>
    <el-container>
        <el-aside width="200">
            <el-menu :default-openeds="['1','2','3','5']" router>
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-user"></i>{{$t('user')}}</template>
                    <el-menu-item-group>
                        <template slot="title">{{$t('userManage')}}</template>
                        <el-menu-item index="/user">{{$t('user')}}</el-menu-item>
                        <el-menu-item index="/comment">{{$t('comment')}}</el-menu-item>
                        <el-menu-item index="/hacknews" v-text="'Hacknews'"></el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-film"></i>Ssh</template>
                    <el-menu-item-group>
                        <template slot="title">Ssh & Sftp helper</template>
                        <el-menu-item index="/ssh">Ssh/Sftp</el-menu-item>
                        <el-menu-item index="/ssh-log" v-text="$t('sshLog')"></el-menu-item>

                    </el-menu-item-group>
                </el-submenu>

                <el-submenu index="3">
                    <template slot="title"><i class="el-icon-rank"></i>Ginbro</template>
                    <el-menu-item-group>
                        <template slot="title">{{$t('restCli')}}</template>
                        <el-menu-item index="/ginbro" v-text="$t('ginbroGen')"></el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

                <el-submenu index="5">
                    <template slot="title"><i class="el-icon-message"></i>{{$t('wslog')}}</template>
                    <el-menu-item-group>
                        <template slot="title">{{$t('wslogMsg')}}</template>
                        <el-menu-item index="/wslog/hook">{{$t('wslogHook')}}</el-menu-item>
                        <el-menu-item index="/wslog-msg">{{$t('wslogMsg')}}</el-menu-item>
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
                    <!--change lange-->
                    <el-dropdown>

                        <span v-text="langText" style="margin-right: 2rem;"> </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <el-link @click="setLang('zh-CN')" type="success">中文</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-link @click="setLang('en-US')" type="danger">English</el-link>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-tooltip content="Help" placement="top">
                        <el-link icon="el-icon-question" class="addon-icon" :underline="false" target="_blank"
                                 href="https://github.com/dejavuzhou/felix"></el-link>
                    </el-tooltip>

                    <el-tooltip content="Feedback" placement="top">
                        <el-link icon="el-icon-s-comment" class="addon-icon" :underline="false" target="_blank"
                                 href="https://join.slack.com/t/360-co/shared_invite/enQtNjQyNDQ5NzUwMDY1LTBhOTAxOTM1MDA4YTU4YmI4ZGUxMGM4MWYxYzhkYmM2ZWM4NjA1NWY4Y2JkMjEwNzdiYWU1MWNiNzM3ZTg5ZTY"></el-link>
                    </el-tooltip>

                    <!--用户-->
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
    import config from "@/libs/config"

    export default {
        name: "Main",
        data() {
            return {
                ws: null,
                lang: "English",
            }
        },
        computed: {
            langText() {
                let lang = localStorage.getItem("language");
                if (!lang){
                    return "English"
                }
                if (lang.startsWith("zh-")) {
                    return "中文"
                } else {
                    return "English"
                }
            },
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
        mounted() {
            this.startWebsocketConn();
            if (this.$route.path === '/') {
                this.$router.push({name: 'ssh'})
            }
        },
        beforeDestroy() {
            if (this.ws) {
                this.ws.close()
            }
        },
        methods: {
            startWebsocketConn() {
                let token = localStorage.getItem('token');
                if (!token){
                    return
                }
                let wsURL = `${config.wsBase}/ws/hook?&_t=${token}`;
                let ws = new WebSocket(wsURL);
                ws.onmessage = ev => {
                    let obj = JSON.parse(ev.data);
                    this.$store.commit('prependMsgs', obj);
                    this.$notify({
                        duration: 10000,
                        title: 'received a msg from hook',
                        message: obj.slack_msg.attachments[0].fallback,
                        type: "success"
                    });
                };
                ws.onclose = ce => {
                    if (ce.code !== 1005) {
                        this.$notify.error({
                            title: `code ${ce.code}`,
                            message: ce.reason,
                        });
                    }
                };
                this.ws = ws
            },
            setLang(lang) {
                localStorage.setItem("language", lang);
                this.$i18n.locale = lang;
            },
            doLogout() {
                localStorage.removeItem("token");
                localStorage.removeItem("expire_ts");
                localStorage.removeItem("expire");
                this.$router.push({name: "login"});
            }
        },
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