<template>
    <div class="qcode-quiz">
        <div class="qcode-quiz__header">
            <div class="score-board">
                <span class="portfolioTask__score">{{ score }} / {{ attempts }}</span>
                <span class="portfolioTask__score">Streak: {{ streak }}</span>
            </div>

            <div class="mode-selector">
                <button
                    :class="['mode-btn', { active: mode === 'codeToMeaning' }]"
                    @click="setMode('codeToMeaning')"
                >Code → Meaning</button>
                <button
                    :class="['mode-btn', { active: mode === 'meaningToCode' }]"
                    @click="setMode('meaningToCode')"
                >Meaning → Code</button>
            </div>
        </div>

        <div class="question-card">
            <div class="question-label">
                {{ mode === 'codeToMeaning' ? 'What does this Q-code mean?' : 'Which Q-code matches this description?' }}
            </div>
            <div :class="['question-display', mode === 'meaningToCode' ? 'question-display--text' : '']">
                {{ questionText }}
            </div>
        </div>

        <div class="answers-grid">
            <button
                v-for="(answer, index) in currentAnswers"
                :key="index"
                :class="['answer-btn', getAnswerClass(answer)]"
                :disabled="answered"
                @click="selectAnswer(answer)"
            >
                <template v-if="mode === 'codeToMeaning'">
                    <span class="answer-line">{{ answer.question }}</span>
                    <span class="answer-line">{{ answer.answer }}</span>
                </template>
                <template v-else>{{ answer.code }}</template>
            </button>
        </div>

        <div v-if="answered" :class="['feedback', isCorrect ? 'success' : 'error']">
            <div class="feedback__status">{{ isCorrect ? '✅ Correct!' : '❌ Incorrect!' }}</div>
            <div class="feedback__examples">
                <span class="feedback__ex-q">{{ currentQuestion.questionExample }}</span>
                <span class="feedback__ex-sep"> → </span>
                <span class="feedback__ex-a">{{ currentQuestion.answerExample }}</span>
            </div>
            <div v-if="currentQuestion.scale.length" class="feedback__scale">
                <span v-for="(label, i) in currentQuestion.scale" :key="i" class="feedback__scale-item">
                    {{ i + 1 }} = {{ label }}
                </span>
            </div>
            <div class="feedback__explanation">{{ currentQuestion.explanation }}</div>
        </div>

        <button v-if="answered" class="btn-next" @click="nextQuestion">Next →</button>

        <button class="btn-reference" @click="showModal = true">Q-code reference</button>

        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal">
                <div class="modal__header">
                    <h2 class="modal__title">Q-code Reference</h2>
                    <button class="modal__close" @click="showModal = false">✕</button>
                </div>
                <div class="modal__body">
                    <div v-for="q in qCodes" :key="q.code" class="modal__entry">
                        <div class="modal__code">{{ q.code }}</div>
                        <div class="modal__desc">
                            <div class="modal__row">
                                <span class="modal__text">{{ q.question }}</span>
                                <span class="modal__example">{{ q.questionExample }}</span>
                            </div>
                            <div class="modal__row">
                                <span class="modal__text">{{ q.answer }}</span>
                                <span class="modal__example">{{ q.answerExample }}</span>
                            </div>
                            <div v-if="q.scale.length" class="modal__scale">
                                <span v-for="(label, i) in q.scale" :key="i" class="modal__scale-item">
                                    {{ i + 1 }} = {{ label }}
                                </span>
                            </div>
                            <div class="modal__explanation">{{ q.explanation }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QCodes',

    data() {
        return {
            mode: 'codeToMeaning',
            score: 0,
            attempts: 0,
            streak: 0,
            answered: false,
            isCorrect: false,
            selectedAnswer: null,
            currentQuestion: null,
            currentAnswers: [],
            questionPool: [],
            questionIndex: 0,
            showModal: false,

            qCodes: [
                {
                    code: 'QRA',
                    question: 'What is the call sign of your station?',
                    answer: 'My call sign is...',
                    questionExample: 'QRA?',
                    answerExample: 'QRA LA1ABC',
                    scale: [],
                    explanation: 'Used to identify a station by its official call sign. Call signs are assigned by national authorities and uniquely identify every licensed amateur station.',
                },
                {
                    code: 'QRG',
                    question: 'What is the exact frequency?',
                    answer: 'The exact frequency is...',
                    questionExample: 'QRG?',
                    answerExample: 'QRG 14.225 MHz',
                    scale: [],
                    explanation: 'Used when there is uncertainty about the exact operating frequency. Useful on older equipment without a precise digital readout.',
                },
                {
                    code: 'QRH',
                    question: 'Does my frequency vary?',
                    answer: 'Your frequency varies',
                    questionExample: 'QRH?',
                    answerExample: 'QRH',
                    scale: [],
                    explanation: 'Sent when the other station\'s frequency is drifting or unstable. Common with older or poorly calibrated transmitters, especially on HF.',
                },
                {
                    code: 'QRI',
                    question: 'How is my transmitted tone?',
                    answer: 'Your transmitted tone is (1–3)',
                    questionExample: 'QRI?',
                    answerExample: 'QRI 1',
                    scale: ['Good', 'Variable', 'Bad'],
                    explanation: 'Refers to the T (tone) component of the RST reporting system used in CW (Morse code) contacts. A pure, stable sine wave gives a tone rating of 1 (good).',
                },
                {
                    code: 'QRK',
                    question: 'What is the readability of signals?',
                    answer: 'Your signal readability is (1–5)',
                    questionExample: 'QRK?',
                    answerExample: 'QRK 5',
                    scale: ['Unintelligible', 'Hard to make out', 'Middling', 'Clear', 'Flawless'],
                    explanation: 'Refers to the R (readability) component of the RST system. Reflects how well the transmitted characters or speech can be understood, independent of signal strength.',
                },
                {
                    code: 'QRL',
                    question: 'Are you busy?',
                    answer: 'I am busy, do not disturb',
                    questionExample: 'QRL?',
                    answerExample: 'QRL',
                    scale: [],
                    explanation: 'Always send "QRL?" before transmitting on a frequency to check if it is already in use. Failure to do so is considered bad operating practice.',
                },
                {
                    code: 'QRM',
                    question: 'Is your transmission affected by interference?',
                    answer: 'Your interference level is (1–5)',
                    questionExample: 'QRM?',
                    answerExample: 'QRM 3',
                    scale: ['None', 'Slight', 'Moderate', 'Severe', 'Extreme'],
                    explanation: 'QRM specifically refers to man-made interference, such as signals from other stations. Distinct from QRN which is natural static.',
                },
                {
                    code: 'QRN',
                    question: 'Are you troubled by static?',
                    answer: 'Your static level is (1–5)',
                    questionExample: 'QRN?',
                    answerExample: 'QRN 4',
                    scale: ['None', 'Slight', 'Moderate', 'Severe', 'Extreme'],
                    explanation: 'QRN refers to natural atmospheric noise such as static from thunderstorms. Unlike QRM, it cannot be resolved by changing frequency.',
                },
                {
                    code: 'QRO',
                    question: 'Should I increase transmitter power?',
                    answer: 'Increase transmitter power',
                    questionExample: 'QRO?',
                    answerExample: 'QRO',
                    scale: [],
                    explanation: 'A request to increase output power. Used when the received signal is too weak. Always stay within the legal power limits for your license class.',
                },
                {
                    code: 'QRP',
                    question: 'Should I decrease transmitter power?',
                    answer: 'Decrease transmitter power',
                    questionExample: 'QRP?',
                    answerExample: 'QRP',
                    scale: [],
                    explanation: 'Informally, QRP has become a popular operating style meaning low-power operation, typically 5 W or less. QRP operators pride themselves on making contacts with minimal power.',
                },
                {
                    code: 'QRQ',
                    question: 'Should I send faster?',
                    answer: 'Send faster (... words per minute)',
                    questionExample: 'QRQ?',
                    answerExample: 'QRQ 25',
                    scale: [],
                    explanation: 'Used in CW (Morse code) operation to request a faster sending speed. Experienced operators may prefer higher speeds to make contacts more efficient.',
                },
                {
                    code: 'QRS',
                    question: 'Should I send slower?',
                    answer: 'Send slower (... words per minute)',
                    questionExample: 'QRS?',
                    answerExample: 'QRS 10',
                    scale: [],
                    explanation: 'Used in CW operation to request a slower sending speed. Very common for new operators still learning Morse code. A good operator always adjusts to the other station\'s speed.',
                },
                {
                    code: 'QRT',
                    question: 'Should I stop transmitting?',
                    answer: 'Stop transmitting',
                    questionExample: 'QRT?',
                    answerExample: 'QRT',
                    scale: [],
                    explanation: 'Signals the end of a transmission session. Often paired with 73 (best regards) as a farewell. Also used by authorities to order a station to stop transmitting.',
                },
                {
                    code: 'QRU',
                    question: 'Do you have anything for me?',
                    answer: 'I have nothing for you',
                    questionExample: 'QRU?',
                    answerExample: 'QRU',
                    scale: [],
                    explanation: 'Used to indicate there is no more traffic or messages to exchange. Signals that the contact is wrapping up. The question form asks if the other station has anything pending.',
                },
                {
                    code: 'QRV',
                    question: 'Are you ready?',
                    answer: 'I am ready',
                    questionExample: 'QRV?',
                    answerExample: 'QRV',
                    scale: [],
                    explanation: 'Confirms readiness to receive traffic or begin a contact. Often used before a scheduled contact or after a frequency change.',
                },
                {
                    code: 'QRW',
                    question: 'Should I inform ... that you are calling on ... kHz?',
                    answer: 'Tell ... I am calling on ... kHz',
                    questionExample: 'QRW LA3CD 14.250?',
                    answerExample: 'QRW LA3CD 14.250',
                    scale: [],
                    explanation: 'Used to relay a calling notice through an intermediate station when direct contact with the target station is not possible.',
                },
                {
                    code: 'QRX',
                    question: 'When will you call me again?',
                    answer: 'I will wait and call you again at...',
                    questionExample: 'QRX?',
                    answerExample: 'QRX 1430 UTC',
                    scale: [],
                    explanation: 'Instructs the other station to stand by. The time given is in UTC. Used when a brief pause is needed before continuing the contact.',
                },
                {
                    code: 'QRY',
                    question: 'When is it my turn?',
                    answer: 'Your turn is number...',
                    questionExample: 'QRY?',
                    answerExample: 'QRY 4',
                    scale: [],
                    explanation: 'Used in net or traffic handling situations where multiple stations are waiting. The control station assigns each a queue number.',
                },
                {
                    code: 'QRZ',
                    question: 'Who is calling me?',
                    answer: 'You are being called by...',
                    questionExample: 'QRZ?',
                    answerExample: 'QRZ LA1ABC',
                    scale: [],
                    explanation: 'Sent when a station hears someone calling but cannot identify the caller. Also used at the end of a CQ call to invite responses. QRZ.com, the famous ham radio callsign database, takes its name from this code.',
                },
                {
                    code: 'QSA',
                    question: 'How strong are my signals?',
                    answer: 'Your signal strength is (1–5)',
                    questionExample: 'QSA?',
                    answerExample: 'QSA 4',
                    scale: ['Barely detectable', 'Faint', 'Reasonably strong', 'Solid', 'Very strong'],
                    explanation: 'Refers to the S (strength) component of the RST reporting system. In modern amateur radio the S-meter on the receiver provides this reading directly.',
                },
                {
                    code: 'QSB',
                    question: 'Do the signals vary in strength?',
                    answer: 'Signals vary in strength (fading)',
                    questionExample: 'QSB?',
                    answerExample: 'QSB',
                    scale: [],
                    explanation: 'Describes signal fading caused by changing ionospheric conditions or multipath propagation. Common on HF bands, especially during marginal propagation.',
                },
                {
                    code: 'QSD',
                    question: 'Is my keying defective?',
                    answer: 'Your keying is defective',
                    questionExample: 'QSD?',
                    answerExample: 'QSD',
                    scale: [],
                    explanation: 'Indicates problems with CW keying, such as uneven dot/dash ratios, chirp, or key clicks. Defective keying makes copy difficult and may cause interference.',
                },
                {
                    code: 'QSK',
                    question: 'Can you hear me between your signals and break in if necessary?',
                    answer: 'I can hear you, break in if needed',
                    questionExample: 'QSK?',
                    answerExample: 'QSK',
                    scale: [],
                    explanation: 'Refers to full break-in CW operation where the operator can listen between individual Morse characters. Allows the other station to interrupt at any time, enabling a more conversational exchange.',
                },
                {
                    code: 'QSL',
                    question: 'Can you acknowledge receipt?',
                    answer: 'I acknowledge receipt',
                    questionExample: 'QSL?',
                    answerExample: 'QSL',
                    scale: [],
                    explanation: 'One of the most recognised Q-codes. In everyday use QSL simply means "understood" or "confirmed". QSL cards — postcard-sized confirmations of a contact — are a beloved amateur radio tradition and are exchanged by mail or through bureaus worldwide.',
                },
                {
                    code: 'QSO',
                    question: 'Can you establish contact with ... (call sign)?',
                    answer: 'I can establish contact',
                    questionExample: 'QSO LA4DE?',
                    answerExample: 'QSO LA4DE',
                    scale: [],
                    explanation: 'In everyday amateur radio use, a QSO simply refers to a radio contact or conversation. "I had a great QSO with a station in Japan" is typical usage.',
                },
                {
                    code: 'QSP',
                    question: 'Can you relay to ... (call sign)?',
                    answer: 'I can relay to...',
                    questionExample: 'QSP LA5EF?',
                    answerExample: 'QSP LA5EF',
                    scale: [],
                    explanation: 'Used when a message needs to be forwarded through an intermediate station because the destination station cannot be reached directly.',
                },
                {
                    code: 'QSS',
                    question: 'What working frequency will you use?',
                    answer: 'I will use working frequency...',
                    questionExample: 'QSS?',
                    answerExample: 'QSS 7.050 MHz',
                    scale: [],
                    explanation: 'Used to agree on a working frequency before or during a contact, particularly when moving off a calling frequency to a clear channel.',
                },
                {
                    code: 'QSV',
                    question: 'Should I send a series of Vs?',
                    answer: 'Send a series of Vs',
                    questionExample: 'QSV?',
                    answerExample: 'QSV V V V V V',
                    scale: [],
                    explanation: 'The letter V in Morse code (· · · —) provides a convenient tuning signal. A series of Vs allows the receiving operator or a third party to tune equipment and check the signal.',
                },
                {
                    code: 'QSW',
                    question: 'Will you transmit on ... kHz?',
                    answer: 'I will transmit on ... kHz',
                    questionExample: 'QSW 3.750?',
                    answerExample: 'QSW 3.750',
                    scale: [],
                    explanation: 'Used to inform the other station on which frequency transmission will take place, particularly in split-frequency operation where transmit and receive frequencies differ.',
                },
                {
                    code: 'QSX',
                    question: 'Will you listen on frequency ...?',
                    answer: 'I will listen on frequency...',
                    questionExample: 'QSX 14.195?',
                    answerExample: 'QSX 14.195',
                    scale: [],
                    explanation: 'Specifies the frequency on which a station is listening for replies. Often used in split-frequency DX operation, where the DX station transmits on one frequency and listens on another.',
                },
                {
                    code: 'QSY',
                    question: 'Should I change frequency?',
                    answer: 'Change frequency to...',
                    questionExample: 'QSY?',
                    answerExample: 'QSY 21.300 MHz',
                    scale: [],
                    explanation: 'A request or instruction to move to a different frequency. Used to escape interference, move from a calling frequency to a working frequency, or comply with band plans.',
                },
                {
                    code: 'QSZ',
                    question: 'Should I send each word twice?',
                    answer: 'Send each word twice',
                    questionExample: 'QSZ?',
                    answerExample: 'QSZ',
                    scale: [],
                    explanation: 'Requested when conditions are so poor that single transmission of each word is insufficient for reliable copy. Increases reliability at the cost of throughput.',
                },
                {
                    code: 'QTC',
                    question: 'How many messages do you have to send?',
                    answer: 'I have ... messages',
                    questionExample: 'QTC?',
                    answerExample: 'QTC 3',
                    scale: [],
                    explanation: 'Used in formal traffic handling to declare the number of messages (traffic) waiting to be passed. Common in emergency communications and radiogram nets.',
                },
                {
                    code: 'QTH',
                    question: 'What is your position or location?',
                    answer: 'My position or location is...',
                    questionExample: 'QTH?',
                    answerExample: 'QTH Oslo, JP59OW',
                    scale: [],
                    explanation: 'One of the most commonly exchanged pieces of information in a contact. In amateur radio, location is often given as a city and Maidenhead grid locator (e.g. JP59OW), which allows distance and antenna bearing to be calculated.',
                },
                {
                    code: 'QTR',
                    question: 'What is the correct time?',
                    answer: 'The correct time is...',
                    questionExample: 'QTR?',
                    answerExample: 'QTR 1425 UTC',
                    scale: [],
                    explanation: 'Time is always given in UTC (Coordinated Universal Time) in amateur radio to avoid confusion across time zones. Accurate time is important for log keeping and scheduled contacts.',
                },
                {
                    code: 'QST',
                    question: 'Do you have a message for all stations?',
                    answer: 'I have a message for all stations (general call)',
                    questionExample: 'QST?',
                    answerExample: 'QST QST',
                    scale: [],
                    explanation: 'A general call addressed to all amateur stations. Used by net control stations and clubs to broadcast bulletins or announcements. In Norway, QST-LA specifically addresses all Norwegian radio amateurs.',
                },
            ],
        };
    },

    computed: {
        questionText() {
            if (!this.currentQuestion) return '';
            return this.mode === 'codeToMeaning'
                ? this.currentQuestion.code
                : this.currentQuestion.question;
        },
    },

    mounted() {
        this.buildPool();
        this.nextQuestion();
    },

    methods: {
        setMode(newMode) {
            if (newMode === this.mode) return;
            this.mode = newMode;
            this.score = 0;
            this.attempts = 0;
            this.streak = 0;
            this.answered = false;
            this.buildPool();
            this.nextQuestion();
        },

        buildPool() {
            const pool = [...this.qCodes].sort(() => Math.random() - 0.5);
            this.questionPool = pool;
            this.questionIndex = 0;
        },

        nextQuestion() {
            if (this.questionIndex >= this.questionPool.length) {
                this.buildPool();
            }

            this.currentQuestion = this.questionPool[this.questionIndex++];
            this.answered = false;
            this.isCorrect = false;
            this.selectedAnswer = null;

            this.generateAnswers();
        },

        generateAnswers() {
            const correct = this.currentQuestion;
            const others = this.qCodes.filter(q => q.code !== correct.code);
            const wrongThree = others.sort(() => Math.random() - 0.5).slice(0, 3);
            this.currentAnswers = [...wrongThree, correct].sort(() => Math.random() - 0.5);
        },

        selectAnswer(answer) {
            if (this.answered) return;
            this.answered = true;
            this.selectedAnswer = answer;
            this.isCorrect = answer.code === this.currentQuestion.code;
            this.attempts++;
            if (this.isCorrect) {
                this.score++;
                this.streak++;
            } else {
                this.streak = 0;
            }
        },

        getAnswerClass(answer) {
            if (!this.answered) return '';
            if (answer.code === this.currentQuestion.code) return 'answer-btn--correct';
            if (answer === this.selectedAnswer) return 'answer-btn--wrong';
            return 'answer-btn--disabled';
        },
    },
};
</script>

