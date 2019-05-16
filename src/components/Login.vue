<template>
    <div class="login">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
            <h2>Login to Felix-Ssh2ws</h2>

            <el-form-item prop="user">
                <el-input v-model="ruleForm.user" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="ruleForm.password" prefix-icon="el-icon-c-scale-to-original"
                          show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           style="width:100%;"
                           :loading="loading"
                           @click.native.prevent="handleLogin">
                    Login
                </el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                ruleForm: {
                    name: '',
                    password: ''
                }
            };
        },
        methods: {
            handleLogin() {
                this.loading = true;
                this.$http.post('api/login', this.ruleForm).then(res => {
                    if (res) {
                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("expire_ts", res.data.expire_ts);
                        localStorage.setItem("expire", res.data.expire);
                        this.$router.push({name: "sshList"});
                    }
                    this.loading = false;
                })
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
