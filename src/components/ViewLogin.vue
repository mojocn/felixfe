<template>
    <div class="login">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
            <h2>Login to Felix-Ssh2ws</h2>

            <el-form-item prop="user">
                <el-input v-model="ruleForm.username" prefix-icon="el-icon-user-solid"
                          placeholder="username or email"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="ruleForm.password" prefix-icon="el-icon-c-scale-to-original"
                          show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           style="width:45%;"
                           :loading="loading"
                           v-on:keyup.enter="handleLogin"
                           @click.native.prevent="handleLogin">
                    Login
                </el-button>
                <el-button type="success"
                           style="width:45%;float: right"
                           :loading="loading"
                           v-on:keyup.enter="doGithubLogin"
                           @click.native.prevent="doGithubLogin">
                    Github账号登录
                </el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                githubCallbackUrl:"",
                githubClientId:"",
                loading: false,
                ruleForm: {
                    username: 'admin',
                    password: 'admin'
                }
            };
        },
        mounted() {
            this.$http.get("api/meta").then(res => {
                if (res) {
                    this.githubClientId = res.data.github_client_id;
                    this.githubCallbackUrl = res.data.github_callback_url;
                    localStorage.setItem("meta", JSON.stringify(res.data));
                }
            })
        },
        methods: {
            handleLogin() {
                this.loading = true;
                this.$http.post('api/login', this.ruleForm).then(res => {
                    if (res) {
                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("expire_ts", res.data.expire_ts);
                        localStorage.setItem("expire", res.data.expire);
                        localStorage.setItem("user", JSON.stringify(res.data));
                        this.$router.push({name: "ssh"});
                    }
                    this.loading = false;
                })
            },
            doGithubLogin(){
                window.location.href = `https://github.com/login/oauth/authorize?client_id=${this.githubClientId}&redirect_uri=${this.githubCallbackUrl}&scope=user:email&state=${new Date().getTime()}&allow_signup=true`
            }
        }
    }

</script>


<style scoped>
    div.login > form {
        width: 520px;
        padding: 35px 35px 15px;
        margin: 80px auto;
    }

    form > h2 {
        font-size: 26px;
        font-weight: 400;
        margin: 0 auto 40px;
        text-align: center;
        font-weight: 700;
    }

</style>