<style scoped>
.qcode-quiz {
    max-width: 640px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    font-family: "Open Sans", "Segoe UI", Tahoma, sans-serif;
}

.qcode-quiz__header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.score-board {
    display: flex;
    gap: 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
}

.mode-selector {
    display: flex;
    gap: 0.5rem;
}

.mode-btn {
    padding: 0.4rem 1rem;
    border-radius: 999px;
    border: 2px solid #667eea;
    background: transparent;
    color: #667eea;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.mode-btn.active,
.mode-btn:hover {
    background: #667eea;
    color: #fff;
}

.question-card {
    width: 100%;
    min-height: 160px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    gap: 0.5rem;
    text-align: center;
}

.question-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.question-display {
    font-size: 4rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.04em;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    line-height: 1.1;
}

.question-display--text {
    font-size: 1.15rem;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 1.5;
}

.answers-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    width: 100%;
}

.answer-btn {
    padding: 0.9rem 1rem;
    border: 2px solid #d1d5db;
    border-radius: 10px;
    background: #fff;
    color: #374151;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    line-height: 1.4;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
    min-height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.answer-btn:hover:not(:disabled) {
    border-color: #667eea;
    background: #f5f3ff;
    transform: translateY(-1px);
}

.answer-btn:disabled {
    cursor: default;
}

.answer-btn--correct {
    border-color: #10b981 !important;
    background: #d1fae5 !important;
    color: #065f46 !important;
    font-weight: 700;
}

.answer-btn--wrong {
    border-color: #ef4444 !important;
    background: #fee2e2 !important;
    color: #991b1b !important;
}

.answer-btn--disabled {
    opacity: 0.5;
}

.answer-line {
    display: block;
}

.answer-line + .answer-line {
    margin-top: 0.2rem;
    color: #6b7280;
    font-size: 0.8rem;
}

.feedback {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.95rem;
    text-align: center;
}

.feedback__status {
    font-weight: 600;
    margin-bottom: 0.4rem;
}

.feedback__examples {
    font-size: 0.875rem;
    font-style: italic;
    opacity: 0.9;
}

.feedback__ex-q {
    font-weight: 600;
}

.feedback__scale {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.35rem 0.75rem;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    opacity: 0.85;
}

.feedback__explanation {
    margin-top: 0.6rem;
    font-size: 0.85rem;
    font-style: italic;
    line-height: 1.4;
}

.success {
    background: #d1fae5;
    color: #065f46;
    border: 2px solid #10b981;
}

.error {
    background: #fee2e2;
    color: #991b1b;
    border: 2px solid #ef4444;
}

.btn-next {
    padding: 0.75rem 2.5rem;
    font-size: 1rem;
    font-weight: 600;
    background: #4caf50;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
}

.btn-next:hover {
    background: #43a047;
    transform: translateY(-1px);
}

.btn-reference {
    background: none;
    border: none;
    color: #667eea;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
}

.btn-reference:hover {
    color: #764ba2;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal {
    background: #fff;
    border-radius: 12px;
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.modal__title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.modal__close {
    background: none;
    border: none;
    font-size: 1.1rem;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
}

.modal__close:hover {
    color: #111827;
}

.modal__body {
    overflow-y: auto;
    padding: 0.5rem 0;
}

.modal__entry {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.6rem 1.5rem;
    border-bottom: 1px solid #f3f4f6;
}

.modal__entry:last-child {
    border-bottom: none;
}

.modal__code {
    font-size: 1.1rem;
    font-weight: 700;
    color: #667eea;
    min-width: 3.5rem;
    flex-shrink: 0;
}

.modal__desc {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.modal__row {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    flex-wrap: wrap;
}


.modal__text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
}

.modal__example {
    font-size: 0.78rem;
    color: #4caf50;
    font-style: italic;
    white-space: nowrap;
}

.modal__scale {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem 0.6rem;
    margin-top: 0.1rem;
    padding-left: 1rem;
    font-size: 0.75rem;
    color: #9ca3af;
    font-style: italic;
}

.modal__explanation {
    margin-top: 0.4rem;
    padding-left: 1rem;
    font-size: 0.78rem;
    color: #6b7280;
    font-style: italic;
    line-height: 1.45;
}

@media (max-width: 500px) {
    .answers-grid {
        grid-template-columns: 1fr;
    }

    .question-display {
        font-size: 3rem;
    }

    .question-display--text {
        font-size: 1rem;
    }

    .modal-overlay {
        align-items: flex-end;
        padding: 0;
    }

    .modal {
        border-radius: 16px 16px 0 0;
        max-height: 90vh;
        max-width: 100%;
    }

    .modal__header {
        padding: 1rem 1.25rem;
    }

    .modal__entry {
        padding: 0.6rem 1rem;
        gap: 0.75rem;
    }

    .modal__code {
        min-width: 2.8rem;
        font-size: 1rem;
    }

    .modal__text {
        font-size: 0.82rem;
    }

    .modal__example {
        font-size: 0.75rem;
    }

    .modal__scale {
        font-size: 0.72rem;
        padding-left: 0;
    }

    .modal__explanation {
        font-size: 0.74rem;
        padding-left: 0;
    }
}
</style>
