import {createApp} from 'vue/dist/vue.esm-bundler.js';
import axios from 'axios';
import ArticleItem from '../veiws/ArticleItem.vue';

export default {
    _mountpoint: document.querySelector('[data-frontpage-filter-vue]'),
    init() {
        if (!this._mountpoint) {
            return;
        }

        const app = createApp({
            delimiters: ['[[', ']]'],
            components: {
                ArticleItem
            },
            data() {
                return {
                    articles: [],
                    loaded: false,
                }
            },
            mounted() {
                this.getArticles();
            },
            methods: {
                getArticles(){
                    axios.get("/actions/haxor/articles/all")
                    .then(response => {
                        this.articles = response.data;
                        this.loaded = true;
                    })
                    .catch(e => {
                        console.log(e);
                    })
                }
            },
            computed: {
                articleSubjects(){
                    let subjects = [];
                    this.articles.forEach(article => {
                        if (!subjects.includes(article.subject)){
                            subjects.push(article.subject);
                        }
                    });
                    return subjects;
                },
                articleLanguages(){
                    let languages = [];
                    this.articles.forEach(article => {
                        if (!languages.includes(article.language)){
                            languages.push(article.language);
                        }
                    });
                    return languages;
                }
            },
        });

        app.mount(this._mountpoint);
    }
}