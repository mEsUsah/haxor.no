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
                    askAnswerPending: false,
                    askAnswer: null,
                    askAnswerMaxHeight: '0px',
                    askResultMinHeight: '0px',
                    askSources: [],
                    askArticlesRevealed: false,
                    askError: null,
                    articlesRevealed: false,
                    _askAnswerRevealTimer: null,
                    _askArticleRevealTimer: null,
                    _searchDebounceTimer: null,
                    _articlesRevealTimer: null,
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
                    this.askAnswerPending = false;
                    this.askError = null;
                    this.askAnswer = null;
                    this.askSources = [];
                    this.askArticlesRevealed = false;
                    this.stopRevealingAnswer();
                    this.stopRevealingArticles();

                    // Reset both before re-measuring below — otherwise the previous answer's
                    // min-height is still in effect while we measure the new spinner's "natural"
                    // height, inflating it to match the old box, which then only ever grows
                    // larger across successive queries instead of resetting each time.
                    this.askAnswerMaxHeight = '0px';
                    this.askResultMinHeight = '0px';

                    // Wait for the loading spinner to actually be on screen, then measure its
                    // height — that's what the answer box should visually grow from, instead of
                    // starting from fully closed. It also becomes a min-height floor on the body
                    // wrapper, so swapping to a short error/no-results message never shrinks the
                    // box below however tall the spinner made it.
                    this.$nextTick(() => {
                        const loadingHeight = (this.$refs.aiResultBody ? this.$refs.aiResultBody.offsetHeight : 0) + 'px';
                        this.askAnswerMaxHeight = loadingHeight;
                        this.askResultMinHeight = loadingHeight;

                        axios.get("/actions/ai-search/ask", { params: { query } })
                        .then(response => {
                            const answer = response.data.answer || null;
                            const sources = response.data.sources || [];

                            // Remove the loading indicator right away, but hold off on showing
                            // anything (the box just sits empty) for a beat before the text and
                            // the box's resize both happen together.
                            this.askLoading = false;
                            this.askAnswerPending = true;

                            this._askAnswerRevealTimer = setTimeout(() => {
                                this.askAnswer = answer;
                                this.askSources = sources;
                                this.askAnswerPending = false;

                                // Wait a frame after the (still-collapsed) answer box is in the
                                // DOM before growing it, so the browser actually animates the
                                // transition instead of snapping straight to the open height.
                                // Target its real content height (scrollHeight ignores the
                                // max-height clip) instead of an arbitrary cap, so the animation
                                // takes the full duration regardless of answer length.
                                this.$nextTick(() => {
                                    const target = this.$refs.aiAnswerEl ? this.$refs.aiAnswerEl.scrollHeight : 2000;

                                    requestAnimationFrame(() => {
                                        requestAnimationFrame(() => {
                                            this.askAnswerMaxHeight = target + 'px';
                                        });
                                    });
                                });

                                // All matched articles are already in the DOM (so the flex-wrap
                                // layout never reflows) — this flag just triggers their opacity
                                // transition; each one's own transition-delay (see the template)
                                // staggers when it actually starts fading in.
                                this.stopRevealingArticles();
                                this._askArticleRevealTimer = setTimeout(() => {
                                    this.askArticlesRevealed = true;
                                }, 500);
                            }, 500);
                        })
                        .catch(e => {
                            console.log(e);
                            this.askLoading = false;
                            this.askAnswerPending = false;
                            this.askAnswer = null;
                            this.askSources = [];
                            this.askError = this.aiSearchErrorMessage;
                        })
                        .finally(() => {
                            this.askSubmitted = true;
                        });
                    });
                },
                stopRevealingAnswer(){
                    if (this._askAnswerRevealTimer) {
                        clearTimeout(this._askAnswerRevealTimer);
                        this._askAnswerRevealTimer = null;
                    }
                },
                stopRevealingArticles(){
                    if (this._askArticleRevealTimer) {
                        clearTimeout(this._askArticleRevealTimer);
                        this._askArticleRevealTimer = null;
                    }
                },
                resetAskState(){
                    this.askLoading = false;
                    this.askSubmitted = false;
                    this.askAnswerPending = false;
                    this.askAnswer = null;
                    this.askAnswerMaxHeight = '0px';
                    this.askResultMinHeight = '0px';
                    this.askSources = [];
                    this.askArticlesRevealed = false;
                    this.stopRevealingAnswer();
                    this.stopRevealingArticles();
                    this.askError = null;
                },
                getArticles(){
                    axios.get("/actions/haxor/articles/all")
                    .then(response => {
                        this.articles = response.data;
                        this.loaded = true;
                        this.filterArticles();
                    })
                    .catch(e => {
                        console.log(e);
                    })
                },
                filterArticles() {
                    // Clear immediately so the old results disappear before the new set fades
                    // in, instead of the list just swapping content in place.
                    this.filteredArticles = [];
                    this.articlesRevealed = false;
                    clearTimeout(this._articlesRevealTimer);

                    this._articlesRevealTimer = setTimeout(() => {
                        let filtered;

                        if (this.searchQuery.length > 1) {
                            filtered = this.articles.filter(article => {
                                return article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
                                       || (article.teaser && article.teaser.toLowerCase().includes(this.searchQuery.toLowerCase()))
                                       || article.subject.toLowerCase().includes(this.searchQuery.toLowerCase())
                                       || article.intro.toLowerCase().includes(this.searchQuery.toLowerCase())
                            });
                        } else {
                            filtered = this.articles;
                        }

                        if (this.selectedLanguages.length > 0) {
                            filtered = filtered.filter(article => {
                                return this.selectedLanguages.includes(article.language);
                            });
                        }
                        if (this.selectedSubjects.length > 0) {
                            filtered = filtered.filter(article => {
                                return this.selectedSubjects.includes(article.subject);
                            });
                        }

                        this.filteredArticles = filtered;
                        this.revealFilteredArticles();
                    }, 200);
                },
                revealFilteredArticles(){
                    this.articlesRevealed = false;

                    // A single requestAnimationFrame after $nextTick doesn't guarantee the
                    // browser actually paints the "not revealed" state before we flip it —
                    // depending on how busy the page is (very much the case during initial
                    // load), both changes can land in the same paint and the transition never
                    // plays, so the whole list just appears at once instead of staggering. The
                    // nested rAF guarantees one full paint happens in between.
                    this.$nextTick(() => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                this.articlesRevealed = true;
                            });
                        });
                    });
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
                searchQuery(){
                    clearTimeout(this._searchDebounceTimer);
                    this._searchDebounceTimer = setTimeout(() => {
                        this.filterArticles();
                    }, 300);
                },
                aiSearchEnabled(enabled){
                    if (!enabled) {
                        this.resetAskState();

                        // filteredArticles/articlesRevealed kept their values from before AI
                        // search was switched on (the grid was only unmounted, not reset), so
                        // simply remounting it would show everything already in its revealed
                        // state with nothing to transition from. Re-run the filter (the search
                        // query may have changed while in AI mode anyway) so it clears and
                        // replays the one-by-one reveal instead.
                        this.filterArticles();
                    }
                },
            }
        });

        app.mount(mountpoint);
    }
}