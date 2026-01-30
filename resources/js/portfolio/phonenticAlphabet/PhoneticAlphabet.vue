<template>
    <div class="phonetic-checker">
        <div v-if="!browserSupported" class="error-message">
            Your browser does not support the Web Speech API. Please use Chrome, Edge, or Safari.
        </div>
        
        <template v-else>
            <div class="mode-selector">
                <label class="mode-switch">
                    <input type="checkbox" v-model="showLetters" @change="onModeChange">
                    <span class="switch-label">Letters</span>
                </label>
                <label class="mode-switch">
                    <input type="checkbox" v-model="showNumbers" @change="onModeChange">
                    <span class="switch-label">Numbers</span>
                </label>
                <label v-if="showNumbers" class="mode-switch">
                    <input type="checkbox" v-model="useNiner">
                    <span class="switch-label">Use "Niner" for 9</span>
                </label>
            </div>
            
            
            <div class="score-board">
                <span class="portfolioTask__score">{{ score }} / {{ attempts }}</span>
                <span class="portfolioTask__score">Streak: {{ streak }}</span>
            </div>
            
            <div class="word-display">
                <div class="letter">{{ currentLetter || '-' }}</div>
                <div class="word">{{ showAnswer ? currentWord : '?????' }}</div>
            </div>
            
            <div class="controls">
                <button 
                    v-if="!showAnswer"
                    @click="startListening" 
                    :disabled="isListening || (!showLetters && !showNumbers)"
                    class="btn-start"
                >
                    🎤 {{ isListening ? 'Listening...' : 'Start Speaking' }}
                </button>
                <button 
                    v-else
                    @click="showNewWord" 
                    :disabled="!showLetters && !showNumbers"
                    class="btn-next"
                >
                    Next Word
                </button>
            </div>
            
            
            <div v-if="feedback" class="feedback">
                <div :class="feedbackType">
                    <template v-if="feedbackType === 'success'">
                        ✅ Correct! You said: "{{ transcript }}"
                    </template>
                    <template v-else>
                        ❌ Incorrect. You said: "{{ transcript }}"<br>
                    </template>
                </div>
            </div>
            <div v-if="!showLetters && !showNumbers" class="warning-message">
                ⚠️ Please select at least one mode
            </div>
            
        </template>
    </div>
</template>

<script>
export default {
    name: 'PhoneticAlphabet',
    
    data() {
        return {
            phoneticAlphabet: {
                'A': 'Alpha',
                'B': 'Bravo',
                'C': 'Charlie',
                'D': 'Delta',
                'E': 'Echo',
                'F': 'Foxtrot',
                'G': 'Golf',
                'H': 'Hotel',
                'I': 'India',
                'J': 'Juliet',
                'K': 'Kilo',
                'L': 'Lima',
                'M': 'Mike',
                'N': 'November',
                'O': 'Oscar',
                'P': 'Papa',
                'Q': 'Quebec',
                'R': 'Romeo',
                'S': 'Sierra',
                'T': 'Tango',
                'U': 'Uniform',
                'V': 'Victor',
                'W': 'Whiskey',
                'X': 'X-ray',
                'Y': 'Yankee',
                'Z': 'Zulu'
            },
            phoneticNumbers: {
                '0': 'Zero',
                '1': 'One',
                '2': 'Two',
                '3': 'Three',
                '4': 'Four',
                '5': 'Five',
                '6': 'Six',
                '7': 'Seven',
                '8': 'Eight',
                '9': 'Niner'
            },
            showLetters: true,
            showNumbers: false,
            useNiner: true,
            currentLetter: null,
            currentWord: null,
            recognition: null,
            isListening: false,
            score: 0,
            streak: 0,
            attempts: 0,
            statusMessage: 'Click "Start Speaking" and say the phonetic word',
            feedback: false,
            feedbackType: '',
            transcript: '',
            showAnswer: false,
            browserSupported: true,
            currentCharacterSeries: [],
            currentCharacterIndex: 0
        };
    },
    
    mounted() {
        this.createNewCharacterSeries();
        this.initSpeechRecognition();
        if (this.browserSupported) {
            this.showNewWord();
        }
    },
    
    beforeUnmount() {
        if (this.recognition) {
            this.recognition.abort();
        }
    },
    
    methods: {
        createNewCharacterSeries() {
            let characters = [];
            
            if (this.showLetters) {
                characters = characters.concat(Object.keys(this.phoneticAlphabet));
            }
            if (this.showNumbers) {
                characters = characters.concat(Object.keys(this.phoneticNumbers));
            }
            
            // Shuffle all characters
            this.currentCharacterSeries = characters.sort(() => Math.random() - 0.5);
        },
        
        onModeChange() {
            if (!this.showLetters && !this.showNumbers) {
                // At least one must be selected - do nothing, just show warning
                return;
            }
            
            this.score = 0;
            this.attempts = 0;
            this.streak = 0;
            this.currentCharacterIndex = 0;
            this.createNewCharacterSeries();
            this.showNewWord();
        },
        
        initSpeechRecognition() {
            // Check for browser support
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                this.browserSupported = false;
                return;
            }
            
            // Initialize Speech Recognition
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            // Set up event listeners
            this.recognition.onresult = (event) => this.handleResult(event);
            this.recognition.onerror = (event) => this.handleError(event);
            this.recognition.onend = () => this.handleEnd();
        },
        
        showNewWord() {
            this.currentLetter = this.currentCharacterSeries[this.currentCharacterIndex];
            
            // Check which dictionary to use
            if (this.phoneticAlphabet[this.currentLetter]) {
                this.currentWord = this.phoneticAlphabet[this.currentLetter];
            } else {
                // For numbers, check if it's 9 and use Nine or Niner based on toggle
                if (this.currentLetter === '9') {
                    this.currentWord = this.useNiner ? 'Niner' : 'Nine';
                } else {
                    this.currentWord = this.phoneticNumbers[this.currentLetter];
                }
            }
            
            this.currentCharacterIndex++;

            if (this.currentCharacterIndex >= this.currentCharacterSeries.length) {
                this.createNewCharacterSeries();
                this.currentCharacterIndex = 0;
            }
            
            this.feedback = false;
            this.feedbackType = '';
            this.transcript = '';
            this.showAnswer = false;
            this.statusMessage = 'Click "Start Speaking" and say the phonetic word';
        },
        
        startListening() {
            if (this.isListening) return;
            
            this.isListening = true;
            this.statusMessage = '🎤 Listening...';
            
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Recognition start error:', error);
                this.isListening = false;
            }
        },
        
        handleResult(event) {
            this.transcript = event.results[0][0].transcript.trim().toLowerCase();
            const correctWord = this.currentWord.toLowerCase();
            
            this.attempts++;
            
            // Check if the spoken word matches
            if (this.transcript === correctWord || this.transcript.includes(correctWord)) {
                this.score++;
                this.streak++;
                this.showFeedback(true);
            } else {
                this.showFeedback(false);
                this.streak = 0;
            }
        },
        
        showFeedback(isCorrect) {
            this.feedback = true;
            this.feedbackType = isCorrect ? 'success' : 'error';
            this.showAnswer = true;
            this.statusMessage = 'Click "Next Word" to continue';
        },
        
        handleError(event) {
            console.error('Speech recognition error:', event.error);
            
            if (event.error === 'no-speech') {
                this.statusMessage = 'No speech detected. Please try again.';
            } else if (event.error === 'not-allowed') {
                this.statusMessage = 'Microphone access denied. Please allow microphone access.';
            } else {
                this.statusMessage = `Error: ${event.error}. Please try again.`;
            }
        },
        
        handleEnd() {
            this.isListening = false;
        }
    }
};
</script>

