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
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: '10px 12px',
  color: T.text,
  fontSize: 13,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'sans-serif',
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
const P_ANALISE = `Você é um advogado trabalhista sênior com 20 anos de experiência no Brasil. Analise o relato do lead com precisão técnica.

BASE JURÍDICA COMPLETA que você domina:
CLT: arts. 9, 29, 41, 58-62 (jornada), 74 (controle de ponto), 118, 129-143 (férias), 166-200 (segurança), 223-A a 223-G (dano existencial/reforma), 240, 394-A (gestante), 441-507 (rescisão), 482-483 (justa causa/rescisão indireta)
CF/88 art.7º: I (FGTS/despedida arbitrária), II (seguro-desemprego), IV (salário mínimo), VI (irredutibilidade), VIII (13º), IX (adicional noturno), XIII (jornada 8h/44h), XIV (turnos revezamento 6h), XV (repouso semanal), XVI (hora extra 50%), XVII (férias+1/3), XVIII (licença maternidade 120d), XIX (licença paternidade), XXII (saúde/segurança), XXIII (adicional insalubridade/periculosidade), XXIX (prescrição 5 anos/2 anos)
TST Súmulas relevantes: 6 (equiparação salarial), 17 (gratificação natalina), 21 (CLT art.477), 29 (rescisão nula), 51 (norma coletiva), 55 (repouso semanal), 85 (compensação jornada), 114 (estabilidade cipeiro), 132 (adicional periculosidade), 138 (semana espanhola), 149 (pres.rurícola), 159 (hora extra), 172 (adicional noturno), 199 (bancário), 204 (equiparação), 212 (ônus prova dispensa), 219 (honorários), 228 (percentual insalubridade), 244 (gestante), 246 (FGTS falta grave), 260 (adicional férias), 277 (CCT), 291 (aviso prévio), 296 (horas extras), 303 (equiparação servidor), 331 (terceirização), 338 (ponto), 339 (adicional acúmulo), 358 (uniforme), 362 (prescrição FGTS), 363 (reconhecimento vínculo PJ), 366 (ata audiência), 369 (dirigente sindical), 372 (auxiliar enfermagem), 374 (sobreaviso), 376 (adicional noturno transferência), 377 (aviso prévio FGTS), 378 (rito sumaríssimo), 381 (proporcionalidade), 386 (domingos e feriados), 388 (jornada motorista), 391 (gestante contrato prazo), 392 (proteção gestante), 396 (amamentação), 437 (banco horas), 443 (aviso prévio proporcional), 450 (tempo pré-contratual)
OJ SDI-1: 24 (adicional transferência), 57 (adicional noturno), 103 (bancário), 195 (repouso), 215 (aviso prévio), 232 (prescrição declaratória), 273 (FGTS rescisão indireta), 295 (FGTS), 361 (pres.FGTS), 363 (reconhecimento vínculo)
Leis: 8.036/90 (FGTS art.18 multa 40%), 9.029/95 (discriminação), 9.601/98 (contrato prazo), 11.788/08 (estágio), 12.506/11 (aviso proporcional: 3d/ano + 30d base = máx 90d), 13.467/17 (reforma: art.444 PLT, art.611-A CCT prevalece, art.58-A tempo parcial), Lei 14.611/23 (igualdade salarial), LGPD 13.709/18

RESPONDA SOMENTE com o JSON (sem markdown, sem texto extra):
{"nome":"nome ou Não informado","situacao":"empregado|demitido|rescisão indireta|autônomo|PJ|não informado","tempo_empresa":"X anos Y meses ou não informado","salario_estimado":"valor mensal estimado ou não informado","violacoes":["descrição clara da irregularidade"],"fundamentos":["Art. X CLT — descrição","Súmula X TST — descrição"],"provas_mencionadas":["prova citada no relato"],"provas_sugeridas":["prova que deve ser levantada"],"nivel":"forte|moderado|fraco","justificativa":"frase técnica explicando o nível","prescricao_alerta":"alerta sobre prazo prescricional se relevante ou null","alerta_risco":"risco jurídico ou estratégico ou null"}`;

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

const P_APRESENTACAO = (nomeAdv, escritorio, personalizada) => `Você é um especialista em comunicação jurídica. Gere uma mensagem de PRIMEIRO CONTATO para um advogado trabalhista responder um potencial cliente que acabou de entrar em contato (ex: mandou apenas "Oi", "Boa tarde" ou mensagem inicial).

OBJETIVO: Iniciar o funil de forma acolhedora, profissional e gerar confiança para o cliente compartilhar o caso.

${personalizada ? `ADVOGADO: ${nomeAdv || '[Nome do Advogado]'}\nESCRITÓRIO: ${escritorio || '[Nome do Escritório]'}` : 'Use linguagem genérica — o advogado vai personalizar antes de enviar.'}

REGRAS ABSOLUTAS:
- NUNCA prometer resultado, valor ou êxito (violação EOAB arts. 34 e 39)
- Tom acolhedor, humano e profissional
- Máximo 6 linhas para WhatsApp
- Terminar com uma pergunta aberta que convide o cliente a contar o caso

RESPONDA SOMENTE com o JSON (sem markdown):
{"whatsapp":"mensagem para WhatsApp (max 6 linhas)","email":"versão para e-mail ou LinkedIn (mais formal, com saudação e despedida)","por_que_funciona":"razão psicológica da abordagem"}`;

const P_NOVA_MSG = (ctx) => `Você é um advogado trabalhista expert em comunicação e fechamento de contratos. O lead abaixo já foi analisado e está no funil. Ele mandou uma nova mensagem. Responda de forma estratégica, mantendo o relacionamento aquecido e avançando o fechamento. Respeite o EOAB: sem prometer resultados ou valores.

CONTEXTO DO CASO JÁ ANALISADO:
${ctx}

Responda SOMENTE com o JSON (sem markdown):
{"resposta_whatsapp":"resposta direta para WhatsApp (máx 5 linhas, tom humano, termina com pergunta ou próximo passo claro)","resposta_email":"versão mais formal para e-mail ou LinkedIn","analise_intencao":"o que o lead está realmente comunicando com essa mensagem (insegurança, interesse, objeção velada, etc.)","proximo_passo":"ação concreta que o advogado deve tomar agora"}`;

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

const P_DOSSIE = `Você é um estrategista jurídico-comercial de elite. Com base no perfil completo do lead abaixo, gere um DOSSIÊ EXECUTIVO que o advogado vai usar durante a consulta presencial ou por vídeo. O objetivo é fazer o advogado parecer que estudou o caso por dias inteiros. Tom direto, objetivo, como um briefing de alto nível para CEO.

Retorne SOMENTE JSON (sem markdown):
{"resumo_caso":"2-3 frases que resumem o caso de forma precisa e técnica para o advogado relembrar durante a consulta","pontos_fortes":["ponto forte jurídico do caso para o advogado explorar"],"pontos_frageis":["ponto fraco ou risco que o advogado deve antecipar"],"estrategia_abertura":"frase exata que o advogado deve usar para abrir a conversa — algo que mostre que ele conhece o caso profundamente","argumento_central":"o argumento jurídico mais poderoso em linguagem simples para o cliente entender e se sentir representado","valor_estimado_causa":"estimativa realista do valor da causa baseada nas violações","probabilidade_exito":"Alta|Média|Baixa","justificativa_exito":"razão técnica em 1 linha","script_fechamento":"frase exata para pedir a assinatura do contrato ao final da consulta — natural, sem pressão excessiva, respeitando EOAB","nao_diga":"o que o advogado NÃO deve dizer ou prometer nessa consulta específica"}`;

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

