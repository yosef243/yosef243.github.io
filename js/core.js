// ==========================================
// ملف core.js (القلب النابض - البيانات والمسبحة والتتبع)
// ==========================================

let defaultDeceasedName = "المرحوم صبري كامل سليم";
let currentDeceasedName = localStorage.getItem('savedDeceasedName') || defaultDeceasedName;
let currentLang = localStorage.getItem('appLang') || 'ar';
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

let state = { 
    count: 0, 
    deceasedIdx: 0, 
    generalIdx: 0, 
    currentZekrIdx: 0, 
    batchCount: 1, 
    azkarProgress: {}, 
    lastAzkarReset: Date.now(), 
    trackerTasks: {}, 
    lastTrackerReset: new Date().toDateString() 
};

const STORAGE_KEY = 'sabry_v24_local'; 
let audioCtx = null;

function saveData() { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
}

function loadData() { 
    const saved = localStorage.getItem(STORAGE_KEY); 
    if(saved) { 
        try { 
            const parsed = JSON.parse(saved); 
            state = { ...state, ...parsed }; 
        } catch(e) {} 
    } 
}

function checkAzkarAutoReset() { 
    const now = Date.now(); 
    if (now - state.lastAzkarReset > SIX_HOURS_MS) { 
        state.azkarProgress = {}; 
        state.lastAzkarReset = now; 
        saveData(); 
    } 
}

function checkTrackerAutoReset() { 
    const today = new Date().toDateString(); 
    if (state.lastTrackerReset !== today) { 
        state.trackerTasks = {}; 
        state.lastTrackerReset = today; 
        saveData(); 
    } 
}

function playClick() { 
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (!audioCtx) return;

        if (audioCtx.state === 'suspended') audioCtx.resume(); 
        const osc = audioCtx.createOscillator(); 
        const gain = audioCtx.createGain(); 
        osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05); 
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05); 
        osc.connect(gain); 
        gain.connect(audioCtx.destination); 
        osc.start(); 
        osc.stop(audioCtx.currentTime + 0.05); 
    } catch(e) { console.warn("Audio not supported"); }
}

function incrementCounter() { 
    state.count++; 
    playClick(); 
    if (navigator.vibrate) { try { navigator.vibrate(15); } catch(e){} } 
    
    if (state.count % 33 === 0) { 
        if (typeof TASBEEH_AZKAR !== 'undefined') {
            const tData = TASBEEH_AZKAR[currentLang] || TASBEEH_AZKAR['ar'];
            if (tData) state.currentZekrIdx = (state.currentZekrIdx + 1) % tData.length;
        }
        state.batchCount++; 
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: ['#1E6F5C', '#E9C46A'] }); 
        }
        if (navigator.vibrate) { try { navigator.vibrate([50, 50]); } catch(e){} } 
        
        // 💡 إرسال حدث (Event) لإحصائيات جوجل عند اكتمال دورة المسبحة
        if (typeof gtag === 'function') {
            gtag('event', 'tasbeeh_cycle_completed', {
                'cycle_number': state.batchCount
            });
        }
    } 
    if (typeof updateCounterUI === 'function') updateCounterUI(); 
    saveData(); 
}

function confirmReset() { 
    if(confirm(currentLang === 'ar' ? 'تصفير عداد المسبحة؟' : 'Reset Counter?')) { 
        state.count = 0; 
        state.currentZekrIdx = 0; 
        state.batchCount = 1; 
        if (typeof updateCounterUI === 'function') updateCounterUI(); 
        saveData(); 
    } 
}

function incrementZekr(type, index, target) {
    const key = `${type}_${index}`; 
    if (!state.azkarProgress[key]) state.azkarProgress[key] = 0;
    
    if (state.azkarProgress[key] < target) { 
        state.azkarProgress[key]++; 
        playClick(); 
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch(e){} } 
        saveData(); 
        if (typeof renderAzkar === 'function') renderAzkar(type); 
    }
}

function toggleTask(index) {
    state.trackerTasks[index] = !state.trackerTasks[index];
    saveData();
    if (typeof renderTracker === 'function') renderTracker(); 
}
