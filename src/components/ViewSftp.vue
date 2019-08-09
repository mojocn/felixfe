<style scoped>

    .custom-tree-node {
        width: 100%;
    }

    .sftp-tree {
        border-radius: 4px;
        color: white;
        padding: 30px;
        background: black;
        margin: 40px 30px 30px 30px;
    }

    .el-col > a {
        margin-right: 20px;
    }

    .file-name {
        margin: 8px !important;
    }

    .isdir {
        font-weight: lighter;
    }


</style>
<template>
    <section>
        <el-row justify="center" type="flex" class="toolbar" align="middle">
            <el-col :span="6">
                <el-button icon="el-icon-back" @click="$router.go(-1)" type="primary"></el-button>
            </el-col>
            <el-col :span="18"><h2> Sftp: {{user}} @ {{name}}</h2></el-col>
        </el-row>

        <el-tree
                class="sftp-tree"
                :load="loadNode"
                lazy
                :indent="30"
                :default-expanded-keys="['/']"
                :data="data"
                :props="defaultProps"
                node-key="path">
            <el-row :gutter="20" :class="{'custom-tree-node':true,'isdir':data.is_dir}" slot-scope="{ node, data }"
                    justify="center" type="flex">
                <el-col :span="1">
                    <el-link icon="el-icon-folder" type="success" v-if="data.is_dir"></el-link>
                    <el-link icon="el-icon-document-checked" type="primary" v-if="!data.is_dir"></el-link>
                </el-col>
                <el-col :span="4">
                    <i class="file-name">{{ node.label }}</i>

                </el-col>
                <el-col :span="4" title="file size (byte)">
                    <i class="file-size">{{ data.size }}</i>

                </el-col>
                <el-col :span="3" title="mod">
                    <i class="file-mod">{{ data.mod }}</i>

                </el-col>
                <el-col :span="4" title="modify time">
                    <i class="file-time">{{ data.time }}</i>
                </el-col>

                <el-col :span="1">
                    <el-link
                            v-if="data.is_dir"
                            type="warning"
                            title="upload"
                            @click="handleUploadDialog(data)"
                            icon="el-icon-upload">
                    </el-link>
                </el-col>
                <el-col :span="1">

                    <el-link
                            v-if="!data.is_dir"
                            type="success"
                            @click="handleDownload(data)"
                            title="download"
                            icon="el-icon-download">
                    </el-link>
                </el-col>
                <el-col :span="1">
                    <el-link
                            v-if="!data.is_dir"
                            type="primary"
                            title="cat"
                            @click="handleSftpCat(data)"
                            icon="el-icon-view">
                    </el-link>
                </el-col>
                <el-col :span="1">
                    <el-link
                            v-if="node.level != 1"
                            type="danger"
                            @click="handleDelete(data)"
                            title="rm"
                            icon="el-icon-delete-solid">

                    </el-link>
                </el-col>
                <el-col :span="1">
                    <el-link
                            v-if="node.level != 1"
                            title="rename"
                            type="info"
                            @click="handleRename(data)"
                            icon="el-icon-edit">
                    </el-link>
                </el-col>
                <el-col :span="1">
                    <el-link
                            title="mkdir"
                            v-if="data.is_dir"
                            type="primary"
                            @click="handleMkdir(data)"
                            icon="el-icon-folder-add">
                    </el-link>
                </el-col>
            </el-row>
            <!--<span class="custom-tree-node" slot-scope="{ node, data }">-->
            <!--<i class="el-icon-folder" v-if="data.is_dir"></i>-->
            <!--<i class="el-icon-document-checked" v-if="!data.is_dir"></i>-->
            <!--<i class="file-name">{{ node.label }}</i>-->
            <!--<i class="file-size" >{{ data.size }}</i>-->
            <!--<i class="file-mod">{{ data.mod }}</i>-->
            <!--<i class="file-time">{{ data.time }}</i>-->
            <!--<span class="sftp-action">-->
            <!--<el-link-->
            <!--v-if="data.is_dir"-->
            <!--type="warning"-->
            <!--@click="handleUploadDialog(data)"-->
            <!--icon="el-icon-upload">-->
            <!--</el-link>-->
            <!--<el-link-->
            <!--v-if="!data.is_dir"-->
            <!--type="success"-->
            <!--@click="handleDownload(data)"-->
            <!--icon="el-icon-download">-->
            <!--</el-link>-->

            <!--<el-link-->
            <!--v-if="!data.is_dir"-->
            <!--type="primary"-->
            <!--@click="handleSftpCat(data)"-->
            <!--icon="el-icon-view">-->
            <!--</el-link>-->
            <!--<el-link-->
            <!--type="danger"-->
            <!--@click="handleDelete(data)"-->
            <!--icon="el-icon-delete-solid">-->
            <!--</el-link>-->
            <!--<el-link-->
            <!--v-if="node.level != 1"-->
            <!--type="info"-->
            <!--@click="handleRename(data)"-->
            <!--icon="el-icon-edit">-->
            <!--</el-link>-->
            <!--<el-link-->
            <!--v-if="data.is_dir"-->
            <!--type="primary"-->
            <!--@click="handleMkdir(data)"-->
            <!--icon="el-icon-folder-add">-->
            <!--</el-link>-->
            <!--</span>-->

            <!--</span>-->
        </el-tree>

        <el-dialog
                title="Sftp Upload files to dir"
                :visible.sync="uploadDialogVisible"
                width="30%"
                center>
            <el-upload
                    name="file"
                    multiple
                    :on-error="handleUploadError"
                    :on-success="handleUploadSuccess"
                    :action="uploadUrl"
                    :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-dialog>

        <el-dialog
                title="File View"
                :visible.sync="catDialogVisible"
                width="50%"
                center>
            <pre v-text="catData" class="cat-view"></pre>
        </el-dialog>

    </section>


