import {createApp} from 'vue';
import axios from 'axios';
import {marked} from 'marked';
import DOMPurify from 'dompurify';
import ArticleItem from '../veiws/ArticleItem.vue';
import ArticleFilter from '../veiws/ArticleFilter.vue';

export default {
    _mountpoint: document.querySelector('[data-frontpage-filter-vue]'),
    init() {
        if (!this._mountpoint) {
            return;
        }

        const mountpoint = this._mountpoint;

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
                    selectedSubjects: [],
                    selectedLanguages: [],
                    showFilters: false,
                    aiSearchEnabled: false,
                    aiSearchLabel: mountpoint.dataset.aiSearchLabel,
                    searchLabel: mountpoint.dataset.searchPlaceholder,
                    aiSearchPlaceholder: mountpoint.dataset.aiSearchPlaceholder,
                    aiSearchErrorMessage: mountpoint.dataset.aiSearchError,
                    aiSearchNoResultsMessage: mountpoint.dataset.aiSearchNoResults,
                    askLoading: false,
                    askSubmitted: false,
                    askAnswer: null,
                    askSources: [],
                    askError: null,
                }
            },
            mounted() {
                this.getArticles();
            },
            methods: {
                askAi(){
                    const query = this.searchQuery.trim();

                    if (!this.aiSearchEnabled || query.length < 2) {
                        return;
                    }

                    this.askLoading = true;
                    this.askError = null;
                    this.askAnswer = null;
                    this.askSources = [];

                    axios.get("/actions/ai-search/ask", { params: { query } })
                    .then(response => {
                        this.askAnswer = response.data.answer || null;
                        this.askSources = response.data.sources || [];
                    })
                    .catch(e => {
                        console.log(e);
                        this.askAnswer = null;
                        this.askSources = [];
                        this.askError = this.aiSearchErrorMessage;
                    })
                    .finally(() => {
                        this.askLoading = false;
                        this.askSubmitted = true;
                    });
                },
                resetAskState(){
                    this.askLoading = false;
                    this.askSubmitted = false;
                    this.askAnswer = null;
                    this.askSources = [];
                    this.askError = null;
                },
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
                                   || article.intro.toLowerCase().includes(this.searchQuery.toLowerCase())
                        });
                    } else {
                        this.filteredArticles = this.articles;
                    }

                    if (this.selectedLanguages.length > 0) {
                        this.filteredArticles = this.filteredArticles.filter(article => {
                            return this.selectedLanguages.includes(article.language);
                        });
                    }
                    if (this.selectedSubjects.length > 0) {
                        this.filteredArticles = this.filteredArticles.filter(article => {
                            return this.selectedSubjects.includes(article.subject);
                        });
                    }
                },
                updateLanguageFilters(language) {
                    if(this.selectedLanguages.includes(language)){
                        this.selectedLanguages = this.selectedLanguages.filter(l => l !== language);
                    } else {
                        this.selectedLanguages.push(language);
                    }
                    this.filterArticles();
                },
                updateSubjectFilters(subject) {
                    if(this.selectedSubjects.includes(subject)){
                        this.selectedSubjects = this.selectedSubjects.filter(s => s !== subject);
                    } else {
                        this.selectedSubjects.push(subject);
                    }
                    this.filterArticles();
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
                },
                searchPlaceholder(){
                    return this.aiSearchEnabled ? this.aiSearchPlaceholder : this.searchLabel;
                },
                askMatchedArticles(){
                    return this.askSources
                        .map(source => this.articles.find(article => article.uuid === source.document_uid))
                        .filter(Boolean);
                },
                renderedAskAnswer(){
                    if (!this.askAnswer) {
                        return '';
                    }

                    const html = marked.parse(this.askAnswer, { breaks: true, gfm: true });

                    // Sanitize since this is rendered via v-html — the LLM's answer shouldn't be
                    // able to smuggle in anything beyond the formatting marked itself produces.
                    return DOMPurify.sanitize(html);
                }
            },
            watch: {
                searchQuery: 'filterArticles',
                articles: 'filterArticles',
                aiSearchEnabled(enabled){
                    if (!enabled) {
                        this.resetAskState();
                    }
                },
            }
        });

        app.mount(mountpoint);
    }
}