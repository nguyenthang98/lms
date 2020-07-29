<template>
    <div>
        <h1>Tasks</h1>
        <div>
            <button @click="addTask()">Add Task</button>
        </div>
        <div>
            <div v-for="task in tasks">
                <task-node :id="task._id" :title="task.title" :description="task.description" :start-date="task.startDate" :due-date="task.dueDate" :on-delete="onTaskDelete"></task-node>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../services/api";
import TaskNode from "./TaskNode.vue";
export default {
    components: { TaskNode },
    data: () => ({
        tasks: []
    }),
    mounted() {
        this.refreshTaskList();
    },
    methods: {
        addTask: function() {
            const appInst = this;
            this.$modal.show({
                template: `
                    <div style="padding: 1em 0px 0px;">
                        <div style="display: flex; margin: 1em 0.5em;">
                            <label style="flex: 2">Title</label>
                            <input style="flex: 4" v-model="title" type="text"/>
                        </div>
                        <div style="display: flex; margin: 1em 0.5em;">
                            <label style="flex: 2">Description</label>
                            <input style="flex: 4" v-model="description" type="text"/>
                        </div>
                        <div style="display: flex; margin: 1em 0.5em;">
                            <label style="flex: 2">Content</label>
                            <textarea style="flex: 4" rows="4" v-model="content" type="text"/>
                        </div>
                        <div style="display: flex; margin: 1em 0.5em;">
                            <label style="flex: 2">Start</label>
                            <input style="flex: 4" v-model="startDate" type="datetime-local"/>
                        </div>
                        <div style="display: flex; margin: 1em 0.5em;">
                            <label style="flex: 2">Due</label>
                            <input style="flex: 4" v-model="dueDate" type="datetime-local"/>
                        </div>
                        <div style="display: flex; margin-top: 2em;">
                            <button style="flex: 1; padding: 1em; border: 0px;" @click="cancelBtnClicked">Cancel</button>
                            <button style="flex: 1; padding: 1em; border: 0px;" @click="okBtnClicked">Ok</button>
                        </div>
                    </div>
                `,
                data: () => ({
                    title: "",
                    description: "",
                    content: "",
                    startDate: null,
                    dueDate: null
                }),
                methods: {
                    cancelBtnClicked() {
                        this.$emit('close');
                    },
                    okBtnClicked() {
                        api.createTask({
                            title: this.title,
                            description: this.description,
                            content: this.content,
                            startDate: this.startDate,
                            dueDate: this.dueDate,
                        }).then(() => {
                            appInst.refreshTaskList();
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
        },
        refreshTaskList: function() {
            api.listTask()
                .then(res => {
                    this.tasks = res.data;
                })
        },
        onTaskDelete: function() {
            this.refreshTaskList();
        }
    }
}
</script>
