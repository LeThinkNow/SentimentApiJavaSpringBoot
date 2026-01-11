const API_URL = "https://sentimentapijavaspringboot.onrender.com";
let sentimentChart = null;
let currentLang = 'es';

const EXAMPLES = {
    es: [
        { type: "Marketing 📈", text: "¡Me encanta la nueva campaña, los colores son increíbles!" },
        { type: "Soporte 🎧", text: "Llevo esperando 30 minutos y nadie me atiende, pésimo servicio." },
        { type: "Producto 📦", text: "El producto llegó roto y la caja estaba abierta." },
        { type: "Feedback 👍", text: "Todo bien, correcto, sin quejas." }
    ],
    en: [
        { type: "Marketing 📈", text: "I absolutely love the new branding, looks fresh!" },
        { type: "Support 🎧", text: "Terrible experience, rude staff and long wait times." },
        { type: "Product 📦", text: "Item received damaged, very disappointed." },
        { type: "Feedback 👍", text: "Good service, fast delivery." }
    ],
    pt: [
        { type: "Marketing 📈", text: "Adorei a nova campanha, muito criativa!" },
        { type: "Suporte 🎧", text: "Ninguém responde meus emails, suporte horrível." },
        { type: "Produto 📦", text: "Produto chegou antes do prazo, parabéns." },
        { type: "Feedback 👍", text: "Serviço ok, nada demais." }
    ]
};

// LANGUAGE TABS
function setLang(lang, btn) {
    currentLang = lang;
    document.getElementById('langSelect').value = lang;
    document.querySelector('.lang-tabs .active').classList.remove('active');
    btn.classList.add('active');
    renderExamples();
}

function renderExamples() {
    const list = document.getElementById('examplesList');
    list.innerHTML = EXAMPLES[currentLang].map(ex => `
        <div class="chip-bus" onclick="fillInput('${ex.text.replace(/'/g, "\\'")}')">
            <span class="chip-type">${ex.type}</span>
            ${ex.text}
        </div>
    `).join('');
}

function fillInput(text) {
    document.getElementById('textInput').value = text;
    analyzeText();
}

// HANDLE CUSTOM LIMIT
function handleLimitChange(select) {
    const input = document.getElementById('customLimitInput');
    if (select.value === 'custom') {
        input.classList.remove('hidden');
        input.focus();
    } else {
        input.classList.add('hidden');
        loadStats(select.value);
    }
}

// LOGIC
async function loadStats(limit = 100000) {
    try {
        const res = await fetch(`${API_URL}/stats?limit=${limit}`);
        const data = await res.json();

        // Numeric
        document.getElementById('totalAnalyzed').innerText = data.total_analyzed || 0;
        document.getElementById('pctPositive').innerText = Math.round(data.positive_pct || 0) + '%';
        document.getElementById('pctNegative').innerText = Math.round(data.negative_pct || 0) + '%';
        document.getElementById('pctNeutral').innerText = Math.round(data.neutral_pct || 0) + '%';

        // Bars
        document.getElementById('barPositive').style.width = (data.positive_pct || 0) + '%';
        document.getElementById('barNegative').style.width = (data.negative_pct || 0) + '%';
        document.getElementById('barNeutral').style.width = (data.neutral_pct || 0) + '%';

        // Chart
        updateChart(data);

    } catch (e) {
        console.error("Error loading stats", e);
    }
}

function updateChart(data) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    if (sentimentChart) sentimentChart.destroy();

    // Register Plugin (if not auto-registered)
    // Chart.register(ChartDataLabels); 

    sentimentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positivo', 'Negativo', 'Neutro'],
            datasets: [{
                data: [data.positive_pct, data.negative_pct, data.neutral_pct],
                backgroundColor: ['#22c55e', '#ef4444', '#94a3b8'],
                borderWidth: 0
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#9ca3af', usePointStyle: true } },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold', size: 14 },
                    formatter: (value, ctx) => {
                        // value is percentage
                        if (value === 0) return '';
                        const total = data.total_analyzed || 0;
                        const count = Math.round((value / 100) * total);
                        return `${count}\n(${Math.round(value)}%)`;
                    },
                    textAlign: 'center'
                }
            }
        }
    });
}


