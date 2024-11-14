<template>
  <el-container v-loading="loading">
    <el-aside width="200">
      <el-menu :default-active="$route.path" :default-openeds="['0','1','2']" router>
        <el-submenu v-for="(obj,idx) in navi" :key="idx" :index="`${idx}`">
          <template slot="title"><i :class="obj.icon"></i>{{ obj.txt }}</template>
          <el-menu-item-group>
            <el-menu-item v-for="item in obj.subs" :key="item.path" :index="item.path"
                          v-text="item.txt"></el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>


    <el-container style="height: 100vh">
      <el-header>
        <el-breadcrumb separator="/">
          <template v-if="breads">
            <el-breadcrumb-item v-for="bc in breads" :key="bc.name" :to="{ name: bc.name }">{{ bc.title }}
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>

        <div class="header-addons">

          <el-tooltip content="" placement="top">

            <el-link :underline="false" class="addon-icon" icon="el-icon-orange"
                     target="_blank"
                     href="/#">
            </el-link>

          </el-tooltip>

          <el-tooltip content="Oauth2-Github" placement="top">
            <el-link :underline="false" class="addon-icon" icon="el-icon-map-location"
                     target="_blank"
                     :href="oauthGithubURL">
            </el-link>
          </el-tooltip>


          <el-tooltip content="Mojotv.cn" placement="top">
            <el-link :underline="false" class="addon-icon" href="https://mojotv.cn"
                     icon="el-icon-question" target="_blank"></el-link>
          </el-tooltip>


          <el-tooltip placement="top">
            <div slot="content">
              <p>ByteGang</p>
              <p>前端GitHash：{{ gitHash }}</p>
              <template v-for="(item,k) in version">
                <p :key="k" v-text="item.desc + item.key"></p>
              </template>
            </div>
            <el-link :underline="false" class="addon-icon" icon="el-icon-warning"></el-link>
          </el-tooltip>


          <!--用户-->
          <el-dropdown @command="doCommand">
            <span>
              <el-badge :hidden="todoCount < 1" :max="9" :value="todoCount" class="abadge" type="success">
                  <img :src="user ? user.avatar : '/favicon.ico'" :title="user ? user.name : '请登录'" class="avatar">
              </el-badge>

            </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="sre-mfa-init"
                                icon="el-icon-key">激活SRE-MFA
              </el-dropdown-item>


              <el-dropdown-item v-if="todoCount > 0" command="todo" icon="el-icon-s-promotion">
                {{ `${todoCount}条待审批` }}
              </el-dropdown-item>
              <!--              <el-dropdown-item command="logout" icon="el-icon-s-operation">账号登出</el-dropdown-item>-->
              <el-dropdown-item command="reset-password" icon="el-icon-guide">重置-密码
              </el-dropdown-item>
              <el-dropdown-item command="reset-mfa" icon="el-icon-odometer">重置-MFA</el-dropdown-item>
              <!--              <el-dropdown-item command="reset-pk" icon="el-icon-key">重置堡垒机SSH公钥</el-dropdown-item>-->
              <!--              <el-dropdown-item command="user-setting" icon="el-icon-setting">设置公钥</el-dropdown-item>-->
              <!--              <el-dropdown-item command="user-mfa" icon="el-icon-s-grid">设置2FA</el-dropdown-item>-->
              <el-dropdown-item v-if="isAdmin" command="debug-log" icon="el-icon-s-grid" title="仅管理员可以看到">
                系统日志
              </el-dropdown-item>
              <el-dropdown-item v-if="isAdmin" command="doc-api" icon="el-icon-s-grid" title="仅仅管理员可以看到">
                API文档
              </el-dropdown-item>
              <el-dropdown-item v-if="isAdmin" command="jms-report" icon="el-icon-s-grid"
                                title="仅仅管理员可以看到">报表预览
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>

      </el-header>
      <el-main id="felix">
        <router-view></router-view>
      </el-main>
      <el-footer height="15">

      </el-footer>
    </el-container>

    <df-user :visible="visibleUserSetting" title="个人设置" @afterClose="visibleUserSetting = false"></df-user>

  </el-container>
</template>

<script>

import DfUser from "@/components/misc/DfUserPublicKey";
import {gitHash} from "@/assets/hash.json";


