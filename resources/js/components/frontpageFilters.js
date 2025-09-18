import {createApp} from 'vue/dist/vue.esm-bundler.js';
import axios from 'axios';
import ArticleItem from '../veiws/ArticleItem.vue';
import ArticleFilter from '../veiws/ArticleFilter.vue';

export default {
    _mountpoint: document.querySelector('[data-frontpage-filter-vue]'),
    init() {
        if (!this._mountpoint) {
            return;
        }

        const app = createApp({
            delimiters: ['[[', ']]'],
            components: {
                ArticleItem,
                ArticleFilter,
            },
            data() {
                return {
                    articles: [],
                    loaded: false,
                    searchQuery: '',
                    filteredArticles: [],
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
                },
                filterArticles() {
                    if (this.searchQuery.length > 1) {
                        this.filteredArticles = this.articles.filter(article => {
                            return article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
                                   || (article.teaser && article.teaser.toLowerCase().includes(this.searchQuery.toLowerCase()))
                                   || article.subject.toLowerCase().includes(this.searchQuery.toLowerCase())
                                   || article.intro.toLowerCase().includes(this.searchQuery.toLowerCase());
                        });
                    } else {
                        this.filteredArticles = this.articles;
                    }
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
            watch: {
                searchQuery: 'filterArticles',
                articles: 'filterArticles',
            }
        });

        app.mount(this._mountpoint);
    }
}