import {createApp} from 'vue/dist/vue.esm-bundler.js';
import axios from 'axios';

export default {
    _mountpoint: document.querySelector('[data-thm-vue]'),
    init() {
        if (!this._mountpoint) {
            return;
        }

        const app = createApp({
            delimiters: ['[[', ']]'],
            data() {
                return {
                    scoreboard: [],
                    countries: null,
                    checkedCountries: null
                }
            },
            mounted() {
                // Get THM scoreboard data
                console.log("mounted");
                axios.get("/actions/haxor/thm")
                    .then(response => {
                        this.scoreboard = response.data.scoreboard;
                        this.countries = response.data.contries;
                        this.checkedCountries = response.data.contries;
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            methods: {
                myAccount(username){
                    if(username == "mEsUsah") {
                        return true;
                    }
                    return false;
                },
                makeReadableScore(score){
                    let scoreString = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    return scoreString;
                }
            },
            computed: {
                filterCountries(){
                    let filteredScores = [];
                    this.scoreboard.forEach(score => {
                        this.checkedCountries.forEach(country => {
                            if (country == score.country){
                                filteredScores.push(score);
                            }
                        });
                    });
                    return filteredScores.slice(0,100);
                }
            },
        });

        app.mount(this._mountpoint);
    }
}