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
                    displayData: [],
                    scoreboard: null,
                    countries: null,
                    testingTesting: "hello"
                }
            },
            mounted() {
                // Get THM scoreboard data
                console.log("mounted");
                axios.get("/actions/haxor/thm")
                    .then(response => {
                        this.scoreboard = response.data.scoreboard;
                        this.countries = response.data.contries;
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            methods: {
                myAccount(row){
                    if(row.username == "mEsUsah") {
                        return true;
                    }
                    return false;
                }
            },
            computed: {

            },
        });

        app.mount(this._mountpoint);
    }
}