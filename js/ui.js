// ==========================================
// ملف ui.js (الواجهة والجماليات والتنقل والترجمة)
// ==========================================

const UI_TEXT = {
    ar: {
        header_dua: "اللهم اغفر له وارحمه وعافه واعف عنه وأكرم نزله ووسع مدخله",
        tab_tasbeeh: "المسبحة", tab_azkar: "الأذكار", tab_tracker: "الورد اليومي", 
        tab_duas: "الأدعية", tab_quran: "القرآن", tab_names: "الأسماء", tab_stories: "قصص",
        btn_reset: "تصفير العداد", azkar_morning: "الصباح", azkar_evening: "المساء", azkar_sleep: "النوم",
        dua_deceased: "للمتوفى", dua_general: "أدعية عامة",
        quran_full: "المصحف كاملاً", quran_yaseen: "سورة يس", quran_mulk: "سورة الملك", quran_kahf: "سورة الكهف",
        title_tracker: "الورد اليومي", desc_tracker: "قليل دائم خير من كثير منقطع",
        title_names: "أسماء الله الحسنى", title_stories: "قصص وعبر", times: "مرات", btn_copy: "نسخ",
        sadaqa_title: "✨ صدقة جارية لمن تحب",
        sadaqa_desc: "أنشئ نسخة من هذا التطبيق باسم من تحب من الأموات ليكون صدقة جارية لروحهم.",
        btn_create_sadaqa: "أنشئ صدقة جارية الآن",
        modal_title1: "أنشئ صدقة جارية",
        modal_desc1: "اكتب اسم المتوفى ليتم إنشاء رابط مخصص باسمه:",
        btn_generate: "توليد الرابط",
        modal_title2: "تم الإنشاء بنجاح! 🎉",
        modal_desc2: "هذا هو الرابط المخصص، انسخه وشاركه مع عائلتك وأصدقائك:",
        btn_copy_link: "📋 نسخ الرابط",
        btn_open_link: "فتح الرابط ❯",
        footer_dev: "Developed by Yousef Sabry",
        ad_space: "مساحة إعلانية (تظهر هنا بعد موافقة أدسنس)"
    },
    en: {
        header_dua: "O Allah, forgive him and have mercy on him",
        tab_tasbeeh: "Tasbeeh", tab_azkar: "Azkar", tab_tracker: "Daily Wird", 
        tab_duas: "Duas", tab_quran: "Quran", tab_names: "Names", tab_stories: "Stories",
        btn_reset: "Reset Counter", azkar_morning: "Morning", azkar_evening: "Evening", azkar_sleep: "Sleep",
        dua_deceased: "For Deceased", dua_general: "General Duas",
        quran_full: "Full Quran", quran_yaseen: "Surah Yaseen", quran_mulk: "Surah Al-Mulk", quran_kahf: "Surah Al-Kahf",
        title_tracker: "Daily Wird", desc_tracker: "Consistent small deeds are best",
        title_names: "Names of Allah", title_stories: "Stories", times: "times", btn_copy: "Copy",
        sadaqa_title: "✨ Sadaqa Jariyah",
        sadaqa_desc: "Create a copy of this app with the name of your deceased loved one.",
        btn_create_sadaqa: "Create Sadaqa Now",
        modal_title1: "Create Sadaqa Jariyah",
        modal_desc1: "Enter the name of the deceased to generate a custom link:",
        btn_generate: "Generate Link",
        modal_title2: "Successfully Created! 🎉",
        modal_desc2: "Here is the custom link, copy and share it:",
        btn_copy_link: "📋 Copy Link",
        btn_open_link: "Open Link ❯",
        footer_dev: "Developed by Yousef Sabry",
        ad_space: "Ad Space (Appears here after AdSense approval)"
    }
};

let currentAzkarType = 'morning';
let activeDuaType = 'deceased';

function toggleLanguage() { 
    currentLang = currentLang === 'ar' ? 'en' : 'ar'; 
    localStorage.setItem('appLang', currentLang); 
    applyLanguage(); 
    if (typeof updateInstallBtnLang === 'function') updateInstallBtnLang(); 
}