// ─── 1. ANALISAR LEAD ─────────────────────────────────────────────────────────
const ABORDAGENS = [
  { id: 'urgencia', icon: '⚡', label: 'Urgência', cor: T.red, desc: 'Lead procrastinando — prescrição em risco' },
  { id: 'empatia', icon: '🤝', label: 'Empatia', cor: T.purple, desc: 'Lead abalado, inseguro, com medo' },
  { id: 'autoridade', icon: '⚖️', label: 'Autoridade', cor: T.gold, desc: 'Lead quer sentir que fala com expert' },
  { id: 'racional', icon: '📊', label: 'Racional', cor: T.blue, desc: 'Lead quer entender antes de decidir' },
  { id: 'exclusivo', icon: '🎯', label: 'Exclusividade', cor: T.green, desc: 'Lead precisa do empurrão final' },
];
const INSTRUCOES = {
  urgencia: 'Mencione DIRETAMENTE o prazo prescricional de 2 anos após extinção do contrato (art. 7º XXIX CF/88, art. 11 CLT). Cada dia sem agir é risco real de perder direitos. Tom firme e respeitoso.',
  empatia: 'Valide o sofrimento primeiro. Mostre que entende a situação difícil. O advogado é parceiro, não vendedor. Tom acolhedor, humano. Cite proteção legal que ampara essa pessoa.',
  autoridade: 'Demonstre domínio técnico imediato. Cite artigos da CLT e Súmulas do TST aplicáveis ao caso. Tom seguro, de referência no assunto. O cliente deve sentir que está com o melhor.',
  racional: 'Apresente os direitos de forma objetiva. Relate o que ele tem a ganhar e o risco de não agir. Cite o percentual de êxito da área. Tom educativo, transparente, sem pressão.',
  exclusivo: 'Crie senso de oportunidade — atenção personalizada, análise completa feita, janela aberta agora. Tom de oportunidade única sem desespero. Valorize o tempo que já dedicou ao caso.',
};

