<template>
    <input type="checkbox" 
        class="article-filter"
        :class="'article-filter--' + name"
        :checked="selected" 
        @change="$emit('change', name)"
        :aria-label="(selected ? 'Deselect ' : 'Select ') + (subject ? subject : (language == 'nb' ? 'Norwegian' : 'English')) + ' filter'"
    ></input>
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