import { useState, useEffect } from 'react';

// ─── TEMA ─────────────────────────────────────────────────────────────────────
const T = {
  bg: '#f5f5fa',
  surface: '#ffffff',
  card: '#ffffff',
  border: '#e2e2ee',
  gold: '#a07828',
  goldDim: '#c9a84c15',
  goldBorder: '#c9a84c40',
  text: '#1a1a2e',
  textMuted: '#5a5a7a',
  textDim: '#9898b8',
  green: '#16a34a',
  greenBg: '#f0fdf4',
  yellow: '#ca8a04',
  yellowBg: '#fefce8',
  red: '#dc2626',
  redBg: '#fef2f2',
  purple: '#7c3aed',
  purpleBg: '#f5f3ff',
  blue: '#0284c7',
  blueBg: '#f0f9ff',
};

// ─── API ──────────────────────────────────────────────────────────────────────
async function callClaude(prompt, userContent, maxTokens = 1500, fileData = null) {
  const contentArr = [];
  if (fileData) contentArr.push(fileData);
  contentArr.push({ type: 'text', text: `${prompt}\n\n---\n\n${userContent}` });
  const res = await fetch('/api/analisar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: contentArr }],
    }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`API ${res.status}: ${raw.slice(0, 120)}`);
  let data;
  try { data = JSON.parse(raw); } catch (_) { throw new Error('Resposta inválida da API'); }
  const txt = (data.content || []).map((i) => (i.type === 'text' ? i.text : '')).join('').trim();
  if (!txt) throw new Error('Resposta vazia');
  const clean = txt.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try { return JSON.parse(clean); } catch (_) {}
  const m = txt.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (_) {} }
  throw new Error(`JSON inválido: ${txt.slice(0, 80)}`);
}

// ─── COMPONENTES COMPARTILHADOS ───────────────────────────────────────────────
const inp = {
  background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
  padding: '10px 12px', color: T.text, fontSize: 13, outline: 'none',
  width: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif',
};
const sel = { ...inp, cursor: 'pointer' };

function Btn({ children, onClick, disabled, variant = 'primary', style = {} }) {
  const base = {
    border: 'none', borderRadius: 10, padding: '11px 18px', fontSize: 13, fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8, transition: 'opacity 0.2s', fontFamily: 'sans-serif', ...style,
  };
  const v = {
    primary: { background: disabled ? '#1a1a28' : `linear-gradient(135deg,${T.gold},#9a6818)`, color: disabled ? T.textDim : '#0a0a14' },
    ghost: { background: 'transparent', border: `1px solid ${T.border}`, color: T.textMuted },
    danger: { background: T.redBg, border: `1px solid ${T.red}25`, color: T.red },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant] }}>{children}</button>;
}

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
      style={{ background: ok ? T.greenBg : 'transparent', border: `1px solid ${ok ? T.green : T.border}`, color: ok ? T.green : T.textMuted, borderRadius: 7, padding: '4px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'monospace', transition: 'all 0.2s' }}>
      {ok ? '✓ COPIADO' : 'COPIAR'}
    </button>
  );
}

function Tag({ children, color = T.gold, bg }) {
  return <span style={{ background: bg || `${color}12`, border: `1px solid ${color}28`, color, borderRadius: 6, padding: '3px 9px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>{children}</span>;
}

function Lbl({ children }) {
  return <div style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>{children}</div>;
}

function Err({ msg }) {
  if (!msg) return null;
  return <div style={{ color: T.red, fontSize: 12, background: `${T.red}10`, border: `1px solid ${T.red}22`, borderRadius: 8, padding: '10px 14px', marginBottom: 12, lineHeight: 1.6 }}>⚠ {msg}</div>;
}

function Card({ children, style = {}, accent }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${accent ? `${accent}35` : T.border}`, borderRadius: 14, padding: 20, marginBottom: 12, position: 'relative', overflow: 'hidden', ...style }}>
      {accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},transparent)` }} />}
      {children}
    </div>
  );
}