const FORMATOS = [
  { id: 'whatsapp', icon: '💬', label: 'WhatsApp', desc: 'Curto e direto, máx 5 linhas' },
  { id: 'email', icon: '📧', label: 'E-mail', desc: 'Formal, completo, com saudação' },
  { id: 'ligacao', icon: '📞', label: 'Roteiro de Ligação', desc: 'Script para falar ao telefone' },
  { id: 'formal', icon: '📋', label: 'Mensagem Formal', desc: 'Profissional para LinkedIn/escritório' },
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

function BlocoApresentacao() {
  const [aberto, setAberto]         = useState(false);
  const [modo, setModo]             = useState('generica');
  const [nomeAdv, setNomeAdv]       = useState('');
  const [escritorio, setEscritorio] = useState('');
  const [resultado, setResultado]   = useState(null);
  const [loading, setLoading]       = useState(false);
  const [err, setErr]               = useState('');

  const gerar = async () => {
    setLoading(true); setErr('');
    try {
      const r = await callClaude(P_APRESENTACAO(nomeAdv, escritorio, modo === 'personalizada'), 'Gere a mensagem de primeiro contato.', 800);
      setResultado(r);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 14, overflow: 'hidden' }}>
      <button onClick={() => setAberto(!aberto)}
        style={{ width: '100%', background: 'transparent', border: 'none', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 20 }}>👋</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>Mensagem de Apresentação</div>
          <div style={{ color: T.textMuted, fontSize: 11, marginTop: 2 }}>Cliente mandou "Oi"? Gere aqui o primeiro contato do funil</div>
        </div>
        <span style={{ color: T.textMuted, fontSize: 18, transform: aberto ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </button>
      {aberto && (
        <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${T.border}` }}>
          {!resultado ? (
            <>
              <div style={{ paddingTop: 14, marginBottom: 14 }}>
                <Lbl>Tipo de mensagem</Lbl>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['generica', '🌐 Genérica', 'Pronto para usar'], ['personalizada', '✏️ Personalizada', 'Com seu nome e escritório']].map(([v, l, d]) => (
                    <button key={v} onClick={() => setModo(v)}
                      style={{ flex: 1, background: modo === v ? T.goldDim : 'transparent', border: `1px solid ${modo === v ? T.gold : T.border}`, borderRadius: 9, padding: '10px 12px', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ color: modo === v ? T.gold : T.text, fontSize: 12, fontWeight: 700 }}>{l}</div>
                      <div style={{ color: T.textMuted, fontSize: 10, marginTop: 2 }}>{d}</div>
                    </button>
                  ))}
                </div>
              </div>
              {modo === 'personalizada' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div><Lbl>Seu nome</Lbl><input value={nomeAdv} onChange={e => setNomeAdv(e.target.value)} placeholder="Dr(a). Seu Nome" style={inp} /></div>
                  <div><Lbl>Escritório</Lbl><input value={escritorio} onChange={e => setEscritorio(e.target.value)} placeholder="Nome do Escritório" style={inp} /></div>
                </div>
              )}
              <Err msg={err} />
              <Btn onClick={gerar} disabled={loading} style={{ width: '100%', padding: 12 }}>
                {loading ? '⏳ Gerando...' : '→ Gerar Mensagem de Apresentação'}
              </Btn>
            </>
          ) : (
            <div style={{ paddingTop: 14 }}>
              {[['💬 WHATSAPP', 'whatsapp', T.green], ['📧 E-MAIL / LINKEDIN', 'email', T.blue]].map(([lbl, key, cor]) => (
                <Card key={key} accent={cor} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Tag color={cor}>{lbl}</Tag><CopyBtn text={resultado[key]} />
                  </div>
                  <p style={{ color: T.text, fontSize: 13, lineHeight: 1.8, margin: 0, fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>{resultado[key]}</p>
                </Card>
              ))}
              <div style={{ background: T.greenBg, borderRadius: 9, padding: '10px 14px', marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: T.green, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 4 }}>◆ POR QUE FUNCIONA</div>
                <p style={{ color: T.green, fontSize: 12, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>{resultado.por_que_funciona}</p>
              </div>
              <Btn variant="ghost" onClick={() => setResultado(null)} style={{ width: '100%', fontSize: 11 }}>↺ Gerar novamente</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ToolLead({ onSaveCRM }) {
  const [step, setStep] = useState(1);
  const [txt, setTxt] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [msgs, setMsgs] = useState(null);
  const [ab, setAb] = useState('urgencia');
  const [fmt, setFmt] = useState('whatsapp');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [savedCRM, setSavedCRM] = useState(false);
  const [histAuto, setHistAuto] = useState([]);
  const [dossie, setDossie] = useState(null);
  const [loadingDossie, setLoadingDossie] = useState(false);
  const [novaMsg, setNovaMsg]         = useState('');
  const [novaResp, setNovaResp]       = useState(null);
  const [loadingNova, setLoadingNova] = useState(false);
  const [showNovaMsg, setShowNovaMsg] = useState(false);

  const novaEntrada = (icone, txt) => ({
    icone, txt, auto: true,
    data: new Date().toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  });

  const handleArquivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErr('');

    // ZIP — exportação do WhatsApp
    if (file.name.endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
      try {
        const JSZipMod = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
        const JSZip = JSZipMod.default || JSZipMod;
        const zip = await JSZip.loadAsync(file);
        let textoConversa = '';
        const audios = [];
        for (const [nome, entry] of Object.entries(zip.files)) {
          if (!entry.dir) {
            if (nome.endsWith('.txt')) textoConversa = await entry.async('string');
            else if (nome.match(/\.(mp4|m4a|opus|ogg|aac|mp3)$/i)) audios.push(nome);
          }
        }
        if (textoConversa) {
          setTxt(textoConversa.slice(0, 8000));
          setNomeArquivo(file.name + ' ✓ conversa extraída');
          setArquivo(null);
          if (audios.length > 0) setErr('✓ Conversa extraída! ' + audios.length + ' áudio(s) no ZIP.');
        } else {
          setErr('Nenhum texto encontrado no ZIP. Confirme se é exportação do WhatsApp.');
        }
      } catch (_) { setErr('Erro ao abrir o ZIP. Extraia manualmente e cole o texto.'); }
      return;
    }

    // TXT simples
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => { setTxt(reader.result.slice(0, 8000)); setNomeArquivo(file.name); setArquivo(null); };
      reader.readAsText(file, 'UTF-8'); return;
    }

    // Áudio avulso do WhatsApp
    if (file.type.startsWith('audio/') || file.name.match(/\.(mp4|m4a|opus|ogg|aac|mp3)$/i)) {
      setNomeArquivo(file.name + ' (áudio — cole a transcrição abaixo)');
      setArquivo(null); setErr('Áudio recebido! Cole a transcrição manualmente no campo acima.'); return;
    }

    // PDF ou imagem
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      if (file.type === 'application/pdf') {
        setArquivo({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } });
      } else if (file.type.startsWith('image/')) {
        setArquivo({ type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } });
      } else {
        setErr('Formato não suportado. Use PDF, imagem, TXT ou ZIP do WhatsApp.'); return;
      }
      setNomeArquivo(file.name);
    };
    reader.readAsDataURL(file);
  };

  const analisar = async () => {
    if (txt.trim().length < 5 && !arquivo) { setErr('Descreva o caso ou anexe um arquivo.'); return; }
    setErr(''); setLoading(true);
    try {
      const r = await callClaude(P_ANALISE, txt || 'Analise o documento anexado.', 1500, arquivo);
      setAnalysis(r);
      setHistAuto(prev => [...prev, { icone: '⚡', txt: `Análise gerada — nível ${(r.nivel||'').toUpperCase()} — ${(r.violacoes||[]).slice(0,2).join(', ')}`, auto: true, data: new Date().toLocaleDateString('pt-BR'), hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
      setStep(2);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const gerarMsgs = async (abId, fmtId) => {
    const id = abId || ab;
    const fid = fmtId || fmt;
    setAb(id); setFmt(fid); setLoading(true); setErr('');
    try {
      const ctx = `Nome: ${analysis.nome}\nSituação: ${analysis.situacao}\nTempo: ${analysis.tempo_empresa}\nViolações: ${(analysis.violacoes || []).join('; ')}\nFundamentos: ${(analysis.fundamentos || []).slice(0, 3).join('; ')}`;
      const r = await callClaude(P_MENSAGEM_FORMATO(ABORDAGENS.find((a) => a.id === id)?.label, INSTRUCOES[id], fid), ctx);
      setMsgs({ ...r, abId: id, fmtId: fid });
      setHistAuto(prev => [...prev, { icone: '📨', txt: `Mensagem gerada — tom ${ABORDAGENS.find(a=>a.id===id)?.label} · ${FORMATOS.find(f=>f.id===fid)?.label}`, auto: true, data: new Date().toLocaleDateString('pt-BR'), hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
      setStep(3);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const salvarCRM = () => {
    if (!analysis || savedCRM) return;
    const novo = {
      id: Date.now(),
      nome: analysis.nome !== 'Não informado' ? analysis.nome : 'Lead sem nome',
      contato: '',
      caso: (analysis.violacoes || []).slice(0, 2).join(', '),
      stage: 'novo',
      vinculo: analysis.situacao,
      tempo: analysis.tempo_empresa,
      salario: analysis.salario_estimado,
      violacoes: (analysis.violacoes || []).join('; '),
      docs: [],
      hist: [...histAuto, { icone: '📥', txt: 'Lead cadastrado no CRM', auto: true, data: new Date().toLocaleDateString('pt-BR'), hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }],
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('lf_leads') || '[]');
      localStorage.setItem('lf_leads', JSON.stringify([novo, ...existing]));
      setSavedCRM(true);
      if (onSaveCRM) onSaveCRM();
    } catch (e) {}
  };

  if (step === 1) return (
    <div>
      <Title sub="Cole o relato ou anexe um arquivo — PDF, print, foto do documento.">⚡ Analisar Lead</Title>

      {/* ── BLOCO APRESENTAÇÃO ── */}
      <BlocoApresentacao />

      <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={7}
        placeholder="Cole aqui o relato do lead trabalhista...&#10;&#10;Ex: 'Fui demitido depois de 6 anos sem receber horas extras...'"
        style={{ ...inp, resize: 'vertical', lineHeight: 1.7, fontSize: 14, padding: 16 }}
        onFocus={(e) => (e.target.style.borderColor = `${T.gold}55`)}
        onBlur={(e) => (e.target.style.borderColor = T.border)} />
      <div style={{ textAlign: 'right', fontSize: 11, color: T.textDim, fontFamily: 'monospace', margin: '4px 0 12px' }}>{txt.length} caracteres</div>

      {/* ANEXO */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, background: nomeArquivo ? T.greenBg : T.surface, border: `1px solid ${nomeArquivo ? T.green : T.border}`, borderRadius: 10, padding: '12px 16px', cursor: 'pointer', marginBottom: 14, transition: 'all 0.2s' }}>
        <input type="file" accept=".pdf,.zip,.txt,.mp4,.m4a,.opus,.ogg,.aac,.mp3,image/*" onChange={handleArquivo} style={{ display: 'none' }} />
        <span style={{ fontSize: 18 }}>{nomeArquivo ? '✓' : '📎'}</span>
        <div>
          <div style={{ color: nomeArquivo ? T.green : T.text, fontSize: 13, fontWeight: 600 }}>
            {nomeArquivo || 'Anexar arquivo — PDF, imagem ou ZIP do WhatsApp'}
          </div>
          <div style={{ color: T.textMuted, fontSize: 11, marginTop: 2 }}>
            {nomeArquivo ? 'Arquivo pronto para análise' : 'ZIP do WhatsApp, PDF, print, áudio (.mp4/.opus/.m4a)...'}
          </div>
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

  if (step === 2 && analysis) {
    const nv = analysis.nivel?.toLowerCase();
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <button onClick={() => setStep(1)} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 7, padding: '6px 12px', color: T.textMuted, fontSize: 12, cursor: 'pointer' }}>← Voltar</button>
          <Title sub="Análise jurídica completa com base na CLT, TST e CF/88.">Análise do Caso</Title>
        </div>
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            {[['Lead', analysis.nome], ['Situação', analysis.situacao], ['Tempo', analysis.tempo_empresa], ['Salário est.', analysis.salario_estimado]].map(([k, v]) => (
              <div key={k}><Lbl>{k}</Lbl><div style={{ color: T.text, fontSize: 13 }}>{v || 'Não informado'}</div></div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: NB[nv] || T.surface, borderRadius: 8, marginBottom: 14 }}>
            <Tag color={NC[nv] || T.textMuted} bg={NB[nv]}>{(analysis.nivel || '').toUpperCase()}</Tag>
            <span style={{ color: NC[nv] || T.textMuted, fontSize: 13, fontStyle: 'italic' }}>{analysis.justificativa}</span>
          </div>
          <Lbl>Violações Identificadas</Lbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {(analysis.violacoes || []).map((v, i) => <Tag key={i} color={T.gold}>{v}</Tag>)}
          </div>
          <Lbl>Fundamentos Jurídicos</Lbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
            {(analysis.fundamentos || []).map((f, i) => (
              <div key={i} style={{ background: T.surface, borderRadius: 6, padding: '6px 10px', color: T.textMuted, fontSize: 12, fontFamily: 'monospace' }}>{f}</div>
            ))}
          </div>
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

        {/* SALVAR NO CRM */}
        <button onClick={salvarCRM} disabled={savedCRM}
          style={{ width: '100%', background: savedCRM ? T.greenBg : T.surface, border: `1px solid ${savedCRM ? T.green : T.border}`, borderRadius: 10, padding: '10px 16px', cursor: savedCRM ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, transition: 'all 0.2s' }}>
          <span style={{ fontSize: 16 }}>{savedCRM ? '✓' : '📋'}</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: savedCRM ? T.green : T.text, fontSize: 13, fontWeight: 600 }}>{savedCRM ? 'Salvo no CRM!' : 'Salvar lead no CRM automaticamente'}</div>
            <div style={{ color: T.textMuted, fontSize: 11 }}>{savedCRM ? 'Lead adicionado com dados da análise' : 'Preenche nome, caso, violações e situação'}</div>
          </div>
        </button>
        <Err msg={err} />
        <Btn onClick={() => gerarMsgs(ab, fmt)} disabled={loading} style={{ width: '100%', padding: 14 }}>
          {loading ? '⏳ Gerando mensagem...' : `→ Gerar ${FORMATOS.find(f=>f.id===fmt)?.icon} ${FORMATOS.find(f=>f.id===fmt)?.label} com tom ${ABORDAGENS.find((a) => a.id === ab)?.icon} ${ABORDAGENS.find((a) => a.id === ab)?.label}`}
        </Btn>

        {/* ── RESPONDER MENSAGEM DO CLIENTE ── */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ color: T.textDim, fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>OU SE O CLIENTE JÁ RESPONDEU</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>
          <button onClick={() => { setShowNovaMsg(!showNovaMsg); setNovaResp(null); setNovaMsg(''); }}
            style={{ width: '100%', background: showNovaMsg ? T.goldDim : T.surface, border: `1.5px dashed ${showNovaMsg ? T.gold : T.border}`, borderRadius: 12, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: showNovaMsg ? T.gold : `${T.gold}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>💬</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: showNovaMsg ? T.gold : T.text, fontSize: 13, fontWeight: 700 }}>Responder mensagem, dúvida ou resposta do cliente</div>
              <div style={{ color: T.textMuted, fontSize: 11, marginTop: 2 }}>Cole aqui o que o cliente escreveu — a IA gera a resposta ideal com contexto do caso</div>
            </div>
            <span style={{ color: showNovaMsg ? T.gold : T.textDim, fontSize: 18, transform: showNovaMsg ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
          </button>
          {showNovaMsg && (
            <div style={{ background: T.surface, border: `1px solid ${T.goldBorder}`, borderRadius: '0 0 12px 12px', borderTop: 'none', padding: '16px 18px 18px' }}>
              {!novaResp ? (
                <>
                  <Lbl>O que o cliente escreveu?</Lbl>
                  <textarea value={novaMsg} onChange={e => setNovaMsg(e.target.value)} rows={4}
                    placeholder={'Cole aqui a mensagem, dúvida ou resposta do cliente...\n\nEx: "Mas será que vale a pena mesmo? Tenho medo de perder meu emprego atual..."'}
                    style={{ ...inp, resize: 'none', lineHeight: 1.7, fontSize: 13, marginBottom: 12, borderColor: `${T.gold}40` }} />
                  <Btn onClick={async () => {
                    if (!novaMsg.trim()) return;
                    setLoadingNova(true); setErr('');
                    try {
                      const ctx = `Lead: ${analysis.nome} | Situação: ${analysis.situacao} | Tempo: ${analysis.tempo_empresa} | Nível: ${analysis.nivel}
Violações: ${(analysis.violacoes||[]).join(', ')}
Fundamentos: ${(analysis.fundamentos||[]).slice(0,3).join('; ')}`;
                      const r = await callClaude(P_NOVA_MSG(ctx), `Mensagem/dúvida do cliente: "${novaMsg}"`, 1000);
                      setNovaResp(r);
                      setHistAuto(prev => [...prev, novaEntrada('💬', `Mensagem do cliente respondida: "${novaMsg.slice(0,50)}..."`)]);
                    } catch(e) { setErr(e.message); } finally { setLoadingNova(false); }
                  }} disabled={loadingNova || !novaMsg.trim()} style={{ width: '100%', padding: 12 }}>
                    {loadingNova ? '⏳ Gerando resposta ideal...' : '→ Gerar Resposta para Esta Mensagem'}
                  </Btn>
                </>
              ) : (
                <>
                  <div style={{ background: `${T.border}50`, borderRadius: 8, padding: '10px 14px', marginBottom: 14, display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>👤</span>
                    <div>
                      <div style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace', marginBottom: 3 }}>CLIENTE DISSE</div>
                      <div style={{ color: T.textMuted, fontSize: 13, fontStyle: 'italic', lineHeight: 1.6 }}>"{novaMsg}"</div>
                    </div>
                  </div>
                  <div style={{ background: T.purpleBg, border: `1px solid ${T.purple}20`, borderRadius: 9, padding: '10px 14px', marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: T.purple, fontFamily: 'monospace', marginBottom: 4 }}>🧠 O QUE ELE ESTÁ REALMENTE DIZENDO</div>
                    <div style={{ color: T.purple, fontSize: 12, lineHeight: 1.6 }}>{novaResp.analise_intencao}</div>
                  </div>
                  {[['💬 RESPONDER NO WHATSAPP', 'resposta_whatsapp', T.green], ['📧 RESPONDER POR E-MAIL', 'resposta_email', T.blue]].map(([lbl, key, cor]) => (
                    <div key={key} style={{ background: T.card, border: `1px solid ${cor}30`, borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Tag color={cor}>{lbl}</Tag><CopyBtn text={novaResp[key]} />
                      </div>
                      <p style={{ color: T.text, fontSize: 13, lineHeight: 1.8, margin: 0, fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>{novaResp[key]}</p>
                    </div>
                  ))}
                  <div style={{ background: T.yellowBg, border: `1px solid ${T.yellow}25`, borderRadius: 9, padding: '10px 14px', marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: T.yellow, fontFamily: 'monospace', marginBottom: 4 }}>⚡ PRÓXIMO PASSO RECOMENDADO</div>
                    <div style={{ color: T.yellow, fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}>{novaResp.proximo_passo}</div>
                  </div>
                  <Btn variant="ghost" onClick={() => { setNovaResp(null); setNovaMsg(''); }} style={{ width: '100%', fontSize: 11 }}>
                    ↺ Cliente mandou outra mensagem? Responder novamente
                  </Btn>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 3 && msgs) {
    const abObj = ABORDAGENS.find((a) => a.id === msgs.abId);
    const fmtObj = FORMATOS.find((f) => f.id === msgs.fmtId);
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <button onClick={() => setStep(2)} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 7, padding: '6px 12px', color: T.textMuted, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>← Voltar</button>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, margin: 0, color: T.text }}>Mensagem Pronta ✓</h2>
        </div>
        <p style={{ color: T.textMuted, fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>Copie e cole no canal escolhido.</p>
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
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: T.textMuted, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 8 }}>NÃO GOSTOU? TENTE OUTRA VERSÃO</div>
          <p style={{ color: T.textMuted, fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>A IA gera uma abordagem diferente automaticamente — sem você precisar escolher nada.</p>
          <Btn onClick={() => {
            const outrasAb = ABORDAGENS.filter(a => a.id !== msgs.abId);
            const novaAb = outrasAb[Math.floor(Math.random() * outrasAb.length)];
            gerarMsgs(novaAb.id, msgs.fmtId);
          }} disabled={loading} variant="ghost" style={{ width: '100%', padding: 13, fontWeight: 700 }}>
            {loading ? '⏳ Gerando outra versão...' : '↺ Gerar outra opção de resposta'}
          </Btn>
        </div>
        {/* ✦ DOSSIÊ EXECUTIVO */}
        {!dossie ? (
          <div style={{ background: `${T.gold}10`, border: `1px solid ${T.goldBorder}`, borderRadius: 12, padding: '16px 18px', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: T.gold, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 6 }}>✦ MOLHO SECRETO — DOSSIÊ EXECUTIVO</div>
            <p style={{ color: T.textMuted, fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>Chega na consulta sabendo tudo: pontos fortes, riscos, valor estimado, script de abertura e a frase exata para fechar o contrato.</p>
            <Btn onClick={async () => {
              if (!analysis) return;
              setLoadingDossie(true);
              try {
                const ctx = `Lead: ${analysis.nome} | Cidade: ${analysis.cidade} | Situação: ${analysis.situacao} | Tempo: ${analysis.tempo_empresa} | Salário: ${analysis.salario_estimado}
Violações: ${(analysis.violacoes||[]).join(', ')}
Fundamentos: ${(analysis.fundamentos||[]).slice(0,4).join(' | ')}
Nível: ${analysis.nivel} — ${analysis.justificativa}
${analysis.prescricao_alerta ? `PRESCRIÇÃO: ${analysis.prescricao_alerta}` : ''}
${analysis.alerta_risco ? `RISCO: ${analysis.alerta_risco}` : ''}`;
                const r = await callClaude(P_DOSSIE, ctx, 2000);
                setDossie(r);
                setHistAuto(prev => [...prev, { icone: '✦', txt: 'Dossiê executivo gerado', auto: true, data: new Date().toLocaleDateString('pt-BR'), hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
              } catch(e) {} finally { setLoadingDossie(false); }
            }} disabled={loadingDossie} style={{ width: '100%', padding: 13 }}>
              {loadingDossie ? '⏳ Montando dossiê...' : '✦ Gerar Dossiê Executivo do Lead'}
            </Btn>
          </div>
        ) : (
          <div style={{ background: T.surface, border: `2px solid ${T.goldBorder}`, borderRadius: 14, padding: '20px 20px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${T.gold},#7a5810)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✦</div>
              <div>
                <div style={{ color: T.gold, fontSize: 14, fontWeight: 700, fontFamily: 'Georgia,serif' }}>Dossiê Executivo</div>
                <div style={{ color: T.textMuted, fontSize: 11, fontFamily: 'monospace' }}>{analysis.nome} · {analysis.cidade}</div>
              </div>
              <div style={{ marginLeft: 'auto', background: dossie.probabilidade_exito === 'Alta' ? T.greenBg : dossie.probabilidade_exito === 'Média' ? T.yellowBg : T.redBg, border: `1px solid ${dossie.probabilidade_exito === 'Alta' ? T.green : dossie.probabilidade_exito === 'Média' ? T.yellow : T.red}30`, borderRadius: 8, padding: '4px 12px' }}>
                <div style={{ fontSize: 9, color: T.textDim, fontFamily: 'monospace' }}>ÊXITO</div>
                <div style={{ color: dossie.probabilidade_exito === 'Alta' ? T.green : dossie.probabilidade_exito === 'Média' ? T.yellow : T.red, fontSize: 12, fontWeight: 700 }}>{dossie.probabilidade_exito}</div>
              </div>
            </div>

            <div style={{ background: T.bg, borderRadius: 9, padding: '12px 14px', marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace', marginBottom: 4 }}>RESUMO DO CASO</div>
              <p style={{ color: T.text, fontSize: 13, margin: 0, lineHeight: 1.7, fontFamily: 'Georgia,serif' }}>{dossie.resumo_caso}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={{ background: T.greenBg, border: `1px solid ${T.green}20`, borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: T.green, fontFamily: 'monospace', marginBottom: 6 }}>✓ PONTOS FORTES</div>
                {(dossie.pontos_fortes||[]).map((p,i) => <div key={i} style={{ color: T.green, fontSize: 11, padding: '2px 0', lineHeight: 1.4 }}>• {p}</div>)}
              </div>
              <div style={{ background: T.redBg, border: `1px solid ${T.red}20`, borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: T.red, fontFamily: 'monospace', marginBottom: 6 }}>⚠ PONTOS FRÁGEIS</div>
                {(dossie.pontos_frageis||[]).map((p,i) => <div key={i} style={{ color: T.red, fontSize: 11, padding: '2px 0', lineHeight: 1.4 }}>• {p}</div>)}
              </div>
            </div>

            <div style={{ background: T.purpleBg, border: `1px solid ${T.purple}20`, borderRadius: 9, padding: '12px 14px', marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: T.purple, fontFamily: 'monospace', marginBottom: 5 }}>🎙 COMO ABRIR A CONSULTA — DIGA EXATAMENTE ISSO</div>
              <p style={{ color: T.purple, fontSize: 13, margin: 0, lineHeight: 1.7, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>"{dossie.estrategia_abertura}"</p>
            </div>

            <div style={{ background: T.blueBg, border: `1px solid ${T.blue}20`, borderRadius: 9, padding: '12px 14px', marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: T.blue, fontFamily: 'monospace', marginBottom: 5 }}>⚖️ ARGUMENTO CENTRAL — LINGUAGEM DO CLIENTE</div>
              <p style={{ color: T.blue, fontSize: 13, margin: 0, lineHeight: 1.7 }}>{dossie.argumento_central}</p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1, background: T.goldDim, border: `1px solid ${T.goldBorder}`, borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: T.gold, fontFamily: 'monospace', marginBottom: 4 }}>💰 VALOR ESTIMADO DA CAUSA</div>
                <div style={{ color: T.gold, fontSize: 14, fontWeight: 700 }}>{dossie.valor_estimado_causa}</div>
              </div>
              <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace', marginBottom: 4 }}>JUSTIFICATIVA</div>
                <div style={{ color: T.textMuted, fontSize: 11, lineHeight: 1.4 }}>{dossie.justificativa_exito}</div>
              </div>
            </div>

            <div style={{ background: T.greenBg, border: `1px solid ${T.green}20`, borderRadius: 9, padding: '12px 14px', marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: T.green, fontFamily: 'monospace', marginBottom: 5 }}>✍️ SCRIPT DE FECHAMENTO — FRASE PARA ASSINAR O CONTRATO</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <p style={{ color: T.green, fontSize: 13, margin: 0, lineHeight: 1.7, fontFamily: 'Georgia,serif', fontStyle: 'italic', flex: 1 }}>"{dossie.script_fechamento}"</p>
                <CopyBtn text={dossie.script_fechamento} />
              </div>
            </div>

            <div style={{ background: T.redBg, border: `1px solid ${T.red}20`, borderRadius: 9, padding: '12px 14px', marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: T.red, fontFamily: 'monospace', marginBottom: 5 }}>🚫 NÃO DIGA ISSO NA CONSULTA</div>
              <p style={{ color: T.red, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{dossie.nao_diga}</p>
            </div>

            <Btn variant="ghost" onClick={() => setDossie(null)} style={{ width: '100%', fontSize: 11 }}>↺ Regenerar dossiê</Btn>
          </div>
        )}

        <Btn variant="ghost" onClick={() => { setStep(1); setTxt(''); setAnalysis(null); setMsgs(null); setArquivo(null); setNomeArquivo(''); setSavedCRM(false); setHistAuto([]); setDossie(null); }} style={{ width: '100%', marginTop: 4 }}>
          + Analisar novo lead
        </Btn>
      </div>
    );
  }
  return null;
}

// ─── 2. CRM ───────────────────────────────────────────────────────────────────
const STAGES = [
  { id: 'novo', label: 'Novo Lead', cor: T.textMuted },
  { id: 'contato', label: 'Contato Feito', cor: T.blue },
  { id: 'consulta', label: 'Consulta Agendada', cor: T.yellow },
  { id: 'fechado', label: 'Fechado ✓', cor: T.green },
  { id: 'perdido', label: 'Perdido', cor: T.red },
];
const DOCS = [
  'CTPS', 'Contracheques (últimos 12m)', 'Extrato FGTS', 'Termo de Rescisão / TRCT',
  'Contrato de Trabalho', 'Holerites', 'Espelho de Ponto', 'Atestados Médicos',
  'E-mails / Mensagens', 'RG e CPF', 'Comprovante de Residência', 'PPP (se acidente/doença)',
];

function Ficha({ lead, onBack, onSave, onDel }) {
  const [f, setF] = useState({ cpf: '', endereco: '', vinculo: '', tempo: '', salario: '', violacoes: '', provas: '', honorarios: '', percentual: '', docs: [], hist: [], ...lead });
  const [nota, setNota] = useState('');
  const up = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const addNota = () => {
    if (!nota.trim()) return;
    const h = [{ txt: nota, data: new Date().toLocaleDateString('pt-BR'), hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }, ...(f.hist || [])];
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
      <Card>
        <Lbl>💬 Histórico de Contatos</Lbl>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input value={nota} onChange={(e) => setNota(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNota()} placeholder="Anotação... (Enter para salvar)" style={{ ...inp, flex: 1 }} />
          <Btn onClick={addNota} style={{ padding: '8px 14px', whiteSpace: 'nowrap', fontSize: 12 }}>+ Anotar</Btn>
        </div>
        {!(f.hist || []).length && <div style={{ color: T.textDim, fontSize: 12, fontFamily: 'monospace' }}>Nenhum contato registrado.</div>}
        {(f.hist || []).map((h, i) => (
          <div key={i} style={{ borderLeft: `2px solid ${T.goldBorder}`, paddingLeft: 12, marginBottom: 10 }}>
            <div style={{ color: T.text, fontSize: 13 }}>{h.txt}</div>
            <div style={{ color: T.textDim, fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>{h.data} às {h.hora}</div>
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
    try {
      const d = localStorage.getItem('lf_leads');
      if (d) setLeads(JSON.parse(d));
    } catch (e) {}
    setLoaded(true);
  }, []);

  const save = (nl) => {
    setLeads(nl);
    try { localStorage.setItem('lf_leads', JSON.stringify(nl)); } catch (e) {}
  };
  const addLead = () => {
    if (!form.nome.trim()) return;
    save([{ id: Date.now(), ...form, docs: [], hist: [], createdAt: new Date().toLocaleDateString('pt-BR') }, ...leads]);
    setForm({ nome: '', contato: '', caso: '', stage: 'novo' }); setShowForm(false);
  };
  const saveFicha = (f) => { save(leads.map((l) => (l.id === f.id ? f : l))); setFicha(f); };
  const delLead = (id) => { save(leads.filter((l) => l.id !== id)); setFicha(null); };

  if (!loaded) return <div style={{ color: T.textMuted, padding: 40, textAlign: 'center', fontFamily: 'monospace' }}>Carregando...</div>;
  if (ficha) return <Ficha lead={ficha} onBack={() => setFicha(null)} onSave={saveFicha} onDel={delLead} />;

  return (
    <div>
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
  { id: 'pensar', label: '"Vou pensar e te aviso"' },
  { id: 'dinheiro', label: '"Não tenho dinheiro agora"' },
  { id: 'medo', label: '"Tenho medo de perder o emprego"' },
  { id: 'vale', label: '"Será que vale a pena processar?"' },
  { id: 'tempo', label: '"Não tenho tempo pra isso"' },
  { id: 'empresa', label: '"A empresa é boa, não quero problemas"' },
  { id: 'outro', label: 'Outra objeção...' },
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
    try {
      const r = await callClaude(P_OBJECAO, `Objeção: ${obTxt}\n${ctx ? `Contexto do caso: ${ctx}` : ''}`);
      setRes(r);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
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
  const [f, setF] = useState({ sal: '', entrada: '', saida: '', dias_ultimo_mes: '30', aviso: 'indenizado', tipo: 'sjc', fgts: '' });
  const [res, setRes] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const up = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const n = (v) => parseFloat(v) || 0;

  const calcularMeses = () => {
    if (!f.entrada || !f.saida) return 0;
    const [de, me, ae] = f.entrada.split('/').map(Number);
    const [ds, ms, as_] = f.saida.split('/').map(Number);
    if (!de||!me||!ae||!ds||!ms||!as_) return 0;
    const dtE = new Date(ae, me-1, de);
    const dtS = new Date(as_, ms-1, ds);
    if (dtS <= dtE) return 0;
    return (dtS.getFullYear() - dtE.getFullYear()) * 12 + (dtS.getMonth() - dtE.getMonth());
  };

  const calcular = () => {
    const sal = n(f.sal), meses = calcularMeses(), dias = n(f.dias_ultimo_mes), fgts = n(f.fgts);
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
    if (f.tipo === 'acordo') {
      // Art. 484-A CLT — Rescisão por acordo entre empregado e empregador
      const anosCompletos = Math.floor(meses / 12);
      const diasAviso = Math.min(30 + anosCompletos * 3, 90);
      add('Aviso Prévio (50% do proporcional)', (sal / 30) * diasAviso * 0.5,
        `${Math.round(diasAviso / 2)} dias efetivos — metade do aviso proporcional de ${diasAviso} dias`,
        'Art. 484-A I CLT');
      const fgtsSaldo = fgts > 0 ? fgts : sal * 0.08 * meses;
      add('Multa FGTS 20% (metade da SJC)', fgtsSaldo * 0.2,
        `20% sobre R$ ${fgtsSaldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} — reduzida pela metade vs SJC`,
        'Art. 484-A II CLT');
      add('⚠ Saque FGTS disponível (80% do saldo)', fgtsSaldo * 0.8,
        'Empregado pode sacar 80% — não soma ao total rescisório, é saldo próprio',
        'Art. 484-A §1º CLT');
      // Sem seguro-desemprego — alerta
      items.push({ nome: '✕ Seguro-desemprego', valor: 0, desc: 'NÃO gerado no acordo — exige dispensa unilateral sem justa causa', lei: 'Art. 484-A §2º CLT' });
    }
    setRes({ items, total });
  };

  const verificarAI = async () => {
    if (!res) return;
    setLoadingAI(true);
    try {
      const ctx = `Salário: R$${f.sal}\nTempo: ${calcularMeses()} meses (${f.entrada} a ${f.saida})\nTipo: ${f.tipo}\nVerbas calculadas: ${res.items.map((i) => i.nome + ': R$' + i.valor.toFixed(2)).join(', ')}`;
      const r = await callClaude(P_VERBAS_IA, ctx, 800);
      setAlerta(r);
    } catch (e) {} finally { setLoadingAI(false); }
  };

  const tipos = [{ id: 'sjc', label: 'Sem justa causa' }, { id: 'cjc', label: 'Com justa causa' }, { id: 'ri', label: 'Rescisão indireta (art. 483 CLT)' }, { id: 'pe', label: 'Pedido de demissão' }, { id: 'acordo', label: 'Acordo (art. 484-A CLT)' }];

  return (
    <div>
      <Title sub="Estimativa das verbas rescisórias com fundamentos legais. Base: CLT, CF/88 e Lei 12.506/11.">🧮 Calculadora de Verbas</Title>
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div style={{ gridColumn: '1/-1' }}>
            <Lbl>Salário bruto (R$)</Lbl>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input value={f.sal} onChange={(e) => up('sal', e.target.value)} placeholder="ex: 3500" type="number" style={{ ...inp, flex: 1 }} />
              {calcularMeses() > 0 && (
                <div style={{ background: T.goldDim, border: `1px solid ${T.goldBorder}`, borderRadius: 8, padding: '8px 14px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: T.gold, fontFamily: 'monospace' }}>TEMPO APURADO</div>
                  <div style={{ color: T.gold, fontSize: 13, fontWeight: 700 }}>
                    {Math.floor(calcularMeses()/12) > 0 ? `${Math.floor(calcularMeses()/12)}a ` : ''}{calcularMeses()%12 > 0 ? `${calcularMeses()%12}m` : ''} ({calcularMeses()} meses)
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <Lbl>Data de entrada (dd/mm/aaaa)</Lbl>
            <input value={f.entrada} onChange={e => {
              let v = e.target.value.replace(/\D/g,'');
              if (v.length>2) v = v.slice(0,2)+'/'+v.slice(2);
              if (v.length>5) v = v.slice(0,5)+'/'+v.slice(5);
              up('entrada', v.slice(0,10));
            }} placeholder="ex: 15/03/2019" style={inp} maxLength={10} />
          </div>
          <div>
            <Lbl>Data de saída (dd/mm/aaaa)</Lbl>
            <input value={f.saida} onChange={e => {
              let v = e.target.value.replace(/\D/g,'');
              if (v.length>2) v = v.slice(0,2)+'/'+v.slice(2);
              if (v.length>5) v = v.slice(0,5)+'/'+v.slice(5);
              up('saida', v.slice(0,10));
            }} placeholder="ex: 30/04/2025" style={inp} maxLength={10} />
          </div>
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
          {(f.tipo === 'sjc' || f.tipo === 'ri' || f.tipo === 'acordo') && (
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
  const up = (k, v) => setF((x) => ({ ...x, [k]: v }));

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
      const r = await callClaude(P_CONTRATO, ctx, 2000);
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
          <Err msg={err} />
          <Btn onClick={gerar} disabled={loading} style={{ width: '100%', padding: 13 }}>{loading ? '⏳ Gerando contrato completo...' : '→ Gerar Contrato de Honorários'}</Btn>
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

const ESTILOS_IMG = [
  { id: 'educativo',   label: '📚 Educativo',   desc: 'Explica um direito trabalhista' },
  { id: 'alerta',      label: '⚠️ Alerta',       desc: 'Chama atenção para um risco' },
  { id: 'motivacional',label: '💪 Motivacional', desc: 'Encoraja a buscar direitos' },
  { id: 'pergunta',    label: '❓ Pergunta',     desc: 'Engaja com uma dúvida comum' },
];

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

  // ── estados do gerador de imagens ──
  const [imgTema, setImgTema]       = useState('');
  const [imgTemaCustom, setImgTemaCustom] = useState('');
  const [imgEstilo, setImgEstilo]   = useState('educativo');
  const [imgNome, setImgNome]       = useState('');
  const [imgFormato, setImgFormato] = useState('feed');
  const [imgPost, setImgPost]       = useState(null);

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = (text||'').split(' '); let line = '', cy = y;
    for (let n = 0; n < words.length; n++) {
      const test = line + words[n] + ' ';
      if (ctx.measureText(test).width > maxWidth && n > 0) { ctx.fillText(line, x, cy); line = words[n] + ' '; cy += lineHeight; }
      else { line = test; }
    }
    ctx.fillText(line, x, cy);
  };

  const desenharCanvas = (p, fmt, nome) => {
    const canvas = document.getElementById('imgCanvas');
    if (!canvas || !p) return;
    const w = 600, h = fmt === 'feed' ? 600 : 1067;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, p.cor_fundo || '#0a1628'); bg.addColorStop(1, '#060d1a');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    const bar = ctx.createLinearGradient(0, 0, w, 0);
    bar.addColorStop(0, 'transparent'); bar.addColorStop(0.5, p.cor_destaque || '#c9a84c'); bar.addColorStop(1, 'transparent');
    ctx.fillStyle = bar; ctx.fillRect(0, 0, w, 4);
    ctx.font = `${fmt==='feed'?'80px':'100px'} serif`; ctx.textAlign = 'center';
    ctx.fillText(p.emoji_principal || '⚖️', w/2, fmt==='feed'?120:160);
    ctx.fillStyle = p.cor_destaque || '#c9a84c'; ctx.font = `bold ${fmt==='feed'?'34px':'40px'} Arial`;
    wrapText(ctx, (p.titulo||'').toUpperCase(), w/2, fmt==='feed'?190:285, w-80, fmt==='feed'?42:50);
    ctx.fillStyle = '#fff'; ctx.font = `${fmt==='feed'?'17px':'21px'} Arial`;
    wrapText(ctx, p.subtitulo||'', w/2, fmt==='feed'?255:380, w-100, fmt==='feed'?25:30);
    ctx.strokeStyle = (p.cor_destaque||'#c9a84c')+'66'; ctx.lineWidth = 1;
    const ly = fmt==='feed'?288:432; ctx.beginPath(); ctx.moveTo(60,ly); ctx.lineTo(w-60,ly); ctx.stroke();
    ctx.fillStyle = '#c8d8ee'; ctx.font = `${fmt==='feed'?'14px':'17px'} Arial`;
    wrapText(ctx, p.corpo||'', w/2, fmt==='feed'?325:480, w-80, fmt==='feed'?21:27);
    ctx.fillStyle = '#fff'; ctx.font = `bold ${fmt==='feed'?'13px':'16px'} Arial`;
    ctx.fillText('👉 '+(p.cta||''), w/2, fmt==='feed'?430:690);
    ctx.fillStyle = p.cor_destaque||'#c9a84c'; ctx.font = `bold ${fmt==='feed'?'12px':'15px'} Arial`;
    ctx.fillText(nome||'Dr. Advogado', w/2, fmt==='feed'?480:790);
    ctx.fillStyle = '#3a5a7a'; ctx.font = `${fmt==='feed'?'10px':'13px'} Arial`;
    ctx.fillText((p.hashtags||[]).map(h=>'#'+h).join(' '), w/2, fmt==='feed'?508:848);
    ctx.fillStyle = bar; ctx.fillRect(0, h-4, w, 4);
  };

  const mods = [
    { id: 'conteudo', icon: '✍️', label: 'Conteúdo', desc: 'Post educativo para redes sociais' },
    { id: 'anuncio', icon: '📢', label: 'Anúncio', desc: 'Google Ads ou Meta Ads' },
    { id: 'indicacao', icon: '🤝', label: 'Indicação', desc: 'Reativar ex-clientes' },
    { id: 'imagem',    icon: '🖼️', label: 'Imagem IA',  desc: 'Posts e stories' },
  ];

  return (
    <div>
      <Title sub="Apareça onde seu cliente está. Conteúdo educativo, anúncio e indicação — tudo dentro do EOAB.">📣 Presença Digital</Title>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 22 }}>
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

      {/* ── GERADOR DE IMAGENS IA ── */}
      {mod === 'imagem' && !imgPost && (
        <Card>
          <Lbl>Tema do post</Lbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
            {TEMAS.map(t => (
              <button key={t} onClick={() => setImgTema(t)}
                style={{ background: imgTema===t ? T.goldDim : T.surface, border: `1px solid ${imgTema===t ? T.gold : T.border}`, borderRadius: 7, padding: '6px 11px', color: imgTema===t ? T.gold : T.textMuted, fontSize: 11, cursor: 'pointer' }}>{t}</button>
            ))}
          </div>
          <input value={imgTemaCustom} onChange={e => setImgTemaCustom(e.target.value)} placeholder="Ou digite um tema personalizado..." style={{ ...inp, marginBottom: 14 }} />
          <Lbl>Estilo</Lbl>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {ESTILOS_IMG.map(e => (
              <button key={e.id} onClick={() => setImgEstilo(e.id)}
                style={{ background: imgEstilo===e.id ? T.goldDim : T.card, border: `1px solid ${imgEstilo===e.id ? T.gold : T.border}`, borderRadius: 9, padding: '10px 12px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ color: imgEstilo===e.id ? T.gold : T.text, fontSize: 12, fontWeight: 700 }}>{e.label}</div>
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
            const t = imgTemaCustom.trim() || imgTema;
            if (!t) { setErr('Escolha ou digite um tema.'); return; }
            setErr(''); setLoading(true);
            try {
              const estiloObj = ESTILOS_IMG.find(e => e.id === imgEstilo);
              const prompt = `Você é especialista em comunicação jurídica para redes sociais. Crie post para Instagram de advogado trabalhista. Siga o EOAB: sem prometer resultados, tom educativo.\n\nTema: ${t}\nEstilo: ${estiloObj.label} — ${estiloObj.desc}\nNome: ${imgNome||'Dr. Advogado'}\nFormato: ${imgFormato==='feed'?'Feed quadrado 1:1':'Story vertical 9:16'}\n\nRetorne SOMENTE JSON (sem markdown):\n{"titulo":"max 6 palavras","subtitulo":"max 10 palavras","corpo":"2-3 linhas educativas","cta":"max 8 palavras","hashtags":["t1","t2","t3","t4","t5"],"cor_fundo":"hex escuro ex #0a1628","cor_destaque":"hex ex #c9a84c","emoji_principal":"1 emoji"}`;
              const r = await callClaude(prompt, t, 1000);
              setImgPost(r);
            } catch(e) { setErr(e.message); } finally { setLoading(false); }
          }} disabled={loading} style={{ width: '100%', padding: 14 }}>
            {loading ? '⏳ Gerando post...' : '→ Gerar Imagem do Post'}
          </Btn>
        </Card>
      )}
      {mod === 'imagem' && imgPost && (() => {
        setTimeout(() => desenharCanvas(imgPost, imgFormato, imgNome), 80);
        const baixar = () => {
          const c = document.getElementById('imgCanvas');
          if (!c) return;
          const a = document.createElement('a'); a.download = 'post-instagram.png'; a.href = c.toDataURL('image/png'); a.click();
        };
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Tag color={T.green}>POST GERADO</Tag>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={baixar} style={{ background: T.goldDim, border: `1px solid ${T.goldBorder}`, color: T.gold, borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>⬇ Baixar PNG</button>
                <Btn variant="ghost" onClick={() => setImgPost(null)} style={{ padding: '6px 12px', fontSize: 11 }}>Novo</Btn>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <canvas id="imgCanvas" style={{ maxWidth: '100%', borderRadius: 12, boxShadow: '0 4px 24px #00000040' }} />
            </div>
            <Card>
              <Lbl>Textos para copiar</Lbl>
              {[['Título', imgPost.titulo],['Subtítulo', imgPost.subtitulo],['Corpo', imgPost.corpo],['CTA', imgPost.cta]].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <div><span style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace' }}>{k}: </span><span style={{ fontSize: 12, color: T.text }}>{v}</span></div>
                  <CopyBtn text={v} />
                </div>
              ))}
              <div><span style={{ fontSize: 10, color: T.textDim, fontFamily: 'monospace' }}>Hashtags: </span><span style={{ fontSize: 12, color: T.blue }}>{(imgPost.hashtags||[]).map(h=>'#'+h).join(' ')}</span></div>
            </Card>
          </div>
        );
      })()}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'lead',     icon: '⚡', label: '1. Lead',      sub: 'Analisar + fechar' },
  { id: 'contrato', icon: '📄', label: '2. Contrato',  sub: 'Honorários' },
  { id: 'crm',      icon: '📋', label: '3. CRM',       sub: 'Pipeline + fichas' },
  { id: 'presenca', icon: '📣', label: '4. MKT',       sub: 'Presença digital' },
  { id: 'calc',     icon: '🧮', label: '5. Verbas',    sub: 'Calculadora' },
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
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>LeadFechado</div>
          <div style={{ fontSize: 9, color: T.textDim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>SUÍTE JURÍDICA TRABALHISTA · PRODUTO FINAL</div>
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
        {active === 'lead'     && <ToolLead onSaveCRM={() => setCrmKey(k => k+1)} />}
        {active === 'contrato' && <ToolContrato />}
        {active === 'crm'      && <ToolCRM key={crmKey} />}
        {active === 'presenca' && <ToolPresenca />}
        {active === 'calc'     && <ToolCalc />}
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
