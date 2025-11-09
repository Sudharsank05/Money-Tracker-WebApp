// Voice input handler using Web Speech API

const VoiceInput = {
    recognition: null,
    isListening: false,
    onResultCallback: null,

    /**
     * Initialize speech recognition
     */
    init() {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN'; // Indian English

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('Listening...', true);
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.updateUI(`Heard: ${transcript}`, false);
            this.parseVoiceInput(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            
            let errorMessage = 'Error occurred. Please try again.';
            if (event.error === 'no-speech') {
                errorMessage = 'No speech detected. Please try again.';
            } else if (event.error === 'not-allowed') {
                errorMessage = 'Microphone permission denied. Please enable it in settings.';
            }
            
            this.updateUI(errorMessage, false);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (this.voiceBtn) {
                this.voiceBtn.classList.remove('recording');
            }
        };

        return true;
    },

    /**
     * Start listening for voice input
     */
    startListening() {
        if (!this.recognition) {
            if (!this.init()) {
                alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
                return;
            }
        }

        if (this.isListening) {
            this.stopListening();
            return;
        }

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.updateUI('Error starting voice input. Please try again.', false);
        }
    },

    /**
     * Stop listening
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    },

    /**
     * Parse voice input and extract expense information
     * @param {string} transcript - Voice transcript text
     */
    parseVoiceInput(transcript) {
        const lowerTranscript = transcript.toLowerCase();
        
        // Extract amount (look for numbers)
        const amountMatch = transcript.match(/(\d+(?:\.\d{2})?)/);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

        // Category keywords mapping
        const categoryKeywords = {
            'Food & Dining': ['food', 'dining', 'restaurant', 'lunch', 'dinner', 'breakfast', 'snack', 'coffee', 'tea', 'meal', 'eat', 'hungry'],
            'Transportation': ['transport', 'taxi', 'uber', 'ola', 'bus', 'train', 'metro', 'auto', 'rickshaw', 'fuel', 'petrol', 'diesel', 'travel'],
            'Shopping': ['shopping', 'buy', 'purchase', 'mall', 'store', 'market', 'clothes', 'shirt', 'pants', 'shoes'],
            'Bills & Utilities': ['bill', 'electricity', 'water', 'phone', 'internet', 'wifi', 'utility', 'rent', 'maintenance'],
            'Entertainment': ['movie', 'cinema', 'game', 'entertainment', 'fun', 'party', 'concert', 'show'],
            'Healthcare': ['medicine', 'doctor', 'hospital', 'pharmacy', 'medical', 'health', 'clinic'],
            'Others': []
        };

        // Find matching category
        let category = 'Others';
        for (const [cat, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
                category = cat;
                break;
            }
        }

        // Extract description (remove amount and common words)
        let description = transcript;
        if (amountMatch) {
            description = description.replace(amountMatch[0], '').trim();
        }
        // Remove common filler words
        description = description.replace(/\b(spent|on|for|rupees|rs|rupee|add|expense)\b/gi, '').trim();
        if (!description || description.length < 3) {
            description = category;
        }

        // Callback with parsed data
        if (this.onResultCallback) {
            this.onResultCallback({
                amount: amount,
                category: category,
                description: description || category
            });
        }
    },

    /**
     * Update UI with status message
     * @param {string} message - Status message
     * @param {boolean} isRecording - Whether currently recording
     */
    updateUI(message, isRecording) {
        const statusEl = document.getElementById('voiceStatus');
        if (statusEl) {
            statusEl.textContent = message;
        }

        this.voiceBtn = document.getElementById('voiceBtn');
        if (this.voiceBtn) {
            if (isRecording) {
                this.voiceBtn.classList.add('recording');
                this.voiceBtn.querySelector('span:first-child').textContent = '🔴';
            } else {
                this.voiceBtn.classList.remove('recording');
                this.voiceBtn.querySelector('span:first-child').textContent = '🎤';
            }
        }
    },

    /**
     * Set callback for when voice input is processed
     * @param {Function} callback - Callback function that receives parsed data
     */
    setResultCallback(callback) {
        this.onResultCallback = callback;
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    VoiceInput.init();
    
    // Set up voice button click handler
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            VoiceInput.startListening();
        });
    }
});