function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('langToggleBtn').innerText = currentLang === 'ar' ? 'EN' : 'عربي';
    
    document.querySelectorAll('[data-i18n]').forEach(el => { 
        const key = el.getAttribute('data-i18n'); 
        if (UI_TEXT[currentLang] && UI_TEXT[currentLang][key]) { 
            el.innerText = UI_TEXT[currentLang][key]; 
        } 
    });
    
    const nameInput = document.getElementById('deceasedNameInput');
    if (nameInput) {
        nameInput.placeholder = currentLang === 'ar' ? 'مثال: المرحوم أحمد محمود' : 'Ex: John Doe';
    }
    
    updateUI();
    const activeAzkarBtn = document.querySelector('#azkar .azkar-opt.active');
    if(activeAzkarBtn) { 
        const typeMatch = activeAzkarBtn.getAttribute('onclick').match(/'([^']+)'/); 
        if (typeMatch) renderAzkar(typeMatch[1]); 
    }
}

function initTheme() { 
    const savedTheme = localStorage.getItem('theme') || 'default'; 
    setTheme(savedTheme, null); 
}

function setTheme(themeName, btnElement) { 
    if (themeName === 'default') { 
        document.body.removeAttribute('data-theme'); 
    } else { 
        document.body.setAttribute('data-theme', themeName); 
    } 
    localStorage.setItem('theme', themeName); 
    document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active')); 
    
    if (btnElement) { 
        btnElement.classList.add('active'); 
    } else { 
        const colors = { 'default': 'rgb(30, 111, 92)', 'blue': 'rgb(29, 53, 87)', 'brown': 'rgb(111, 78, 55)', 'dark': 'rgb(17, 24, 39)' }; 
        document.querySelectorAll('.color-dot').forEach(dot => { 
            if (getComputedStyle(dot).backgroundColor === colors[themeName]) { 
                dot.classList.add('active'); 
            } 
        }); 
    } 
}

function switchTab(id, btn) { 
    document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active')); 
    document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active')); 
    document.getElementById(id).classList.add('active'); 
    btn.classList.add('active'); 
}

function updateUI() { 
    updateCounterUI(); 
    renderActiveDua(); 
    if (typeof renderTracker === 'function') renderTracker(); 
    if (typeof renderNames === 'function') renderNames(); 
    if (typeof renderStories === 'function') renderStories(); 
}

function updateCounterUI() { 
    document.getElementById('totalCounter').textContent = state.count; 
    if(typeof TASBEEH_AZKAR !== 'undefined') {
        const tasbeehData = TASBEEH_AZKAR[currentLang] || TASBEEH_AZKAR['ar'];
        if(tasbeehData) document.getElementById('dhikrText').textContent = tasbeehData[state.currentZekrIdx]; 
    }
    let currentBatch = (state.count % 33); 
    if (state.count > 0 && currentBatch === 0) currentBatch = 33; 
    document.getElementById('batchCounter').textContent = `${currentBatch} / 33`; 
}

function renderAzkar(type) { 
    if (typeof checkAzkarAutoReset === 'function') checkAzkarAutoReset(); 
    const list = document.getElementById('azkarList');
    if(typeof AZKAR === 'undefined') return;
    
    const azkarData = AZKAR[currentLang] || AZKAR['ar']; 
    if(!azkarData || !azkarData[type]) return;

    const timesTxt = UI_TEXT[currentLang].times;
    let html = '';
    
    azkarData[type].forEach((zekr, index) => {
        const key = `${type}_${index}`; 
        const currentCount = state.azkarProgress[key] || 0; 
        const target = zekr.c; 
        const isCompleted = currentCount >= target;
        const btnClass = isCompleted ? 'zekr-count-btn completed' : 'zekr-count-btn';
        
        const btnText = isCompleted ? '✔️' : `<span dir="ltr" style="font-family: Arial, sans-serif; display: inline-block;">${currentCount} / ${target}</span>`;
        
        html += `<div class="zekr-item">
                    <div class="zekr-text-wrap" style="font-family:'Amiri'">${zekr.t}</div>
                    <div class="zekr-bottom-row">
                        <span style="font-size:0.85rem;color:var(--text-sub);opacity:0.8;">${currentLang === 'ar' ? 'الهدف:' : 'Target:'} ${target} ${timesTxt}</span>
                        <button class="${btnClass}" onclick="incrementZekr('${type}', ${index}, ${target})" ${isCompleted ? 'disabled' : ''}>${btnText}</button>
                    </div>
                 </div>`;
    });
    list.innerHTML = html; 
}

function toggleAzkar(type, btn) { 
    document.querySelectorAll('#azkar .azkar-opt').forEach(b => b.classList.remove('active')); 
    btn.classList.add('active'); 
    currentAzkarType = type; 
    renderAzkar(type); 
}

function toggleDuaCategory(type, btn) { 
    const container = btn.parentElement; 
    container.querySelectorAll('.azkar-opt').forEach(b => b.classList.remove('active')); 
    btn.classList.add('active'); 
    activeDuaType = type; 
    renderActiveDua(); 
}

