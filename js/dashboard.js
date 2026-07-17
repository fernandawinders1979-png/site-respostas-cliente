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
  // Busca o dobro de semanas: as mais recentes continuam sendo o que já
  // aparece no gráfico/tabela, as mais antigas só servem de base pra
  // comparação ("X% em relação ao período anterior") nos KPIs.
  const COMPARISON_WEEKS = HISTORY_WEEKS * 2;

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

  const RANKING_LIMIT = 5;

  const statusEl = document.getElementById("metrics-status");
  const legendEl = document.getElementById("chart-legend");
  const chartEl = document.getElementById("trend-chart");
  const tooltipEl = document.getElementById("chart-tooltip");
  const tableBodyEl = document.querySelector("#trend-table tbody");
  const rankingMotivoEl = document.getElementById("ranking-motivo");
  const rankingTemplateEl = document.getElementById("ranking-template");

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

  /**
   * Mostra a variação percentual em relação a um valor anterior, num
   * elemento de texto pequeno abaixo do KPI. Trata os casos em que não dá
   * pra calcular uma porcentagem honesta (sem dado anterior, ou anterior
   * era zero) em vez de mostrar contas estranhas tipo "∞%".
   * @param {string} elementId
   * @param {number} currentValue
   * @param {number|null} previousValue null quando não há dado suficiente
   */
  function renderDelta(elementId, currentValue, previousValue) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (previousValue === null || previousValue === undefined) {
      el.textContent = "Sem comparação disponível ainda";
      el.className = "kpi-delta is-neutral";
      return;
    }

    if (previousValue === 0) {
      if (currentValue === 0) {
        el.textContent = "Sem mudança em relação ao período anterior";
        el.className = "kpi-delta is-neutral";
      } else {
        el.textContent = "↑ Não havia valor identificado no período anterior";
        el.className = "kpi-delta is-bad";
      }
      return;
    }

    const change = ((currentValue - previousValue) / previousValue) * 100;
    const rounded = Math.round(Math.abs(change));

    if (rounded === 0) {
      el.textContent = "Sem mudança em relação ao período anterior";
      el.className = "kpi-delta is-neutral";
      return;
    }

    const isDown = change < 0;
    el.textContent = `${isDown ? "↓" : "↑"} ${rounded}% em relação ao período anterior`;
    el.className = `kpi-delta ${isDown ? "is-good" : "is-bad"}`;
  }

  /**
   * @param {Object} stats semana atual (GET /risk-stats)
   * @param {Array} history últimas HISTORY_WEEKS semanas (mais antiga -> mais recente)
   * @param {Array} previousHistory as HISTORY_WEEKS semanas anteriores a essas, para comparação
   */
  function renderKpis(stats, history, previousHistory) {
    document.getElementById("kpi-valor-semana").textContent = formatCurrency(stats.altoValor);
    document.getElementById("kpi-casos-semana").textContent = `${stats.alto} caso(s) de risco alto`;

    const previousWeek = history.length >= 2 ? history[history.length - 2] : null;
    renderDelta("kpi-delta-semana", stats.altoValor, previousWeek ? previousWeek.altoValor : null);

    const totalValor = history.reduce((sum, week) => sum + week.altoValor, 0);
    const totalCasos = history.reduce((sum, week) => sum + week.alto, 0);
    document.getElementById("kpi-valor-periodo").textContent = formatCurrency(totalValor);
    document.getElementById("kpi-casos-periodo").textContent = `${totalCasos} caso(s) de risco alto`;
    document.getElementById("kpi-periodo-semanas").textContent = String(HISTORY_WEEKS);

    const hasFullPreviousPeriod = (previousHistory || []).length >= HISTORY_WEEKS;
    const previousTotalValor = (previousHistory || []).reduce((sum, week) => sum + week.altoValor, 0);
    renderDelta("kpi-delta-periodo", totalValor, hasFullPreviousPeriod ? previousTotalValor : null);
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
      icon.setAttribute("width", "12");
      icon.setAttribute("height", "12");
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
  const CHART_HEIGHT = 220;
  const MARGIN = { top: 20, right: 20, bottom: 32, left: 34 };
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
     Rankings (motivos de contato, templates mais usados) — gráfico de
     barras horizontais, com grade e eixo (mesmo estilo visual do gráfico
     de tendência). Cor única (verde da marca): aqui a cor não identifica
     nada — não é uma série categórica, só ilustra a magnitude — então o
     nome de cada item vem escrito diretamente ao lado da barra.
     ========================================================= */
  const RANKING_CHART_WIDTH = 680;
  const RANKING_LABEL_WIDTH = 200;
  const RANKING_ROW_HEIGHT = 34;
  const RANKING_BAR_HEIGHT = 14;
  const RANKING_TOP_PAD = 24;
  const RANKING_RIGHT_PAD = 46;
  const RANKING_LABEL_MAX_CHARS = 26;

  function truncateLabel(label) {
    if (label.length <= RANKING_LABEL_MAX_CHARS) return label;
    return `${label.slice(0, RANKING_LABEL_MAX_CHARS - 1)}…`;
  }

  function renderRanking(container, items) {
    if (!container) return;
    container.innerHTML = "";

    if (!items || items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "ai-note";
      empty.textContent = "Ainda sem dados suficientes nesse período.";
      container.appendChild(empty);
      return;
    }

    const plotLeft = RANKING_LABEL_WIDTH;
    const plotRight = RANKING_CHART_WIDTH - RANKING_RIGHT_PAD;
    const plotWidth = plotRight - plotLeft;
    const chartHeight = RANKING_TOP_PAD + items.length * RANKING_ROW_HEIGHT + 4;

    const maxCount = Math.max(1, ...items.map((item) => item.count));
    const scaleX = (value) => plotLeft + (plotWidth * value) / maxCount;

    const svg = svgEl("svg", {
      viewBox: `0 0 ${RANKING_CHART_WIDTH} ${chartHeight}`,
      class: "trend-chart ranking-chart",
      role: "img",
    });

    // Grade vertical (recessiva) + rótulos do eixo de quantidade, no topo.
    const gridTicks = 4;
    for (let i = 0; i <= gridTicks; i++) {
      const value = Math.round((maxCount * i) / gridTicks);
      const x = scaleX(value);
      svg.appendChild(
        svgEl("line", { x1: x, x2: x, y1: RANKING_TOP_PAD - 6, y2: chartHeight, class: "chart-gridline" }),
      );
      const label = svgEl("text", { x, y: 12, class: "chart-axis-label", "text-anchor": "middle" });
      label.textContent = String(value);
      svg.appendChild(label);
    }

    items.forEach((item, index) => {
      const y = RANKING_TOP_PAD + index * RANKING_ROW_HEIGHT;
      const barWidth = Math.max(0, scaleX(item.count) - plotLeft);

      const labelText = svgEl("text", {
        x: plotLeft - 10,
        y: y + RANKING_BAR_HEIGHT / 2 + 4,
        class: "chart-axis-label ranking-chart-label",
        "text-anchor": "end",
      });
      labelText.textContent = truncateLabel(item.label);
      labelText.appendChild(svgEl("title", {})).textContent = item.label;

      const bar = svgEl("rect", {
        x: plotLeft,
        y,
        width: barWidth,
        height: RANKING_BAR_HEIGHT,
        rx: 3,
        class: "ranking-chart-bar",
      });

      const valueText = svgEl("text", {
        x: plotLeft + barWidth + 6,
        y: y + RANKING_BAR_HEIGHT / 2 + 4,
        class: "chart-direct-label ranking-chart-value",
      });
      valueText.textContent = String(item.count);

      svg.appendChild(labelText);
      svg.appendChild(bar);
      svg.appendChild(valueText);
    });

    container.appendChild(svg);
  }

  /* =========================================================
     Volume de atendimento (respostas copiadas, por semana) — gráfico de
     barras verticais, reaproveitando os eixos/escala do gráfico de
     tendência (mesmo CHART_WIDTH/CHART_HEIGHT/MARGIN, mesmo viewBox no
     dashboard.html).
     ========================================================= */
  function renderVolumeChart(history) {
    const svg = document.getElementById("volume-chart");
    if (!svg) return;
    svg.innerHTML = "";

    const count = history.length;
    const maxCount = Math.max(1, ...history.map((week) => week.count));

    const gridTicks = 4;
    for (let i = 0; i <= gridTicks; i++) {
      const value = Math.round((maxCount * i) / gridTicks);
      const y = yForValue(value, maxCount);
      svg.appendChild(
        svgEl("line", { x1: MARGIN.left, x2: CHART_WIDTH - MARGIN.right, y1: y, y2: y, class: "chart-gridline" }),
      );
      const label = svgEl("text", { x: MARGIN.left - 8, y: y + 3, class: "chart-axis-label", "text-anchor": "end" });
      label.textContent = String(value);
      svg.appendChild(label);
    }

    history.forEach((week, index) => {
      if (count > 8 && index % 2 !== 0 && index !== count - 1) return;
      const x = xForIndex(index, count);
      const label = svgEl("text", { x, y: CHART_HEIGHT - MARGIN.bottom + 18, class: "chart-axis-label", "text-anchor": "middle" });
      label.textContent = shortWeekLabel(week.week);
      svg.appendChild(label);
    });

    const barBottom = CHART_HEIGHT - MARGIN.bottom;
    const barWidth = count > 0 ? Math.max(8, (PLOT_WIDTH / count) * 0.5) : 20;

    history.forEach((week, index) => {
      const x = xForIndex(index, count);
      const yTop = yForValue(week.count, maxCount);
      const bar = svgEl("rect", {
        x: x - barWidth / 2,
        y: yTop,
        width: barWidth,
        height: Math.max(0, barBottom - yTop),
        rx: 3,
        class: "ranking-chart-bar",
      });
      bar.appendChild(svgEl("title", {})).textContent = `${shortWeekLabel(week.week)}: ${week.count}`;
      svg.appendChild(bar);
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
      const rankingUrl = (category) =>
        `${FRESHDESK_WORKER_URL}/stat-ranking?category=${category}&weeks=${HISTORY_WEEKS}&limit=${RANKING_LIMIT}`;

      const [statsRes, historyRes, motivoRes, templateRes, volumeRes] = await Promise.all([
        fetch(`${FRESHDESK_WORKER_URL}/risk-stats`, { headers: { "X-App-Token": token } }),
        fetch(`${FRESHDESK_WORKER_URL}/risk-history?weeks=${COMPARISON_WEEKS}`, { headers: { "X-App-Token": token } }),
        fetch(rankingUrl("motivo"), { headers: { "X-App-Token": token } }),
        fetch(rankingUrl("template"), { headers: { "X-App-Token": token } }),
        fetch(`${FRESHDESK_WORKER_URL}/stat-history?category=resposta&key=total&weeks=${HISTORY_WEEKS}`, {
          headers: { "X-App-Token": token },
        }),
      ]);

      const responses = [statsRes, historyRes, motivoRes, templateRes, volumeRes];
      if (responses.some((res) => res.status === 401)) {
        clearStoredToken();
        setStatus("Senha de equipe incorreta. Recarregue a página para tentar de novo.", "error");
        return;
      }

      if (responses.some((res) => !res.ok)) {
        setStatus("Não foi possível carregar as métricas agora. Tente de novo em instantes.", "error");
        return;
      }

      const stats = await statsRes.json();
      const { weeks: fullHistory } = await historyRes.json();
      const motivoRanking = await motivoRes.json();
      const templateRanking = await templateRes.json();
      const volumeHistory = await volumeRes.json();

      const history = fullHistory.slice(-HISTORY_WEEKS);
      const previousHistory = fullHistory.slice(0, Math.max(0, fullHistory.length - HISTORY_WEEKS));

      renderKpis(stats, history, previousHistory);
      renderLegend();
      renderChart(history);
      renderTable(history);
      renderRanking(rankingMotivoEl, motivoRanking.items);
      renderRanking(rankingTemplateEl, templateRanking.items);
      renderVolumeChart(volumeHistory.weeks);

      const volumeTotalEl = document.getElementById("volume-total-semana");
      if (volumeTotalEl) {
        const thisWeekCount = volumeHistory.weeks[volumeHistory.weeks.length - 1]?.count || 0;
        volumeTotalEl.textContent = `${thisWeekCount} resposta(s) enviada(s) esta semana`;
      }

      setStatus("");
    } catch (error) {
      setStatus("Erro de conexão. Verifique sua internet e recarregue a página.", "error");
    }
  }

  document.querySelectorAll(".ranking-weeks-count").forEach((el) => {
    el.textContent = String(HISTORY_WEEKS);
  });

  loadMetrics();
})();