async function analyzeText() {
    const text = document.getElementById('textInput').value;
    if (!text) return alert("Ingrese un texto para analizar.");

    // Loading State
    const btn = document.querySelector('.analyze-btn');
    const originalBtn = btn.innerHTML;
    btn.innerHTML = '<span>⏳ Analizando...</span>';

    try {
        const res = await fetch(`${API_URL}/sentiment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language: currentLang })
        });
        const data = await res.json();

        // Error Handling
        if (data.error) {
            const box = document.getElementById('inlineResult');
            box.classList.remove('hidden');
            document.getElementById('resBadge').innerText = 'ERROR';
            document.getElementById('resBadge').className = 'status-pill Negativo';

            // Hide normal UI parts
            document.querySelector('.prob-bar').style.display = 'none';
            document.getElementById('featuresContainer').classList.add('hidden');

            // Show error message in action box
            const alertBox = document.getElementById('actionSuggestion');
            alertBox.classList.remove('hidden');
            alertBox.style.borderColor = 'var(--neg)';
            alertBox.style.background = 'rgba(239, 68, 68, 0.1)';
            alertBox.style.color = '#fca5a5';
            document.getElementById('actionText').innerText = data.error;

            return;
        }

        // Show Results (Reset visibility)
        document.querySelector('.prob-bar').style.display = 'block';
        const box = document.getElementById('inlineResult');
        box.classList.remove('hidden');

        // Status Badge
        const badge = document.getElementById('resBadge');
        badge.innerText = data.prevision;
        badge.className = 'status-pill ' + data.prevision;

        // Prob Bar
        // Prob Bar
        const prob = Math.round(data.probabilidad * 100);
        document.getElementById('resProbability').innerText = prob + '% Confianza';
        const fill = document.getElementById('confidenceFill');
        fill.style.width = prob + '%';

        // Reset gradients - use solid colors for clean look
        fill.style.background = '';

        if (data.prevision === 'Positivo') {
            fill.style.backgroundColor = '#10b981';
            fill.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.3)';
        } else if (data.prevision === 'Negativo') {
            fill.style.backgroundColor = '#ef4444';
            fill.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.3)';
        } else {
            fill.style.backgroundColor = '#9ca3af';
            fill.style.boxShadow = 'none';
        }

        // Action Suggester logic
        const alertBox = document.getElementById('actionSuggestion');
        const actionText = document.getElementById('actionText');

        // Reset inline styles to rely partly on CSS class + border color override
        alertBox.style.background = '';
        alertBox.style.boxShadow = '';

        if (data.prevision === 'Negativo') {
            alertBox.classList.remove('hidden');
            alertBox.style.borderColor = '#ef4444';
            alertBox.style.color = '#fca5a5';

            if (text.toLowerCase().includes('lento') || text.toLowerCase().includes('espera')) {
                actionText.innerText = 'Detectada queja por tiempos. Escalar a Supervisor.';
            } else {
                actionText.innerText = 'Cliente insatisfecho. Prioridad alta para retención.';
            }
        } else if (data.prevision === 'Positivo') {
            alertBox.classList.remove('hidden');
            alertBox.style.borderColor = '#10b981';
            alertBox.style.color = '#6ee7b7';
            actionText.innerText = 'Cliente promotor. Sugerir dejar reseña pública o upsell.';
        } else {
            alertBox.classList.add('hidden');
        }
        // Features
        const featsContainer = document.getElementById('featuresContainer');
        const featsList = document.getElementById('featuresList');
        if (data.topFeatures && data.topFeatures.length > 0) {
            featsContainer.classList.remove('hidden');
            featsList.innerHTML = data.topFeatures.map(f => `<span class="tag">${f}</span>`).join(' ');
        } else {
            featsContainer.classList.add('hidden');
        }

        // Refresh stats
        loadStats(document.getElementById('statsLimitSelect').value);

    } catch (e) {
        console.error(e);
        alert("Error de conexión");
    } finally {
        btn.innerHTML = originalBtn;
    }
}

// BATCH
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
let lastBatchData = [];

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('hover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('hover');
    if (e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        document.getElementById('fileName').innerText = e.dataTransfer.files[0].name;
    }
});
fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) document.getElementById('fileName').innerText = e.target.files[0].name;
});


async function uploadBatch() {
    const file = fileInput.files[0];
    if (!file) return alert("Seleccione un archivo CSV primero.");

    const formData = new FormData();
    formData.append('file', file);

    const btn = document.querySelector('.secondary-btn');
    btn.innerText = 'Procesando...';

    try {
        const res = await fetch(`${API_URL}/batch`, { method: 'POST', body: formData });
        const data = await res.json();

        lastBatchData = data; // Save for export

        const tbody = document.getElementById('batchTableBody');
        tbody.innerHTML = '';
        document.getElementById('batchResults').classList.remove('hidden');

        // Show Export Button if it exists or create it
        let exportBtn = document.getElementById('exportBtn');
        if (!exportBtn) {
            exportBtn = document.createElement('button');
            exportBtn.id = 'exportBtn';
            exportBtn.className = 'secondary-btn';
            exportBtn.style.marginLeft = '1rem';
            exportBtn.style.borderColor = 'var(--accent)';
            exportBtn.style.color = 'var(--accent)';
            exportBtn.innerText = '💾 Descargar CSV';
            exportBtn.onclick = exportBatchCSV;
            document.querySelector('.batch-controls').appendChild(exportBtn);
        }

        data.forEach(item => {
            let color = item.prevision === 'Positivo' ? 'var(--pos)' : (item.prevision === 'Negativo' ? 'var(--neg)' : 'var(--neu)');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.texto.substring(0, 40)}...</td>
                <td style="font-weight:700; color:${color}">${item.prevision}</td>
                <td>${Math.round(item.probabilidad * 100)}%</td>
            `;
            tbody.appendChild(tr);
        });
        loadStats(document.getElementById('statsLimitSelect').value);

    } catch (e) {
        alert("Error al procesar archivo");
    } finally {
        btn.innerText = 'Procesar Datos';
    }
}


// Init
renderExamples();
loadStats();

function exportBatchCSV() {
    if (!lastBatchData || lastBatchData.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Texto,Sentimiento,Probabilidad,Score\n";

    lastBatchData.forEach(row => {
        let cleanText = row.texto ? row.texto.replace(/"/g, "\"\"") : "";
        let rowStr = `"${cleanText}","${row.prevision}","${row.probabilidad}","${Math.round(row.probabilidad * 100)}%"`;
        csvContent += rowStr + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_sentimientos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


