<template>
    <input type="checkbox" :checked="selected" @change="$emit('change', name)">{{name}}</input>
</template>
<script>
export default {
    props: {
        subject: {
            type: String,
            required: false
        },
        language: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: true
        },
        selected: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    emits: ['change'],
};
</script>