<template>
    <el-dialog
            :visible.sync="v"
            :title="dTitle"
            @opened="doOpened"
            @open="doOpen"
            @close=" $emit('afterClose')"
    >
        <el-form :model="form" :label-width="80" :rules="rules" ref="ruleForm"
                 status-icon>
            <el-form-item label="英文标题" prop="title_en" required>
                <el-input v-model.trim="form.title_en" autocomplete="off" :disabled="isView"></el-input>
            </el-form-item>

            <el-form-item label="中文标题" prop="title_zh" required>
                <el-input v-model.trim="form.title_zh" autocomplete="off" :disabled="isView"></el-input>
            </el-form-item>
            <el-form-item label="URL" prop="url" required>
                <el-input v-model.trim="form.url" autocomplete="off" :disabled="isView"></el-input>
            </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer" v-if="!isView">
            <el-button @click="v = false" v-t="{path:'cancel'}"></el-button>
            <el-button type="primary" @click="handleFormSubmit" v-t="{path:'submit'}"></el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "DfHacknews",
        props: {obj: {type: Object, require: true}, id: {type: Number, require: true}, type: String, visible: Boolean},
        data() {
            return {
                isView: false,
                v: this.visible,
                form: this.obj,
                rules: {},
            };
        },
        watch: {
            visible(val) {
                this.v = val;//新增result的watch，监听变更并同步到myResult上
            }
        },
        computed: {
            dTitle() {
                switch (this.type) {
                    case "create":
                        return this.$t('sshFilterCreate');
                    case "view":
                        return this.$t('sshFilterView');
                    case "edit":
                        return this.$t('sshFilterUpdate');
                    default:
                        return ""
                }
            },
        },
        methods: {
            doAppendRule() {
                let ele = {command: "", msg: "", enable: 2};
                if (!this.form.filters) {
                    this.form.filters = [ele];
                    return
                }
                if (this.form.filters && Array.isArray(this.form.filters)) {
                    this.form.filters.push(ele)
                }
            },
            doOpen() {
                this.isView = this.type === 'view';
                this.form = this.obj;

                if (this.id > 0 && !!this.obj) {
                    this.$http.get(`filter-group/${this.id}`).then(resp => {
                        if (resp) {
                            this.form = resp.data
                        }
                    })
                }

            },
            postFormData() {
                let method = 'post';
                let url = 'api/hacknews';
                if (this.type === "edit") {
                    method = "patch";
                }
                if (this.type === "create") {
                    method = "post"
                }

                let data = this.form;

                this.$http({method, url, data}).then(res => {
                    if (res) {
                        this.$message.success("success");
                        this.v = false
                    }
                })
            },

            doOpened() {
            },
            handleFormSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.postFormData()
                    } else {
                        this.$notify.error("form validation failed");
                    }
                });
            },

        },
    }
</script>

<style scoped>
    .filter {
        width: 100%;
        display: flex !important;
        justify-content: space-between !important;;
        align-items: center !important;;
    }
</style>