function Title({ children, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, margin: '0 0 5px', color: T.text }}>{children}</h2>
      {sub && <p style={{ color: T.textMuted, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function InfoBox({ children, color = T.gold }) {
  return <div style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 10, padding: '10px 14px', marginBottom: 14, color, fontSize: 12, lineHeight: 1.6 }}>{children}</div>;
}

// ─── PROMPTS JURÍDICOS ────────────────────────────────────────────────────────

// ── ALTERAÇÃO 1: BASE JURÍDICA EXPANDIDA ──────────────────────────────────────
const P_ANALISE = `Você é um advogado trabalhista sênior com 20 anos de experiência no Brasil. Analise o relato do lead com máxima precisão técnica, usando toda a base jurídica abaixo.

════════════════════════════════════════
LEGISLAÇÃO FEDERAL
════════════════════════════════════════
CLT: arts. 9 (nulidade de ato prejudicial), 29, 41, 58-62 (jornada/sobreaviso/prontidão), 74 (controle de ponto — obrigatório acima de 10 empregados), 118 (estabilidade acidentado), 129-143 (férias), 143 (conversão em abono), 166-200 (segurança e medicina do trabalho), 223-A a 223-G (dano existencial e extrapatrimonial — Reforma 2017), 240, 394-A (gestante em local insalubre), 441-507 (rescisão), 467 (multa por atraso de verbas rescisórias), 477 (prazo pagamento rescisão — 10 dias), 482-483 (justa causa / rescisão indireta), 611-A (prevalência da negociação coletiva), 611-B (direitos irrenunciáveis — rol taxativo).
CF/88 art. 7º: I (FGTS/despedida arbitrária), II (seguro-desemprego), IV (salário mínimo), VI (irredutibilidade salarial), VIII (13º salário), IX (adicional noturno mín. 20%), XIII (jornada 8h/44h semanal), XIV (turno de revezamento 6h), XV (repouso semanal remunerado), XVI (hora extra mín. 50%), XVII (férias + 1/3), XVIII (licença-maternidade 120 dias), XIX (licença-paternidade), XXII (saúde e segurança), XXIII (adicional insalubridade/periculosidade), XXIX (prescrição: 5 anos durante contrato, 2 anos após extinção), XXX (proibição diferença salarial por sexo/idade/cor/estado civil), XXXI (proibição discriminação ao portador de deficiência).
Leis complementares: 8.036/90 (FGTS — art. 18 §1º multa 40%; art. 20 hipóteses de saque), 9.029/95 (discriminação na relação de trabalho), 9.601/98 (contrato por prazo determinado), 10.101/00 (PLR), 11.788/08 (estágio — art. 15: vínculo se descumpridos requisitos), 12.506/11 (aviso prévio proporcional: 30 dias base + 3 dias por ano completo, máx. 90 dias), 13.467/17 (Reforma Trabalhista: art. 444 PLT, art. 58-A tempo parcial, art. 443 contrato intermitente, art. 507-A cláusula arbitral acima de 2x teto RGPS), 14.611/23 (igualdade salarial entre homens e mulheres — relatório de transparência obrigatório para empresas acima de 100 empregados), LGPD 13.709/18 (proteção de dados do trabalhador).

════════════════════════════════════════
SÚMULAS DO TST — COMPLETAS E ATUALIZADAS
════════════════════════════════════════
[RESCISÃO E ESTABILIDADE]
Súm. 6 — Equiparação salarial: requisitos (mesma função, mesmo empregador, mesmo estabelecimento, diferença máx. 4 anos na função, 2 anos no cargo; paradigma vivo na função).
Súm. 21 — Contrato por prazo determinado: ausência de aviso prévio não gera direito a indenização, salvo cláusula assecuratória.
Súm. 29 — Nulidade de rescisão: quando a ruptura do contrato é ilegal, presume-se que o vínculo não foi interrompido.
Súm. 43 — Presunção de despedida arbitrária: alteração da condição de trabalho — ônus do empregador provar motivação legítima.
Súm. 51 — Norma regulamentar: quando alterada, aplica-se a nova para admitidos após a mudança e a anterior para os demais (§ único: direito adquirido ao regulamento vigente).
Súm. 212 — Ônus da prova da dispensa: do empregador, inclusive quanto à modalidade (com ou sem justa causa).
Súm. 291 — Aviso prévio proporcional (antes da Lei 12.506/11): 3 dias por ano de serviço, limitado a 60 dias. Após a lei: 3 dias/ano, máx. 90 dias total.
Súm. 369 — Dirigente sindical: garantia de emprego desde registro da candidatura até 1 ano após o mandato (CF art. 8º VIII).
Súm. 377 — FGTS no aviso prévio indenizado: integra a base de cálculo do depósito.
Súm. 378 — Estabilidade acidentado (art. 118 CLT): não se exige afastamento superior a 15 dias; basta nexo causal e CAT (ou reconhecimento pelo INSS).
Súm. 390 — Estabilidade do servidor público celetista: aplicável a estados e municípios que não adotaram regime estatutário.
Súm. 392 — Gestante — garantia de emprego: confirmação da gravidez antes ou após a dispensa não afasta a nulidade (mesmo sem ciência do empregador).
Súm. 396 — Estabilidade provisória — indenização: se expirado o período sem a reintegração, a indenização é devida do início até o fim do período.
Súm. 443 — Doença grave estigmatizante: presunção de dispensa discriminatória (HIV, hepatite, neoplasia, alcoolismo, etc.) — nulidade ou indenização.
Súm. 450 — Férias: pagamento fora do prazo legal gera direito a pagamento em dobro, incluindo o terço constitucional.

[JORNADA E HORAS EXTRAS]
Súm. 85 — Compensação de jornada: acordo individual escrito é válido para compensação semanal; banco de horas exige ACT/CCT.
Súm. 105 — Motorista/cobrador: tempo de espera integra a jornada se à disposição do empregador.
Súm. 112 — Trabalho em condições insalubres: não excluí cômputo de horas extras.
Súm. 116 — Adicional noturno: hora noturna reduzida (52'30''); devido mesmo após as 5h da manhã se a jornada se iniciou no período noturno.
Súm. 132 — Adicional de periculosidade: eletricitários — incide sobre a remuneração total (acórdão SDI-1).
Súm. 138 — Semana espanhola (sistema 6x1 com compensação): nulo se não amparado por norma coletiva.
Súm. 159 — Horas extras habituais: integram a remuneração para todos os fins (DSR, férias, 13º, aviso prévio, FGTS).
Súm. 172 — Adicional noturno: integra a base de cálculo das horas extras noturnas.
Súm. 199 — Bancário — horas extras: a 6ª hora diária é extra para os enquadrados no art. 224 CLT; cargo de confiança diferenciado (§ 2º) faz jornada de 8h.
Súm. 228 — Insalubridade: base de cálculo é o salário mínimo (após declaração de inconstitucionalidade parcial do art. 192 CLT pelo STF — RE 565.714), salvo norma coletiva mais favorável.
Súm. 264 — Salário-hora: divisor 200 (mensalista) e 150 (semanalista 5 dias) para cálculo de horas extras.
Súm. 296 — Horas extras: comprovação pelo empregado das horas que excederem o limite legal; ônus do empregador para diferenças internas.
Súm. 338 — Ponto eletrônico / controle de jornada: ônus do empregador com mais de 10 empregados; ausência de registro inverte o ônus.
Súm. 340 — Comissionista puro: horas extras = 50% sobre a hora normal calculada pela média das comissões.
Súm. 360 — Contrato de trabalho — horas extras: o acordo de prorrogação de jornada não pode ser tácito.
Súm. 374 — Sobreaviso: regime de pré-contratação via celular/aplicativo que restrinja a liberdade de locomoção é sobreaviso (1/3 da hora normal).
Súm. 376 — Adicional noturno em transferência: mantém-se o adicional se o horário noturno era habitual antes da transferência.
Súm. 388 — Motorista profissional (Lei 13.103/15): tempo de espera não é horas extras; jornada diária 8h, semanal 44h.
Súm. 437 — Intervalo intrajornada: supressão total ou parcial gera pagamento integral do período suprimido como hora extra (§ 4º art. 71 CLT — mesmo após Reforma para contratos anteriores).
Súm. 444 — Jornada 12x36: válida se prevista em lei ou negociação coletiva; integra feriados e DSRs.

[FÉRIAS E DESCANSO]
Súm. 7 — Férias: é possível recorrer ao TST de decisão que condena em dobro sem prova de ausência de concessão.
Súm. 149 — Rurícola: prescrição de 2 anos após extinção (CF art. 7º XXIX). Antes da CF/88: apenas ação trabalhista em 2 anos.
Súm. 261 — Férias proporcionais: devidas mesmo no pedido de demissão com menos de 12 meses (art. 147 CLT).
Súm. 328 — Férias + 1/3: integra a remuneração para fins de cálculo do 13º e demais verbas que tomam como base a remuneração.
Súm. 381 — 13º salário proporcional: o aviso prévio indenizado integra o tempo de serviço para fins de proporcionalidade.
Súm. 386 — Domingos e feriados (comércio): o trabalho nesses dias, sem compensação ou pagamento, gera adicional de 100%.

[FGTS E MULTA]
Súm. 246 — FGTS na justa causa: não há multa de 40%, salvo se a justa causa for declarada inválida.
Súm. 362 — Prescrição do FGTS: trintenária antes da ADC 58/STF (2020); após a ADC 58 — prescrição de 5 anos, limitada a 30 anos para contratos anteriores.
Súm. 461 — FGTS: o empregador que não efetua os depósitos no prazo é responsável pela correção monetária e juros (art. 22 Lei 8.036/90).

[VÍNCULO EMPREGATÍCIO E TERCEIRIZAÇÃO]
Súm. 212 — Ônus da prova da despedida: do empregador.
Súm. 257 — Vigilante — vínculo: reconhecido com a empresa tomadora se ausente contrato de vigilância registrado.
Súm. 331 — Terceirização: (I) ilícita quando relacionada à atividade-fim, salvo trabalho temporário; (II) não forma vínculo com a Administração Pública; (III) responsabilidade subsidiária da tomadora pelas verbas inadimplidas; (IV) tomadora pública — responsabilidade mediante comprovação de culpa in vigilando; (V) licitude da terceirização de atividade-fim após ADPF 324/STF e RE 958.252 (2018) — qualquer atividade pode ser terceirizada; (VI) responsabilidade subsidiária da tomadora permanece mesmo após a liberalização.
Súm. 363 — Vínculo nulo (administração pública sem concurso): direito apenas ao saldo salarial e FGTS; sem outras verbas.
Súm. 386 — Franquia: pode ou não gerar vínculo com a franqueadora, dependendo das circunstâncias fáticas.
Súm. 443 — Presunção de dispensa discriminatória: inversão do ônus da prova.

[DANO MORAL E EXTRAPATRIMONIAL]
Súm. 37 — Danos morais e patrimoniais: podem ser cumulados na mesma ação (aplicado ao processo do trabalho por analogia — arts. 223-A a 223-G CLT).
Arts. 223-A a 223-G CLT (Reforma 2017): regulam o dano extrapatrimonial trabalhista; tarifação por ofensa (leve, média, grave, gravíssima) com base no último salário contratual — questionada perante STF (ADI 6050, 6069, 6082 — julgamento pendente parcial).

[HONORÁRIOS E CUSTAS]
Súm. 219 — Honorários advocatícios trabalhistas: antes da Reforma — apenas com assistência sindical e estado de miserabilidade (10-20%). Após 11.11.2017: art. 791-A CLT — sucumbência de 5 a 15%, mesmo para beneficiários da justiça gratuita (§ 4º — suspenso se insuficiência de créditos).
Súm. 329 — Honorários: a declaração de pobreza gera presunção relativa de hipossuficiência.

[PRESCRIÇÃO]
Súm. 308 — Prescrição: conta-se a partir da lesão (actio nata), não do término do contrato.
Súm. 362 — FGTS: trintenária até 13/11/2014; após ADC 58/STF (2020): 5 anos, limitado a 30 anos para períodos anteriores.
Súm. 382 — Prescrição — contrato nulo (menor de 18 anos): não corre durante a menoridade.

════════════════════════════════════════
ORIENTAÇÕES JURISPRUDENCIAIS — SDI-1
════════════════════════════════════════
OJ 24 — Adicional de transferência (art. 469 §3º CLT): devido ao empregado transferido provisoriamente sem anuência — 25% sobre o salário.
OJ 57 — Adicional noturno: redução da hora noturna (52'30'') aplica-se às prorrogações em horário diurno posterior às 5h.
OJ 103 — Bancário — tempo no banco: o tempo gasto em trajeto entre bancos é computado como jornada.
OJ 155 — Gratificação de função: se recebida por 10 anos ou mais, incorpora-se ao salário (irredutibilidade).
OJ 195 — Repouso semanal remunerado: supressão habitual gera reflexos em outras verbas (férias, 13º, aviso prévio).
OJ 215 — Aviso prévio: o prazo prescricional só se inicia após o término do aviso prévio (trabalhado ou indenizado).
OJ 232 — Prescrição declaratória: cabe declaratória do vínculo mesmo após prescrição da pretensão condenatória.
OJ 273 — Rescisão indireta — FGTS: devida a multa de 40% na rescisão indireta.
OJ 275 — Motorista — horas de espera (anterior à Lei 13.103/15): compõem a jornada se o empregado permanece à disposição.
OJ 295 — FGTS — atraso: depósito intempestivo gera correção monetária integral.
OJ 321 — Contrato de experiência: prorrogado tacitamente além de 90 dias converte-se em prazo indeterminado.
OJ 361 — Prescrição FGTS: 30 anos para contratos anteriores a 14/11/2019; 5 anos para contratos posteriores (ADC 58/2020).
OJ 363 — Reconhecimento de vínculo: ônus da prova do empregado quando nega o vínculo o suposto empregador.
OJ 394 — Gestante — contrato de experiência: a garantia de emprego aplica-se mesmo durante o contrato de experiência.
OJ 400 — Salário in natura — habitação: não integra a base do FGTS quando é condição indispensável ao trabalho.
OJ 417 — Empregado rural — motorista: se transporta insumos da atividade rural, é rurícola.

════════════════════════════════════════
ORIENTAÇÕES JURISPRUDENCIAIS — SDI-2
════════════════════════════════════════
OJ 65 — Mandado de segurança — penhora de dinheiro: é legítima a penhora de dinheiro para garantia de execução trabalhista.
OJ 142 — Ação rescisória — erro de fato: configurado quando a decisão admite fato inexistente ou desconsidera fato existente.

════════════════════════════════════════
ORIENTAÇÕES JURISPRUDENCIAIS — SDC
════════════════════════════════════════
OJ 5 — Dissídio coletivo — greve: é abusiva a greve que não observa o prazo de comunicação prévia de 72h (serviços essenciais: 96h).
OJ 17 — Cláusula normativa — ultratividade: após a Reforma (art. 614 §3º CLT) é vedada a ultratividade; instrumentos coletivos vigoram por prazo certo máx. 2 anos.

════════════════════════════════════════
TEMAS REPETITIVOS VINCULANTES — TST
════════════════════════════════════════
Tema 1 — Acordo de compensação de jornada (banco de horas): invalidade do acordo tácito ou verbal; exige instrumento escrito ou norma coletiva. Banco de horas anual exige ACT/CCT (Súm. 85, V).
Tema 2 — Intervalo intrajornada (art. 71 CLT): supressão total ou parcial — pagamento integral do período como hora extra com adicional de 50%. Após Reforma (contrato pós 11/11/17): apenas o período suprimido com natureza indenizatória (não mais hora extra).
Tema 3 — Intervalo interjornada (art. 66 CLT): supressão gera pagamento das horas faltantes como extras (OJ 355 SDI-1).
Tema 4 — FGTS — prescrição — ADC 58: contratos extintos antes de 14/11/2019 — prescrição trintenária até o máximo de 30 anos. Contratos iniciados após: 5 anos.
Tema 5 — Terceirização lícita após ADPF 324 e RE 958.252 (STF, 2018): qualquer atividade pode ser terceirizada, inclusive atividade-fim. Súm. 331 itens V e VI permanecem (responsabilidade subsidiária da tomadora).
Tema 6 — Empregado hipersuficiente (art. 444 §único CLT): salário ≥ 2x teto do RGPS + diploma de nível superior — pode pactuar individualmente condições previstas no art. 611-A. Entendimento controverso; STF ainda analisa (ADI 5766).
Tema 7 — Dano extrapatrimonial — tarifação (arts. 223-A a 223-G CLT): constitucionalidade debatida no STF (ADIs 6050/6069/6082); TRT's divergem. Tese majoritária: tarifação não impede fixação superior se proporcional à gravidade, vedado apenas o non liquet.
Tema 8 — Gratuidade da justiça (art. 790 §3º CLT pós-Reforma): basta declaração de insuficiência de recursos; não exige comprovação documental (Súm. 463 TST).
Tema 9 — Honorários sucumbenciais do beneficiário da gratuidade (art. 791-A §4º CLT): suspensos por 2 anos se insuficiência de créditos — STF declarou parcialmente inconstitucional na ADI 5766 (honorários periciais não podem ser cobrados do beneficiário da gratuidade).
Tema 10 — Contrato intermitente (art. 443 §3º CLT): compatível com a CF/88; convocação não aceita não gera indenização; FGTS sobre valor recebido por convocação.
Tema 11 — Ultratividade de norma coletiva (art. 614 §3º CLT): vedada após a Reforma; instrumentos coletivos vigoram por prazo determinado máx. 2 anos, sem prorrogação automática.
Tema 12 — Rescisão por acordo (art. 484-A CLT): multa FGTS 20%; aviso prévio 50%; sem seguro-desemprego; saque de 80% do FGTS.
Tema 13 — Assédio moral organizacional: configurado por condutas sistemáticas do empregador que degradam o ambiente de trabalho — gera dano moral coletivo e individual (art. 223-C CLT).
Tema 14 — Teletrabalho / home office (art. 75-A a 75-E CLT): controle de jornada — se houver, gera horas extras; sem controle: exclui o capítulo de duração (art. 62 III CLT). Acordo individual escrito obrigatório.
Tema 15 — Trabalho em plataformas digitais (uberização): STF — RE 1.446.336 (Repercussão Geral reconhecida, 2024) — definirá se há vínculo empregatício entre motoristas de aplicativo e plataformas. Pendente de julgamento definitivo. TRTs divergem: TRT-2 (SP), TRT-3 (MG) e TRT-15 (Campinas) já reconheceram vínculo em casos concretos.

════════════════════════════════════════
SÚMULAS DE TRTs — POR MATÉRIA RELEVANTE
════════════════════════════════════════
[HORAS EXTRAS / JORNADA]
TRT-2 (SP) Súm. 24 — Controle de ponto: ausência de registro inverte o ônus da prova em favor do empregado.
TRT-3 (MG) Súm. 58 — Sobreaviso via celular: restrição à liberdade de locomoção configura sobreaviso (1/3).
TRT-4 (RS) Súm. 60 — Horas extras habituais: integram a remuneração para todos os reflexos, inclusive aviso prévio.
TRT-15 (Campinas) Súm. 32 — Banco de horas unilateral: inválido sem previsão em norma coletiva.
TRT-18 (GO) Súm. 5 — Intervalo intrajornada: supressão parcial — pagamento integral do período, não apenas do tempo suprimido.

[VÍNCULO EMPREGATÍCIO / TERCEIRIZAÇÃO]
TRT-1 (RJ) Súm. 26 — Tomadora de serviço: responsabilidade subsidiária reconhecida independentemente de integrar licitação pública, desde que haja culpa in vigilando.
TRT-2 (SP) Súm. 15 — Pejotização: configurado o vínculo quando presentes os requisitos do art. 3º CLT, ainda que mediante contrato de prestação de serviços com pessoa jurídica.
TRT-3 (MG) Súm. 43 — Terceirização ilícita: reconhecimento de vínculo direto com a tomadora se configurada fraude.
TRT-12 (SC) Súm. 29 — Plataforma digital: análise casuística dos elementos fáticos; presunção de vínculo se houver controle de jornada e exclusividade.

[RESCISÃO / ESTABILIDADE]
TRT-4 (RS) Súm. 49 — Gestante em contrato de experiência: garantia de emprego desde a concepção, independentemente do conhecimento do empregador.
TRT-9 (PR) Súm. 15 — Aviso prévio proporcional: o período proporcional (Lei 12.506/11) integra o contrato para fins de contagem de tempo de serviço e FGTS.
TRT-9 (PR) Súm. 21 — Rescisão indireta: comprovado o descumprimento culposo do empregador (art. 483 CLT), são devidas todas as verbas da demissão sem justa causa, incluindo multa FGTS 40%.
TRT-15 (Campinas) Súm. 41 — Doença ocupacional: nexo causal presumido quando a atividade é de risco; ônus do empregador afastar o nexo.
TRT-10 (DF/TO) Súm. 18 — Dispensa discriminatória: reintegração ou indenização em dobro (Lei 9.029/95 art. 4º), à escolha do empregado.

[DANO MORAL / EXTRAPATRIMONIAL]
TRT-2 (SP) Súm. 42 — Assédio moral: presunção relativa quando a conduta do superior hierárquico é reiterada e documentada por testemunhos.
TRT-3 (MG) Súm. 59 — Dano existencial: configurado quando a supressão habitual do intervalo intrajornada ou jornada excessiva compromete o projeto de vida do empregado.
TRT-15 (Campinas) Súm. 45 — Tarifação do dano extrapatrimonial: o teto do art. 223-G CLT não é absoluto; o juiz pode superar se a lesão for gravíssima e concretamente demonstrada.
TRT-9 (PR) Súm. 19 — Dano moral por revista íntima: configura ofensa à dignidade (art. 5º X CF/88), independentemente de consentimento.

[FGTS / VERBAS RESCISÓRIAS]
TRT-1 (RJ) Súm. 32 — FGTS — atraso sistemático: gera dano material autônomo, além da correção monetária.
TRT-4 (RS) Súm. 55 — Multa do art. 477 CLT: devida quando o pagamento das verbas rescisórias superar 10 dias da extinção do contrato, salvo comprovação de pagamento parcial tempestivo.
TRT-9 (PR) Súm. 16 — Multa do art. 467 CLT: incide sobre verbas rescisórias incontroversas não pagas na audiência.

[PLATAFORMAS DIGITAIS — TENDÊNCIA]
TRT-2 (SP) — Decisões de turmas (2023-2024): reconhecimento de vínculo de motoristas Uber e iFood quando demonstrados controle algorítmico, exclusividade de fato e subordinação estrutural.
TRT-3 (MG) — Idem, com tese de subordinação por dependência econômica.
TRT-15 (Campinas) — Idem, acrescentando que a unilateralidade das regras da plataforma configura poder diretivo.

════════════════════════════════════════
REGRAS DE ANÁLISE
════════════════════════════════════════
1. Identifique TODAS as violações possíveis, inclusive as não óbvias (ex.: dano existencial por jornada excessiva, acúmulo de funções sem adicional, assédio moral organizacional).
2. Cite sempre o fundamento legal mais específico disponível (artigo + lei + súmula/OJ/Tema Repetitivo).
3. Considere súmulas de TRTs quando houver indicação da localidade do lead.
4. Avalie provas disponíveis versus provas a levantar.
5. Alerte sobre prescrição iminente (< 6 meses do término do contrato).
6. Nível forte: 3+ violações sólidas com fundamento claro. Moderado: 1-2 violações ou prova fraca. Fraco: situação sem violações claras ou prescrição consumada.

RESPONDA SOMENTE com o JSON abaixo (sem markdown, sem texto extra):
{"nome":"nome ou Não informado","cidade":"cidade ou Não informada","situacao":"empregado|demitido|rescisão indireta|autônomo|PJ|não informado","tempo_empresa":"X anos Y meses ou não informado","salario_estimado":"valor mensal estimado ou não informado","violacoes":["descrição clara da irregularidade"],"fundamentos":["Art. X CLT — descrição","Súmula X TST — descrição","OJ X SDI-1 — descrição","Tema Repetitivo X TST — descrição"],"trt_aplicavel":"TRT competente com base na cidade informada, ou null","sumulas_trt":["Súmula X TRT-Y — descrição aplicável ao caso, se houver"],"provas_mencionadas":["prova citada no relato"],"provas_sugeridas":["prova que deve ser levantada"],"nivel":"forte|moderado|fraco","justificativa":"frase técnica explicando o nível","prescricao_alerta":"alerta sobre prazo prescricional se relevante ou null","alerta_risco":"risco jurídico ou estratégico ou null"}`;

const P_MENSAGEM = (abordagem, instrucao) => `Você é um advogado trabalhista gerando mensagens de WhatsApp para FECHAR CONTRATO.
ABORDAGEM: ${abordagem} — ${instrucao}
REGRAS ABSOLUTAS:
- Máximo 5 linhas. Mensagem objetiva e direta.
- NUNCA prometer resultado, valor ou êxito (violação EOAB arts. 34 e 39)
- Citar algo ESPECÍFICO do caso — nunca genérico
- Encerrar com pergunta de fechamento direta ("Quando fica bom pra você?", "Posso te ligar amanhã às X?")
- Máximo 1 emoji, preferencialmente nenhum
- Referenciar CLT/TST/CF88 para demonstrar autoridade
RESPONDA SOMENTE com o JSON (sem markdown):
{"mensagem_principal":"texto aqui","followup_24h":"texto aqui","por_que_fecha":"razão técnica de fechamento"}`;

const P_OBJECAO = `Você é um advogado trabalhista expert em fechamento de contratos. Responda à objeção do cliente com empatia e argumentação jurídica sólida. Respeite o EOAB: sem prometer resultados ou valores, sem captação explícita.
RESPONDA SOMENTE com o JSON (sem markdown):
{"validacao":"frase empática que valida o sentimento sem concordar com a desistência","resposta_whatsapp":"mensagem WhatsApp (máx 4 linhas, tom humano, termina com pergunta)","resposta_presencial":"resposta para ligação ou encontro presencial (2-3 frases diretas)","argumento_juridico":"fundamento técnico específico que fortalece o caso do cliente","erro_comum":"o que o advogado NÃO deve dizer nessa situação"}`;

const P_CONTRATO = `Você é um advogado especialista em contratos de honorários trabalhistas. Gere um contrato profissional e completo baseado no Estatuto da OAB (Lei 8.906/94), Regulamento Geral e EOAB.

O contrato deve conter obrigatoriamente:
1. QUALIFICAÇÃO DAS PARTES — completa com CPF, endereço, OAB
2. OBJETO — descrição das pretensões trabalhistas com fundamentos (CLT/CF88)
3. HONORÁRIOS — valor/percentual, forma de pagamento, honorários de sucumbência (art. 791-A CLT c/c art. 85 CPC)
4. OBRIGAÇÕES DO CONTRATANTE — fornecer documentos, comparecer a audiências, comunicar mudanças
5. OBRIGAÇÕES DO ADVOGADO — diligência, sigilo (art. 34 EOAB), dever de informar
6. PRAZO E PRESCRIÇÃO — alerta sobre prazo de 2 anos pós-extinção e 5 anos durante o contrato (art. 7º XXIX CF/88, art. 11 CLT)
7. DESPESAS PROCESSUAIS — custas, perícias, diligências
8. RESCISÃO CONTRATUAL — hipóteses e consequências
9. PROTEÇÃO DE DADOS — LGPD (Lei 13.709/18)
10. FORO — Vara do Trabalho da localidade (art. 651 CLT)
11. ASSINATURAS — local, data, testemunhas

RESPONDA SOMENTE com o JSON (sem markdown):
{"contrato":"texto integral do contrato formatado com quebras de linha \\n"}`;

const P_VERBAS_IA = `Você é um contador especialista em direito trabalhista. Revise o cálculo e identifique verbas adicionais não óbvias que podem ter sido perdidas.
RESPONDA SOMENTE com o JSON (sem markdown):
{"verbas_extras":["verba não calculada e fundamento"],"alertas":["alerta técnico importante"],"observacao":"nota sobre a estimativa"}`;

const P_CONTEUDO = `Você é um especialista em comunicação jurídica para advogados trabalhistas. Crie conteúdo educativo e informativo dentro das normas do EOAB (art. 39 — sem mercantilização, sem promessas, sem captação explícita).
RESPONDA SOMENTE com o JSON (sem markdown):
{"titulo":"título chamativo e legal","corpo":"texto completo pronto para postar (use quebras de linha)","hashtags":"5 hashtags relevantes","cta":"chamada para ação sutil e dentro do EOAB","melhor_horario":"quando postar para maximizar alcance"}`;

const P_ANUNCIO = `Você é um especialista em tráfego pago para serviços jurídicos trabalhistas. Crie textos dentro das normas do EOAB (art. 39 — sem prometer resultados, sem captação, informativo).
RESPONDA SOMENTE com o JSON (sem markdown):
{"titulo_principal":"título (máx 30 chars)","descricao":"descrição (máx 90 chars)","texto_feed":"texto para feed (2-3 linhas informativas)","headline":"headline impactante (máx 40 chars)","palavras_chave":["kw1","kw2","kw3","kw4","kw5"],"segmentacao":"dica de público e segmentação","orcamento_sugerido":"sugestão de investimento mínimo para resultado"}`;

const P_INDICACAO = `Você é um advogado trabalhista criando mensagem para reativar relacionamento com ex-cliente e pedir indicação, dentro do EOAB (sem captação, sem oferta de serviços diretamente).
RESPONDA SOMENTE com o JSON (sem markdown):
{"mensagem_whatsapp":"mensagem natural e humanizada para WhatsApp","mensagem_email":"versão para e-mail ou LinkedIn, mais formal","por_que_funciona":"razão psicológica e técnica da abordagem"}`;

// ─── ABORDAGENS E FORMATOS ────────────────────────────────────────────────────
const ABORDAGENS = [
  { id: 'urgencia',   icon: '⚡', label: 'Urgência',       cor: T.red,    desc: 'Lead procrastinando — prescrição em risco' },
  { id: 'empatia',    icon: '🤝', label: 'Empatia',        cor: T.purple, desc: 'Lead abalado, inseguro, com medo' },
  { id: 'autoridade', icon: '⚖️', label: 'Autoridade',     cor: T.gold,   desc: 'Lead quer sentir que fala com expert' },
  { id: 'racional',   icon: '📊', label: 'Racional',       cor: T.blue,   desc: 'Lead quer entender antes de decidir' },
  { id: 'exclusivo',  icon: '🎯', label: 'Exclusividade',  cor: T.green,  desc: 'Lead precisa do empurrão final' },
];

const INSTRUCOES = {
  urgencia:   'Mencione DIRETAMENTE o prazo prescricional de 2 anos após extinção do contrato (art. 7º XXIX CF/88, art. 11 CLT). Cada dia sem agir é risco real de perder direitos. Tom firme e respeitoso.',
  empatia:    'Valide o sofrimento primeiro. Mostre que entende a situação difícil. O advogado é parceiro, não vendedor. Tom acolhedor, humano. Cite proteção legal que ampara essa pessoa.',
  autoridade: 'Demonstre domínio técnico imediato. Cite artigos da CLT e Súmulas do TST aplicáveis ao caso. Tom seguro, de referência no assunto. O cliente deve sentir que está com o melhor.',
  racional:   'Apresente os direitos de forma objetiva. Relate o que ele tem a ganhar e o risco de não agir. Cite o percentual de êxito da área. Tom educativo, transparente, sem pressão.',
  exclusivo:  'Crie senso de oportunidade — atenção personalizada, análise completa feita, janela aberta agora. Tom de oportunidade única sem desespero. Valorize o tempo que já dedicou ao caso.',
};

const FORMATOS = [
  { id: 'whatsapp', icon: '💬', label: 'WhatsApp',         desc: 'Curto e direto, máx 5 linhas' },
  { id: 'email',    icon: '📧', label: 'E-mail',           desc: 'Formal, completo, com saudação' },
  { id: 'ligacao',  icon: '📞', label: 'Roteiro de Ligação', desc: 'Script para falar ao telefone' },
  { id: 'formal',   icon: '📋', label: 'Mensagem Formal',  desc: 'Profissional para LinkedIn/escritório' },
];

const P_MENSAGEM_FORMATO = (abordagem, instrucao, formato) => `Você é um advogado trabalhista gerando comunicação para FECHAR CONTRATO.
ABORDAGEM: ${abordagem} — ${instrucao}
FORMATO: ${formato === 'whatsapp' ? 'WhatsApp — máximo 5 linhas, tom direto, informal mas profissional' : formato === 'email' ? 'E-mail — com Assunto, saudação formal, corpo de 3-4 parágrafos, despedida' : formato === 'ligacao' ? 'Roteiro de ligação telefônica — com abertura, desenvolvimento e fechamento em tópicos curtos para o advogado falar' : 'Mensagem formal — tom institucional, adequado para LinkedIn ou comunicação de escritório'}
REGRAS ABSOLUTAS:
- NUNCA prometer resultado, valor ou êxito (violação EOAB arts. 34 e 39)
- Citar algo ESPECÍFICO do caso — nunca genérico
- Terminar sempre com pergunta de fechamento direta
- Referenciar CLT/TST/CF88 para demonstrar autoridade
RESPONDA SOMENTE com o JSON (sem markdown):
{"mensagem_principal":"texto completo aqui","followup_24h":"texto de acompanhamento 24h depois no mesmo formato","por_que_fecha":"razão técnica desta combinação abordagem+formato"}`;

const NC = { forte: T.green, moderado: T.yellow, fraco: T.red };
const NB = { forte: T.greenBg, moderado: T.yellowBg, fraco: T.redBg };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const novaEntrada = (icone, txt) => ({
  icone, txt, auto: true,
  data: new Date().toLocaleDateString('pt-BR'),
  hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
});

function BtnSalvarCRM({ savedCRM, onSave }) {
  return (
    <button onClick={onSave} disabled={savedCRM}
      style={{ width: '100%', background: savedCRM ? T.greenBg : T.surface, border: `1px solid ${savedCRM ? T.green : T.border}`, borderRadius: 10, padding: '10px 16px', cursor: savedCRM ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, transition: 'all 0.2s' }}>
      <span style={{ fontSize: 16 }}>{savedCRM ? '✓' : '📋'}</span>
      <div style={{ textAlign: 'left' }}>
        <div style={{ color: savedCRM ? T.green : T.text, fontSize: 13, fontWeight: 600 }}>{savedCRM ? 'Salvo no CRM!' : 'Salvar lead no CRM'}</div>
        <div style={{ color: T.textMuted, fontSize: 11 }}>{savedCRM ? 'Lead adicionado com dados da análise' : 'Preenche nome, caso, violações e situação'}</div>
      </div>
    </button>
  );
}

// ─── 1. ANALISAR LEAD ─────────────────────────────────────────────────────────
// ── ALTERAÇÃO 2: FUNIL COMPLETO — step 0 = saudação, step 1 = coleta nome/cidade, step 2 = relato
function ToolLead({ onSaveCRM }) {
  const [step, setStep]           = useState(0);   // 0=saudação 1=coleta 2=relato 3=análise 4=mensagens 5=objeções
  const [leadNome, setLeadNome]   = useState('');
  const [leadCidade, setLeadCidade] = useState('');
  const [txt, setTxt]             = useState('');
  const [analysis, setAnalysis]   = useState(null);
  const [msgs, setMsgs]           = useState(null);
  const [ab, setAb]               = useState('urgencia');
  const [fmt, setFmt]             = useState('whatsapp');
  const [loading, setLoading]     = useState(false);
  const [err, setErr]             = useState('');
  const [arquivo, setArquivo]     = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [savedCRM, setSavedCRM]   = useState(false);
  const [histAuto, setHistAuto]   = useState([]);

  const handleArquivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErr('');

    if (file.name.endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
      try {
        const JSZipMod = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
        const JSZip = JSZipMod.default || JSZipMod;
        const zip = await JSZip.loadAsync(file);
        let textoConversa = '';
        const arquivosAudio = [];
        for (const [nome, entry] of Object.entries(zip.files)) {
          if (!entry.dir) {
            if (nome.endsWith('.txt')) textoConversa = await entry.async('string');
            else if (nome.match(/\.(mp4|m4a|opus|ogg|aac|mp3)$/i)) arquivosAudio.push(nome);
          }
        }
        if (textoConversa) {
          setTxt(textoConversa.slice(0, 8000));
          setNomeArquivo(file.name + ' ✓ conversa extraída');
          setArquivo(null);
          if (arquivosAudio.length > 0) setErr('✓ Conversa extraída! ' + arquivosAudio.length + ' áudio(s) encontrado(s) — transcrição automática em breve.');
        } else {
          setErr('Nenhum texto encontrado no ZIP. Confirme se é exportação do WhatsApp.');
        }
      } catch (_) { setErr('Erro ao abrir o ZIP. Extraia manualmente e cole o texto aqui.'); }
      return;
    }

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => { setTxt(reader.result.slice(0, 8000)); setNomeArquivo(file.name); setArquivo(null); };
      reader.readAsText(file, 'UTF-8');
      return;
    }

    if (file.type.startsWith('audio/') || file.name.match(/\.(mp4|m4a|opus|ogg|aac|mp3)$/i)) {
      setNomeArquivo(file.name + ' (áudio — cole a transcrição abaixo)');
      setArquivo(null);
      setErr('Áudio recebido! Cole a transcrição manualmente no campo acima.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      const isPdf = file.type === 'application/pdf';
      const isImg = file.type.startsWith('image/');
      if (isPdf) setArquivo({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } });
      else if (isImg) setArquivo({ type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } });
      else { setErr('Formato não suportado. Use PDF, imagem, TXT ou ZIP do WhatsApp.'); return; }
      setNomeArquivo(file.name);
    };
    reader.readAsDataURL(file);
  };

  const analisar = async () => {
    if (txt.trim().length < 5 && !arquivo) { setErr('Descreva o caso ou anexe um arquivo.'); return; }
    setErr(''); setLoading(true);
    try {
      const contexto = `${leadNome ? `Nome do lead: ${leadNome}\n` : ''}${leadCidade ? `Cidade: ${leadCidade}\n` : ''}---\n${txt || 'Analise o documento anexado.'}`;
      const r = await callClaude(P_ANALISE, contexto, 1800, arquivo);
      setAnalysis(r);
      setHistAuto(prev => [...prev, novaEntrada('⚡', `Análise gerada — nível ${(r.nivel || '').toUpperCase()} — ${(r.violacoes || []).slice(0,2).join(', ')}`)]);
      setStep(3);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const gerarMsgs = async (abId, fmtId) => {
    const id = abId || ab;
    const fid = fmtId || fmt;
    setAb(id); setFmt(fid); setLoading(true); setErr('');
    try {
      const ctx = `Nome: ${analysis.nome}\nCidade: ${analysis.cidade || leadCidade || 'não informada'}\nSituação: ${analysis.situacao}\nTempo: ${analysis.tempo_empresa}\nViolações: ${(analysis.violacoes || []).join('; ')}\nFundamentos: ${(analysis.fundamentos || []).slice(0, 3).join('; ')}`;
      const r = await callClaude(P_MENSAGEM_FORMATO(ABORDAGENS.find((a) => a.id === id)?.label, INSTRUCOES[id], fid), ctx);
      setMsgs({ ...r, abId: id, fmtId: fid });
      const abLabel = ABORDAGENS.find((a) => a.id === id)?.label || id;
      const fmtLabel = FORMATOS.find((f) => f.id === fid)?.label || fid;
      setHistAuto(prev => [...prev, novaEntrada('📨', `Mensagem gerada — tom ${abLabel} · ${fmtLabel}`)]);
      setStep(4);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const salvarCRM = () => {
    if (!analysis || savedCRM) return;
    const entradaSalvo = novaEntrada('📥', 'Lead cadastrado no CRM');
    const novo = {
      id: Date.now(),
      nome: analysis.nome !== 'Não informado' ? analysis.nome : (leadNome || 'Lead sem nome'),
      contato: '',
      caso: (analysis.violacoes || []).slice(0, 2).join(', '),
      stage: 'novo',
      vinculo: analysis.situacao,
      tempo: analysis.tempo_empresa,
      salario: analysis.salario_estimado,
      violacoes: (analysis.violacoes || []).join('; '),
      docs: [],
      hist: [...histAuto, entradaSalvo],
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('lf_leads') || '[]');
      localStorage.setItem('lf_leads', JSON.stringify([novo, ...existing]));
      setSavedCRM(true);
      if (onSaveCRM) onSaveCRM();
    } catch (_) {}
  };

  const resetTudo = () => {
    setStep(0); setLeadNome(''); setLeadCidade(''); setTxt('');
    setAnalysis(null); setMsgs(null); setArquivo(null); setNomeArquivo('');
    setSavedCRM(false); setHistAuto([]); setErr('');
  };

  // ── STEP 0: SAUDAÇÃO ─────────────────────────────────────────────────────────
  if (step === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 16px 24px' }}>
      <div style={{ width: 64, height: 64, background: `linear-gradient(135deg,${T.gold},#7a5810)`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 20 }}>⚖️</div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: T.text, margin: '0 0 10px' }}>
        Bem-vindo ao Analisador de Leads
      </h2>
      <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.7, maxWidth: 440, margin: '0 0 8px' }}>
        Aqui você analisa o caso do seu lead com base jurídica completa — CLT, TST, OJs e Temas Repetitivos — e recebe mensagens prontas para fechar o contrato.
      </p>
      <p style={{ color: T.textDim, fontSize: 12, lineHeight: 1.6, maxWidth: 400, margin: '0 0 28px', fontStyle: 'italic' }}>
        Em menos de 1 minuto você terá a análise jurídica e as abordagens de fechamento personalizadas para este lead.
      </p>
      <Btn onClick={() => setStep(1)} style={{ padding: '14px 32px', fontSize: 14 }}>
        → Iniciar análise do lead
      </Btn>
    </div>
  );

  // ── STEP 1: COLETA DE NOME E CIDADE ──────────────────────────────────────────
  if (step === 1) return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button onClick={() => setStep(0)} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 7, padding: '6px 12px', color: T.textMuted, fontSize: 12, cursor: 'pointer' }}>← Voltar</button>
        <Title sub="Antes de começar, informe os dados básicos do lead.">📋 Dados do Lead</Title>
      </div>

      {/* Barra de progresso */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {['Dados', 'Relato', 'Análise', 'Fechar'].map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', height: 3, borderRadius: 2, background: i === 0 ? T.gold : T.border }} />
            <span style={{ fontSize: 9, color: i === 0 ? T.gold : T.textDim, fontFamily: 'monospace' }}>{s}</span>
          </div>
        ))}
      </div>

      <Card accent={T.gold}>
        <InfoBox color={T.blue}>
          💡 Essas informações ajudam a personalizar as mensagens de fechamento e identificar o TRT competente para o caso.
        </InfoBox>

        <div style={{ marginBottom: 14 }}>
          <Lbl>Nome do lead</Lbl>
          <input
            value={leadNome}
            onChange={(e) => setLeadNome(e.target.value)}
            placeholder="ex: João da Silva"
            style={inp}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && setStep(2)}
          />
          <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>Opcional — mas personaliza muito as mensagens de fechamento</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Lbl>Cidade do lead</Lbl>
          <input
            value={leadCidade}
            onChange={(e) => setLeadCidade(e.target.value)}
            placeholder="ex: Londrina - PR"
            style={inp}
            onKeyDown={(e) => e.key === 'Enter' && setStep(2)}
          />
          <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>Permite identificar o TRT competente e jurisprudência regional aplicável</div>
        </div>

        <Btn onClick={() => setStep(2)} style={{ width: '100%', padding: 14 }}>
          → Continuar para o relato do caso
        </Btn>
        <button onClick={() => setStep(2)} style={{ width: '100%', background: 'transparent', border: 'none', color: T.textDim, fontSize: 12, cursor: 'pointer', marginTop: 10, padding: 6 }}>
          Pular esta etapa
        </button>
      </Card>
    </div>
  );

  // ── STEP 2: RELATO DO CASO ────────────────────────────────────────────────────
  if (step === 2) return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button onClick={() => setStep(1)} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 7, padding: '6px 12px', color: T.textMuted, fontSize: 12, cursor: 'pointer' }}>← Voltar</button>
        <Title sub="Cole o relato ou anexe um arquivo — PDF, print, foto do documento.">
          ⚡ Relato do Caso{leadNome ? ` — ${leadNome}` : ''}
        </Title>
      </div>

      {/* Barra de progresso */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {['Dados', 'Relato', 'Análise', 'Fechar'].map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', height: 3, borderRadius: 2, background: i <= 1 ? T.gold : T.border }} />
            <span style={{ fontSize: 9, color: i <= 1 ? T.gold : T.textDim, fontFamily: 'monospace' }}>{s}</span>
          </div>
        ))}
      </div>

      {leadNome && (
        <div style={{ background: T.goldDim, border: `1px solid ${T.goldBorder}`, borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>👤</span>
          <div>
            <span style={{ color: T.gold, fontSize: 13, fontWeight: 600 }}>{leadNome}</span>
            {leadCidade && <span style={{ color: T.textMuted, fontSize: 12 }}> · {leadCidade}</span>}
          </div>
        </div>
      )}

      <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={7}
        placeholder="Cole aqui o relato do lead trabalhista...&#10;&#10;Ex: 'Fui demitido depois de 6 anos sem receber horas extras...'"
        style={{ ...inp, resize: 'vertical', lineHeight: 1.7, fontSize: 14, padding: 16 }}
        onFocus={(e) => (e.target.style.borderColor = `${T.gold}55`)}
        onBlur={(e) => (e.target.style.borderColor = T.border)} />
      <div style={{ textAlign: 'right', fontSize: 11, color: T.textDim, fontFamily: 'monospace', margin: '4px 0 12px' }}>{txt.length} caracteres</div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, background: nomeArquivo ? T.greenBg : T.surface, border: `1px solid ${nomeArquivo ? T.green : T.border}`, borderRadius: 10, padding: '12px 16px', cursor: 'pointer', marginBottom: 14, transition: 'all 0.2s' }}>
        <input type="file" accept=".pdf,.zip,.txt,.mp4,.m4a,.opus,.ogg,.aac,.mp3,image/*" onChange={handleArquivo} style={{ display: 'none' }} />
        <span style={{ fontSize: 18 }}>{nomeArquivo ? '✓' : '📎'}</span>
        <div>
          <div style={{ color: nomeArquivo ? T.green : T.text, fontSize: 13, fontWeight: 600 }}>{nomeArquivo || 'Anexar arquivo — PDF, imagem ou ZIP do WhatsApp'}</div>
          <div style={{ color: T.textMuted, fontSize: 11, marginTop: 2 }}>{nomeArquivo ? 'Arquivo pronto para análise' : 'ZIP do WhatsApp, PDF, print, áudio (.mp4/.opus/.m4a)...'}</div>
        </div>
        {nomeArquivo && (
          <button onClick={(e) => { e.preventDefault(); setArquivo(null); setNomeArquivo(''); }}
            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: T.red, fontSize: 16, cursor: 'pointer' }}>✕</button>
        )}
      </label>

      <Err msg={err} />
      <Btn onClick={analisar} disabled={loading} style={{ width: '100%', padding: 15 }}>
        {loading ? '⏳ Analisando com base jurídica completa...' : '→ Analisar Lead'}
      </Btn>
    </div>
  );

  // ── STEP 3: RESULTADO DA ANÁLISE ──────────────────────────────────────────────
  if (step === 3 && analysis) {
    const nv = analysis.nivel?.toLowerCase();
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <button onClick={() => setStep(2)} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 7, padding: '6px 12px', color: T.textMuted, fontSize: 12, cursor: 'pointer' }}>← Voltar</button>
          <Title sub="Análise jurídica completa com base na CLT, TST, OJs e Temas Repetitivos.">Análise do Caso</Title>
        </div>

        {/* Barra de progresso */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {['Dados', 'Relato', 'Análise', 'Fechar'].map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: 3, borderRadius: 2, background: i <= 2 ? T.gold : T.border }} />
              <span style={{ fontSize: 9, color: i <= 2 ? T.gold : T.textDim, fontFamily: 'monospace' }}>{s}</span>
            </div>
          ))}
        </div>

        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            {[['Lead', analysis.nome], ['Cidade', analysis.cidade || leadCidade || 'Não informada'], ['Situação', analysis.situacao], ['Tempo', analysis.tempo_empresa], ['Salário est.', analysis.salario_estimado]].map(([k, v]) => (
              <div key={k}><Lbl>{k}</Lbl><div style={{ color: T.text, fontSize: 13 }}>{v || 'Não informado'}</div></div>
            ))}
            {analysis.trt_aplicavel && (
              <div style={{ gridColumn: '1/-1' }}>
                <Lbl>TRT Competente</Lbl>
                <div style={{ color: T.blue, fontSize: 13, fontWeight: 600 }}>{analysis.trt_aplicavel}</div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: NB[nv] || T.surface, borderRadius: 8, marginBottom: 14 }}>
            <Tag color={NC[nv] || T.textMuted} bg={NB[nv]}>{(analysis.nivel || '').toUpperCase()}</Tag>
            <span style={{ color: NC[nv] || T.textMuted, fontSize: 13, fontStyle: 'italic' }}>{analysis.justificativa}</span>
          </div>
          <Lbl>Violações Identificadas</Lbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {(analysis.violacoes || []).map((v, i) => <Tag key={i} color={T.gold}>{v}</Tag>)}
          </div>
          <Lbl>Fundamentos Jurídicos — TST / CLT / CF</Lbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: analysis.sumulas_trt?.length ? 10 : 14 }}>
            {(analysis.fundamentos || []).map((f, i) => (
              <div key={i} style={{ background: T.surface, borderRadius: 6, padding: '6px 10px', color: T.textMuted, fontSize: 12, fontFamily: 'monospace' }}>{f}</div>
            ))}
          </div>
          {(analysis.sumulas_trt || []).length > 0 && (
            <>
              <Lbl>Jurisprudência Regional — {analysis.trt_aplicavel || 'TRT'}</Lbl>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                {(analysis.sumulas_trt || []).map((s, i) => (
                  <div key={i} style={{ background: T.blueBg, borderRadius: 6, padding: '6px 10px', color: T.blue, fontSize: 12, fontFamily: 'monospace', border: `1px solid ${T.blue}20` }}>{s}</div>
                ))}
              </div>
            </>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <Lbl>Provas Mencionadas</Lbl>
              {(analysis.provas_mencionadas || []).map((p, i) => <div key={i} style={{ color: T.green, fontSize: 12, padding: '2px 0' }}>✓ {p}</div>)}
              {!(analysis.provas_mencionadas || []).length && <div style={{ color: T.textDim, fontSize: 12 }}>Nenhuma citada</div>}
            </div>
            <div>
              <Lbl>Provas a Levantar</Lbl>
              {(analysis.provas_sugeridas || []).map((p, i) => <div key={i} style={{ color: T.yellow, fontSize: 12, padding: '2px 0' }}>→ {p}</div>)}
            </div>
          </div>
        </Card>

        {analysis.prescricao_alerta && analysis.prescricao_alerta !== 'null' && (
          <InfoBox color={T.red}>⏰ <strong>Prescrição:</strong> {analysis.prescricao_alerta}</InfoBox>
        )}
        {analysis.alerta_risco && analysis.alerta_risco !== 'null' && (
          <InfoBox color={T.yellow}>⚠ <strong>Risco:</strong> {analysis.alerta_risco}</InfoBox>
        )}

        <Card style={{ background: T.surface }}>
          <Lbl>🎯 Escolha a abordagem de fechamento</Lbl>
          <p style={{ color: T.textMuted, fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>Cada abordagem gera mensagens completamente diferentes. Escolha com base no perfil do lead.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {ABORDAGENS.map((a) => (
              <button key={a.id} onClick={() => setAb(a.id)}
                style={{ background: ab === a.id ? `${a.cor}12` : T.card, border: `1px solid ${ab === a.id ? a.cor : T.border}`, borderRadius: 9, padding: '11px 14px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s' }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ color: ab === a.id ? a.cor : T.text, fontSize: 13, fontWeight: 700 }}>{a.label}</span>
                  <span style={{ color: T.textMuted, fontSize: 11, marginLeft: 8 }}>{a.desc}</span>
                </div>
                {ab === a.id && <span style={{ color: a.cor }}>✓</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card style={{ background: T.surface }}>
          <Lbl>📄 Formato da mensagem</Lbl>
          <p style={{ color: T.textMuted, fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>Escolha como quer se comunicar com esse lead.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {FORMATOS.map((f) => (
              <button key={f.id} onClick={() => setFmt(f.id)}
                style={{ background: fmt === f.id ? `${T.gold}12` : T.card, border: `1px solid ${fmt === f.id ? T.gold : T.border}`, borderRadius: 9, padding: '10px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 16, marginBottom: 3 }}>{f.icon}</div>
                <div style={{ color: fmt === f.id ? T.gold : T.text, fontSize: 12, fontWeight: 700 }}>{f.label}</div>
                <div style={{ color: T.textMuted, fontSize: 10, marginTop: 2 }}>{f.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        <BtnSalvarCRM savedCRM={savedCRM} onSave={salvarCRM} />
        <Err msg={err} />
        <Btn onClick={() => gerarMsgs(ab, fmt)} disabled={loading} style={{ width: '100%', padding: 14 }}>
          {loading ? '⏳ Gerando mensagem...' : `→ Gerar ${FORMATOS.find(f=>f.id===fmt)?.icon} ${FORMATOS.find(f=>f.id===fmt)?.label} com tom ${ABORDAGENS.find((a) => a.id === ab)?.icon} ${ABORDAGENS.find((a) => a.id === ab)?.label}`}
        </Btn>
      </div>
    );
  }

  // ── STEP 4: MENSAGENS ──────────────────────────────────────────────────────────
  if (step === 4 && msgs) {
    const abObj = ABORDAGENS.find((a) => a.id === msgs.abId);
    const fmtObj = FORMATOS.find((f) => f.id === msgs.fmtId);
    return (
      <div>
        <Title sub="Copie e cole no canal escolhido.">Mensagem Pronta ✓</Title>

        {/* Barra de progresso */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {['Dados', 'Relato', 'Análise', 'Fechar'].map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: 3, borderRadius: 2, background: T.gold }} />
              <span style={{ fontSize: 9, color: T.gold, fontFamily: 'monospace' }}>{s}</span>
            </div>
          ))}
        </div>

        {abObj && fmtObj && (
          <InfoBox color={abObj.cor}>
            {fmtObj.icon} <strong>{fmtObj.label}</strong> · tom {abObj.icon} <strong>{abObj.label}</strong> — {abObj.desc}
          </InfoBox>
        )}
        {[['MENSAGEM PRINCIPAL', 'mensagem_principal', T.gold], ['ACOMPANHAMENTO 24H', 'followup_24h', T.purple]].map(([lbl, key, cor]) => (
          <Card key={key} accent={cor}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Tag color={cor}>{lbl}</Tag>
              <CopyBtn text={msgs[key]} />
            </div>
            <p style={{ color: T.text, fontSize: 14, lineHeight: 1.8, margin: 0, fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>{msgs[key]}</p>
          </Card>
        ))}
        <Card style={{ background: T.greenBg, borderColor: `${T.green}25` }}>
          <Lbl>◆ Por que essa combinação fecha</Lbl>
          <p style={{ color: T.green, fontSize: 13, margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>{msgs.por_que_fecha}</p>
        </Card>

        <BtnSalvarCRM savedCRM={savedCRM} onSave={salvarCRM} />

        <Card style={{ background: T.surface }}>
          <Lbl>Testar outra combinação — mesmo lead</Lbl>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6 }}>Tom:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ABORDAGENS.filter((a) => a.id !== msgs.abId).map((a) => (
                <button key={a.id} onClick={() => gerarMsgs(a.id, msgs.fmtId)} disabled={loading}
                  style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 7, padding: '5px 10px', color: T.textMuted, fontSize: 11, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = a.cor; e.currentTarget.style.color = a.cor; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6 }}>Formato:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FORMATOS.filter((f) => f.id !== msgs.fmtId).map((f) => (
                <button key={f.id} onClick={() => gerarMsgs(msgs.abId, f.id)} disabled={loading}
                  style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 7, padding: '5px 10px', color: T.textMuted, fontSize: 11, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div style={{ background: T.surface, border: `1px solid ${T.goldBorder}`, borderRadius: 12, padding: '16px 18px', marginTop: 8 }}>
          <div style={{ fontSize: 11, color: T.gold, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 10 }}>◆ PRÓXIMA ETAPA DO FUNIL</div>
          <p style={{ color: T.textMuted, fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>
            O cliente vai levantar objeções. Antecipe com respostas prontas baseadas no perfil deste lead.
          </p>
          <Btn onClick={() => setStep(5)} style={{ width: '100%', padding: 12 }}>
            🛡️ Gerar Respostas para Objeções deste Lead →
          </Btn>
        </div>
        <Btn variant="ghost" onClick={resetTudo} style={{ width: '100%', marginTop: 4 }}>
          + Analisar novo lead
        </Btn>
      </div>
    );
  }

  // ── STEP 5: OBJEÇÕES ──────────────────────────────────────────────────────────
  if (step === 5 && analysis) {
    return <ToolObjecoesLead analysis={analysis} savedCRM={savedCRM} onSaveCRM={salvarCRM}
      onRegistrarHist={(e) => setHistAuto(prev => [...prev, e])}
      onBack={() => setStep(4)} onNovoLead={resetTudo} />;
  }

  return null;
}

// ─── OBJEÇÕES DO LEAD (funil integrado) ───────────────────────────────────────
function ToolObjecoesLead({ analysis, savedCRM, onSaveCRM, onRegistrarHist, onBack, onNovoLead }) {
  const [loading, setLoading] = useState(false);
  const [respostas, setRespostas] = useState(null);
  const [err, setErr] = useState('');

  const gerar = async () => {
    setLoading(true); setErr('');
    try {
      const ctx = `Lead: ${analysis.nome || 'Não informado'}
Cidade: ${analysis.cidade || 'não informada'}
Situação: ${analysis.situacao || ''}
Tempo de empresa: ${analysis.tempo_empresa || ''}
Violações: ${(analysis.violacoes || []).join(', ')}
Nível do caso: ${analysis.nivel || ''}
Salário estimado: ${analysis.salario_estimado || ''}`;

      const prompt = `Você é um advogado trabalhista expert em fechamento de contratos. Com base no perfil do lead abaixo, gere as 4 objeções MAIS PROVÁVEIS que esse cliente específico vai levantar e a resposta ideal para cada uma. Respeite o EOAB: sem prometer resultados ou valores, sem captação explícita.

Retorne SOMENTE JSON no formato:
{"objecoes":[{"objecao":"texto da objeção","resposta":"resposta ideal empática e jurídica","por_que_funciona":"explicação de 1 linha"}]}`;

      const r = await callClaude(prompt, ctx, 2000);
      setRespostas(r.objecoes || []);
      if (onRegistrarHist) onRegistrarHist(novaEntrada('🛡️', `Objeções geradas — ${(r.objecoes || []).length} respostas prontas`));
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 7, padding: '6px 12px', color: T.textMuted, fontSize: 12, cursor: 'pointer' }}>← Voltar</button>
        <Title sub="Objeções prováveis deste lead específico com respostas prontas.">🛡️ Objeções do Lead</Title>
      </div>
      <div style={{ background: T.goldDim, border: `1px solid ${T.goldBorder}`, borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: T.gold, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 4 }}>LEAD ANALISADO</div>
        <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{analysis.nome || 'Sem nome'}</div>
        <div style={{ fontSize: 12, color: T.textMuted }}>{analysis.situacao} · {analysis.tempo_empresa}</div>
      </div>
      {!respostas ? (
        <>
          <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
            A IA vai analisar o perfil deste lead e prever as 4 objeções mais prováveis com respostas personalizadas para fechar este caso específico.
          </p>
          <BtnSalvarCRM savedCRM={savedCRM} onSave={onSaveCRM} />
          <Err msg={err} />
          <Btn onClick={gerar} disabled={loading} style={{ width: '100%', padding: 14 }}>
            {loading ? '⏳ Analisando objeções prováveis...' : '→ Gerar Respostas para Este Lead'}
          </Btn>
        </>
      ) : (
        <>
          {respostas.map((item, i) => (
            <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 18px', marginBottom: 12 }}>
              <div style={{ background: T.redBg, border: `1px solid ${T.red}20`, borderRadius: 7, padding: '8px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: T.red, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 3 }}>OBJEÇÃO {i + 1}</div>
                <div style={{ color: T.red, fontSize: 13, fontWeight: 600, fontStyle: 'italic' }}>"{item.objecao}"</div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: T.gold, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 6 }}>RESPOSTA IDEAL</div>
                <p style={{ color: T.text, fontSize: 13, lineHeight: 1.7, margin: 0, fontFamily: 'Georgia,serif' }}>{item.resposta}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: T.green, fontStyle: 'italic' }}>◆ {item.por_que_funciona}</div>
                <CopyBtn text={item.resposta} />
              </div>
            </div>
          ))}
          <BtnSalvarCRM savedCRM={savedCRM} onSave={onSaveCRM} />
          <Btn variant="ghost" onClick={() => setRespostas(null)} style={{ width: '100%', marginBottom: 8 }}>↺ Gerar novamente</Btn>
          <Btn variant="ghost" onClick={onNovoLead} style={{ width: '100%' }}>+ Analisar novo lead</Btn>
        </>
      )}
    </div>
  );
}

// ─── 2. CRM ───────────────────────────────────────────────────────────────────
const STAGES = [
  { id: 'novo',     label: 'Novo Lead',           cor: T.textMuted },
  { id: 'contato',  label: 'Contato Feito',        cor: T.blue },
  { id: 'consulta', label: 'Consulta Agendada',    cor: T.yellow },
  { id: 'fechado',  label: 'Fechado ✓',            cor: T.green },
  { id: 'perdido',  label: 'Perdido',              cor: T.red },
];
const DOCS = [
  'CTPS', 'Contracheques (últimos 12m)', 'Extrato FGTS', 'Termo de Rescisão / TRCT',
  'Contrato de Trabalho', 'Holerites', 'Espelho de Ponto', 'Atestados Médicos',
  'E-mails / Mensagens', 'RG e CPF', 'Comprovante de Residência', 'PPP (se acidente/doença)',
];

function Ficha({ lead, onBack, onSave, onDel }) {
  const [f, setF] = useState({ cpf: '', endereco: '', vinculo: '', tempo: '', salario: '', violacoes: '', provas: '', honorarios: '', percentual: '', docs: [], hist: [], reuniao_data: '', reuniao_hora: '', reuniao_tipo: 'video', reuniao_obs: '', ...lead });
  const [nota, setNota] = useState('');
  const up = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const addNota = () => {
    if (!nota.trim()) return;
    const h = [{ icone: '💬', txt: nota, auto: false, data: new Date().toLocaleDateString('pt-BR'), hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }, ...(f.hist || [])];
    setF((x) => ({ ...x, hist: h })); setNota('');
  };
  const toggleDoc = (d) => up('docs', (f.docs || []).includes(d) ? f.docs.filter((x) => x !== d) : [...(f.docs || []), d]);
  const st = STAGES.find((s) => s.id === f.stage) || STAGES[0];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 7, padding: '6px 12px', color: T.textMuted, fontSize: 12, cursor: 'pointer' }}>← CRM</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: T.text }}>{f.nome}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
            <Tag color={st.cor}>{st.label}</Tag>
            <span style={{ color: T.textDim, fontSize: 11, fontFamily: 'monospace' }}>desde {f.createdAt}</span>
          </div>
        </div>
        <Btn onClick={() => onSave(f)} style={{ padding: '7px 14px', fontSize: 12 }}>💾 Salvar</Btn>
        <Btn variant="danger" onClick={() => onDel(f.id)} style={{ padding: '7px 10px' }}>✕</Btn>
      </div>
      <Card>
        <Lbl>Etapa do pipeline</Lbl>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {STAGES.map((s) => (
            <button key={s.id} onClick={() => up('stage', s.id)}
              style={{ background: f.stage === s.id ? `${s.cor}18` : 'transparent', border: `1px solid ${f.stage === s.id ? s.cor : T.border}`, borderRadius: 7, padding: '5px 12px', color: f.stage === s.id ? s.cor : T.textMuted, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}>
              {s.label}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <Lbl>📋 Dados Pessoais</Lbl>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['nome', 'Nome'], ['cpf', 'CPF'], ['contato', 'WhatsApp'], ['salario', 'Salário (R$)'], ['endereco', 'Endereço']].map(([k, ph]) => (
            <div key={k} style={{ gridColumn: k === 'endereco' ? '1/-1' : 'auto' }}>
              <Lbl>{ph}</Lbl>
              <input value={f[k] || ''} onChange={(e) => up(k, e.target.value)} placeholder={ph} style={inp} />
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Lbl>⚖️ Dados do Caso</Lbl>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['vinculo', 'Tipo de vínculo'], ['tempo', 'Tempo na empresa']].map(([k, ph]) => (
            <div key={k}><Lbl>{ph}</Lbl><input value={f[k] || ''} onChange={(e) => up(k, e.target.value)} placeholder={ph} style={inp} /></div>
          ))}
          {[['violacoes', 'Violações identificadas'], ['provas', 'Provas disponíveis']].map(([k, ph]) => (
            <div key={k} style={{ gridColumn: '1/-1' }}>
              <Lbl>{ph}</Lbl>
              <textarea value={f[k] || ''} onChange={(e) => up(k, e.target.value)} placeholder={ph} rows={2} style={{ ...inp, resize: 'none' }} />
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Lbl>💰 Honorários Combinados</Lbl>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><Lbl>Valor fixo (R$)</Lbl><input value={f.honorarios || ''} onChange={(e) => up('honorarios', e.target.value)} placeholder="ex: 2000" type="number" style={inp} /></div>
          <div><Lbl>Êxito (%)</Lbl><input value={f.percentual || ''} onChange={(e) => up('percentual', e.target.value)} placeholder="ex: 30" type="number" style={inp} /></div>
        </div>
      </Card>
      <Card>
        <Lbl>📎 Checklist de Documentos</Lbl>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {DOCS.map((d) => {
            const ok = (f.docs || []).includes(d);
            return <button key={d} onClick={() => toggleDoc(d)} style={{ background: ok ? T.greenBg : T.surface, border: `1px solid ${ok ? T.green : T.border}`, borderRadius: 7, padding: '5px 11px', color: ok ? T.green : T.textMuted, fontSize: 11, cursor: 'pointer', transition: 'all 0.15s' }}>{ok ? '✓ ' : ''}{d}</button>;
          })}
        </div>
        <div style={{ marginTop: 10, color: T.textDim, fontSize: 11, fontFamily: 'monospace' }}>{(f.docs || []).length}/{DOCS.length} documentos recebidos</div>
      </Card>
      <Card accent={f.reuniao_data ? T.blue : undefined}>
        <Lbl>📅 Próxima Reunião</Lbl>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div><Lbl>Data</Lbl><input type="date" value={f.reuniao_data || ''} onChange={(e) => up('reuniao_data', e.target.value)} style={inp} /></div>
          <div><Lbl>Hora</Lbl><input type="time" value={f.reuniao_hora || ''} onChange={(e) => up('reuniao_hora', e.target.value)} style={inp} /></div>
          <div><Lbl>Tipo</Lbl>
            <select value={f.reuniao_tipo || 'video'} onChange={(e) => up('reuniao_tipo', e.target.value)} style={sel}>
              <option value="video">📹 Vídeo (Meet/Zoom)</option>
              <option value="presencial">🏢 Presencial</option>
              <option value="telefone">📞 Telefone</option>
              <option value="whatsapp">💬 WhatsApp</option>
            </select>
          </div>
          <div><Lbl>Observação</Lbl><input value={f.reuniao_obs || ''} onChange={(e) => up('reuniao_obs', e.target.value)} placeholder="ex: trazer CTPS e holerites" style={inp} /></div>
        </div>
        {f.reuniao_data && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ background: T.blueBg, border: `1px solid ${T.blue}25`, borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>📅</span>
              <span style={{ color: T.blue, fontSize: 13, fontWeight: 600 }}>
                {new Date(f.reuniao_data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                {f.reuniao_hora ? ` às ${f.reuniao_hora}` : ''}
              </span>
            </div>
            <button onClick={() => { up('reuniao_data', ''); up('reuniao_hora', ''); up('reuniao_obs', ''); }}
              style={{ background: 'transparent', border: 'none', color: T.red, fontSize: 13, cursor: 'pointer' }}>✕ Limpar</button>
          </div>
        )}
      </Card>
      <Card>
        <Lbl>💬 Histórico de Contatos</Lbl>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input value={nota} onChange={(e) => setNota(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNota()} placeholder="Anotação... (Enter para salvar)" style={{ ...inp, flex: 1 }} />
          <Btn onClick={addNota} style={{ padding: '8px 14px', whiteSpace: 'nowrap', fontSize: 12 }}>+ Anotar</Btn>
        </div>
        {!(f.hist || []).length && <div style={{ color: T.textDim, fontSize: 12, fontFamily: 'monospace' }}>Nenhum evento registrado.</div>}
        {(f.hist || []).map((h, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: h.auto ? T.goldDim : T.surface, border: `1px solid ${h.auto ? T.goldBorder : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                {h.icone || '💬'}
              </div>
              {i < (f.hist || []).length - 1 && <div style={{ width: 1, flex: 1, background: T.border, minHeight: 10, marginTop: 3 }} />}
            </div>
            <div style={{ paddingBottom: 8, flex: 1 }}>
              <div style={{ color: T.text, fontSize: 13, lineHeight: 1.5 }}>{h.txt}</div>
              <div style={{ color: T.textDim, fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>{h.data} às {h.hora}{h.auto ? '' : ' · manual'}</div>
            </div>
          </div>
        ))}
      </Card>
      <Btn onClick={() => onSave(f)} style={{ width: '100%', padding: 13 }}>💾 Salvar Ficha</Btn>
    </div>
  );
}

function ToolCRM() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ nome: '', contato: '', caso: '', stage: 'novo' });
  const [showForm, setShowForm] = useState(false);
  const [ficha, setFicha] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { const d = localStorage.getItem('lf_leads'); if (d) setLeads(JSON.parse(d)); } catch (_) {}
    setLoaded(true);
  }, []);

  const save = (nl) => { setLeads(nl); try { localStorage.setItem('lf_leads', JSON.stringify(nl)); } catch (_) {} };
  const addLead = () => {
    if (!form.nome.trim()) return;
    save([{ id: Date.now(), ...form, docs: [], hist: [], createdAt: new Date().toLocaleDateString('pt-BR') }, ...leads]);
    setForm({ nome: '', contato: '', caso: '', stage: 'novo' }); setShowForm(false);
  };
  const saveFicha = (f) => { save(leads.map((l) => (l.id === f.id ? f : l))); setFicha(f); };
  const delLead = (id) => { save(leads.filter((l) => l.id !== id)); setFicha(null); };

  if (!loaded) return <div style={{ color: T.textMuted, padding: 40, textAlign: 'center', fontFamily: 'monospace' }}>Carregando...</div>;
  if (ficha) return <Ficha lead={ficha} onBack={() => setFicha(null)} onSave={saveFicha} onDel={delLead} />;

  const hoje = new Date().toISOString().split('T')[0];
  const reunioesHoje = leads.filter(l => l.reuniao_data === hoje).sort((a, b) => (a.reuniao_hora || '').localeCompare(b.reuniao_hora || ''));
  const reunioesFuturas = leads.filter(l => l.reuniao_data && l.reuniao_data > hoje).sort((a, b) => a.reuniao_data.localeCompare(b.reuniao_data)).slice(0, 3);
  const tipoIcon = { video: '📹', presencial: '🏢', telefone: '📞', whatsapp: '💬' };

  return (
    <div>
      {(reunioesHoje.length > 0 || reunioesFuturas.length > 0) && (
        <div style={{ background: T.blueBg, border: `1px solid ${T.blue}25`, borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
          {reunioesHoje.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: T.blue, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 10 }}>📅 HOJE</div>
              {reunioesHoje.map(l => (
                <div key={l.id} onClick={() => setFicha(l)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: T.surface, borderRadius: 9, marginBottom: 6, cursor: 'pointer', border: `1px solid ${T.blue}30` }}>
                  <span style={{ fontSize: 18 }}>{tipoIcon[l.reuniao_tipo] || '📅'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>{l.nome}</div>
                    <div style={{ color: T.textMuted, fontSize: 11 }}>
                      {l.reuniao_hora ? `${l.reuniao_hora} · ` : ''}{l.reuniao_tipo === 'video' ? 'Vídeo' : l.reuniao_tipo === 'presencial' ? 'Presencial' : l.reuniao_tipo === 'telefone' ? 'Telefone' : 'WhatsApp'}
                      {l.reuniao_obs ? ` · ${l.reuniao_obs}` : ''}
                    </div>
                  </div>
                  <span style={{ color: T.blue, fontSize: 11 }}>→</span>
                </div>
              ))}
            </>
          )}
          {reunioesFuturas.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: T.textMuted, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 8, marginTop: reunioesHoje.length ? 12 : 0 }}>PRÓXIMAS</div>
              {reunioesFuturas.map(l => (
                <div key={l.id} onClick={() => setFicha(l)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 9, marginBottom: 5, cursor: 'pointer', borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 15 }}>{tipoIcon[l.reuniao_tipo] || '📅'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: T.text, fontSize: 12, fontWeight: 600 }}>{l.nome}</div>
                    <div style={{ color: T.textDim, fontSize: 11 }}>
                      {new Date(l.reuniao_data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                      {l.reuniao_hora ? ` às ${l.reuniao_hora}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <Title sub="Pipeline completo do primeiro contato ao contrato assinado.">📋 CRM de Leads</Title>
        <Btn onClick={() => setShowForm(!showForm)} style={{ padding: '9px 14px', fontSize: 12, whiteSpace: 'nowrap' }}>+ Cadastrar Lead</Btn>
      </div>
      {!leads.length && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px 20px', border: `1px dashed ${T.goldBorder}`, borderRadius: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
          <div style={{ color: T.text, fontSize: 16, fontWeight: 600, fontFamily: 'Georgia, serif', marginBottom: 8 }}>Nenhum lead cadastrado</div>
          <div style={{ color: T.textMuted, fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>Cadastre o primeiro lead para iniciar o pipeline.</div>
          <Btn onClick={() => setShowForm(true)} style={{ display: 'inline-flex' }}>+ Cadastrar primeiro lead</Btn>
        </div>
      )}
      {leads.length > 0 && <InfoBox color={T.gold}>💡 Clique em qualquer lead para abrir a ficha completa com documentos, histórico e honorários.</InfoBox>}
      {showForm && (
        <Card accent={T.gold}>
          <Lbl>Novo Lead</Lbl>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[['nome', 'Nome do cliente'], ['contato', 'WhatsApp'], ['caso', 'Resumo do caso']].map(([k, ph]) => (
              <input key={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={ph} style={{ ...inp, gridColumn: k === 'caso' ? '1/-1' : 'auto' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={addLead} style={{ flex: 1 }}>Adicionar</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Btn>
          </div>
        </Card>
      )}
      {STAGES.map((st) => {
        const sl = leads.filter((l) => l.stage === st.id);
        return (
          <div key={st.id} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: st.cor }} />
              <span style={{ color: st.cor, fontSize: 11, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.06em' }}>{st.label.toUpperCase()}</span>
              <span style={{ color: T.textDim, fontSize: 11, fontFamily: 'monospace' }}>({sl.length})</span>
            </div>
            {!sl.length && <div style={{ border: `1px dashed ${T.border}`, borderRadius: 9, padding: '12px 16px', color: T.textDim, fontSize: 12, fontFamily: 'monospace' }}>Vazio</div>}
            {sl.map((l) => (
              <div key={l.id} onClick={() => setFicha(l)}
                style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 11, padding: '14px 18px', marginBottom: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: T.text, fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{l.nome}</div>
                  {l.caso && <div style={{ color: T.textMuted, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{l.caso}</div>}
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    <span style={{ color: T.textDim, fontSize: 11, fontFamily: 'monospace' }}>{l.contato} · {l.createdAt}</span>
                    {(l.hist || []).length > 0 && <Tag color={T.purple}>{l.hist.length} nota{l.hist.length !== 1 ? 's' : ''}</Tag>}
                    {(l.docs || []).length > 0 && <Tag color={T.green}>{l.docs.length} doc{l.docs.length !== 1 ? 's' : ''}</Tag>}
                  </div>
                </div>
                <span style={{ color: T.textDim, fontSize: 16, marginLeft: 10 }}>→</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── 3. QUEBRADOR DE OBJEÇÕES ─────────────────────────────────────────────────
const OBJECOES = [
  { id: 'pensar',   label: '"Vou pensar e te aviso"' },
  { id: 'dinheiro', label: '"Não tenho dinheiro agora"' },
  { id: 'medo',     label: '"Tenho medo de perder o emprego"' },
  { id: 'vale',     label: '"Será que vale a pena processar?"' },
  { id: 'tempo',    label: '"Não tenho tempo pra isso"' },
  { id: 'empresa',  label: '"A empresa é boa, não quero problemas"' },
  { id: 'outro',    label: 'Outra objeção...' },
];

function ToolObjecoes() {
  const [obId, setObId] = useState('');
  const [custom, setCustom] = useState('');
  const [ctx, setCtx] = useState('');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const obTxt = obId === 'outro' ? custom : OBJECOES.find((o) => o.id === obId)?.label || '';

  const gerar = async () => {
    if (!obId) { setErr('Selecione uma objeção.'); return; }
    if (obId === 'outro' && !custom.trim()) { setErr('Digite a objeção.'); return; }
    setErr(''); setLoading(true);
    try { const r = await callClaude(P_OBJECAO, `Objeção: ${obTxt}\n${ctx ? `Contexto do caso: ${ctx}` : ''}`); setRes(r); }
    catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  return (
    <div>
      <Title sub="O cliente travou? Selecione a objeção e receba a resposta ideal — empática, jurídica e dentro do EOAB.">🛡️ Quebrador de Objeções</Title>
      {!res ? (
        <>
          <Lbl>O que o cliente disse?</Lbl>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {OBJECOES.map((ob) => (
              <button key={ob.id} onClick={() => setObId(ob.id)}
                style={{ background: obId === ob.id ? T.goldDim : T.card, border: `1px solid ${obId === ob.id ? T.gold : T.border}`, borderRadius: 9, padding: '11px 13px', color: obId === ob.id ? T.gold : T.textMuted, fontSize: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'Georgia,serif', lineHeight: 1.4, transition: 'all 0.15s' }}>
                {ob.label}
              </button>
            ))}
          </div>
          {obId === 'outro' && <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Digite o que o cliente disse..." style={{ ...inp, marginBottom: 14 }} />}
          <Lbl>Contexto do caso — opcional</Lbl>
          <textarea value={ctx} onChange={(e) => setCtx(e.target.value)} rows={3} placeholder="Ex: cliente demitido após 5 anos, tem medo de represália..." style={{ ...inp, resize: 'none', lineHeight: 1.6, marginBottom: 14 }} />
          <Err msg={err} />
          <Btn onClick={gerar} disabled={loading} style={{ width: '100%', padding: 14 }}>{loading ? '⏳ Gerando resposta...' : '→ Quebrar Objeção'}</Btn>
        </>
      ) : (
        <>
          <InfoBox color={T.gold}>"{obTxt}"</InfoBox>
          <Card accent={T.gold}>
            <Lbl>🤝 Valide primeiro — diga isso</Lbl>
            <p style={{ color: T.text, fontSize: 14, margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{res.validacao}"</p>
          </Card>
          <Card accent={T.green}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Tag color={T.green}>WHATSAPP</Tag><CopyBtn text={res.resposta_whatsapp} />
            </div>
            <p style={{ color: T.text, fontSize: 14, margin: 0, lineHeight: 1.8, fontFamily: 'Georgia,serif', whiteSpace: 'pre-wrap' }}>{res.resposta_whatsapp}</p>
          </Card>
          <Card accent={T.purple}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Tag color={T.purple}>PRESENCIAL / LIGAÇÃO</Tag><CopyBtn text={res.resposta_presencial} />
            </div>
            <p style={{ color: T.text, fontSize: 14, margin: 0, lineHeight: 1.8, fontFamily: 'Georgia,serif' }}>{res.resposta_presencial}</p>
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <Card style={{ margin: 0, background: T.purpleBg, borderColor: `${T.purple}25` }}>
              <Lbl>⚡ Argumento jurídico</Lbl>
              <p style={{ color: T.purple, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{res.argumento_juridico}</p>
            </Card>
            <Card style={{ margin: 0, background: T.redBg, borderColor: `${T.red}25` }}>
              <Lbl>🚫 Não diga isso</Lbl>
              <p style={{ color: T.red, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{res.erro_comum}</p>
            </Card>
          </div>
          <Btn variant="ghost" onClick={() => { setRes(null); setObId(''); setCustom(''); setCtx(''); }} style={{ width: '100%' }}>+ Nova objeção</Btn>
        </>
      )}
    </div>
  );
}

// ─── 4. CALCULADORA DE VERBAS ─────────────────────────────────────────────────
function ToolCalc() {
  const [f, setF] = useState({ sal: '', meses: '', dias_ultimo_mes: '30', aviso: 'indenizado', tipo: 'sjc', fgts: '' });
  const [res, setRes] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const up = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const n = (v) => parseFloat(v) || 0;

  const calcular = () => {
    const sal = n(f.sal), meses = n(f.meses), dias = n(f.dias_ultimo_mes), fgts = n(f.fgts);
    if (sal <= 0 || meses <= 0) return;
    const items = []; let total = 0;
    const add = (nome, valor, desc, lei) => { items.push({ nome, valor, desc, lei }); total += valor; };
    const saldo = (sal / 30) * dias;
    add('Saldo de Salário', saldo, `${dias} dias trabalhados no último mês`, 'Art. 477 CLT');
    const avosRef = Math.ceil(meses % 12 === 0 ? 12 : meses % 12);
    add('13º Salário Proporcional', (sal / 12) * avosRef, `${avosRef}/12 avos`, 'Art. 7º VIII CF/88 + Lei 4.090/62');
    add('Férias Proporcionais + 1/3', (sal / 12) * avosRef * (4 / 3), `${avosRef}/12 avos + 1/3 constitucional`, 'Arts. 129 e 146 CLT + art. 7º XVII CF/88');
    if (f.tipo === 'sjc') {
      if (f.aviso === 'indenizado') {
        const anosCompletos = Math.floor(meses / 12);
        const diasAviso = Math.min(30 + anosCompletos * 3, 90);
        add('Aviso Prévio Indenizado', (sal / 30) * diasAviso, `${diasAviso} dias (30 base + ${anosCompletos * 3} proporcionais)`, 'Lei 12.506/11 + Súmula 441 TST');
      }
      const fgtsSaldo = fgts > 0 ? fgts : sal * 0.08 * meses;
      add('Multa FGTS 40%', fgtsSaldo * 0.4, `40% sobre R$ ${fgtsSaldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${fgts > 0 ? '(saldo informado)' : '(saldo estimado)'}`, 'Art. 18 §1º Lei 8.036/90');
    }
    if (f.tipo === 'ri') {
      const anosCompletos = Math.floor(meses / 12);
      const diasAviso = Math.min(30 + anosCompletos * 3, 90);
      add('Aviso Prévio (Rescisão Indireta)', (sal / 30) * diasAviso, `${diasAviso} dias — culpa do empregador`, 'Art. 483 CLT + Lei 12.506/11');
      const fgtsSaldo = fgts > 0 ? fgts : sal * 0.08 * meses;
      add('Multa FGTS 40%', fgtsSaldo * 0.4, 'Rescisão indireta = mesmas verbas da SJC', 'Art. 18 §1º Lei 8.036/90 + Súmula 246 TST');
    }
    setRes({ items, total });
  };

  const verificarAI = async () => {
    if (!res) return;
    setLoadingAI(true);
    try {
      const ctx = `Salário: R$${f.sal}\nMeses: ${f.meses}\nTipo: ${f.tipo}\nVerbas calculadas: ${res.items.map((i) => i.nome + ': R$' + i.valor.toFixed(2)).join(', ')}`;
      const r = await callClaude(P_VERBAS_IA, ctx, 800);
      setAlerta(r);
    } catch (_) {} finally { setLoadingAI(false); }
  };

  const tipos = [
    { id: 'sjc', label: 'Sem justa causa' },
    { id: 'cjc', label: 'Com justa causa' },
    { id: 'ri',  label: 'Rescisão indireta (art. 483 CLT)' },
    { id: 'pe',  label: 'Pedido de demissão' },
  ];

  return (
    <div>
      <Title sub="Estimativa das verbas rescisórias com fundamentos legais. Base: CLT, CF/88 e Lei 12.506/11.">🧮 Calculadora de Verbas</Title>
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div><Lbl>Salário bruto (R$)</Lbl><input value={f.sal} onChange={(e) => up('sal', e.target.value)} placeholder="ex: 3500" type="number" style={inp} /></div>
          <div><Lbl>Tempo de empresa (meses)</Lbl><input value={f.meses} onChange={(e) => up('meses', e.target.value)} placeholder="ex: 36" type="number" style={inp} /></div>
          <div><Lbl>Dias trabalhados no último mês</Lbl><input value={f.dias_ultimo_mes} onChange={(e) => up('dias_ultimo_mes', e.target.value)} placeholder="1-30" type="number" style={inp} /></div>
          <div><Lbl>Saldo FGTS (R$) — opcional</Lbl><input value={f.fgts} onChange={(e) => up('fgts', e.target.value)} placeholder="se souber" type="number" style={inp} /></div>
          <div style={{ gridColumn: '1/-1' }}>
            <Lbl>Tipo de desligamento</Lbl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {tipos.map((t) => (
                <button key={t.id} onClick={() => up('tipo', t.id)} style={{ background: f.tipo === t.id ? T.goldDim : 'transparent', border: `1px solid ${f.tipo === t.id ? T.gold : T.border}`, borderRadius: 7, padding: '7px 12px', color: f.tipo === t.id ? T.gold : T.textMuted, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}>{t.label}</button>
              ))}
            </div>
          </div>
          {(f.tipo === 'sjc' || f.tipo === 'ri') && (
            <div style={{ gridColumn: '1/-1' }}>
              <Lbl>Aviso prévio</Lbl>
              <div style={{ display: 'flex', gap: 7 }}>
                {[['indenizado', 'Indenizado'], ['trabalhado', 'Trabalhado']].map(([v, l]) => (
                  <button key={v} onClick={() => up('aviso', v)} style={{ background: f.aviso === v ? T.goldDim : 'transparent', border: `1px solid ${f.aviso === v ? T.gold : T.border}`, borderRadius: 7, padding: '7px 14px', color: f.aviso === v ? T.gold : T.textMuted, fontSize: 12, cursor: 'pointer' }}>{l}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Btn onClick={calcular} style={{ width: '100%', padding: 13 }}>→ Calcular Verbas Rescisórias</Btn>
      </Card>
      {res && (
        <>
          {res.items.map((item, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: T.text, fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.nome}</div>
                <div style={{ color: T.textMuted, fontSize: 11 }}>{item.desc}</div>
                <div style={{ color: T.textDim, fontSize: 10, fontFamily: 'monospace', marginTop: 2 }}>{item.lei}</div>
              </div>
              <div style={{ color: T.gold, fontSize: 14, fontWeight: 700, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          ))}
          <div style={{ background: `${T.gold}12`, border: `1px solid ${T.goldBorder}`, borderRadius: 11, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 8px' }}>
            <span style={{ color: T.gold, fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>TOTAL ESTIMADO</span>
            <span style={{ color: T.gold, fontSize: 20, fontWeight: 700, fontFamily: 'monospace' }}>R$ {res.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style={{ color: T.textDim, fontSize: 11, textAlign: 'center', fontStyle: 'italic', marginBottom: 12 }}>* Estimativa de referência. Valores reais dependem de acordos coletivos, horas extras e outras particularidades.</div>
          <Btn onClick={verificarAI} disabled={loadingAI} variant="ghost" style={{ width: '100%', marginBottom: 12 }}>{loadingAI ? '⏳ Verificando com IA...' : '🤖 IA: Verificar verbas esquecidas'}</Btn>
          {alerta && (
            <Card accent={T.purple}>
              <Lbl>🤖 Análise da IA — Verbas Adicionais</Lbl>
              {(alerta.verbas_extras || []).map((v, i) => <div key={i} style={{ color: T.yellow, fontSize: 12, padding: '3px 0' }}>→ {v}</div>)}
              {(alerta.alertas || []).map((a, i) => <div key={i} style={{ color: T.red, fontSize: 12, padding: '3px 0' }}>⚠ {a}</div>)}
              {alerta.observacao && <div style={{ color: T.textMuted, fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>{alerta.observacao}</div>}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── 5. CONTRATO DE HONORÁRIOS ────────────────────────────────────────────────
function ToolContrato() {
  const [f, setF] = useState({ cliente: '', cpf: '', rg: '', endereco: '', advogado: '', oab: '', caso: '', tipo: 'exito', honorarios: '', percentual: '', cidade: '' });
  const [contrato, setContrato] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [modeloProprio, setModeloProprio] = useState('');
  const [nomeModelo, setNomeModelo] = useState('');
  const up = (k, v) => setF((x) => ({ ...x, [k]: v }));

  const handleModelo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => { setModeloProprio(reader.result.slice(0, 6000)); setNomeModelo(file.name); };
      reader.readAsText(file, 'UTF-8');
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result;
          const match = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
          if (match) {
            const extracted = match.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
            setModeloProprio(extracted.slice(0, 6000));
            setNomeModelo(file.name + ' (texto extraído)');
          } else { setNomeModelo(file.name + ' — use .txt para melhor resultado'); }
        } catch(_) { setNomeModelo(file.name + ' — use .txt para melhor resultado'); }
      };
      reader.readAsText(file);
    }
  };

  const gerar = async () => {
    if (!f.cliente || !f.caso) { setErr('Preencha nome do cliente e descrição do caso.'); return; }
    setErr(''); setLoading(true);
    try {
      const ctx = `CONTRATANTE: ${f.cliente}, CPF: ${f.cpf}, RG: ${f.rg}, Endereço: ${f.endereco}
ADVOGADO: ${f.advogado || '[Nome do Advogado]'}, OAB: ${f.oab || '[OAB/XX 000000]'}
CIDADE: ${f.cidade || '[Cidade]'}
OBJETO/CASO: ${f.caso}
HONORÁRIOS: ${f.tipo === 'exito' ? `${f.percentual || 30}% sobre o valor da condenação (êxito)` : f.tipo === 'fixo' ? `R$ ${f.honorarios} fixo` : f.tipo === 'misto' ? `R$ ${f.honorarios} entrada + ${f.percentual || 20}% êxito` : 'Honorários a combinar'}
DATA: ${new Date().toLocaleDateString('pt-BR')}`;
      const promptBase = modeloProprio
        ? `Você é um assistente jurídico. Use o MODELO DE CONTRATO FORNECIDO pelo advogado como base estrutural e estilo, substituindo apenas as variáveis com os dados abaixo. Mantenha a linguagem, cláusulas e formatação do modelo original. Respeite o EOAB e OAB Lei 8.906/94.

MODELO DO ADVOGADO:
${modeloProprio}

Retorne SOMENTE JSON: {"contrato":"texto integral com \n para quebras de linha"}`
        : P_CONTRATO;
      const r = await callClaude(promptBase, ctx, 2500);
      setContrato((r.contrato || '').replace(/\\n/g, '\n'));
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const campos = [
    { k: 'cliente', ph: 'Nome completo do cliente' }, { k: 'cpf', ph: 'CPF: 000.000.000-00' },
    { k: 'rg', ph: 'RG: 00.000.000-0' }, { k: 'advogado', ph: 'Dr(a). Nome Completo' },
    { k: 'oab', ph: 'OAB/XX 000000' }, { k: 'cidade', ph: 'Cidade - UF' },
    { k: 'endereco', ph: 'Endereço completo do cliente', full: true },
    { k: 'caso', ph: 'Descreva as pretensões: ex: horas extras não pagas, FGTS, equiparação salarial...', full: true },
  ];

  return (
    <div>
      <Title sub="Contrato completo e personalizado com base no Estatuto da OAB (Lei 8.906/94), EOAB, CLT e LGPD.">📄 Contrato de Honorários</Title>
      {!contrato ? (
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {campos.map(({ k, ph, full }) => (
              <div key={k} style={{ gridColumn: full ? '1/-1' : 'auto' }}>
                <Lbl>{ph.split(':')[0]}</Lbl>
                <input value={f[k]} onChange={(e) => up(k, e.target.value)} placeholder={ph} style={inp} />
              </div>
            ))}
            <div><Lbl>Tipo de honorários</Lbl><select value={f.tipo} onChange={(e) => up('tipo', e.target.value)} style={sel}><option value="exito">Êxito (%)</option><option value="fixo">Fixo (R$)</option><option value="misto">Misto (entrada + êxito)</option></select></div>
            <div>
              <Lbl>{f.tipo === 'fixo' ? 'Valor (R$)' : 'Percentual (%)'}</Lbl>
              <input value={f.tipo === 'fixo' ? f.honorarios : f.percentual} onChange={(e) => up(f.tipo === 'fixo' ? 'honorarios' : 'percentual', e.target.value)} placeholder={f.tipo === 'fixo' ? 'ex: 2000' : 'ex: 30'} type="number" style={inp} />
            </div>
            {f.tipo === 'misto' && <div><Lbl>Valor entrada (R$)</Lbl><input value={f.honorarios} onChange={(e) => up('honorarios', e.target.value)} placeholder="ex: 500" type="number" style={inp} /></div>}
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Lbl>Modelo próprio (opcional)</Lbl>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, background: nomeModelo ? T.greenBg : T.surface, border: `1px solid ${nomeModelo ? T.green : T.border}`, borderRadius: 9, padding: '11px 14px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <input type="file" accept=".txt,.docx,.doc" onChange={handleModelo} style={{ display: 'none' }} />
              <span style={{ fontSize: 16 }}>{nomeModelo ? '✓' : '📋'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: nomeModelo ? T.green : T.text, fontSize: 12, fontWeight: 600 }}>{nomeModelo || 'Usar meu modelo de contrato (.txt ou .docx)'}</div>
                <div style={{ color: T.textMuted, fontSize: 11, marginTop: 2 }}>{nomeModelo ? 'IA vai usar seu modelo como base' : 'Se não enviar, usa o modelo padrão FECHA CONTRATO'}</div>
              </div>
              {nomeModelo && <button onClick={(e) => { e.preventDefault(); setModeloProprio(''); setNomeModelo(''); }} style={{ background: 'transparent', border: 'none', color: T.red, fontSize: 14, cursor: 'pointer' }}>✕</button>}
            </label>
          </div>
          <Err msg={err} />
          <Btn onClick={gerar} disabled={loading} style={{ width: '100%', padding: 13, marginTop: 12 }}>{loading ? '⏳ Gerando contrato...' : nomeModelo ? '→ Gerar com Meu Modelo' : '→ Gerar Contrato de Honorários'}</Btn>
        </Card>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Tag color={T.green}>CONTRATO GERADO</Tag>
            <div style={{ display: 'flex', gap: 8 }}>
              <CopyBtn text={contrato} />
              <Btn variant="ghost" onClick={() => setContrato('')} style={{ padding: '4px 12px', fontSize: 11 }}>Novo</Btn>
            </div>
          </div>
          <Card><pre style={{ color: T.text, fontSize: 12.5, lineHeight: 1.9, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif' }}>{contrato}</pre></Card>
        </>
      )}
    </div>
  );
}

// ─── 6. PRESENÇA DIGITAL ──────────────────────────────────────────────────────
const TEMAS = [
  'Demissão sem justa causa', 'Horas extras não pagas', 'Assédio moral no trabalho',
  'FGTS não depositado', 'Demissão durante doença/acidente', 'Trabalho sem carteira assinada',
  'Equiparação salarial', 'Adicional de insalubridade/periculosidade', 'Acidente de trabalho',
  'Desvio de função', 'Intervalo intrajornada suprimido', 'Rescisão indireta (art. 483 CLT)', 'Outro tema...',
];

const TEMAS_IMG = [
  'Demissão sem justa causa', 'Horas extras não pagas', 'Assédio moral',
  'FGTS não depositado', 'Trabalho sem carteira assinada', 'Acidente de trabalho',
  'Rescisão indireta', 'Equiparação salarial', 'Seus direitos trabalhistas',
];

const ESTILOS_IMG = [
  { id: 'educativo',    label: '📚 Educativo',    desc: 'Explica um direito trabalhista' },
  { id: 'alerta',       label: '⚠️ Alerta',        desc: 'Chama atenção para um risco' },
  { id: 'motivacional', label: '💪 Motivacional',  desc: 'Encoraja a buscar direitos' },
  { id: 'pergunta',     label: '❓ Pergunta',       desc: 'Engaja com uma dúvida comum' },
];

function desenharCanvasPresenca(post, formato, nome) {
  const canvas = document.getElementById('postCanvasPresenca');
  if (!canvas || !post) return;
  const size = 600;
  const height = formato === 'feed' ? 600 : 1067;
  canvas.width = size; canvas.height = height;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, size, height);
  grad.addColorStop(0, post.cor_fundo || '#0a1628');
  grad.addColorStop(1, '#060d1a');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, size, height);
  const barGrad = ctx.createLinearGradient(0, 0, size, 0);
  barGrad.addColorStop(0, 'transparent');
  barGrad.addColorStop(0.5, post.cor_destaque || '#c9a84c');
  barGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = barGrad; ctx.fillRect(0, 0, size, 4);
  ctx.font = formato === 'feed' ? '80px serif' : '100px serif';
  ctx.textAlign = 'center';
  ctx.fillText(post.emoji_principal || '⚖️', size/2, formato === 'feed' ? 120 : 160);
  ctx.fillStyle = post.cor_destaque || '#c9a84c';
  ctx.font = `bold ${formato === 'feed' ? '36px' : '42px'} Arial`;
  wrapCanvasText(ctx, (post.titulo || '').toUpperCase(), size/2, formato === 'feed' ? 190 : 290, size - 80, formato === 'feed' ? 42 : 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${formato === 'feed' ? '18px' : '22px'} Arial`;
  wrapCanvasText(ctx, post.subtitulo || '', size/2, formato === 'feed' ? 260 : 390, size - 100, formato === 'feed' ? 26 : 30);
  const lineY = formato === 'feed' ? 295 : 440;
  ctx.strokeStyle = (post.cor_destaque || '#c9a84c') + '66';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60, lineY); ctx.lineTo(size - 60, lineY); ctx.stroke();
  ctx.fillStyle = '#c8d8ee';
  ctx.font = `${formato === 'feed' ? '15px' : '18px'} Arial`;
  wrapCanvasText(ctx, post.corpo || '', size/2, formato === 'feed' ? 330 : 490, size - 80, formato === 'feed' ? 22 : 28);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${formato === 'feed' ? '14px' : '17px'} Arial`;
  ctx.fillText('👉 ' + (post.cta || ''), size/2, formato === 'feed' ? 440 : 700);
  ctx.fillStyle = post.cor_destaque || '#c9a84c';
  ctx.font = `bold ${formato === 'feed' ? '13px' : '16px'} Arial`;
  ctx.fillText(nome || 'Dr. Advogado', size/2, formato === 'feed' ? 490 : 800);
  ctx.fillStyle = '#3a5a7a';
  ctx.font = `${formato === 'feed' ? '10px' : '13px'} Arial`;
  ctx.fillText((post.hashtags || []).map(h => '#' + h).join(' '), size/2, formato === 'feed' ? 520 : 860);
  ctx.fillStyle = barGrad; ctx.fillRect(0, height - 4, size, 4);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = (text || '').split(' ');
  let line = '', cy = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line, x, cy); line = words[n] + ' '; cy += lineHeight;
    } else { line = testLine; }
  }
  ctx.fillText(line, x, cy);
}

function ToolPresenca() {
  const [mod, setMod] = useState('conteudo');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [canal, setCanal] = useState('instagram');
  const [tema, setTema] = useState('');
  const [temaCustom, setTemaCustom] = useState('');
  const [cidade, setCidade] = useState('');
  const [plataforma, setPlataforma] = useState('google');
  const [orcamento, setOrcamento] = useState('');
  const [cidadeAnuncio, setCidadeAnuncio] = useState('');
  const [nomeEx, setNomeEx] = useState('');
  const [casoEx, setCasoEx] = useState('');
  const [imgTema, setImgTema] = useState('');
  const [imgTemaCustom, setImgTemaCustom] = useState('');
  const [imgEstilo, setImgEstilo] = useState('educativo');
  const [imgNome, setImgNome] = useState('');
  const [imgFormato, setImgFormato] = useState('feed');
  const [imgPost, setImgPost] = useState(null);
  const reset = () => { setRes(null); setErr(''); };

  const gerarConteudo = async () => {
    const t = tema === 'Outro tema...' ? temaCustom : tema;
    if (!t) { setErr('Escolha um tema.'); return; }
    setErr(''); setLoading(true);
    try {
      const r = await callClaude(P_CONTEUDO, `Canal: ${canal}\nTema jurídico: ${t}\nCidade do advogado: ${cidade || 'não informada'}\nGere post educativo e informativo sobre direito do trabalho.`, 1000);
      setRes({ tipo: 'conteudo', ...r });
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const gerarAnuncio = async () => {
    if (!cidadeAnuncio) { setErr('Informe a cidade.'); return; }
    setErr(''); setLoading(true);
    try {
      const r = await callClaude(P_ANUNCIO, `Plataforma: ${plataforma}\nCidade: ${cidadeAnuncio}\nOrçamento mensal: ${orcamento ? 'R$' + orcamento : 'não informado'}\nAdvogado trabalhista.`, 800);
      setRes({ tipo: 'anuncio', ...r });
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const gerarIndicacao = async () => {
    if (!nomeEx) { setErr('Informe o nome do ex-cliente.'); return; }
    setErr(''); setLoading(true);
    try {
      const r = await callClaude(P_INDICACAO, `Ex-cliente: ${nomeEx}\nCaso atendido: ${casoEx || 'não informado'}`, 800);
      setRes({ tipo: 'indicacao', ...r });
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const mods = [
    { id: 'conteudo',  icon: '✍️', label: 'Conteúdo', desc: 'Post educativo para redes sociais' },
    { id: 'anuncio',   icon: '📢', label: 'Anúncio',  desc: 'Google Ads ou Meta Ads' },
    { id: 'indicacao', icon: '🤝', label: 'Indicação', desc: 'Reativar ex-clientes' },
    { id: 'imagem',    icon: '🖼️', label: 'Imagem IA', desc: 'Posts e stories prontos' },
  ];

  return (
    <div>
      <Title sub="Apareça onde seu cliente está. Conteúdo educativo, anúncio e indicação — tudo dentro do EOAB.">📣 Presença Digital</Title>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 9, marginBottom: 22 }}>
        {mods.map((m) => (
          <button key={m.id} onClick={() => { setMod(m.id); reset(); }}
            style={{ background: mod === m.id ? T.goldDim : T.card, border: `1px solid ${mod === m.id ? T.gold : T.border}`, borderRadius: 11, padding: '13px 8px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
            <div style={{ fontSize: 20, marginBottom: 5 }}>{m.icon}</div>
            <div style={{ color: mod === m.id ? T.gold : T.text, fontSize: 12, fontWeight: 700 }}>{m.label}</div>
            <div style={{ color: T.textMuted, fontSize: 10, marginTop: 2, lineHeight: 1.4 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {mod === 'conteudo' && !res && (
        <Card>
          <Lbl>Canal</Lbl>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['instagram', '📸 Instagram'], ['linkedin', '💼 LinkedIn'], ['whatsapp', '💬 WhatsApp']].map(([v, l]) => (
              <button key={v} onClick={() => setCanal(v)} style={{ flex: 1, background: canal === v ? T.goldDim : 'transparent', border: `1px solid ${canal === v ? T.gold : T.border}`, borderRadius: 7, padding: '8px 6px', color: canal === v ? T.gold : T.textMuted, fontSize: 11, cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
          <Lbl>Tema jurídico</Lbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
            {TEMAS.map((t) => (
              <button key={t} onClick={() => setTema(t)} style={{ background: tema === t ? T.goldDim : T.surface, border: `1px solid ${tema === t ? T.gold : T.border}`, borderRadius: 7, padding: '6px 11px', color: tema === t ? T.gold : T.textMuted, fontSize: 11, cursor: 'pointer', transition: 'all 0.12s' }}>{t}</button>
            ))}
          </div>
          {tema === 'Outro tema...' && <input value={temaCustom} onChange={(e) => setTemaCustom(e.target.value)} placeholder="Digite o tema..." style={{ ...inp, marginBottom: 14 }} />}
          <Lbl>Sua cidade — opcional</Lbl>
          <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="ex: São Paulo" style={{ ...inp, marginBottom: 14 }} />
          <Err msg={err} />
          <Btn onClick={gerarConteudo} disabled={loading} style={{ width: '100%', padding: 13 }}>{loading ? '⏳ Gerando conteúdo...' : '→ Gerar Post Pronto'}</Btn>
        </Card>
      )}

      {mod === 'anuncio' && !res && (
        <Card>
          <Lbl>Plataforma</Lbl>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['google', '🔍 Google Ads'], ['meta', '📘 Meta Ads']].map(([v, l]) => (
              <button key={v} onClick={() => setPlataforma(v)} style={{ flex: 1, background: plataforma === v ? T.goldDim : 'transparent', border: `1px solid ${plataforma === v ? T.gold : T.border}`, borderRadius: 7, padding: '9px', color: plataforma === v ? T.gold : T.textMuted, fontSize: 12, cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div><Lbl>Cidade alvo</Lbl><input value={cidadeAnuncio} onChange={(e) => setCidadeAnuncio(e.target.value)} placeholder="ex: Curitiba" style={inp} /></div>
            <div><Lbl>Orçamento/mês (R$) — opcional</Lbl><input value={orcamento} onChange={(e) => setOrcamento(e.target.value)} placeholder="ex: 500" type="number" style={inp} /></div>
          </div>
          <Err msg={err} />
          <Btn onClick={gerarAnuncio} disabled={loading} style={{ width: '100%', padding: 13 }}>{loading ? '⏳ Gerando anúncio...' : '→ Gerar Texto de Anúncio'}</Btn>
        </Card>
      )}

      {mod === 'indicacao' && !res && (
        <Card>
          <InfoBox>💡 A melhor fonte de novos clientes é quem você já atendeu bem. Esta mensagem pede indicação de forma natural, sem constranger e dentro do EOAB.</InfoBox>
          <Lbl>Nome do ex-cliente</Lbl>
          <input value={nomeEx} onChange={(e) => setNomeEx(e.target.value)} placeholder="ex: João Silva" style={{ ...inp, marginBottom: 12 }} />
          <Lbl>Caso que foi atendido — opcional</Lbl>
          <input value={casoEx} onChange={(e) => setCasoEx(e.target.value)} placeholder="ex: ganhou horas extras e FGTS após 5 anos" style={{ ...inp, marginBottom: 14 }} />
          <Err msg={err} />
          <Btn onClick={gerarIndicacao} disabled={loading} style={{ width: '100%', padding: 13 }}>{loading ? '⏳ Gerando mensagem...' : '→ Gerar Mensagem de Indicação'}</Btn>
        </Card>
      )}

      {res?.tipo === 'conteudo' && (
        <>
          <Card accent={T.gold}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Tag color={T.gold}>POST PRONTO</Tag>
              <CopyBtn text={`${res.titulo}\n\n${res.corpo}\n\n${res.hashtags}`} />
            </div>
            <div style={{ color: T.gold, fontSize: 15, fontWeight: 700, marginBottom: 10, fontFamily: 'Georgia,serif' }}>{res.titulo}</div>
            <p style={{ color: T.text, fontSize: 14, lineHeight: 1.8, margin: '0 0 12px', whiteSpace: 'pre-wrap' }}>{res.corpo}</p>
            <div style={{ color: T.textMuted, fontSize: 12 }}>{res.hashtags}</div>
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <Card style={{ margin: 0, background: T.purpleBg, borderColor: `${T.purple}25` }}><Lbl>📣 CTA</Lbl><p style={{ color: T.purple, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{res.cta}</p></Card>
            <Card style={{ margin: 0 }}><Lbl>⏰ Melhor horário</Lbl><p style={{ color: T.textMuted, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{res.melhor_horario}</p></Card>
          </div>
          <Btn variant="ghost" onClick={reset} style={{ width: '100%' }}>+ Gerar outro</Btn>
        </>
      )}

      {res?.tipo === 'anuncio' && (
        <>
          <Card accent={T.gold}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Tag color={T.gold}>{plataforma === 'google' ? '🔍 GOOGLE ADS' : '📘 META ADS'}</Tag>
              <CopyBtn text={plataforma === 'google' ? `${res.titulo_principal}\n${res.descricao}` : `${res.texto_feed}\n${res.headline}`} />
            </div>
            {plataforma === 'google' ? (
              <>
                <div style={{ marginBottom: 8 }}><Lbl>Título (30 chars)</Lbl><div style={{ color: T.gold, fontSize: 15, fontWeight: 700 }}>{res.titulo_principal}</div></div>
                <div><Lbl>Descrição (90 chars)</Lbl><div style={{ color: T.text, fontSize: 13 }}>{res.descricao}</div></div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 8 }}><Lbl>Texto do feed</Lbl><p style={{ color: T.text, fontSize: 14, margin: 0, lineHeight: 1.7 }}>{res.texto_feed}</p></div>
                <div><Lbl>Headline</Lbl><div style={{ color: T.gold, fontSize: 15, fontWeight: 700 }}>{res.headline}</div></div>
              </>
            )}
          </Card>
          <Card>
            <Lbl>🔑 Palavras-chave</Lbl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
              {(res.palavras_chave || []).map((p, i) => <Tag key={i} color={T.textMuted} bg={T.surface}>{p}</Tag>)}
            </div>
            <Lbl>🎯 Segmentação sugerida</Lbl>
            <p style={{ color: T.textMuted, fontSize: 13, margin: '0 0 10px' }}>{res.segmentacao}</p>
            <Lbl>💰 Orçamento mínimo sugerido</Lbl>
            <p style={{ color: T.yellow, fontSize: 13, margin: 0 }}>{res.orcamento_sugerido}</p>
          </Card>
          <Btn variant="ghost" onClick={reset} style={{ width: '100%' }}>+ Gerar outro</Btn>
        </>
      )}

      {res?.tipo === 'indicacao' && (
        <>
          <Card accent={T.green}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Tag color={T.green}>WHATSAPP</Tag><CopyBtn text={res.mensagem_whatsapp} />
            </div>
            <p style={{ color: T.text, fontSize: 14, lineHeight: 1.8, margin: 0, fontFamily: 'Georgia,serif', whiteSpace: 'pre-wrap' }}>{res.mensagem_whatsapp}</p>
          </Card>
          <Card accent={T.purple}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Tag color={T.purple}>E-MAIL / LINKEDIN</Tag><CopyBtn text={res.mensagem_email} />
            </div>
            <p style={{ color: T.text, fontSize: 14, lineHeight: 1.8, margin: 0, fontFamily: 'Georgia,serif' }}>{res.mensagem_email}</p>
          </Card>
          <Card style={{ background: T.greenBg, borderColor: `${T.green}22` }}>
            <Lbl>◆ Por que funciona</Lbl>
            <p style={{ color: '#8ecfa0', fontSize: 13, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>{res.por_que_funciona}</p>
          </Card>
          <Btn variant="ghost" onClick={reset} style={{ width: '100%' }}>+ Outro cliente</Btn>
        </>
      )}

      {mod === 'imagem' && !imgPost && (
        <Card>
          <Lbl>Tema do post</Lbl>
          <select value={imgTema} onChange={e => setImgTema(e.target.value)} style={{ ...sel, marginBottom: 10 }}>
            <option value="">Selecione o tema...</option>
            {[...TEMAS_IMG, 'Outro...'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {imgTema === 'Outro...' && <input value={imgTemaCustom} onChange={e => setImgTemaCustom(e.target.value)} placeholder="Digite o tema..." style={{ ...inp, marginBottom: 10 }} />}
          <Lbl style={{ marginTop: 10 }}>Estilo</Lbl>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {ESTILOS_IMG.map(e => (
              <button key={e.id} onClick={() => setImgEstilo(e.id)}
                style={{ background: imgEstilo === e.id ? T.goldDim : T.card, border: `1px solid ${imgEstilo === e.id ? T.gold : T.border}`, borderRadius: 9, padding: '10px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <div style={{ color: imgEstilo === e.id ? T.gold : T.text, fontSize: 12, fontWeight: 700 }}>{e.label}</div>
                <div style={{ color: T.textMuted, fontSize: 10, marginTop: 2 }}>{e.desc}</div>
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div><Lbl>Seu nome</Lbl><input value={imgNome} onChange={e => setImgNome(e.target.value)} placeholder="Dr(a). Seu Nome" style={inp} /></div>
            <div><Lbl>Formato</Lbl>
              <select value={imgFormato} onChange={e => setImgFormato(e.target.value)} style={sel}>
                <option value="feed">📷 Feed (1:1)</option>
                <option value="story">📱 Story (9:16)</option>
              </select>
            </div>
          </div>
          <Err msg={err} />
          <Btn onClick={async () => {
            const t = imgTema === 'Outro...' ? imgTemaCustom : imgTema;
            if (!t) { setErr('Escolha ou digite um tema.'); return; }
            setErr(''); setLoading(true);
            try {
              const estiloObj = ESTILOS_IMG.find(e => e.id === imgEstilo);
              const prompt = `Você é especialista em comunicação jurídica para redes sociais. Crie post para Instagram de advogado trabalhista. Siga o EOAB: sem prometer resultados, tom educativo.\n\nTema: ${t}\nEstilo: ${estiloObj.label} — ${estiloObj.desc}\nNome: ${imgNome || 'Dr. Advogado'}\nFormato: ${imgFormato === 'feed' ? 'Feed quadrado' : 'Story vertical'}\n\nRetorne SOMENTE JSON: {"titulo":"max 6 palavras","subtitulo":"max 10 palavras","corpo":"2-3 linhas educativas","cta":"max 8 palavras sem prometer resultado","hashtags":["t1","t2","t3","t4","t5"],"cor_fundo":"hex escuro ex #0a1628","cor_destaque":"hex ex #c9a84c","emoji_principal":"1 emoji"}`;
              const r = await callClaude(prompt, t, 1000);
              setImgPost(r);
            } catch(e) { setErr(e.message); } finally { setLoading(false); }
          }} disabled={loading} style={{ width: '100%', padding: 14 }}>
            {loading ? '⏳ Gerando post...' : '→ Gerar Imagem do Post'}
          </Btn>
        </Card>
      )}
      {mod === 'imagem' && imgPost && (() => {
        setTimeout(() => desenharCanvasPresenca(imgPost, imgFormato, imgNome), 80);
        const downloadPost = () => {
          const c = document.getElementById('postCanvasPresenca');
          if (!c) return;
          const a = document.createElement('a');
          a.download = 'post-instagram.png';
          a.href = c.toDataURL('image/png');
          a.click();
        };
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Tag color={T.green}>POST GERADO</Tag>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={downloadPost} style={{ background: T.goldDim, border: `1px solid ${T.goldBorder}`, color: T.gold, borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>⬇ Baixar PNG</button>
                <Btn variant="ghost" onClick={() => setImgPost(null)} style={{ padding: '6px 12px', fontSize: 11 }}>Novo</Btn>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <canvas id="postCanvasPresenca" style={{ maxWidth: '100%', borderRadius: 12, boxShadow: '0 4px 24px #00000040' }} />
            </div>
            <Card style={{ background: T.surface }}>
              <Lbl>Texto gerado</Lbl>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['Título', imgPost.titulo],['Subtítulo', imgPost.subtitulo],['Corpo', imgPost.corpo],['CTA', imgPost.cta]].map(([k,v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div><span style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace' }}>{k}: </span><span style={{ fontSize: 12, color: T.text }}>{v}</span></div>
                    <CopyBtn text={v} />
                  </div>
                ))}
                <div><span style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace' }}>Hashtags: </span><span style={{ fontSize: 12, color: T.blue }}>{(imgPost.hashtags || []).map(h => '#'+h).join(' ')}</span></div>
              </div>
            </Card>
          </div>
        );
      })()}
    </div>
  );
}

// ─── 7. GERADOR DE IMAGENS ────────────────────────────────────────────────────
function ToolImagens() {
  const [tema, setTema] = useState('');
  const [temaCustom, setTemaCustom] = useState('');
  const [estilo, setEstilo] = useState('educativo');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [post, setPost] = useState(null);
  const [formato, setFormato] = useState('feed');

  const gerar = async () => {
    const t = tema === 'Outro...' ? temaCustom : tema;
    if (!t) { setErr('Escolha ou digite um tema.'); return; }
    setErr(''); setLoading(true);
    try {
      const estiloObj = ESTILOS_IMG.find(e => e.id === estilo);
      const prompt = `Você é um especialista em comunicação jurídica para redes sociais. Crie o texto para um post de Instagram de advogado trabalhista. Siga o EOAB: sem prometer resultados, sem captação explícita, tom educativo e informativo.

Tema: ${t}
Estilo: ${estiloObj.label} — ${estiloObj.desc}
Nome do advogado: ${nome || 'Dr. Advogado'}
Formato: ${formato === 'feed' ? 'Post quadrado (feed)' : 'Story vertical'}

Retorne SOMENTE JSON:
{"titulo":"título impactante (max 6 palavras)","subtitulo":"subtítulo (max 10 palavras)","corpo":"texto principal (2-3 linhas, direto e educativo)","cta":"chamada para ação (max 8 palavras, sem prometer resultado)","hashtags":["tag1","tag2","tag3","tag4","tag5"],"cor_fundo":"código hex escuro ex: #0a1628","cor_destaque":"código hex dourado ou vibrante ex: #c9a84c","emoji_principal":"1 emoji que representa o tema"}`;
      const r = await callClaude(prompt, t, 1000);
      setPost(r);
    } catch(e) { setErr(e.message); } finally { setLoading(false); }
  };

  const downloadPost = () => {
    const canvas = document.getElementById('postCanvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'post-instagram.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const desenharCanvas = (p) => {
    const canvas = document.getElementById('postCanvas');
    if (!canvas || !p) return;
    const size = 600;
    const height = formato === 'feed' ? 600 : 1067;
    canvas.width = size; canvas.height = height;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, size, height);
    grad.addColorStop(0, p.cor_fundo || '#0a1628');
    grad.addColorStop(1, '#060d1a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, size, height);
    const barGrad = ctx.createLinearGradient(0, 0, size, 0);
    barGrad.addColorStop(0, 'transparent');
    barGrad.addColorStop(0.5, p.cor_destaque || '#c9a84c');
    barGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = barGrad; ctx.fillRect(0, 0, size, 4);
    ctx.font = formato === 'feed' ? '80px serif' : '100px serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.emoji_principal || '⚖️', size/2, formato === 'feed' ? 120 : 160);
    ctx.fillStyle = p.cor_destaque || '#c9a84c';
    ctx.font = `bold ${formato === 'feed' ? '36px' : '42px'} Arial`;
    ctx.textAlign = 'center';
    wrapCanvasText(ctx, (p.titulo || '').toUpperCase(), size/2, formato === 'feed' ? 190 : 290, size - 80, formato === 'feed' ? 42 : 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = `${formato === 'feed' ? '18px' : '22px'} Arial`;
    wrapCanvasText(ctx, p.subtitulo || '', size/2, formato === 'feed' ? 260 : 390, size - 100, formato === 'feed' ? 26 : 30);
    const lineY = formato === 'feed' ? 295 : 440;
    ctx.strokeStyle = (p.cor_destaque || '#c9a84c') + '66';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(60, lineY); ctx.lineTo(size - 60, lineY); ctx.stroke();
    ctx.fillStyle = '#c8d8ee';
    ctx.font = `${formato === 'feed' ? '15px' : '18px'} Arial`;
    wrapCanvasText(ctx, p.corpo || '', size/2, formato === 'feed' ? 330 : 490, size - 80, formato === 'feed' ? 22 : 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${formato === 'feed' ? '14px' : '17px'} Arial`;
    ctx.fillText('👉 ' + (p.cta || ''), size/2, formato === 'feed' ? 440 : 700);
    ctx.fillStyle = p.cor_destaque || '#c9a84c';
    ctx.font = `bold ${formato === 'feed' ? '13px' : '16px'} Arial`;
    ctx.fillText(nome || 'Dr. Advogado', size/2, formato === 'feed' ? 490 : 800);
    ctx.fillStyle = '#3a5a7a';
    ctx.font = `${formato === 'feed' ? '10px' : '13px'} Arial`;
    ctx.fillText((p.hashtags || []).map(h => '#' + h).join(' '), size/2, formato === 'feed' ? 520 : 860);
    ctx.fillStyle = barGrad; ctx.fillRect(0, height - 4, size, 4);
  };

  if (post) setTimeout(() => desenharCanvas(post), 50);

  return (
    <div>
      <Title sub="Gere imagens prontas para Instagram e Stories — sem precisar de designer.">🖼️ Gerador de Imagens IA</Title>
      {!post ? (
        <Card>
          <Lbl>Tema do post</Lbl>
          <select value={tema} onChange={e => setTema(e.target.value)} style={{ ...sel, marginBottom: 10 }}>
            <option value="">Selecione o tema...</option>
            {[...TEMAS_IMG, 'Outro...'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {tema === 'Outro...' && <input value={temaCustom} onChange={e => setTemaCustom(e.target.value)} placeholder="Digite o tema..." style={{ ...inp, marginBottom: 10 }} />}
          <Lbl style={{ marginTop: 10 }}>Estilo</Lbl>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {ESTILOS_IMG.map(e => (
              <button key={e.id} onClick={() => setEstilo(e.id)}
                style={{ background: estilo === e.id ? T.goldDim : T.card, border: `1px solid ${estilo === e.id ? T.gold : T.border}`, borderRadius: 9, padding: '10px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <div style={{ color: estilo === e.id ? T.gold : T.text, fontSize: 12, fontWeight: 700 }}>{e.label}</div>
                <div style={{ color: T.textMuted, fontSize: 10, marginTop: 2 }}>{e.desc}</div>
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div><Lbl>Seu nome</Lbl><input value={nome} onChange={e => setNome(e.target.value)} placeholder="Dr(a). Seu Nome" style={inp} /></div>
            <div><Lbl>Formato</Lbl>
              <select value={formato} onChange={e => setFormato(e.target.value)} style={sel}>
                <option value="feed">📷 Feed (1:1)</option>
                <option value="story">📱 Story (9:16)</option>
              </select>
            </div>
          </div>
          <Err msg={err} />
          <Btn onClick={gerar} disabled={loading} style={{ width: '100%', padding: 14 }}>
            {loading ? '⏳ Gerando post...' : '→ Gerar Imagem do Post'}
          </Btn>
        </Card>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Tag color={T.green}>POST GERADO</Tag>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={downloadPost} style={{ background: T.goldDim, border: `1px solid ${T.goldBorder}`, color: T.gold, borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>⬇ Baixar PNG</button>
              <Btn variant="ghost" onClick={() => setPost(null)} style={{ padding: '6px 12px', fontSize: 11 }}>Novo</Btn>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <canvas id="postCanvas" style={{ maxWidth: '100%', borderRadius: 12, boxShadow: `0 4px 24px #00000040` }} />
          </div>
          <Card style={{ background: T.surface }}>
            <Lbl>Texto gerado</Lbl>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Título', post.titulo], ['Subtítulo', post.subtitulo], ['Corpo', post.corpo], ['CTA', post.cta]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div><span style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace' }}>{k}: </span><span style={{ fontSize: 12, color: T.text }}>{v}</span></div>
                  <CopyBtn text={v} />
                </div>
              ))}
              <div><span style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace' }}>Hashtags: </span><span style={{ fontSize: 12, color: T.blue }}>{(post.hashtags || []).map(h => '#' + h).join(' ')}</span></div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'lead',     icon: '⚡', label: '1. Lead',     sub: 'Analisar + fechar' },
  { id: 'crm',      icon: '📋', label: '2. CRM',      sub: 'Pipeline + fichas' },
  { id: 'contrato', icon: '📄', label: '3. Contrato', sub: 'Honorários completo' },
  { id: 'calc',     icon: '🧮', label: '4. Verbas',   sub: 'Calculadora rescisória' },
  { id: 'presenca', icon: '📣', label: '5. MKT',      sub: 'Presença + Imagem IA' },
];

export default function App() {
  const [active, setActive] = useState('lead');
  const [crmKey, setCrmKey] = useState(0);
  const handleSaveCRM = () => setCrmKey(k => k + 1);
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, background: T.surface, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ width: 32, height: 32, background: `linear-gradient(135deg,${T.gold},#7a5810)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>⚖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>FECHA CONTRATO</div>
          <div style={{ fontSize: 9, color: T.textDim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>INTELIGÊNCIA JURÍDICA COMERCIAL · PRODUTO FINAL</div>
        </div>
      </div>
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, display: 'flex', overflowX: 'auto', padding: '0 8px' }}>
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${active === t.id ? T.gold : 'transparent'}`, padding: '10px 12px', color: active === t.id ? T.gold : T.textMuted, fontSize: 11, cursor: 'pointer', fontFamily: 'monospace', whiteSpace: 'nowrap', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, maxWidth: 700, width: '100%', margin: '0 auto', padding: '28px 18px 60px' }}>
        {active === 'lead'     && <ToolLead onSaveCRM={handleSaveCRM} />}
        {active === 'crm'      && <ToolCRM key={crmKey} />}
        {active === 'contrato' && <ToolContrato />}
        {active === 'calc'     && <ToolCalc />}
        {active === 'presenca' && <ToolPresenca />}
      </div>
      <style>{`
        *{box-sizing:border-box;}
        input,textarea,select{caret-color:${T.gold};}
        textarea::placeholder,input::placeholder{color:${T.textDim};}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}
        ::-webkit-scrollbar-track{background:${T.bg};}
        button:active{opacity:0.75;}
        select option{background:#fff;color:${T.text};}
      `}</style>
    </div>
  );
}

