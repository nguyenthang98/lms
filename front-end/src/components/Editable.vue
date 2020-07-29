<template>
    <div>
        <div class="editable-view" v-show="!showEdit" @click="showEdit = !showEdit">{{value}}</div>
        <input class="editable-input" :type="type" v-show="showEdit" v-bind:value="value" @blur="onValueChanged($event.target.value)"/>
    </div>
</template>
<style lang="css" scoped>
.editable-view {
    min-width: 1em;
    min-height: 1em;
}
.editable-input {
}
</style>
<script>
export default {
    props: ['getValue', 'setValue', 'type'],
    data: () => ({
        showEdit: false
    }),
    computed: {
        value: function() {
            return this.getValue();
        }
    },
    methods: {
        onValueChanged(newValue) {
            this.setValue(newValue);
            this.showEdit = !this.showEdit;
        }
    }
}
</script>
