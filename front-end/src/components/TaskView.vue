<template>
    <div>
        <h1>Title: {{title}}</h1>
        <h3>Description: {{description}}</h3>
        <h3>Task id: {{$route.params.id}}</h3>

        <p>{{content}}</p>

        <div>
            <button @click="importSubmissions()">IMPORT</button>
            <button @click="clearSubmissions()">CLEAR</button>
            <button @click="addSubmission()">Add</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Student Id</th>
                    <th>Git</th>
                    <th>Web</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Del</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="sub in submissions">
                    <td>{{sub.studentId}}</td>
                    <td><a v-bind:href="sub.git" target="_blank">{{sub.git}}</a></td>
                    <td><a v-bind:href="sub.web" target="_blank">{{sub.web}}</a></td>
                    <td>{{formatDate(sub.submissionDate)}}</td>
                    <td><Editable :get-value="getValueFn(sub)" :set-value="setValueFn(sub)" type="number"/></td>
                    <td><button @click="deleteSubmission(sub._id)">X</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style lang="css" scoped>
table > thead th {
    border: 1px solid black;
    background: lightgrey;
}
</style>
<script>
import api from "../services/api";
import parse from "csv-parse";
import Editable from "./Editable.vue";

export default {
    components: {Editable},
    data: () => ({
        title: "",
        description: "",
        content: "",
        submissions: []
    }),
    mounted() {
        // load task info
        api.getTask(this.$route.params.id)
            .then(res => {
                const taskInfo = res.data;
                this.title = taskInfo.title;
                this.description = taskInfo.description;
                this.content = taskInfo.content;
            });
        // load submission info
        this.refreshSubmissionList();
        /*
        api.listSubmissionByTask(this.$route.params.id)
            .then(res => {
                const subs = res.data;
                subs.forEach(sub => {
                    if (!sub.score)
                        sub.score = -1;
                })
                this.submissions = subs;
            })
        */
    },
    methods: {
        formatDate: (_date) => {
            const date = new Date(_date);
            return `${date.toTimeString()} - ${date.toDateString()}`;
        },
        importSubmissions: function() {
            const inputEle = document.createElement('input');
            inputEle.type = "file";
            inputEle.onchange = (event) => {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    parse(e.target.result, {
                        comment: "#",
                        columns: true
                    }, (err, output) => {
                        console.log(output);
                        const promises = [];
                        output.forEach(sub => {
                            promises.push(new Promise(resolve => {
                                this.createSubmission(sub, resolve, false);
                            }))
                        })
                        Promise.all(promises)
                            .then(() => {
                                this.refreshSubmissionList();
                            })
                    })
                };
                reader.readAsText(file);
            }
            inputEle.click();
        },
        clearSubmissions: function() {
            const res = confirm("Clear all submissions?");
            if (res) {
                const promises = [];
                this.submissions.forEach(sub => {
                    promises.push(new Promise(resolve => {
                        this.deleteSubmission(sub._id, resolve, false, false);
                    }));
                })
                Promise.all(promises)
                    .then(() => {
                        this.refreshSubmissionList();
                    })
            }
        },
        getValueFn: function(src) {
            return () => {
                return src.score
            }
        },
        setValueFn: function(src) {
            return (newValue) => {
                console.log(`setting value from ${src.score} to ${newValue}`);
                src.score = newValue;
                api.editSubmission(src);
            }
        },
        refreshSubmissionList: function() {
            api.listSubmissionByTask(this.$route.params.id)
                .then(res => {
                        const subs = res.data;
                        subs.forEach(sub => {
                                if (!sub.score)
                                sub.score = -1;
                                })
                        this.submissions = subs;
                        })
        },
        createSubmission: function(sub, cb, doRefresh = true) {
            api.createSubmission(Object.assign(sub, {taskId: this.$route.params.id}))
                .then(res => {
                    doRefresh && this.refreshSubmissionList();
                    cb && cb();
                })
        },
        deleteSubmission: function(id, cb, doRefresh = true, _confirm = true) {
            let res = _confirm;
            if (_confirm) {
                res = confirm("Are you sure delete this record?");
            }
            if (res) {
                api.removeSubmission(id)
                    .then(res => {
                            doRefresh && this.refreshSubmissionList();
                            cb && cb();
                            })
            }
        },
        addSubmission: function() {
            const appInst = this;
            this.$modal.show({
                template: `
                    <div style="padding: 1em 0px 0px;">
                        <div style="display: flex; margin: 1em 0.5em;">
                            <label style="flex: 2">StudentId</label>
                            <input style="flex: 4" v-model="studentId" type="text"/>
                        </div>
                        <div style="display: flex; margin: 1em 0.5em;">
                            <label style="flex: 2">git</label>
                            <input style="flex: 4" v-model="git" type="text"/>
                        </div>
                        <div style="display: flex; margin: 1em 0.5em;">
                            <label style="flex: 2">web</label>
                            <input style="flex: 4" v-model="web" type="text"/>
                        </div>
                        <div style="display: flex; margin: 1em 0.5em;">
                            <label style="flex: 2">score</label>
                            <input style="flex: 4" v-model="score" type="number"/>
                        </div>
                        <div style="display: flex; margin-top: 2em;">
                            <button style="flex: 1; padding: 1em; border: 0px;" @click="cancelBtnClicked">Cancel</button>
                            <button style="flex: 1; padding: 1em; border: 0px;" @click="okBtnClicked">Ok</button>
                        </div>
                    </div>
                `,
                data: () => ({
                    studentId: "",
                    git: "",
                    web: "",
                    score: -1
                }),
                methods: {
                    cancelBtnClicked() {
                        this.$emit('close');
                    },
                    okBtnClicked() {
                        appInst.createSubmission({
                            studentId: this.studentId,
                            git: this.git,
                            web: this.web,
                            score: this.score
                        });
                        this.$emit('close');
                    }
                },
                props: []
            }, { }, {
                height: 'auto'
            }, {
                'before-close': event => {}
            });
        }
    }
}
</script>
