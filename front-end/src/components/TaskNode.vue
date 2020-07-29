<template>
    <div>
        <span>
            <h2>{{title}}</h2>
            <h4>{{description}}</h4>
            <h4>Start: {{formatDate(startDate)}}</h4>
            <h4>Due: {{formatDate(dueDate)}}</h4>
        </span>
        <span>
            <button @click="viewTask()">View</button>
            <button @click="deleteTask()">Delete</button>
        </span>
    </div>
</template>
<script>
import api from "../services/api";
export default {
    props: ["id", "title", "description", 'startDate', 'dueDate', 'onDelete'],
    methods: {
        viewTask: function() {
            window.location = `/#/task/${this.id}`;
        },
        deleteTask: function() {
            const res = confirm("Are you sure to delete this task?");
            if (res) {
                api.removeTask(this.id);
                this.onDelete && this.onDelete();
            }
        },
        formatDate: (_date) => {
            const date = new Date(_date);
            return `${date.toTimeString()} - ${date.toDateString()}`;
        },
    }
}
</script>
