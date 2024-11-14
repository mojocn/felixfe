<template>
  <el-container style="height: 100vh">
    <el-card class="box-card" shadow="always" style="width: 61.8%;margin: 4rem auto auto auto;height: 34rem">
      <div slot="header" class="clearfix">
        <span>SRE-Open-2FA 认证平台</span>
        <el-button style="float: right; padding: 3px 0" type="text">开发文档</el-button>
      </div>


      <el-form ref="form" :model="form" :rules="rules" label-width="120px" status-icon @submit="doVerifyMfa">
        <el-form-item label="账号">
          <el-tag size="mini" type="primary" v-text="`${user.name} ${user.email} ${user.phone}`"></el-tag>
          <el-tag size="mini" type="warning" v-text="_timeHuman()"></el-tag>
        </el-form-item>
        <el-form-item label="部门">
          <el-tag size="mini" type="primary" v-text="`${user.dept_path}`"></el-tag>
        </el-form-item>


        <el-form-item label="手机验证" required>
          <el-input v-model.trim="form.mobile_code" clearable maxlength="4"
                    minlength="4"
                    placeholder="请点击右边按钮发送发送手机验证码"
                    prefix-icon="el-icon-connection"
                    show-word-limit>
            <el-button slot="append" @click="dfv = true">发送手机验证码</el-button>

          </el-input>
        </el-form-item>


        <el-form-item label="2FA-QR">
          <div style="display: flex;justify-content: left; align-items: end">
            <qrcode-vue :title="user.mfa_qr" :value="user.mfa_qr" level="L" size="100"></qrcode-vue>
            <span style="margin-left: 2rem">
              <p style="color: #409EFF;line-height: 22px">Google Authenticator 或者 微信小程序中搜索 KMFA(如果更新需要删除旧的2FA)</p>
              <p style="color: #F56C6C;font-weight: bold;line-height: 22px">扫描二维码 -> 输入小程序中的6位数字到下面input框</p>
          </span>
          </div>
        </el-form-item>


        <el-form-item label="校验2FA-Code" prop="code" required>
          <el-input v-model.trim="form.code" clearable maxlength="6"
                    minlength="6"
                    placeholder="请输入2FA程序中的六位数字,进行确认"
                    prefix-icon="el-icon-connection"
                    show-word-limit></el-input>
        </el-form-item>


        <el-form-item>
          <el-button title="完成2FA设置" type="success" @click="doVerifyMfa">提交</el-button>
          <el-button @click="_closeWin">关闭</el-button>
        </el-form-item>
      </el-form>


    </el-card>


    <el-dialog :visible.sync="dfv" title="发送手机验证码" @open="fetchCaptcha">
      <el-form label-width="120px" @submit="doCaptchaVerify">
        <el-form-item label="手机号码">
          <el-tag size="mini" type="primary" v-text="`${user.phone}`"></el-tag>
        </el-form-item>

        <el-form-item label="图像验证码">
          <el-link size="mini" @click="fetchCaptcha"><img :src="captchaImg" alt="captcha"></el-link>
        </el-form-item>

        <el-form-item label="图片答案">
          <el-input v-model="captchaValue" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dfv = false">取 消</el-button>
        <el-button type="primary" @click="doCaptchaVerify">确 定</el-button>
      </div>
    </el-dialog>


  </el-container>
</template>

<script>

import QrcodeVue from 'qrcode.vue'

export default {
  components: {QrcodeVue},

  name: 'SetupMfa',
  props: {userId: String, token: String},
  data() {
    return {
      dfv: false,
      captchaId: '',
      captchaImg: '',
      captchaValue: '',
      user: {},
      form: {user_id: parseInt(this.userId), code: '', mobile_code: ''},
      rules: {},


    };
  },
  mounted() {
    this.fetchUser()
  },

  methods: {
    _closeWin() {
      window.close()
    },
    _timeHuman() {
      let min = Math.floor(this.user.mfa_token_second / 60)
      let second = this.user.mfa_token_second % 60
      if (min === 0) {
        return `链接将在${second}秒后失效`
      }
      return `链接将在${min}分钟后失效`
    },
    fetchUser() {
      const id = this.userId
      const token = this.token
      this.$http.get("/api/open/mfa/qr", {params: {id, token}}).then(res => {
        if (res) {
          this.user = res
        }
      })
    },
    fetchCaptcha() {
      this.$http.get("/api/captcha").then(res => {
        if (res) {
          this.captchaId = res.id
          this.captchaImg = res.image
        }
      })
    },
    doCaptchaVerify() {
      let data = {id: this.captchaId, value: this.captchaValue}
      this.$http.post("/api/captcha-verify", data).then(res => {
        if (res) {
          this.$message.success("手机验证码已经发送成功")
          this.dfv = false
        }
      })
    },
    doVerifyMfa() {
      this.$http.post("/api/open/mfa/verify", this.form).then(res => {
        if (res) {
          this.$message.success("您的SRE-OPEN-2FA配置成功!页面在3秒之后关闭")
          window.setTimeout(window.close, 3 * 1000,);
        }
      })

    },
  },
};
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}

</style>