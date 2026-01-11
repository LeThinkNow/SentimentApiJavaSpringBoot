document.addEventListener("DOMContentLoaded", function() {
    // 1. Buscamos los elementos en el HTML
    const elPos = document.getElementById('totalPos');
    const elNeg = document.getElementById('totalNeg');

    // 2. Si existen (ya se hizo un análisis), leemos el número. Si no, usamos 0.
    // Esto evita el error "Cannot read properties of null"
    const totalPos = elPos ? parseInt(elPos.innerText) : 0;
    const totalNeg = elNeg ? parseInt(elNeg.innerText) : 0;
    const totalNeu = 0;

    // 3. Solo renderizamos si hay datos reales
    if (elPos && elNeg) {
        renderCharts(totalPos, totalNeg, totalNeu);
    }
});

function renderCharts(pos, neg, neu) {
    const canvasPie = document.getElementById('pieChart');
    if (canvasPie) {
        const ctxPie = canvasPie.getContext('2d');
        new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['Positivos', 'Negativos', 'Neutros'],
                datasets: [{
                    data: [pos, neg, neu],
                    backgroundColor: ['#198754', '#dc3545', '#6c757d'],
                    hoverOffset: 4
                }]
            },
            options: { maintainAspectRatio: false, responsive: true }
        });
    }
}