function renderActiveDua() { 
    if(typeof DECEASED_DUAS === 'undefined' || typeof GENERAL_DUAS === 'undefined') return; 
    const isDeceased = activeDuaType === 'deceased'; 
    const source = isDeceased ? DECEASED_DUAS : GENERAL_DUAS;
    const arr = source[currentLang] || source['ar']; 
    if (!arr) return;

    const list = document.getElementById('duasList');
    let html = '';
    
    arr.forEach((dua, index) => {
        html += `<div class="zekr-item">
                    <div class="zekr-text-wrap" style="font-family:'Amiri'; text-align: justify; color: var(--primary); font-weight: bold; font-size: 1.5rem;">
                        ${dua}
                    </div>
                    <div class="zekr-bottom-row" style="justify-content: center;">
                        <button class="copy-btn" onclick="copySpecificDua(${index}, ${isDeceased})" style="width: 100%; justify-content: center; border-radius: 30px; font-size: 1.1rem; padding: 12px;">
                            📋 <span data-i18n="btn_copy">${UI_TEXT[currentLang].btn_copy}</span>
                        </button>
                    </div>
                 </div>`;
    });
    list.innerHTML = html; 
}

function copySpecificDua(index, isDeceased) {
    const source = isDeceased ? DECEASED_DUAS : GENERAL_DUAS;
    const arr = source[currentLang] || source['ar'];
    const text = arr[index];
    
    const footerText = currentLang === 'ar' ? `\n\n(صدقة جارية عن روح ${currentDeceasedName})` : `\n\n(Sadaqa for ${currentDeceasedName})`; 
    const footer = isDeceased ? footerText : ""; 
    
    navigator.clipboard.writeText(text + footer).then(() => {
        alert(currentLang === 'ar' ? 'تم النسخ!' : 'Copied!');
        
        // 💡 إرسال حدث (Event) لإحصائيات جوجل عند نسخ المستخدم لأي دعاء
        if (typeof gtag === 'function') {
            gtag('event', 'copy_dua_clicked', {
                'dua_type': isDeceased ? 'deceased' : 'general'
            });
        }
    }); 
}

function renderTracker() {
    if (typeof checkTrackerAutoReset === 'function') checkTrackerAutoReset();
    if (typeof DAILY_TASKS === 'undefined') return;
    const arr = DAILY_TASKS[currentLang] || DAILY_TASKS['ar']; 
    if(!arr) return;

    const list = document.getElementById('trackerList');
    let html = '';
    arr.forEach((task, index) => {
        const isDone = state.trackerTasks[index] ? true : false;
        html += `<div class="task-item ${isDone ? 'done' : ''}" onclick="toggleTask(${index})">
                    <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''}>
                    <span class="task-text">${task}</span>
                 </div>`;
    });
    list.innerHTML = html;
}

function renderNames() {
    if (typeof ALLAH_NAMES === 'undefined') return;
    const arr = ALLAH_NAMES[currentLang] || ALLAH_NAMES['ar'];
    if(!arr) return;

    const grid = document.getElementById('namesGrid');
    let html = '';
    arr.forEach(item => {
        html += `<div class="name-card">
                    <div class="allah-name">${item.name}</div>
                    <div class="allah-desc">${item.desc}</div>
                 </div>`;
    });
    grid.innerHTML = html;
}

function renderStories() {
    if (typeof STORIES === 'undefined') return;
    const arr = STORIES[currentLang] || STORIES['ar'];
    if(!arr) return;

    const list = document.getElementById('storiesList');
    let html = '';
    arr.forEach(story => {
        html += `<div class="story-card">
                    <div class="story-title">${story.title}</div>
                    <div class="story-content">${story.content}</div>
                 </div>`;
    });
    list.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const customName = urlParams.get('name');
    if (customName && customName.trim() !== "") { 
        currentDeceasedName = customName.trim(); 
        localStorage.setItem('savedDeceasedName', currentDeceasedName); 
    }
    document.querySelectorAll('.deceased-name').forEach(el => el.textContent = currentDeceasedName); 
    document.title = currentDeceasedName + " | Sadaqa";
    
    if (typeof updateDynamicManifest === 'function') updateDynamicManifest(currentDeceasedName);

    initTheme(); 
    if (typeof loadData === 'function') loadData(); 
    if (typeof checkAzkarAutoReset === 'function') checkAzkarAutoReset(); 
    
    applyLanguage(); 
    renderAzkar('morning'); 
    
    renderTracker();
    renderNames();
    renderStories();
    
    if (typeof initPWA === 'function') initPWA();
});
