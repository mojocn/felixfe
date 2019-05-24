<template>
    <section>
        <div style="margin: 40px 40px 120px 40px">
            <h2 style="text-align: center;color:#409EFF">Command: felix ginbro</h2>
            <p style="color:#F56C6C;text-align: center;margin: 40px ">
                Using a SQL database schema connection generates a Golang + gin + gorm + auth-jwt + RESTful app codebase
                <el-link style="margin-left: 120px" type="warning"
                         href="https://github.com/dejavuzhou/felix/tree/master/ginbro" target="_blank">Help Doc
                </el-link>
            </p>
        </div>

        <el-form ref="form" :model="form" label-width="150px" size="mini" status-icon :rules="rules">
            <el-steps :active="stepIdx" align-center>
                <el-step title="database connection"></el-step>
                <el-step title="jwt auth"></el-step>
                <el-step title="app config"></el-step>
                <el-step title="generate code"></el-step>
            </el-steps>
            <div class="db" v-show="stepIdx === 1">
                <el-form-item label="Db type">
                    <el-radio-group v-model="form.db_type">
                        <el-radio label="mysql">mysql</el-radio>
                        <el-radio label="mssql">mssql</el-radio>
                        <el-radio label="sqlite">sqlite</el-radio>
                        <el-radio label="sqlite3">sqlite3</el-radio>
                        <el-radio label="postgres">postgres</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="DB Charset">
                    <el-radio-group v-model="form.db_char">
                        <el-radio label="utf8">utf8</el-radio>
                        <el-radio label="utf8mb4">utf8mb4</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Db Addr" prop="db_addr">
                    <el-input placeholder="127.0.0.1:3306" v-model="form.db_addr">
                    </el-input>
                </el-form-item>
                <el-form-item label="Db Name" prop="db_name">
                    <el-input v-model="form.db_name"></el-input>
                </el-form-item>
                <el-form-item label="Db User">
                    <el-input v-model="form.db_user"></el-input>
                </el-form-item>
                <el-form-item label="Db Password">
                    <el-input v-model="form.db_password" show-password></el-input>
                </el-form-item>
            </div>
            <div class="auth" v-show="stepIdx === 2">
                <el-form-item label="Auth Table">
                    <el-select v-model="form.auth_table" placeholder="choose table for auth">
                        <el-option
                                v-for="item in dbTables"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Auth Column">
                    <el-select v-model="form.auth_column" placeholder="choose column for validate password">
                        <el-option
                                v-for="item in dbColumns"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="app" v-show="stepIdx === 3">
                <el-form-item label="App Dir" prop="app_dir">
                    <el-input v-model="form.app_dir"></el-input>
                </el-form-item>
                <el-form-item label="App Addr" prop="app_addr">
                    <el-input v-model="form.app_addr"></el-input>
                </el-form-item>
                <el-form-item label="App Package" prop="app_pkg">
                    <el-input v-model="form.app_pkg"></el-input>
                </el-form-item>
            </div>
            <div class="res" v-show="stepIdx === 4">
                <h3 style="text-align: center" v-if="app"> app codebase is at {{app.app_dir}}</h3>
                <pre v-text="JSON.stringify(app, null, 2)"></pre>
            </div>
            <el-form-item>
                <el-button type="primary" @click="doNext" v-show="btnNtitle" v-text="btnNtitle"></el-button>
                <el-button @click="doPrevious" v-show="btnPtitle" v-text="btnPtitle"></el-button>

                <el-link style="margin-left: 40px" v-bind:href="dlURL" v-show="dlURL !== ''" target="_blank"
                         type="success">Download Code Files
                </el-link>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    };

    export default {
        name: "GinbroGen",
        data() {
            return {
                rules: {
                    db_addr: [
                        {required: true, message: 'data base host and port', trigger: 'blur'},
                    ],
                    db_name: [
                        {required: true, message: 'database name', trigger: 'blur'}
                    ],
                    db_user: [
                        {type: 'date', required: true, message: 'database connection user', trigger: 'blur'}
                    ],
                    db_password: [
                        {type: 'date', required: true, message: 'database connection password', trigger: 'blur'}
                    ],
                    app_dir: [
                        {type: 'date', required: true, message: 'app directory', trigger: 'blur'}
                    ],
                    app_addr: [
                        {type: 'date', required: true, message: 'app listening address', trigger: 'blur'}
                    ],
                    app_pkg: [
                        {type: 'date', required: true, message: 'app Golang package name', trigger: 'blur'}
                    ]
                },
                btnNtitle: "Next",
                btnPtitle: "",
                stepIdx: 1,
                schema: [],
                app: null,
                form: {
                    auth_table: "",
                    auth_column: "",
                    app_dir: '/ginbroRock',
                    app_addr: '127.0.0.1:5555',
                    app_pkg: 'ginbroSon',
                    db_user: 'root',
                    db_password: '',
                    db_name: 'venom',
                    db_addr: '127.0.0.1:3306',
                    db_type: 'mysql',
                    db_char: 'utf8',
                }
            }
        },
        computed: {
            dlURL() {
                let app = this.app;
                if (app) {
                    let token = localStorage.getItem("token");
                    return `/api/ginbro/dl?_t=${token}&p=${app.app_dir}`
                } else {
                    return '';
                }
            },
            dbTables() {
                let tables = [];
                this.schema.forEach(function (element) {
                    tables.push(element.TableName)
                });

                return tables.filter(onlyUnique)
            },
            dbColumns() {
                let cols = [];
                let thisTable = this.form.auth_table;
                this.schema.forEach(function (element) {
                    if (thisTable === element.TableName) {
                        cols.push(element.ColumnName)
                    }
                });
                return cols.filter(onlyUnique)
            },
        },
        watch: {
            // 如果 `question` 发生改变，这个函数就会运行
            stepIdx: function (nIdx) {
                if (nIdx === 1) {
                    this.app = null;
                    this.btnPtitle = "";
                    this.btnNtitle = "Next"
                } else if (nIdx === 4) {
                    this.btnPtitle = "";
                    this.btnNtitle = "Again"

                } else if (nIdx === 3) {
                    this.app = null;
                    this.btnPtitle = "Previous";
                    this.btnNtitle = "Generate"
                } else if (nIdx === 2) {
                    this.app = null;
                    this.btnPtitle = "Previous";
                    this.btnNtitle = "Next"
                } else {
                    this.app = null;
                    this.btnPtitle = "Previous";
                    this.btnNtitle = "Next"
                }
            }
        },
        methods: {
            apiFetchDb() {
                this.$http.post('api/ginbro/db', this.form).then(res => {
                    if (res) {
                        this.schema = res.data;
                        this.stepIdx = 2;
                    }
                })
            },
            apiGenCode() {
                this.$http.post('api/ginbro/gen', this.form).then(res => {
                    if (res) {
                        this.app = res.data;
                        this.stepIdx = 4;
                    }
                })
            },
            doNext() {
                if (this.stepIdx === 1) {
                    this.apiFetchDb();
                    return
                }
                if (this.stepIdx === 3) {
                    this.apiGenCode();
                    return
                }
                this.stepIdx++;
                if (this.stepIdx > 4) {
                    this.stepIdx = 1;
                }
            },
            doPrevious() {
                this.stepIdx--;
                if (this.stepIdx < 1) {
                    this.stepIdx = 1;
                }
            }
        }
    }
</script>

<style scoped>
    .el-steps {
        margin-bottom: 20px;
    }

    .el-form-item {
        margin-bottom: 12px;
    }

</style>