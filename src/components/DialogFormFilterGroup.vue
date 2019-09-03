<template>
    <el-dialog
            :visible.sync="v"
            :title="dTitle"
            @opened="doOpened"
            @open="doOpen"
            @close=" $emit('afterClose')"
    >
        <el-form :model="form" :label-width="$store.state.dialogFormLabelWidth" :rules="rules" ref="ruleForm"
                 status-icon>
            <el-form-item :label="$t('filterGroupName')" prop="name" required>
                <el-input v-model.trim="form.name" autocomplete="off" :disabled="isView"></el-input>
            </el-form-item>

            <el-form-item :label="$t('filterGroupRemark')" prop="remark" required>
                <el-input v-model.trim="form.remark" autocomplete="off" :disabled="isView"></el-input>
            </el-form-item>
            <template v-if="form.filters && form.filters.length > 0">
                <el-form-item :label="$t('filterGroupFilter')" v-for="(v,idx) in form.filters" :key="idx" size="small">
                    <div class="filter">
                        <el-input v-model="v.command" autocomplete="off" :disabled="isView" style="width: 35%"
                                  :placeholder="$t('filterCommandPh')"></el-input>
                        <el-input v-model="v.msg" autocomplete="off" :disabled="isView" style="width: 35%"
                                  :placeholder="$t('filterMsgPh')"></el-input>

                        <el-switch
                                :disabled="isView"
                                title="on/off"
                                v-model.number="v.enable"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                :active-value="2"
                                :inactive-value="4">
                        </el-switch>

                        <el-button @click.prevent="doRemoveFilter(v)"
                                   icon="el-icon-delete"
                                   type="text"
                                   :disabled="isView"></el-button>
                    </div>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item :label="$t('filterGroupFilter')" size="small">
                    <el-button type="warning" @click="doAppendRule" v-t="{path:'filterGroupAddRule'}"
                               :disabled="isView"></el-button>
                </el-form-item>
            </template>


        </el-form>
        <div slot="footer" class="dialog-footer" v-if="!isView">
            <el-button type="warning" @click="doAppendRule" v-t="{path:'filterGroupAddRule'}"
                       v-show="form.filters && form.filters.length > 0"></el-button>
            <el-button @click="v = false" v-t="{path:'cancel'}"></el-button>
            <el-button type="primary" @click="handleFormSubmit" v-t="{path:'submit'}"></el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "DialogFormFilterGroup",
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
                let url = 'filter-group';
                if (this.type === "edit") {
                    method = "patch";
                }
                if (this.type === "create") {
                    method = "post"
                }
                if (this.form && Array.isArray(this.form.filters)) {
                    this.form.filters = this.form.filters.filter(ele => {
                        return ele.command.trim().length > 1
                    })
                }
                let data = this.form;

                this.$http({method, url, data}).then(res => {
                    if (res) {
                        this.$message.success("success");
                        this.v = false
                    }
                })
            },
            doRemoveFilter(item) {
                let index = this.form.filters.indexOf(item);
                if (index !== -1) {
                    this.form.filters.splice(index, 1)
                }
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