<style scoped>
.phonetic-checker {
    max-width: 600px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    font-family: "Open Sans", "Segoe UI", Tahoma, sans-serif;
}

.mode-selector {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.mode-switch {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    position: relative;
}

.mode-switch input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border: 2px solid #4CAF50;
    border-radius: 4px;
    background: white;
    position: relative;
    transition: all 0.3s ease;
}

.mode-switch input[type="checkbox"]:checked {
    background: #4CAF50;
    border-color: #4CAF50;
}

.mode-switch input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    top: 44%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
}

.switch-label {
    user-select: none;
}

.warning-message {
    text-align: center;
    background: #fef3c7;
    color: #92400e;
    font-weight: 500;
    padding: 0.5rem;
    border-radius: 8px;
    border: 2px solid #92400e;
}

.word-display {
    width: 260px;
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.letter {
    font-size: 5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.word {
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
}

.controls {
    text-align: center;
    margin-bottom: 1.5rem;
}

.controls button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.btn-start {
    position: relative;
    background-color: #4CAF50;
    color: white;
    border-radius: 6px;
    border: 2px solid #4CAF50;
    font-size: 18px;
    padding: 10px 20px;
    height: 100%;
    transition: color 0.15s ease-in-out, background-color 0.15s;
    cursor: pointer;
}

.btn-start:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.btn-next {
    background: #4CAF50;
    color: white;
}

.status {
    text-align: center;
    padding: 1rem;
    background: #f3f4f6;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 1rem;
    color: #4b5563;
    min-height: 1.5rem;
}

.feedback,.warning-message {
    text-align: center;
    border-radius: 8px;
    font-size: 1rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 102px;
    width: 100%;
    max-width: 300px;
}
@media only screen and (max-width: 800px) {
    .feedback,.warning-message {
        bottom: 44px;
    }
}
.success {
    background: #d1fae5;
    color: #065f46;
    padding: 0.5rem;
    border-radius: 8px;
    border: 2px solid #10b981;
}

.error {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.5rem;
    border-radius: 8px;
    border: 2px solid #ef4444;
}

.error-message {
    background: #fee2e2;
    color: #991b1b;
    padding: 2rem;
    border-radius: 8px;
    border: 2px solid #ef4444;
    text-align: center;
    font-size: 1.1rem;
}
</style>