</template>


<script>
    export default {
        name: "ViewSftp",
        props: ['ID', 'name', 'user'],
        data() {
            return {
                logData: "",
                uploadUrl: '',
                fileList: [],
                uploadDialogVisible: false,
                logDialogV: false,
                data: [{name: "$HOME", path: "~", is_dir: true}, {name: "/", path: "/", is_dir: true}],
                q: "",
                id: 0,
                path: "",
                defaultProps: {
                    label: 'name',
                    isLeaf(data) {
                        return !data.is_dir
                    }
                }
            };
        },
        mounted() {
        },
        created() {
        },
        methods: {

            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([
                        {name: "$HOME", path: "$HOME", is_dir: true},
                        {name: "/", path: "/", is_dir: true}
                    ]);
                } else {
                    let path = node.data.path;
                    this.$http
                        .get(`api/sftp/${this.id}`, {params: {path}})
                        .then(res => {
                            if (res) {
                                resolve(res.data)
                            }
                        })
                }
            },
            handleSftpCat(data) {
                let path = data.path;
                this.$http.get(`api/sftp/${this.id}/cat`, {params: {path}}).then(res => {
                    if (res) {
                        this.catData = res.data;
                    }
                    this.catDialogVisible = true
                })
            },
            handleUploadSuccess(res, file) {
                if (!res.ok) {
                    this.$message.error(res.msg + file.name)
                }
            },
            handleUploadError(err, file) {
                this.$message.error(err + file.name)
            },
            handleDelete(data) {
                let path = data.path;
                this.$http.get(`api/sftp/${this.id}/rm`, {params: {path}}).then(res => {
                    if (res) {
                        this.$message.success(path + " has been deleted!")
                    }
                })
            },
            handleMkdir(data) {

                this.$prompt(data.path, 'mkdir', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    inputPlaceholder: data.path
                }).then(({value}) => {
                    let path = `${data.path}/${value}`;
                    this.$http.get(`api/sftp/${this.id}/mkdir`, {params: {path}}).then(res => {
                        if (res) {
                            this.$message.success(path + " has been made!")
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'mkdir command has been canceled'
                    });
                });
            },
            handleRename(data) {
                this.$prompt(data.path, 'rename', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    inputPlaceholder: data.path
                }).then(({value}) => {
                    let opath = data.path;
                    let npath = value;
                    this.$http.get(`api/sftp/${this.id}/rename`, {params: {opath, npath}}).then(res => {
                        if (res) {
                            this.$message.success(opath + " has been rename to " + npath)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'rename command has been canceled'
                    });
                });

            },
            handleDownload(data) {
                window.open(`api/sftp/${this.id}/dl?path=${data.path}`, '_blank');
            },
            handleUploadDialog(data) {
                this.uploadDialogVisible = true;
                this.uploadUrl = `api/sftp/${this.id}/up?path=${data.path}`
            }

        }
    };
</script>