export default {
  name: "MainView",
  components: {DfUser},
  data() {
    return {
      loading: false,
      gitHash: gitHash,
      visibleUserSetting: false,
      lang: "English",
    }
  },

  computed: {

    oauthGithubURL() {
      let clientId = '529233922d0f07904d7e';
      let state = 'mojotv.cn';
      let scope = 'user';
      //https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#redirect-urls
      return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${window.location.origin}&scope=${scope}&state=${state}`;

    },

    version() {
      return this.$store.getters.getVersion
    },
    navi() {
      return this.$store.getters.getNavi
    },
    todoCount() {
      return this.$store.getters.getTodoCount
    },
    user: {
      get() {
        let t = localStorage.getItem("mojotv.cn")
        let user = JSON.parse(t)
        this.$store.commit("setUser", user);
        return user
      },
      set(user) {
        localStorage.setItem('mojotv.cn', JSON.stringify(user));
      }
    },
    isAdmin() {
      return this.$store.getters.isAdmin
    },

    breads() {
      return this.$route.meta.breads || null;
    },
  },
  beforeUpdate() {
    window.document.title = this.$route.meta.title || "FelixZhou"
  },
  mounted() {
    if (this.$route.path === '/') {
      this.$router.push({name: 'asset'})
      return
    }
    // this.fetchGithubUser()
    //this.$store.dispatch("fetchMeta")

  },

  watch: {
    $route() {

    }
  },
  methods: {
    async fetchGithubUser() {
      if (this.user) {
        return
      }
      let url = new URL(window.location.href);
      let q = url.searchParams;
      let code = q.get("code")
      let state = q.get("state")
      if (code && state) {
        try {
          this.loading = true
          this.$message.info("start fetch github Oauth2 user info");
          let user = await this.$http.get("/api/oauth/github", {params: {code, state}});
          this.loading = false;

          if (user) {
            this.user = user;
            this.$message.success("user has successful login");
            setTimeout(() => {
              window.location = window.location.origin
            }, 1500)

          } else {
            this._oauthConfirm()
          }

        } catch (e) {
          this.loading = false;
          this.$message.error(e)
        }

      } else {
        // location to Oauth Github page
        window.location = this.oauthGithubURL
      }
    },


    _oauthConfirm() {
      this.$confirm('Github-Oauth2 Login failed', 'Do you want retry?', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        window.location = this.oauthGithubURL
      }).catch(() => {
        window.opener = null;
        window.close()
      });
    },

    _jmsResetPassword() {

    },
    _jmsResetPublicKey() {

    },
    _jmsResetMfa() {

    },
    //cat

    _sreMfaInit() {

    },

    _sreMfaReset() {

    },
    doCommand(command) {

      let now = new Date();
      let ts = now.toISOString().split('T')[0];
      now.setDate(now.getDate() - 7)
      let fs = now.toISOString().split('T')[0]

      switch (command) {
        case 'logout':
          this.$http.get('/api/user/logout').then(res => {
            if (res) {
              this.$store.commit('setUser', null)
              this.$notify({
                title: '用户退出登录',
                message: '本地用户信息已经清除',
                duration: 0
              });
              window.open("https://account.mojotv.cn/usercenter/apps", "_self")
            }
          })
          break
        case 'sre-mfa-init':
          this._sreMfaInit()
          break;
        case 'sre-mfa-reset':
          this._sreMfaReset()
          break;
        case 'user-setting':
          this.visibleUserSetting = true
          break;
        case 'user-mfa':
          this.visibleUserMfa = true
          break;

        case 'debug-log':
          this.openInNewTab("/api/log")
          break;
        case 'jms-report':
          this.$router.push({name: 'jmsReport', params: {from: fs, to: ts}})
          break;
        case 'reset-password':
          this._jmsResetPassword()
          break;
        case 'reset-pk':
          this._jmsResetPublicKey()
          break;
        case 'reset-mfa':
          this._jmsResetMfa()
          break;
        case 'doc-api':
          this.openInNewTab("/swagger/index.html")
          break;

      }

    },
    openInNewTab(uri) {
      let url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + uri;
      //let win = window.open(url, '_blank');
      window.location.assign(url)
      //win.focus();
    },


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


#felix {
  padding: 15px !important;
  border-radius: 4px;
  margin: 8px;
  background: #fff;
}

.avatar {
  width: 40px;
  height: 40px;
  border: 1px solid #d6d6d6;
  border-radius: 20px
}

.mbadge > sup.el-badge__content {
  top: 25px !important;
  right: 96px !important;
  border: none !important;
}

.abadge > sup.el-badge__content {
  top: 4px !important;
  right: 8px !important;
}

</style>

