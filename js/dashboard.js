/**
 * Dashboard de Métricas de Suporte
 * Página independente do dashboard de templates (js/core.js): mostra o
 * valor identificado em risco de chargeback e a tendência semanal, buscando
 * os números já guardados no Worker (freshdesk-worker/) via Cloudflare KV.
 */

(function () {
  "use strict";

  const FRESHDESK_WORKER_URL = "https://freshdesk-proxy.fernandawinders1979.workers.dev";
  const APP_TOKEN_STORAGE_KEY = "freshdeskAppToken";
  const HISTORY_WEEKS = 8;

  // Paleta de status validada (skill de dataviz) para o fundo escuro do
  // site: o par vermelho/verde reprova em testes de daltonismo em QUALQUER
  // tom (é a confusão de cor mais comum), então cada série também tem um
  // formato de marcador e um estilo de linha diferente — a cor nunca é a
  // única forma de diferenciar as três.
  const RISK_ORDER = ["alto", "medio", "baixo"];
  const RISK_META = {
    alto: { label: "Alto", color: "#c73e3a", shape: "circle", dash: "" },
    medio: { label: "Médio", color: "#a88f18", shape: "square", dash: "7,4" },
    baixo: { label: "Baixo", color: "#1f9e8c", shape: "triangle", dash: "2,4" },
  };

  const statusEl = document.getElementById("metrics-status");
  const legendEl = document.getElementById("chart-legend");
  const chartEl = document.getElementById("trend-chart");
  const tooltipEl = document.getElementById("chart-tooltip");
  const tableBodyEl = document.querySelector("#trend-table tbody");

  const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  function setStatus(message, kind) {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.className = "ticket-search-status" + (kind ? ` is-${kind}` : "");
  }

  /**
   * Pega a senha de equipe já guardada nesta aba (mesma chave usada pelo
   * dashboard principal — se já autenticou lá, entra direto aqui também),
   * ou pede uma vez, já que esta página só existe para mostrar dado
   * protegido.
   * @returns {string|null}
   */
  function getAppToken() {
    let token = "";
    try {
      token = window.sessionStorage.getItem(APP_TOKEN_STORAGE_KEY) || "";
    } catch (error) {
      // Sem acesso a sessionStorage: segue sem guardar.
    }

    if (!token) {
      token = window.prompt("Senha de equipe para ver as métricas:");
      if (token) {
        try {
          window.sessionStorage.setItem(APP_TOKEN_STORAGE_KEY, token);
        } catch (error) {
          // Sem acesso a sessionStorage: só não persiste.
        }
      }
    }

    return token || null;
  }

  function clearStoredToken() {
    try {
      window.sessionStorage.removeItem(APP_TOKEN_STORAGE_KEY);
    } catch (error) {
      // Sem acesso a sessionStorage: não tinha nada guardado mesmo.
    }
  }

  function formatCurrency(value) {
    return currencyFormatter.format(value || 0);
  }

  /* =========================================================
     KPIs (valor identificado em risco alto)
     ========================================================= */
  function renderKpis(stats, history) {
    document.getElementById("kpi-valor-semana").textContent = formatCurrency(stats.altoValor);
    document.getElementById("kpi-casos-semana").textContent = `${stats.alto} caso(s) de risco alto`;

    const totalValor = history.reduce((sum, week) => sum + week.altoValor, 0);
    const totalCasos = history.reduce((sum, week) => sum + week.alto, 0);
    document.getElementById("kpi-valor-periodo").textContent = formatCurrency(totalValor);
    document.getElementById("kpi-casos-periodo").textContent = `${totalCasos} caso(s) de risco alto`;
    document.getElementById("kpi-periodo-semanas").textContent = String(HISTORY_WEEKS);
  }

  /* =========================================================
     Legenda (ícone com formato + cor + nome escrito — nunca só a cor)
     ========================================================= */
  function renderLegend() {
    if (!legendEl) return;
    legendEl.innerHTML = "";

    RISK_ORDER.forEach((level) => {
      const meta = RISK_META[level];
      const item = document.createElement("span");
      item.className = "chart-legend-item";

      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 12 12");
      icon.setAttribute("class", "chart-legend-icon");
      icon.appendChild(buildMarkerShape(meta.shape, 6, 6, meta.color));

      const text = document.createElement("span");
      text.textContent = meta.label;

      item.appendChild(icon);
      item.appendChild(text);
      legendEl.appendChild(item);
    });
  }

  /* =========================================================
     Gráfico de tendência (SVG desenhado à mão, sem biblioteca externa)
     ========================================================= */
  const CHART_WIDTH = 720;
  const CHART_HEIGHT = 320;
  const MARGIN = { top: 20, right: 20, bottom: 36, left: 34 };
  const PLOT_WIDTH = CHART_WIDTH - MARGIN.left - MARGIN.right;
  const PLOT_HEIGHT = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

  function svgEl(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs || {}).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  }

  function buildMarkerShape(shape, x, y, color) {
    const size = 4.5;
    if (shape === "square") {
      return svgEl("rect", { x: x - size * 0.85, y: y - size * 0.85, width: size * 1.7, height: size * 1.7, fill: color });
    }
    if (shape === "triangle") {
      const points = `${x},${y - size} ${x - size},${y + size * 0.8} ${x + size},${y + size * 0.8}`;
      return svgEl("polygon", { points, fill: color });
    }
    return svgEl("circle", { cx: x, cy: y, r: size, fill: color });
  }

  function xForIndex(index, count) {
    if (count <= 1) return MARGIN.left + PLOT_WIDTH / 2;
    return MARGIN.left + (PLOT_WIDTH * index) / (count - 1);
  }

  function yForValue(value, maxValue) {
    if (maxValue <= 0) return MARGIN.top + PLOT_HEIGHT;
    return MARGIN.top + PLOT_HEIGHT - (PLOT_HEIGHT * value) / maxValue;
  }

  function shortWeekLabel(weekKey) {
    // "2026-W29" -> "S29"
    const match = weekKey.match(/W(\d+)$/);
    return match ? `S${match[1]}` : weekKey;
  }

  function renderChart(history) {
    if (!chartEl) return;
    chartEl.innerHTML = "";

    const rawMax = Math.max(1, ...history.flatMap((week) => RISK_ORDER.map((level) => week[level])));
    const maxValue = Math.ceil(rawMax * 1.15);
    const count = history.length;

    // Grade horizontal (recessiva) + rótulos do eixo Y.
    const gridTicks = 4;
    for (let i = 0; i <= gridTicks; i++) {
      const value = Math.round((maxValue * i) / gridTicks);
      const y = yForValue(value, maxValue);
      chartEl.appendChild(
        svgEl("line", { x1: MARGIN.left, x2: CHART_WIDTH - MARGIN.right, y1: y, y2: y, class: "chart-gridline" }),
      );
      const label = svgEl("text", { x: MARGIN.left - 8, y: y + 3, class: "chart-axis-label", "text-anchor": "end" });
      label.textContent = String(value);
      chartEl.appendChild(label);
    }

    // Rótulos do eixo X (semana). Se houver muitas semanas, mostra 1 a cada 2.
    history.forEach((week, index) => {
      if (count > 8 && index % 2 !== 0 && index !== count - 1) return;
      const x = xForIndex(index, count);
      const label = svgEl("text", { x, y: CHART_HEIGHT - MARGIN.bottom + 18, class: "chart-axis-label", "text-anchor": "middle" });
      label.textContent = shortWeekLabel(week.week);
      chartEl.appendChild(label);
    });

    // Uma série por nível: linha + marcadores + rótulo direto no último ponto.
    RISK_ORDER.forEach((level) => {
      const meta = RISK_META[level];
      const points = history.map((week, index) => ({
        x: xForIndex(index, count),
        y: yForValue(week[level], maxValue),
        value: week[level],
      }));

      const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
      chartEl.appendChild(
        svgEl("path", {
          d: pathData,
          class: "chart-line",
          stroke: meta.color,
          "stroke-dasharray": meta.dash,
          fill: "none",
        }),
      );

      points.forEach((point) => chartEl.appendChild(buildMarkerShape(meta.shape, point.x, point.y, meta.color)));

      const last = points[points.length - 1];
      const directLabel = svgEl("text", {
        x: Math.min(last.x + 8, CHART_WIDTH - MARGIN.right + 2),
        y: last.y + 4,
        class: "chart-direct-label",
        fill: meta.color,
      });
      directLabel.textContent = `${meta.label} (${last.value})`;
      chartEl.appendChild(directLabel);
    });

    // Camada de "colunas" invisíveis por semana, para o hover mostrar os
    // três valores daquela semana de uma vez (crosshair simples).
    const crosshair = svgEl("line", {
      x1: 0, x2: 0, y1: MARGIN.top, y2: CHART_HEIGHT - MARGIN.bottom, class: "chart-crosshair", visibility: "hidden",
    });
    chartEl.appendChild(crosshair);

    const columnWidth = count <= 1 ? PLOT_WIDTH : PLOT_WIDTH / (count - 1);
    history.forEach((week, index) => {
      const x = xForIndex(index, count);
      const hitZone = svgEl("rect", {
        x: x - columnWidth / 2,
        y: MARGIN.top,
        width: columnWidth,
        height: PLOT_HEIGHT,
        class: "chart-hit-zone",
      });

      hitZone.addEventListener("mouseenter", () => {
        crosshair.setAttribute("x1", x);
        crosshair.setAttribute("x2", x);
        crosshair.setAttribute("visibility", "visible");
        showTooltip(week, x);
      });
      hitZone.addEventListener("mouseleave", () => {
        crosshair.setAttribute("visibility", "hidden");
        hideTooltip();
      });

      chartEl.appendChild(hitZone);
    });
  }

  function showTooltip(week, chartX) {
    if (!tooltipEl || !chartEl) return;
    tooltipEl.innerHTML = `
      <strong>${shortWeekLabel(week.week)}</strong><br>
      🔴 Alto: ${week.alto} (${formatCurrency(week.altoValor)})<br>
      🟡 Médio: ${week.medio}<br>
      🟢 Baixo: ${week.baixo}
    `;
    tooltipEl.hidden = false;

    const chartRect = chartEl.getBoundingClientRect();
    const relativeX = (chartX / CHART_WIDTH) * chartRect.width;
    tooltipEl.style.left = `${Math.min(relativeX + 12, chartRect.width - 160)}px`;
    tooltipEl.style.top = "8px";
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.hidden = true;
  }

  /* =========================================================
     Tabela (alternativa acessível ao gráfico, sempre disponível)
     ========================================================= */
  function renderTable(history) {
    if (!tableBodyEl) return;
    tableBodyEl.innerHTML = "";

    history.forEach((week) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${week.week}</td>
        <td>${week.alto} (${formatCurrency(week.altoValor)})</td>
        <td>${week.medio}</td>
        <td>${week.baixo}</td>
      `;
      tableBodyEl.appendChild(row);
    });
  }

  /* =========================================================
     Carregamento
     ========================================================= */
  async function loadMetrics() {
    const token = getAppToken();
    if (!token) {
      setStatus("É preciso informar a senha de equipe para ver as métricas.", "error");
      return;
    }

    setStatus("🔄 Carregando métricas...");

    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch(`${FRESHDESK_WORKER_URL}/risk-stats`, { headers: { "X-App-Token": token } }),
        fetch(`${FRESHDESK_WORKER_URL}/risk-history?weeks=${HISTORY_WEEKS}`, { headers: { "X-App-Token": token } }),
      ]);

      if (statsRes.status === 401 || historyRes.status === 401) {
        clearStoredToken();
        setStatus("Senha de equipe incorreta. Recarregue a página para tentar de novo.", "error");
        return;
      }

      if (!statsRes.ok || !historyRes.ok) {
        setStatus("Não foi possível carregar as métricas agora. Tente de novo em instantes.", "error");
        return;
      }

      const stats = await statsRes.json();
      const { weeks: history } = await historyRes.json();

      renderKpis(stats, history);
      renderLegend();
      renderChart(history);
      renderTable(history);
      setStatus("");
    } catch (error) {
      setStatus("Erro de conexão. Verifique sua internet e recarregue a página.", "error");
    }
  }

  loadMetrics();
})();
