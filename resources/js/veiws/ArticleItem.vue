<template>
    <a :href="article.url" class="articleList__item" :class="'category__color--' + article.subject">
    <div class="articleList__item--image" :style="'background-image: url(' + article.image + ');'"></div>
    <div class="articleList__item--headline">{{article.title}}</div>
    <i class="category__icon" :class="'category__icon--' + article.subject + ' ' + (article.language == 'nb' ? 'entry__category--twoOfTwo' : 'entry__category--single')"></i>
        <div v-if="article.teaser" class="articleList__item--teaser">{{article.teaser}}</div>
        <i v-if="article.language == 'nb'" class="flag__icon--flagNo entry__category--oneOfTwo"></i>
    </a>
</template>
<script>
export default {
    props: {
        article: {
            type: Object,
            required: true
        }
    }
};
</script>