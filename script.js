// Sistema de Navegação SPA
function navigate(sectionId) {
    const sections = ['home', 'trilhas', 'dicionario', 'codelab', 'jogos', 'progresso', 'camera'];
    sections.forEach(sec => {
        document.getElementById('sec-' + sec).classList.add('hidden');
    });
    document.getElementById('sec-' + sectionId).classList.remove('hidden');

    if (sectionId === 'codelab') {
        updatePreview();
        initBlockly();
    }
}

// Acessibilidade: Tamanho da Fonte
let currentFontSize = 100;
function changeFontSize(delta) {
    currentFontSize += delta * 10;
    document.body.style.fontSize = currentFontSize + '%';
}
function resetFontSize() {
    currentFontSize = 100;
    document.body.style.fontSize = '100%';
}

// Acessibilidade: Alto Contraste
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

// Acessibilidade: Text-to-Speech (Voz)
let ttsEnabled = false;
function toggleTTS() {
    ttsEnabled = !ttsEnabled;
    const btn = document.getElementById('ttsBtn');
    btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> Voz: ${ttsEnabled ? 'ON' : 'OFF'}`;
}
document.addEventListener('mouseover', function(e) {
    if (ttsEnabled && e.target.innerText && e.target.innerText.length < 100) {
        const utterance = new SpeechSynthesisUtterance(e.target.innerText);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }
});

// CodeLab Editor Preview
function updatePreview() {
    const code = document.getElementById('codeEditor').value;
    const frame = document.getElementById('previewFrame').contentWindow.document;
    frame.open();
    frame.write(code);
    frame.close();
}

// CodeLab Alternância de Modos
function setLabMode(mode) {
    if (mode === 'code') {
        document.getElementById('labCodeMode').classList.remove('hidden');
        document.getElementById('labCodeMode').classList.add('grid');
        document.getElementById('labBlocksMode').classList.add('hidden');
        document.getElementById('labBlocksMode').classList.remove('flex');
    } else {
        document.getElementById('labCodeMode').classList.add('hidden');
        document.getElementById('labCodeMode').classList.remove('grid');
        document.getElementById('labBlocksMode').classList.remove('hidden');
        document.getElementById('labBlocksMode').classList.add('flex');
        initBlockly();
    }
}

// Inicialização do Blockly
let blocklyWorkspace = null;
function initBlockly() {
    if (!blocklyWorkspace && document.getElementById('blocklyDiv')) {
        blocklyWorkspace = Blockly.inject('blocklyDiv', {
            toolbox: `<xml>
                <block type="controls_if"></block>
                <block type="logic_compare"></block>
                <block type="text"></block>
                <block type="text_print"></block>
            </xml>`
        });
    }
}

// Dicionário Filtro
function filterLibras() {
    const query = document.getElementById('searchLibras').value.toLowerCase();
    const cards = document.querySelectorAll('.libras-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
}

// Quiz e Progresso
let score = parseInt(localStorage.getItem('sinaliza_score') || '0');
let lessons = parseInt(localStorage.getItem('sinaliza_lessons') || '0');
let challenges = parseInt(localStorage.getItem('sinaliza_challenges') || '0');

function updateProgressUI() {
    document.getElementById('userScore').innerText = score + ' PTS';
    document.getElementById('userLessons').innerText = lessons;
    document.getElementById('userChallenges').innerText = challenges;
}

function answerQuiz(isCorrect) {
    if (isCorrect) {
        score += 50;
        challenges += 1;
        localStorage.setItem('sinaliza_score', score);
        localStorage.setItem('sinaliza_challenges', challenges);
        document.getElementById('quizContainer').classList.add('hidden');
        document.getElementById('quizResult').classList.remove('hidden');
        updateProgressUI();
    } else {
        alert('Resposta incorreta. Tente novamente!');
    }
}

function resetQuiz() {
    document.getElementById('quizContainer').classList.remove('hidden');
    document.getElementById('quizResult').classList.add('hidden');
}

function openLesson(level) {
    alert('Lição de nível ' + level + ' iniciada! +20 Pontos acumulados.');
    lessons += 1;
    score += 20;
    localStorage.setItem('sinaliza_score', score);
    localStorage.setItem('sinaliza_lessons', lessons);
    updateProgressUI();
}

// Webcam API
let videoStream = null;
async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam');
        video.srcObject = videoStream;
        video.classList.remove('hidden');
        document.getElementById('camPlaceholder').classList.add('hidden');
    } catch (err) {
        alert('Não foi possível acessar a câmera: ' + err.message);
    }
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        document.getElementById('webcam').classList.add('hidden');
        document.getElementById('camPlaceholder').classList.remove('hidden');
    }
}

// Inicialização
updateProgressUI();
