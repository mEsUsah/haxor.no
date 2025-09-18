<template>
    <input type="checkbox">{{type}}</input>
</template>
<script>
export default {
    props: {
        type: {
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