import { useState, useEffect } from 'react';

// ─── BASE JURÍDICA INLINE ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// FECHA CONTRATO — BASE JURÍDICA: CÍVEL + PREVIDENCIÁRIO
// ─────────────────────────────────────────────────────────────────────────────

const BASE_CIVEL = {

  // ══════════════════════════════════════════════════════
  // DIREITO DO CONSUMIDOR
  // ══════════════════════════════════════════════════════
  consumidor: {
    legislacao: [
      "CDC art. 6º — Direitos básicos do consumidor: informação, proteção contra práticas abusivas, prevenção e reparação de danos, acesso à Justiça, facilitação de defesa em juízo, inclusive com inversão do ônus da prova.",
      "CDC art. 12 — Responsabilidade objetiva do fabricante, produtor, construtor ou importador por defeito do produto.",
      "CDC art. 14 — Responsabilidade objetiva do fornecedor de serviços por defeitos na prestação.",
      "CDC art. 17 — Equiparação à condição de consumidor de todas as vítimas do evento danoso (bystander).",
      "CDC art. 18 — Vícios do produto: prazo de 30 dias para sanar, após o qual o consumidor pode exigir substituição, restituição ou abatimento proporcional.",
      "CDC art. 20 — Vícios do serviço: mesmo prazo e opções do art. 18.",
      "CDC art. 26 — Prazos de reclamação: 30 dias (produtos/serviços não duráveis) e 90 dias (duráveis).",
      "CDC art. 27 — Prescrição: 5 anos para reparação de danos causados por fato do produto ou serviço.",
      "CDC art. 39 — Práticas abusivas: vedação de venda casada, cobranças abusivas, publicidade enganosa, recusa injustificada de atendimento.",
      "CDC art. 42 — Proibição de constrangimento ou ameaça ao consumidor na cobrança de dívidas; devolução em dobro do valor cobrado indevidamente (parágrafo único).",
      "CDC art. 43 — Banco de dados: direito à informação, cancelamento de inscrição indevida, indenização.",
      "CDC art. 51 — Cláusulas abusivas consideradas nulas de pleno direito.",
      "CDC art. 54-A a 54-G (Venda por Telefone/Internet — Lei 14.181/21 — Superendividamento): proteção ao consumidor superendividado, renegociação de dívidas, repactuação.",
    ],
    sumulas_stj: [
      "Súmula 297/STJ — O CDC é aplicável às instituições financeiras.",
      "Súmula 302/STJ — É abusiva a cláusula contratual de plano de saúde que limita no tempo a internação hospitalar do segurado.",
      "Súmula 308/STJ — A hipoteca firmada entre a construtora e o agente financeiro, anterior ou posterior à celebração da promessa de compra e venda, não tem eficácia perante os adquirentes do imóvel.",
      "Súmula 323/STJ — A inscrição do nome do devedor pode ser mantida nos serviços de proteção ao crédito até o prazo máximo de cinco anos, independentemente da prescrição da execução.",
      "Súmula 359/STJ — Cabe ao órgão mantenedor do cadastro de proteção ao crédito a notificação do devedor antes de proceder à inscrição.",
      "Súmula 370/STJ — Caracteriza dano moral a apresentação antecipada de cheque pré-datado.",
      "Súmula 379/STJ — Nos contratos bancários não regidos por legislação específica, os juros moratórios poderão ser convencionados até o limite de 1% ao mês.",
      "Súmula 381/STJ — Nos contratos bancários, é vedado ao julgador conhecer, de ofício, da abusividade das cláusulas.",
      "Súmula 385/STJ — Da anotação irregular em cadastro de proteção ao crédito, não cabe indenização por dano moral quando preexistente legítima inscrição, ressalvado o direito ao cancelamento.",
      "Súmula 404/STJ — É dispensável o aviso de recebimento (AR) na carta de comunicação ao consumidor sobre a negativação de seu nome em bancos de dados e cadastros.",
      "Súmula 412/STJ — A ação de repetição de indébito de tarifas de água e esgoto sujeita-se ao prazo prescricional estabelecido no Código Civil.",
      "Súmula 469/STJ — Aplica-se o CDC aos contratos de plano de saúde.",
      "Súmula 479/STJ — As instituições financeiras respondem objetivamente pelos danos gerados por fortuito interno relativo a fraudes e delitos praticados por terceiros no âmbito de operações bancárias.",
      "Súmula 480/STJ — O juízo da recuperação judicial não é competente para decidir sobre a constrição de bens não abrangidos pelo plano de recuperação da empresa em recuperação judicial.",
      "Súmula 548/STJ — Incumbe ao credor a exclusão do registro da dívida em nome do devedor no cadastro de inadimplentes no prazo de cinco dias úteis, a partir do integral e efetivo pagamento do débito.",
      "Súmula 559/STJ — Em ações de execução fiscal, é desnecessária a instrução da petição inicial com o demonstrativo de cálculo do débito, por tratar-se de requisito não previsto no art. 6º da Lei 6.830/80.",
      "Súmula 563/STJ — O CDC é aplicável às entidades abertas de previdência complementar, não incidindo nos contratos previdenciários celebrados com entidades fechadas.",
      "Súmula 572/STJ — O Banco do Brasil, na condição de gestor do Cadastro de Emitentes de Cheques sem Fundos (CCF), não tem legitimidade passiva para responder por danos decorrentes da manutenção indevida do nome do devedor no cadastro depois de cancelado o talonário.",
      "Súmula 601/STJ — O Ministério Público tem legitimidade ativa para atuar na execução de título executivo extrajudicial de crédito relativo a fornecimento de unidades habitacionais em programas de habitação popular.",
    ],
    sumulas_stf: [
      "Súmula Vinculante 17/STF — A mora do segurador em pagar o seguro de vida não se aplica às regras do Decreto-lei nº 73/66.",
    ],
    teses_repetitivas_stj: [
      "Tema 466/STJ — Responsabilidade objetiva das instituições bancárias por fraudes praticadas por estelionatários em prejuízo de correntistas.",
      "Tema 633/STJ — Prazo prescricional de 3 anos (CC art. 206, §3º, V) para cobrança de tarifas bancárias.",
      "Tema 710/STJ — Abusividade de cláusula que prevê a cobrança de tarifa de liquidação antecipada em contratos de crédito.",
      "Tema 958/STJ — É cabível dano moral pela negativação indevida mesmo que existam outros apontamentos legítimos — análise caso a caso.",
    ],
    enunciados_estaduais: [
      "Enunciado 1/TJSP — A responsabilidade do fornecedor por fato do produto ou serviço é objetiva e solidária.",
      "Enunciado 2/TJSP — Aplica-se o prazo prescricional de 5 anos do CDC para ação de cobrança de dívida de consumo.",
      "Enunciado 11/TJRJ — Em relação de consumo, o ônus da prova deve ser invertido em favor do consumidor hipossuficiente.",
      "Enunciado 18/TJMG — O fornecedor responde por defeito do produto mesmo que terceiro tenha contribuído para o evento danoso.",
    ],
  },

  // ══════════════════════════════════════════════════════
  // DIREITO BANCÁRIO
  // ══════════════════════════════════════════════════════
  bancario: {
    legislacao: [
      "Lei 4.595/64 — Lei da Reforma Bancária: define o sistema financeiro nacional e as atribuições do Banco Central.",
      "CC art. 591 — Mútuo bancário: presunção de onerosidade; juros permitidos até o dobro da taxa legal.",
      "CC art. 406 — Taxa de juros moratórios: SELIC ou 1% ao mês.",
      "Lei 10.820/03 — Consignação em folha de pagamento: desconto direto na remuneração, aposentadoria ou benefício.",
      "Resolução CMN 3.517/07 — Transparência nas operações de crédito: exigência do CET (Custo Efetivo Total).",
      "Resolução CMN 4.656/18 e 4.657/18 — Sociedades de crédito direto (SCD) e fintech de crédito.",
      "Lei 13.709/18 (LGPD) — Proteção de dados pessoais aplicável às operações bancárias.",
    ],
    sumulas_stj: [
      "Súmula 286/STJ — A renegociação de contrato bancário ou a confissão da dívida não impede a discussão sobre eventuais ilegalidades dos contratos anteriores.",
      "Súmula 293/STJ — A cobrança antecipada do valor residual garantido (VRG) não descaracteriza o contrato de arrendamento mercantil.",
      "Súmula 294/STJ — Não é potestativa a cláusula contratual que prevê a comissão de permanência, calculada pela taxa média de mercado apurada pelo Banco Central do Brasil, limitada à taxa do contrato.",
      "Súmula 295/STJ — A Taxa Referencial (TR) é indexador válido para contratos posteriores à Lei 8.177/91, desde que pactuada.",
      "Súmula 296/STJ — Os juros remuneratórios, não cumuláveis com a comissão de permanência, são devidos no período de inadimplência, à taxa média de mercado estipulada pelo Banco Central do Brasil, limitada ao percentual contratado.",
      "Súmula 379/STJ — Nos contratos bancários não regidos por legislação específica, os juros moratórios poderão ser convencionados até o limite de 1% ao mês.",
      "Súmula 382/STJ — A estipulação de juros remuneratórios superiores a 12% ao ano, por si só, não indica abusividade.",
      "Súmula 530/STJ — Nos contratos bancários, na impossibilidade de comprovar a taxa de juros efetivamente contratada, por não ter sido juntada cópia do instrumento contratual, incidem os juros remuneratórios à taxa média de mercado, apurada pelo Banco Central do Brasil.",
      "Súmula 541/STJ — A previsão no contrato bancário de taxa de juros anual superior ao duodécuplo da mensal é, por si só, insuficiente para caracterizar a capitalização mensal dos juros.",
      "Súmula 565/STJ — A pactuação das tarifas de abertura de crédito (TAC) e de emissão de carnê (TEC), ou outra denominação para o mesmo fato gerador, é válida apenas nos contratos bancários anteriores ao início da vigência da Resolução-CMN 3.518/2007, de 30/04/2008.",
    ],
    teses_repetitivas_stj: [
      "Tema 27/STJ — Juros remuneratórios em contratos bancários: não estão limitados a 12% ao ano; abusividade depende de demonstração de desvio significativo da taxa de mercado.",
      "Tema 28/STJ — Capitalização de juros em período inferior a um ano em contratos bancários: admitida quando expressamente pactuada.",
      "Tema 618/STJ — Nos contratos de crédito bancário com previsão de pagamento em parcelas, é possível o reconhecimento da anatocismo.",
    ],
  },

  // ══════════════════════════════════════════════════════
  // DIREITO DE FAMÍLIA
  // ══════════════════════════════════════════════════════
  familia: {
    legislacao: [
      "CC art. 1.511 a 1.590 — Casamento: celebração, provas, invalidade, eficácia, dissolução.",
      "CC art. 1.591 a 1.638 — Relações de parentesco, filiação, reconhecimento e adoção.",
      "CC art. 1.694 a 1.710 — Alimentos: direito, fixação, exoneração, revisão.",
      "CC art. 1.723 a 1.727 — União estável: reconhecimento, direitos, dissolução.",
      "CC art. 1.784 a 1.856 — Herança: abertura da sucessão, aceitação, renúncia, ordem de vocação hereditária.",
      "Lei 11.340/06 (Lei Maria da Penha) — Proteção da mulher em situação de violência doméstica.",
      "Lei 8.069/90 (ECA) — Proteção integral da criança e do adolescente.",
      "Lei 12.318/10 — Alienação parental: reconhecimento e sanções.",
      "Lei 13.058/14 — Guarda compartilhada como regra.",
      "Lei 13.105/15 (CPC) arts. 693 a 699 — Ações de família: procedimento especial, mediação obrigatória.",
      "Resolução CNJ 125/10 — Política nacional de tratamento adequado de conflitos, incentivo à mediação familiar.",
    ],
    sumulas_stj: [
      "Súmula 197/STJ — O divórcio direto pode ser concedido sem que haja prévia partilha dos bens.",
      "Súmula 301/STJ — Em ação investigatória, a recusa do suposto pai a submeter-se ao exame de DNA induz presunção juris tantum de paternidade.",
      "Súmula 309/STJ — O débito alimentar que autoriza a prisão civil do alimentante é o que compreende as três prestações anteriores ao ajuizamento da execução e as que se vencerem no curso do processo.",
      "Súmula 336/STJ — A mulher que renunciou aos alimentos na separação judicial tem direito à pensão previdenciária por morte do ex-marido, comprovada a necessidade econômica superveniente.",
      "Súmula 358/STJ — O cancelamento de pensão alimentícia de filho que atingiu a maioridade está sujeito à decisão judicial, mediante contraditório, ainda que nos próprios autos.",
      "Súmula 364/STJ — O conceito de impenhorabilidade de bem de família abrange também o imóvel pertencente a pessoas solteiras, separadas e viúvas.",
      "Súmula 382/STJ — A estipulação de juros remuneratórios superiores a 12% ao ano, por si só, não indica abusividade.",
      "Súmula 379/STJ — Nos contratos bancários não regidos por legislação específica, os juros moratórios poderão ser convencionados até o limite de 1% ao mês.",
      "Súmula 527/STJ — O tempo de direito à guarda do menor cessa com a maioridade civil, salvo o reconhecimento judicial de incapacidade.",
      "Súmula 568/STJ — O relator, monocraticamente e no Superior Tribunal de Justiça, poderá dar ou negar provimento ao recurso quando houver entendimento dominante acerca do tema.",
    ],
    sumulas_stf: [
      "Súmula 380/STF — Comprovada a existência de sociedade de fato entre os concubinos, é cabível a sua dissolução judicial, com a partilha do patrimônio adquirido pelo esforço comum.",
      "Súmula 382/STF — A vida em comum sob o mesmo teto, 'more uxorio', não é indispensável à caracterização do concubinato.",
    ],
    teses_repetitivas_stj: [
      "Tema 538/STJ — Os alimentos devidos por ascendente ao neto têm natureza subsidiária e complementar em relação aos devidos pelo genitor.",
      "Tema 629/STJ — O reconhecimento da paternidade socioafetiva não afasta a paternidade biológica — possibilidade de multiparentalidade.",
      "Tema 692/STJ — A obrigação alimentar fundada no parentesco extingue-se com a morte do alimentante.",
    ],
  },

  // ══════════════════════════════════════════════════════
  // RESPONSABILIDADE CIVIL
  // ══════════════════════════════════════════════════════
  responsabilidade_civil: {
    legislacao: [
      "CC art. 186 — Ato ilícito: aquele que por ação ou omissão voluntária, negligência ou imprudência, violar direito e causar dano a outrem.",
      "CC art. 187 — Abuso de direito: também comete ato ilícito o titular de um direito que ao exercê-lo excede manifestamente os limites impostos.",
      "CC art. 927 — Obrigação de reparar o dano causado por ato ilícito (caput) e responsabilidade objetiva em atividade de risco (parágrafo único).",
      "CC art. 932 — Responsabilidade por ato de terceiro: pais pelos filhos menores, empregadores pelos empregados, donos de hotéis pelos hóspedes.",
      "CC art. 933 — Responsabilidade objetiva pelas pessoas indicadas no art. 932, independentemente de culpa.",
      "CC art. 944 — Indenização mede-se pela extensão do dano; redução equitativa quando houver excessiva desproporção entre a culpa e o dano.",
      "CC art. 945 — Concorrência de culpas: a indenização é reduzida na proporção da culpa da vítima.",
      "CC art. 948 a 954 — Danos por morte, lesão corporal, ofensa à liberdade pessoal.",
    ],
    sumulas_stj: [
      "Súmula 37/STJ — São cumuláveis as indenizações por dano material e dano moral oriundos do mesmo fato.",
      "Súmula 54/STJ — Os juros moratórios fluem a partir do evento danoso, em caso de responsabilidade extracontratual.",
      "Súmula 227/STJ — A pessoa jurídica pode sofrer dano moral.",
      "Súmula 281/STJ — A indenização por dano moral não está sujeita à tarifação prevista na Lei de Imprensa.",
      "Súmula 387/STJ — É lícita a cumulação das indenizações de dano estético e dano moral.",
      "Súmula 490/STJ — A dispensa de empregado portador do vírus HIV, sem motivo, caracteriza dano moral.",
      "Súmula 498/STJ — Não incide imposto de renda sobre as indenizações por danos morais.",
    ],
    sumulas_stf: [
      "Súmula 491/STF — É indenizável o acidente que cause a morte de filho menor, ainda que não exerça trabalho remunerado.",
      "Súmula 562/STF — Na indenização de danos materiais decorrentes de ato ilícito cabe a atualização de seu valor, utilizando-se, para esse fim, dentre outros critérios, os índices de correção monetária.",
    ],
    teses_repetitivas_stj: [
      "Tema 235/STJ — A responsabilidade civil do Estado por danos causados por seus agentes é objetiva.",
      "Tema 426/STJ — Responsabilidade solidária da concessionária e do poder concedente por acidente em rodovia.",
      "Tema 941/STJ — Responsabilidade civil de empresas de aplicativo de transporte por fatos praticados por motoristas cadastrados.",
    ],
  },

  // ══════════════════════════════════════════════════════
  // CONTRATOS
  // ══════════════════════════════════════════════════════
  contratos: {
    legislacao: [
      "CC art. 421 — Função social do contrato: a liberdade contratual será exercida nos limites da função social.",
      "CC art. 422 — Princípio da boa-fé objetiva: os contratantes são obrigados a guardar na conclusão e execução do contrato.",
      "CC art. 423 — Contratos de adesão: cláusulas ambíguas ou contraditórias devem ser interpretadas em favor do aderente.",
      "CC art. 424 — Cláusulas abusivas em contratos de adesão: são nulas as que estipulem a renúncia antecipada do aderente a direito resultante da natureza do negócio.",
      "CC art. 478 a 480 — Resolução por onerosidade excessiva (teoria da imprevisão): contrato pode ser resolvido se a prestação se tornar excessivamente onerosa por acontecimentos extraordinários.",
      "CC art. 593 a 622 — Prestação de serviços: prazo máximo, resilição, responsabilidades.",
      "CC art. 709 a 721 — Representação comercial.",
      "CC art. 730 a 756 — Seguro: espécies, obrigações do segurado, obrigações da seguradora.",
    ],
    sumulas_stj: [
      "Súmula 308/STJ — A hipoteca firmada entre a construtora e o agente financeiro, anterior ou posterior à celebração da promessa de compra e venda, não tem eficácia perante os adquirentes do imóvel.",
      "Súmula 543/STJ — Na hipótese de resolução de contrato de promessa de compra e venda de imóvel submetido ao CDC, deve ocorrer a imediata restituição das parcelas pagas pelo promissário comprador.",
      "Súmula 572/STJ — O banco que cede crédito a empresa de factoring não responde pelo inadimplemento do devedor cedido.",
    ],
    teses_repetitivas_stj: [
      "Tema 565/STJ — Em contratos de compra e venda de imóvel, a cláusula de tolerância de 180 dias para entrega não é, por si só, abusiva.",
      "Tema 996/STJ — Lucros cessantes em caso de atraso na entrega de imóvel novo.",
    ],
  },

  // ══════════════════════════════════════════════════════
  // OBRIGAÇÕES
  // ══════════════════════════════════════════════════════
  obrigacoes: {
    legislacao: [
      "CC art. 233 a 242 — Obrigações de dar coisa certa: tradição, perecimento, deterioração.",
      "CC art. 243 a 246 — Obrigações de dar coisa incerta: escolha, riscos.",
      "CC art. 247 a 249 — Obrigações de fazer: pessoal ou impessoal; inadimplemento.",
      "CC art. 250 a 251 — Obrigações de não fazer.",
      "CC art. 264 a 285 — Obrigações solidárias: solidariedade ativa e passiva.",
      "CC art. 389 a 420 — Inadimplemento das obrigações: perdas e danos, juros, correção monetária, cláusula penal.",
    ],
    sumulas_stj: [
      "Súmula 54/STJ — Os juros moratórios fluem a partir do evento danoso em caso de responsabilidade extracontratual.",
      "Súmula 163/STJ — O fornecimento de energia elétrica para imóvel rural é serviço essencial e não pode ser suspenso por inadimplência.",
      "Súmula 412/STJ — A ação de repetição de indébito de tarifas de água e esgoto sujeita-se ao prazo prescricional estabelecido no CC.",
    ],
  },

  // ══════════════════════════════════════════════════════
  // DANO MORAL
  // ══════════════════════════════════════════════════════
  dano_moral: {
    legislacao: [
      "CF art. 5º, V e X — Direito à reparação por dano moral; inviolabilidade da intimidade, vida privada, honra e imagem.",
      "CC art. 186 — Ato ilícito: fundamento da responsabilidade civil por dano moral.",
      "CC art. 927 — Obrigação de indenizar.",
      "CC art. 944 — Extensão da indenização.",
    ],
    sumulas_stj: [
      "Súmula 37/STJ — São cumuláveis as indenizações por dano material e dano moral oriundos do mesmo fato.",
      "Súmula 227/STJ — A pessoa jurídica pode sofrer dano moral.",
      "Súmula 281/STJ — A indenização por dano moral não está sujeita à tarifação prevista na Lei de Imprensa.",
      "Súmula 370/STJ — Caracteriza dano moral a apresentação antecipada de cheque pré-datado.",
      "Súmula 385/STJ — Da anotação irregular em cadastro de proteção ao crédito, não cabe indenização por dano moral quando preexistente legítima inscrição, ressalvado o direito ao cancelamento.",
      "Súmula 387/STJ — É lícita a cumulação das indenizações de dano estético e dano moral.",
      "Súmula 490/STJ — A dispensa de empregado portador do vírus HIV sem motivo caracteriza dano moral.",
      "Súmula 498/STJ — Não incide imposto de renda sobre as indenizações por danos morais.",
    ],
    sumulas_stf: [
      "Súmula Vinculante 37/STF — Não cabe ao Poder Judiciário, que não tem função legislativa, aumentar vencimentos de servidores públicos sob fundamento de isonomia.",
    ],
    teses_repetitivas_stj: [
      "Tema 970/STJ — Dano moral in re ipsa pela negativação indevida do nome do consumidor.",
      "Tema 1063/STJ — Fixação do dano moral: critérios de razoabilidade, proporcionalidade, caráter pedagógico e situação econômica das partes.",
    ],
    enunciados_jornadas: [
      "Enunciado 159/CJF — O dano moral pode ser presumido (in re ipsa) quando da simples análise da situação fática, dispensando prova de sofrimento concreto.",
      "Enunciado 411/CJF — O juiz deve arbitrar o valor do dano moral com base na extensão do dano, nas condições econômicas das partes e no caráter pedagógico da indenização.",
      "Enunciado 444/CJF — A responsabilidade civil por dano moral pode ter caráter punitivo.",
      "Enunciado 550/CJF — A avaliação do dano à imagem far-se-á pela conjugação dos critérios de repercussão e da natureza da ofensa.",
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BASE PREVIDENCIÁRIA
// ─────────────────────────────────────────────────────────────────────────────

const BASE_PREVIDENCIARIA = {

  // ══════════════════════════════════════════════════════
  // LEGISLAÇÃO BASE
  // ══════════════════════════════════════════════════════
  legislacao: [
    "CF art. 201 — Previdência Social: cobertura dos eventos de doença, invalidez, morte e idade avançada; proteção à maternidade e desemprego involuntário.",
    "CF art. 203 — Assistência Social: benefícios a quem não possa prover a própria manutenção.",
    "Lei 8.212/91 — Custeio da Seguridade Social: contribuições previdenciárias, prazo de contribuição, base de cálculo.",
    "Lei 8.213/91 art. 18 — Rol de benefícios: aposentadoria por idade, por tempo de contribuição, especial, por invalidez; auxílio-doença; salário-maternidade; pensão por morte; auxílio-acidente.",
    "Lei 8.213/91 art. 25 — Carência: 12 meses para auxílio-doença e aposentadoria por invalidez; 180 meses para aposentadoria por idade, salvo casos especiais.",
    "Lei 8.213/91 art. 29 — Salário-de-benefício: média dos últimos 12 ou 80% dos maiores salários de contribuição.",
    "Lei 8.213/91 art. 42 a 47 — Aposentadoria por invalidez: requisitos, carência, revisão.",
    "Lei 8.213/91 art. 59 a 63 — Auxílio-doença: requisitos, carência, cessação, prorrogação.",
    "Lei 8.213/91 art. 65 a 70 — Salário-família.",
    "Lei 8.213/91 art. 71 a 73 — Salário-maternidade.",
    "Lei 8.213/91 art. 74 a 79 — Pensão por morte: dependentes, cálculo, cessação.",
    "Lei 8.213/91 art. 86 — Auxílio-acidente: sequela definitiva, redução da capacidade laboral.",
    "Lei 8.742/93 (LOAS) art. 20 — BPC/LOAS: pessoa com deficiência ou idoso (65 anos), renda familiar per capita inferior a 1/4 do salário mínimo.",
    "EC 103/2019 (Reforma da Previdência) — Novas regras de aposentadoria por idade (65 H / 62 M), por tempo de contribuição (progressão das alíquotas), e regras de transição.",
    "Decreto 3.048/99 — Regulamento da Previdência Social: definições de segurado, contribuinte individual, facultativo, especial.",
    "Lei 11.718/08 — Segurado especial rural: conceito, carência diferenciada, comprovação.",
    "IN INSS 128/2022 — Procedimentos administrativos do INSS: reconhecimento de direitos, agendamento, recursos.",
  ],

  // ══════════════════════════════════════════════════════
  // SÚMULAS STJ
  // ══════════════════════════════════════════════════════
  sumulas_stj: [
    "Súmula 9/STJ — A exigência da reserva de 1/3 do salário para efetivação do desconto em consignação não se aplica às remunerações que correspondam ao salário mínimo.",
    "Súmula 160/STJ — É defeso, ao Município, atualizar o IPTU, mediante decreto, em percentual superior ao índice oficial de correção monetária.",
    "Súmula 163/STJ — O fornecimento de energia elétrica para imóvel rural é serviço essencial.",
    "Súmula 193/STJ — O segurado tem direito à complementação do auxílio-doença pela empresa quando o salário-de-benefício for inferior ao salário contratual.",
    "Súmula 235/STJ — A conexão não determina a reunião dos processos, se um deles já foi julgado.",
    "Súmula 410/STJ — A prévia intimação pessoal do devedor constitui condição necessária para a cobrança de multa pelo descumprimento de obrigação de fazer ou não fazer.",
    "Súmula 467/STJ — Prescreve em cinco anos, contados do término do processo administrativo, a pretensão da Administração Pública de promover a execução da multa por infração ambiental.",
    "Súmula 47/STJ — O tempo de serviço militar, incluído o de candidato a reserva que não foi convocado, é computável para fins de aposentadoria.",
    "Súmula 62/STJ — Não é possível o reconhecimento do tempo de serviço rural por meio de certidão expedida após a implantação do Prontuário de Identificação.",
    "Súmula 149/STJ — A prova exclusivamente testemunhal não basta à comprovação da atividade rurícola, para efeito da obtenção de benefício previdenciário.",
    "Súmula 235/STJ — A conexão não determina a reunião dos processos, se um deles já foi julgado.",
    "Súmula 55/STJ — Tribunal de Contas Estadual: competência para aprovar contas dos Municípios.",
    "Súmula 568/STJ — O relator, monocraticamente e no STJ, poderá dar ou negar provimento ao recurso quando houver entendimento dominante acerca do tema.",
  ],

  // ══════════════════════════════════════════════════════
  // SÚMULAS STF
  // ══════════════════════════════════════════════════════
  sumulas_stf: [
    "Súmula Vinculante 33/STF — Aplicam-se ao servidor público, no que couber, as regras do regime geral da previdência social sobre aposentadoria especial de que trata o artigo 40, § 4º, inciso III da Constituição Federal.",
    "Súmula 726/STF — Para efeito de aposentadoria especial de professores, não se computa o tempo de serviço prestado fora da sala de aula.",
    "Súmula 736/STF — Compete à Justiça do Trabalho julgar as ações que tenham como causa de pedir o descumprimento de normas trabalhistas relativas à segurança, higiene e saúde dos trabalhadores.",
  ],

  // ══════════════════════════════════════════════════════
  // TEMAS REPETITIVOS STJ — PREVIDENCIÁRIO
  // ══════════════════════════════════════════════════════
  temas_repetitivos_stj: [
    "Tema 48/STJ — O benefício de prestação continuada (BPC/LOAS) pode ser concedido à pessoa com deficiência independentemente de comprovação de hipossuficiência absoluta, desde que demonstrada a incapacidade de prover a própria subsistência.",
    "Tema 313/STJ — A perda da qualidade de segurado não impede o recebimento de benefício por incapacidade se, quando implementadas todas as condições necessárias, o segurado mantinha essa qualidade.",
    "Tema 501/STJ — O prazo decadencial de 10 anos para revisão de ato que concedeu benefício previdenciário começa a fluir da data em que o segurado recebeu a primeira prestação.",
    "Tema 554/STJ — Prazo de cinco anos para cobrança de diferenças de benefício previdenciário em face do INSS.",
    "Tema 629/STJ — A natureza jurídica do auxílio-doença não se confunde com a aposentadoria por invalidez; a conversão depende de perícia que ateste incapacidade total e permanente.",
    "Tema 732/STJ — A trabalhadora rural que comprovar o exercício de atividade rural anterior ao advento da Lei 8.213/91 tem direito à contagem desse período para fins de carência.",
    "Tema 778/STJ — A averbação do tempo de serviço rural sem o recolhimento das contribuições previdenciárias é possível exclusivamente para fins de obtenção de benefício previdenciário.",
    "Tema 905/STJ — A data de início do benefício (DIB) deve ser fixada na data do requerimento administrativo, salvo quando o segurado não tinha direito nessa data.",
    "Tema 998/STJ — O período de graça estendido por doença grave (art. 15, §1º, Lei 8.213/91) é aplicável às doenças que geram incapacidade laboral prolongada.",
    "Tema 1038/STJ — A conversão de tempo de contribuição especial em comum independe de requerimento administrativo expresso; basta a comprovação das condições especiais.",
  ],

  // ══════════════════════════════════════════════════════
  // SÚMULAS E TESES TNU
  // ══════════════════════════════════════════════════════
  tnu: [
    "Súmula 8/TNU — Para reconhecimento do direito ao auxílio-doença não é exigida a comprovação do recolhimento de contribuições, desde que se verifique a ocorrência do estado de incapacidade durante o período de graça.",
    "Súmula 9/TNU — O uso de Equipamento de Proteção Individual (EPI), ainda que elimine a insalubridade, no caso de exposição a ruído, não descaracteriza o tempo de serviço especial prestado.",
    "Súmula 16/TNU — Para fins de concessão de benefício previdenciário ao trabalhador rural, o início de prova material deve ser contemporâneo aos fatos que pretende provar.",
    "Súmula 27/TNU — A ausência de Comunicação de Acidente do Trabalho (CAT) não é óbice ao reconhecimento do acidente de trabalho, bastando a comprovação do nexo causal.",
    "Súmula 29/TNU — Para os efeitos do art. 20, §2º, da Lei 8.742/93, incapacidade para a vida independente não é só aquela que impede as atividades mais elementares da pessoa, mas também a impossibilita de prover ao próprio sustento.",
    "Súmula 32/TNU — O tempo de trabalho laborado com exposição a ruído é considerado especial, para fins de conversão em comum, independentemente do nível de ruído e do período.",
    "Súmula 33/TNU — Quando o requerimento administrativo de benefício por incapacidade for indeferido sem que o segurado tenha sido submetido a exame médico, a concessão do benefício judicial deve ser a partir da data do referido requerimento.",
    "Súmula 36/TNU — Não se aplica o princípio do tempus regit actum para fins de concessão de benefício previdenciário, devendo ser analisado o direito segundo as normas vigentes à época do implemento dos requisitos.",
    "Súmula 42/TNU — Para fins de aplicação do art. 20, §2º, da Lei 8.742/93, a incapacidade social ou para o trabalho do idoso com 65 anos ou mais é presumida.",
    "Súmula 47/TNU — Uma vez reconhecida a incapacidade parcial para o trabalho, o juiz deve analisar as condições pessoais do segurado para verificar se há possibilidade de exercício de outras atividades.",
    "Súmula 48/TNU — A natureza das atividades desempenhadas pelo trabalhador deve ser aferida por todas as provas produzidas nos autos, inclusive por documentos particulares, desde que contemporâneos ao período que se pretende comprovar.",
    "Súmula 54/TNU — Para a concessão de aposentadoria por invalidez, não é exigível que a incapacidade seja insusceptível de reabilitação.",
    "Súmula 57/TNU — O simples fato de o segurado estar desempregado à época de sua incapacidade não gera presunção de ausência de meios de subsistência e, portanto, não é fundamento suficiente para deferir o BPC/LOAS.",
    "Súmula 63/TNU — A comprovação de tempo de serviço para os efeitos dos benefícios previstos na Lei n.° 8.213/1991, inclusive mediante justificação administrativa ou judicial, conforme preceitua o art. 55, § 3°, só produz efeito quando baseada em início de prova material.",
    "Súmula 64/TNU — O exercício das atividades de tratorista e operador de máquinas agrícolas por mais de 25 anos, com exposição habitual ao agrotóxico, assegura ao segurado o direito à aposentadoria especial.",
    "Súmula 72/TNU — É possível o reconhecimento de uniões estáveis simultâneas para fins previdenciários, quando comprovada a boa-fé do companheiro.",
    "Súmula 77/TNU — O julgado que condena o INSS a averbar tempo de atividade rural não depende de nova ação para determinar a concessão de benefício previdenciário que, posteriormente, passe a ser pleiteado.",
  ],

  // ══════════════════════════════════════════════════════
  // BENEFÍCIOS — JURISPRUDÊNCIA ESPECÍFICA
  // ══════════════════════════════════════════════════════
  por_beneficio: {
    aposentadoria_idade: [
      "Requisitos: 65 anos (H) / 62 anos (M) — EC 103/2019; carência de 180 meses.",
      "Regras de transição: pedágio de 50% sobre o tempo faltante em 13/11/2019 ou 17+12 anos de contribuição.",
      "Trabalhador rural: 60 anos (H) / 55 anos (M); carência substituída por efetivo exercício rural.",
      "TNU Súmula 16: início de prova material contemporâneo para trabalhador rural.",
      "STJ Tema 732: atividade rural anterior a 1991 conta para carência.",
    ],
    aposentadoria_invalidez: [
      "Requisitos: incapacidade total, permanente e insusceptível de reabilitação; carência de 12 meses (salvo acidente).",
      "Valor: 100% do salário-de-benefício + acréscimo de 25% se necessitar de assistência permanente (art. 45, Lei 8.213/91).",
      "TNU Súmula 54: não é exigível que a incapacidade seja insusceptível de reabilitação para concessão.",
      "TNU Súmula 47: incapacidade parcial exige análise das condições pessoais.",
      "DIB: data do requerimento administrativo (STJ Tema 905).",
    ],
    auxilio_doenca: [
      "Requisitos: incapacidade temporária superior a 15 dias; carência de 12 meses (salvo acidente/doença grave).",
      "Alta programada: cancelamento antes do prazo exige perícia, e pode ser contestado judicialmente.",
      "NTEP — Nexo Técnico Epidemiológico: presunção de nexo acidente-trabalho em doenças previstas na lista da Previdência.",
      "TNU Súmula 33: DIB na data do requerimento quando indeferido sem exame médico.",
      "TNU Súmula 8: auxílio-doença no período de graça independe de contribuição recente.",
    ],
    auxilio_acidente: [
      "Requisito: sequela definitiva após consolidação de lesão por acidente, com redução da capacidade laboral.",
      "Valor: 50% do salário-de-benefício.",
      "Cumulação: pode ser acumulado com salário ou outros benefícios, exceto aposentadoria.",
    ],
    bpc_loas: [
      "Requisitos: pessoa com deficiência (qualquer idade) ou idoso (65 anos); renda familiar per capita < 1/4 SM.",
      "LOAS art. 20, §11: para fins de concessão do BPC, o benefício já concedido a outro membro da família não é computado na renda.",
      "TNU Súmula 29: incapacidade para a vida independente inclui impossibilidade de prover sustento.",
      "TNU Súmula 42: incapacidade presumida para idoso com 65 anos ou mais.",
      "STJ Tema 48: hipossuficiência relativa admite concessão mediante análise de todas as circunstâncias.",
    ],
    pensao_por_morte: [
      "Requisitos: dependência econômica comprovada; qualidade de segurado do falecido.",
      "Duração: varia por idade do cônjuge (EC 103/2019): 3 anos a vitalício.",
      "Concubinato: STJ admite divisão da pensão entre esposa e companheira em casos de boa-fé.",
      "TNU Súmula 72: uniões estáveis simultâneas admitidas quando comprovada boa-fé.",
    ],
    atividade_especial: [
      "Aposentadoria especial: 15, 20 ou 25 anos conforme o grau de exposição.",
      "TNU Súmula 9: uso de EPI não descaracteriza tempo especial por exposição a ruído.",
      "TNU Súmula 32: ruído: qualquer nível, qualquer período.",
      "TNU Súmula 64: agrotóxico + tratorista por 25 anos = aposentadoria especial.",
      "STJ Tema 1038: conversão de tempo especial em comum independe de requerimento expresso.",
    ],
    salario_maternidade: [
      "Segurada empregada: pago pela empresa; segurada avulsa: pago diretamente pelo INSS.",
      "Segurada especial, contribuinte individual e facultativa: carência de 10 meses.",
      "Adoção: salário-maternidade pelo período legalmente fixado conforme a idade da criança.",
    ],
  },

  // ══════════════════════════════════════════════════════
  // MAPEAMENTO REGIONAL — TRFs 1 AO 5
  // ══════════════════════════════════════════════════════
  trfs: {
    trf1: {
      abrangencia: "AC, AM, AP, BA, DF, GO, MA, MT, MG, PA, PI, RO, RR, TO",
      sede: "Brasília/DF",
      orientacoes_relevantes: [
        "TRF1 — Trabalhador rural na Amazônia: admite prova documental indireta de atividade extrativista como início de prova material.",
        "TRF1 — Garimpeiro e pescador artesanal: reconhecidos como segurado especial para fins previdenciários.",
        "TRF1 — Cumulação de auxílio-doença com renda do trabalho: vedada, mas exceções quando há incapacidade parcial e atividade compatível.",
        "TRF1 — Tempo de serviço rural sem CTPS: comprovado por documentos rurais (notas fiscais, declarações de sindicato) + testemunhas.",
        "TRF1 — BPC/LOAS: admite análise da situação de vulnerabilidade social ampla, não limitada à renda per capita.",
      ],
    },
    trf2: {
      abrangencia: "ES, RJ",
      sede: "Rio de Janeiro/RJ",
      orientacoes_relevantes: [
        "TRF2 — Pescador artesanal: atividade comprovada por registro de pesca, declaração de colônia e prova testemunhal.",
        "TRF2 — Aposentadoria especial: exposição a agentes químicos (benzeno, asbesto) reconhecida mesmo com EPI.",
        "TRF2 — Incapacidade laborativa: análise das condições pessoais do segurado é obrigatória quando há incapacidade parcial.",
        "TRF2 — Pensão por morte: companheiro homossexual tem direito à pensão, independentemente de registro formal.",
        "TRF2 — Auxílio-acidente: cumulação com aposentadoria por invalidez: inadmissível.",
      ],
    },
    trf3: {
      abrangencia: "MS, SP",
      sede: "São Paulo/SP",
      orientacoes_relevantes: [
        "TRF3 — Motorista de caminhão: atividade especial reconhecida por vibração mecânica e condições de trabalho inadequadas.",
        "TRF3 — Aposentadoria por invalidez por doenças psiquiátricas: admite laudo psicológico para comprovação.",
        "TRF3 — Salário-maternidade para desempregada: concedido dentro do período de graça.",
        "TRF3 — BPC/LOAS: decisão proferida em ação coletiva pode beneficiar outros segurados em situação idêntica.",
        "TRF3 — Faxineira e diarista: reconhecidas como seguradas urbanas mesmo sem registro quando comprovado vínculo.",
      ],
    },
    trf4: {
      abrangencia: "PR, RS, SC",
      sede: "Porto Alegre/RS",
      orientacoes_relevantes: [
        "TRF4 — Trabalhador rural no Sul: boletim de safra e declarações do ITR são aceitos como início de prova material.",
        "TRF4 — Atividade especial: motorista de ônibus coletivo reconhecido como atividade especial por vibração.",
        "TRF4 — Aposentadoria rural: cônjuge de produtor rural pode comprovar atividade em regime de economia familiar.",
        "TRF4 — Alta programada indevida: há presunção relativa de manutenção da incapacidade enquanto não realizada nova perícia.",
        "TRF4 — Concessão de benefícios em tutela antecipada: amplamente admitida em casos de incapacidade grave e urgência.",
      ],
    },
    trf5: {
      abrangencia: "AL, CE, PB, PE, RN, SE",
      sede: "Recife/PE",
      orientacoes_relevantes: [
        "TRF5 — Trabalhador rural no Nordeste: certidão de nascimento dos filhos com profissão de agricultor é forte início de prova material.",
        "TRF5 — Segurado especial: atividade de subsistência (agricultura familiar, pesca artesanal) amplamente reconhecida.",
        "TRF5 — BPC/LOAS: situação de miserabilidade pode ser comprovada por estudo social ou relatório assistencial.",
        "TRF5 — Aposentadoria por invalidez: doenças crônicas com remissão parcial ainda podem ensejar a incapacidade total.",
        "TRF5 — Nexo causal: o histórico laboral do segurado deve ser considerado integralmente na perícia.",
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // PRAZOS E PROCEDIMENTOS
  // ══════════════════════════════════════════════════════
  prazos_procedimentos: [
    "Decadência para revisão de benefício: 10 anos a partir da primeira prestação (STJ Tema 501).",
    "Prescrição para cobrança de diferenças: 5 anos (STJ Tema 554).",
    "Recurso ao CRPS (Conselho de Recursos da Previdência Social): 30 dias da ciência da decisão.",
    "Mandado de segurança contra ato do INSS: 120 dias da ciência do ato coator.",
    "Ação ordinária previdenciária: prescrição quinquenal das parcelas anteriores ao ajuizamento.",
    "Tutela antecipada em ações previdenciárias: amplamente admitida pelo TRF4 e STJ quando verificada urgência.",
    "Prazo do INSS para cumprir tutela antecipada: geralmente fixado em 30 a 45 dias pelos Juízos Federais.",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNÇÃO UTILITÁRIA — GERAR CONTEXTO PARA PROMPT DA IA
// ─────────────────────────────────────────────────────────────────────────────

function gerarContextoCivel(subarea) {
  const dados = BASE_CIVEL[subarea];
  if (!dados) return '';
  const linhas = [];
  if (dados.legislacao) linhas.push('LEGISLAÇÃO:\n' + dados.legislacao.join('\n'));
  if (dados.sumulas_stj) linhas.push('SÚMULAS STJ:\n' + dados.sumulas_stj.join('\n'));
  if (dados.sumulas_stf) linhas.push('SÚMULAS STF:\n' + dados.sumulas_stf.join('\n'));
  if (dados.teses_repetitivas_stj) linhas.push('TEMAS REPETITIVOS STJ:\n' + dados.teses_repetitivas_stj.join('\n'));
  if (dados.enunciados_estaduais) linhas.push('ENUNCIADOS ESTADUAIS:\n' + dados.enunciados_estaduais.join('\n'));
  if (dados.enunciados_jornadas) linhas.push('ENUNCIADOS CJF:\n' + dados.enunciados_jornadas.join('\n'));
  return linhas.join('\n\n');
}

function gerarContextoPrevidenciario(estado) {
  const trf = identificarTRF(estado);
  const contextoTRF = BASE_PREVIDENCIARIA.trfs[trf];
  const linhas = [];
  linhas.push('LEGISLAÇÃO BASE:\n' + BASE_PREVIDENCIARIA.legislacao.join('\n'));
  linhas.push('SÚMULAS STJ:\n' + BASE_PREVIDENCIARIA.sumulas_stj.join('\n'));
  linhas.push('SÚMULAS STF:\n' + BASE_PREVIDENCIARIA.sumulas_stf.join('\n'));
  linhas.push('TEMAS REPETITIVOS STJ:\n' + BASE_PREVIDENCIARIA.temas_repetitivos_stj.join('\n'));
  linhas.push('SÚMULAS E TESES TNU:\n' + BASE_PREVIDENCIARIA.tnu.join('\n'));
  if (contextoTRF) {
    linhas.push(`ORIENTAÇÕES DO ${trf.toUpperCase()} (${contextoTRF.abrangencia}):\n` + contextoTRF.orientacoes_relevantes.join('\n'));
  }
  return linhas.join('\n\n');
}

function identificarTRF(estado) {
  const mapa = {
    'AC': 'trf1','AM': 'trf1','AP': 'trf1','BA': 'trf1','DF': 'trf1',
    'GO': 'trf1','MA': 'trf1','MT': 'trf1','MG': 'trf1','PA': 'trf1',
    'PI': 'trf1','RO': 'trf1','RR': 'trf1','TO': 'trf1',
    'ES': 'trf2','RJ': 'trf2',
    'MS': 'trf3','SP': 'trf3',
    'PR': 'trf4','RS': 'trf4','SC': 'trf4',
    'AL': 'trf5','CE': 'trf5','PB': 'trf5','PE': 'trf5','RN': 'trf5','SE': 'trf5',
  };
  return mapa[estado?.toUpperCase()] || 'trf1';
}


// ─── TEMA ─────────────────────────────────────────────────────────────────────
const T = {
  bg:'#f5f5fa',surface:'#ffffff',card:'#ffffff',border:'#e2e2ee',
  gold:'#a07828',goldDim:'#c9a84c15',goldBorder:'#c9a84c40',
  text:'#1a1a2e',textMuted:'#5a5a7a',textDim:'#9898b8',
  green:'#16a34a',greenBg:'#f0fdf4',yellow:'#ca8a04',yellowBg:'#fefce8',
  red:'#dc2626',redBg:'#fef2f2',purple:'#7c3aed',purpleBg:'#f5f3ff',
  blue:'#0284c7',blueBg:'#f0f9ff',
};

// ─── API ──────────────────────────────────────────────────────────────────────
async function callClaude(prompt, userContent, maxTokens=1500, fileData=null) {
  const contentArr=[];
  if(fileData) contentArr.push(fileData);
  contentArr.push({type:'text',text:`${prompt}\n\n---\n\n${userContent}`});
  const res=await fetch('/api/analisar',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:maxTokens,messages:[{role:'user',content:contentArr}]})});
  const raw=await res.text();
  if(!res.ok) throw new Error(`API ${res.status}: ${raw.slice(0,120)}`);
  let data; try{data=JSON.parse(raw);}catch(_){throw new Error('Resposta inválida da API');}
  const txt=(data.content||[]).map(i=>i.type==='text'?i.text:'').join('').trim();
  if(!txt) throw new Error('Resposta vazia');
  const clean=txt.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/i,'').trim();
  try{return JSON.parse(clean);}catch(_){}
  const m=txt.match(/\{[\s\S]*\}/);
  if(m){try{return JSON.parse(m[0]);}catch(_){}}
  throw new Error(`JSON inválido: ${txt.slice(0,80)}`);
}

// ─── COMPONENTES COMPARTILHADOS ───────────────────────────────────────────────
const inp={background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:'10px 12px',color:T.text,fontSize:13,outline:'none',width:'100%',boxSizing:'border-box',fontFamily:'sans-serif'};
const sel={...inp,cursor:'pointer'};

function Btn({children,onClick,disabled,variant='primary',style={}}){
  const base={border:'none',borderRadius:10,padding:'11px 18px',fontSize:13,fontWeight:700,cursor:disabled?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'opacity 0.2s',fontFamily:'sans-serif',...style};
  const v={
    primary:{background:disabled?'#1a1a28':`linear-gradient(135deg,${T.gold},#9a6818)`,color:disabled?T.textDim:'#0a0a14'},
    ghost:{background:'transparent',border:`1px solid ${T.border}`,color:T.textMuted},
    danger:{background:T.redBg,border:`1px solid ${T.red}25`,color:T.red},
  };
  return <button onClick={onClick} disabled={disabled} style={{...base,...v[variant]}}>{children}</button>;
}

function CopyBtn({text}){
  const [ok,setOk]=useState(false);
  return(<button onClick={()=>{navigator.clipboard.writeText(text);setOk(true);setTimeout(()=>setOk(false),2000);}}
    style={{background:ok?T.greenBg:'transparent',border:`1px solid ${ok?T.green:T.border}`,color:ok?T.green:T.textMuted,borderRadius:7,padding:'4px 12px',fontSize:11,cursor:'pointer',fontFamily:'monospace',transition:'all 0.2s'}}>
    {ok?'✓ COPIADO':'COPIAR'}</button>);
}

function Tag({children,color=T.gold,bg}){
  return <span style={{background:bg||`${color}12`,border:`1px solid ${color}28`,color,borderRadius:6,padding:'3px 9px',fontSize:11,fontFamily:'monospace',fontWeight:700}}>{children}</span>;
}

function Lbl({children}){
  return <div style={{fontSize:10,color:T.textDim,fontFamily:'monospace',letterSpacing:'0.1em',marginBottom:5,textTransform:'uppercase'}}>{children}</div>;
}

function Err({msg}){
  if(!msg) return null;
  return <div style={{color:T.red,fontSize:12,background:`${T.red}10`,border:`1px solid ${T.red}22`,borderRadius:8,padding:'10px 14px',marginBottom:12,lineHeight:1.6}}>⚠ {msg}</div>;
}

function Card({children,style={},accent}){
  return(
    <div style={{background:T.card,border:`1px solid ${accent?`${accent}35`:T.border}`,borderRadius:14,padding:20,marginBottom:12,position:'relative',overflow:'hidden',...style}}>
      {accent&&<div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${accent},transparent)`}}/>}
      {children}
    </div>
  );
}

function Title({children,sub}){
  return(
    <div style={{marginBottom:24}}>
      <h2 style={{fontFamily:'Georgia, serif',fontSize:22,fontWeight:700,margin:'0 0 5px',color:T.text}}>{children}</h2>
      {sub&&<p style={{color:T.textMuted,fontSize:13,margin:0,lineHeight:1.5}}>{sub}</p>}
    </div>
  );
}

function InfoBox({children,color=T.gold}){
  return <div style={{background:`${color}10`,border:`1px solid ${color}25`,borderRadius:10,padding:'10px 14px',marginBottom:14,color,fontSize:12,lineHeight:1.6}}>{children}</div>;
}

// ─── CONFIGURAÇÕES DE ÁREA ────────────────────────────────────────────────────
const AREAS=[
  {id:'trabalhista',icon:'⚒️',label:'Trabalhista',cor:T.gold},
  {id:'civel',icon:'⚖️',label:'Cível',cor:T.blue},
  {id:'previdenciario',icon:'🏥',label:'Previdenciário',cor:T.green},
];
const SUBAREAS_CIVEL=[
  {id:'consumidor',label:'Consumidor'},{id:'bancario',label:'Bancário'},
  {id:'familia',label:'Família'},{id:'responsabilidade_civil',label:'Resp. Civil'},
  {id:'contratos',label:'Contratos'},{id:'obrigacoes',label:'Obrigações'},
  {id:'dano_moral',label:'Dano Moral'},
];
const ESTADOS_BR=['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];
const TRF_LABEL={trf1:'TRF 1ª Região',trf2:'TRF 2ª Região',trf3:'TRF 3ª Região',trf4:'TRF 4ª Região',trf5:'TRF 5ª Região'};

// ─── PROMPTS JURÍDICOS ────────────────────────────────────────────────────────
const P_ANALISE=`Você é um advogado trabalhista sênior com 20 anos de experiência no Brasil. Analise o relato do lead com precisão técnica.

BASE JURÍDICA COMPLETA que você domina:
CLT: arts. 9, 29, 41, 58-62 (jornada), 74 (controle de ponto), 118, 129-143 (férias), 166-200 (segurança), 223-A a 223-G (dano existencial/reforma), 240, 394-A (gestante), 441-507 (rescisão), 482-483 (justa causa/rescisão indireta)
CF/88 art.7º: I (FGTS/despedida arbitrária), II (seguro-desemprego), IV (salário mínimo), VI (irredutibilidade), VIII (13º), IX (adicional noturno), XIII (jornada 8h/44h), XIV (turnos revezamento 6h), XV (repouso semanal), XVI (hora extra 50%), XVII (férias+1/3), XVIII (licença maternidade 120d), XIX (licença paternidade), XXII (saúde/segurança), XXIII (adicional insalubridade/periculosidade), XXIX (prescrição 5 anos/2 anos)
TST Súmulas: 6,17,21,29,51,55,85,114,132,138,149,159,172,199,204,212,219,228,244,246,260,277,291,296,303,331,338,339,358,362,363,366,369,372,374,376,377,378,381,386,388,391,392,396,437,443,450
OJ SDI-1: 24,57,103,195,215,232,273,295,361,363
Leis: 8.036/90 (FGTS 40%), 9.029/95 (discriminação), 11.788/08 (estágio), 12.506/11 (aviso proporcional), 13.467/17 (reforma), Lei 14.611/23 (igualdade salarial), LGPD 13.709/18

RESPONDA SOMENTE com o JSON (sem markdown):
{"nome":"nome ou Não informado","situacao":"empregado|demitido|rescisão indireta|autônomo|PJ|não informado","tempo_empresa":"X anos Y meses ou não informado","salario_estimado":"valor mensal estimado ou não informado","violacoes":["irregularidade"],"fundamentos":["Art. X CLT — descrição","Súmula X TST — descrição"],"provas_mencionadas":["prova citada"],"provas_sugeridas":["prova a levantar"],"nivel":"forte|moderado|fraco","justificativa":"frase técnica","prescricao_alerta":"alerta ou null","alerta_risco":"risco ou null"}`;

const P_ANALISE_CIVEL=(subarea)=>{
  const base=gerarContextoCivel(subarea);
  const labels={consumidor:'Direito do Consumidor',bancario:'Direito Bancário',familia:'Direito de Família',responsabilidade_civil:'Responsabilidade Civil',contratos:'Contratos',obrigacoes:'Obrigações',dano_moral:'Dano Moral'};
  return `Você é um advogado cível sênior especialista em ${labels[subarea]||'Direito Civil'} com 20 anos de experiência no Brasil. Analise o relato com precisão técnica.

BASE JURÍDICA — ${(labels[subarea]||'CÍVEL').toUpperCase()}:
${base}

RESPONDA SOMENTE com o JSON (sem markdown):
{"nome":"nome ou Não informado","situacao":"autor|réu|vítima|consumidor|não informado","area":"${labels[subarea]||'Cível'}","tempo_empresa":"tempo de relação ou não informado","salario_estimado":"valor estimado da causa ou não informado","violacoes":["direito violado"],"fundamentos":["Art. X CC/CDC — descrição","Súmula X STJ — descrição"],"provas_mencionadas":["prova citada"],"provas_sugeridas":["prova a levantar"],"nivel":"forte|moderado|fraco","justificativa":"frase técnica","prescricao_alerta":"alerta ou null","alerta_risco":"risco ou null"}`;
};

const P_ANALISE_PREV=(estado)=>{
  const base=gerarContextoPrevidenciario(estado);
  const trf=identificarTRF(estado);
  const trfLabel=TRF_LABEL[trf]||'TRF 1ª Região';
  return `Você é um advogado previdenciário sênior com 20 anos de experiência, especialista em benefícios do INSS. Estado: ${estado||'não informado'} → Jurisdição: ${trfLabel}

BASE JURÍDICA COMPLETA — PREVIDENCIÁRIO:
${base}

RESPONDA SOMENTE com o JSON (sem markdown):
{"nome":"nome ou Não informado","situacao":"segurado|dependente|aposentado|pensionista|não informado","beneficio_identificado":"benefício mais provável","trf_aplicavel":"${trfLabel}","tempo_empresa":"tempo de contribuição ou não informado","salario_estimado":"valor estimado do benefício ou não informado","violacoes":["direito negado"],"fundamentos":["Art. X Lei 8.213/91 — descrição","Súmula X TNU/STJ — descrição"],"provas_mencionadas":["prova citada"],"provas_sugeridas":["prova a levantar"],"nivel":"forte|moderado|fraco","justificativa":"frase técnica","prescricao_alerta":"alerta ou null","alerta_risco":"risco ou null"}`;
};

const P_FECHAR_AGORA_MSG=(analysis)=>{
  const nv=analysis.nivel||'moderado';
  const ab=nv==='forte'?'autoridade':nv==='fraco'?'empatia':'urgencia';
  const instrucoes={
    autoridade:'Demonstre domínio técnico imediato. Cite artigos e súmulas aplicáveis. Tom seguro, de referência no assunto.',
    urgencia:'Mencione o prazo prescricional aplicável. Cada dia sem agir é risco real. Tom firme e respeitoso.',
    empatia:'Valide o sofrimento primeiro. O advogado é parceiro, não vendedor. Tom acolhedor e humano.',
  };
  return `Você é um advogado gerando mensagem de WhatsApp para FECHAR CONTRATO agora.
CASO: ${analysis.violacoes?.slice(0,2).join(', ')||'violações identificadas'} | Nível: ${nv.toUpperCase()} | Área: ${analysis._area||'trabalhista'}
ABORDAGEM AUTOMÁTICA: ${ab} — ${instrucoes[ab]}
FUNDAMENTOS: ${analysis.fundamentos?.slice(0,2).join(' | ')||'fundamentos identificados'}
REGRAS: NUNCA prometer resultado ou êxito (EOAB art.34/39). Citar algo ESPECÍFICO do caso. Máx 5 linhas. Terminar com pergunta de fechamento direta.
RESPONDA SOMENTE com o JSON (sem markdown):
{"mensagem":"texto WhatsApp pronto para enviar","followup":"acompanhamento em 24h","por_que_fecha":"razão técnica"}`;
};

const P_FECHAR_AGORA_CONTRATO=(analysis)=>`Você é um advogado especialista em contratos de honorários. Gere um RASCUNHO de contrato profissional baseado no Estatuto da OAB (Lei 8.906/94) e EOAB.

DADOS DO CASO:
Área: ${analysis._area||'trabalhista'} | Situação: ${analysis.situacao||'não informada'} | Tempo: ${analysis.tempo_empresa||'não informado'}
Pretensões: ${analysis.violacoes?.join(', ')||'a definir'}
Fundamentos: ${analysis.fundamentos?.slice(0,3).join(' | ')||'a definir'}
Nível do caso: ${analysis.nivel||'moderado'}

O contrato deve conter: qualificação das partes (com campos [NOME], [CPF], [ENDEREÇO] para preenchimento), objeto, honorários (campo [PERCENTUAL/VALOR] a definir), obrigações das partes, prazo e prescrição, LGPD, foro, assinaturas.

RESPONDA SOMENTE com o JSON (sem markdown):
{"contrato":"texto integral com \\n para quebras de linha — campos variáveis entre [colchetes]","resumo":"3 pontos mais importantes do caso para o advogado revisar antes de assinar"}`;

const P_MENSAGEM_FORMATO=(abordagem,instrucao,formato)=>`Você é um advogado gerando comunicação para FECHAR CONTRATO.
ABORDAGEM: ${abordagem} — ${instrucao}
FORMATO: ${formato==='whatsapp'?'WhatsApp — máximo 5 linhas, direto':formato==='email'?'E-mail — com Assunto, saudação, corpo 3-4 parágrafos, despedida':formato==='ligacao'?'Roteiro de ligação — abertura, desenvolvimento e fechamento em tópicos':formato==='formal'?'Mensagem formal — tom institucional, LinkedIn':'Parecer Simplificado — linguagem 100% acessível para o cliente, sem juridiquês, máx 8 linhas, tom humano e didático'}
REGRAS: NUNCA prometer resultado (EOAB art.34/39). Citar algo ESPECÍFICO. Terminar com pergunta de fechamento. Referenciar fundamentos jurídicos.
RESPONDA SOMENTE com o JSON (sem markdown):
{"mensagem_principal":"texto aqui","followup_24h":"acompanhamento 24h","por_que_fecha":"razão técnica"}`;

const P_APRESENTACAO=(nomeAdv,escritorio,personalizada)=>`Você é especialista em comunicação jurídica. Gere mensagem de PRIMEIRO CONTATO para advogado responder cliente que enviou "Oi" ou mensagem inicial. OBJETIVO: iniciar o funil de forma acolhedora e gerar confiança.
${personalizada?`ADVOGADO: ${nomeAdv||'[Nome]'}\nESCRITÓRIO: ${escritorio||'[Escritório]'}`:'Use linguagem genérica.'}
REGRAS: NUNCA prometer resultado (EOAB). Tom acolhedor e profissional. Máx 6 linhas. Terminar com pergunta aberta.
RESPONDA SOMENTE com o JSON (sem markdown):
{"whatsapp":"mensagem WhatsApp (max 6 linhas)","email":"versão e-mail/LinkedIn formal","por_que_funciona":"razão psicológica"}`;

const P_NOVA_MSG=(ctx)=>`Você é um advogado expert em comunicação e fechamento. Lead analisado no funil enviou nova mensagem. Responda estrategicamente mantendo o relacionamento e avançando o fechamento. Sem prometer resultados (EOAB).
CONTEXTO DO CASO: ${ctx}
RESPONDA SOMENTE com o JSON (sem markdown):
{"resposta_whatsapp":"resposta WhatsApp máx 5 linhas com pergunta","resposta_email":"versão formal","analise_intencao":"o que o lead está realmente comunicando","proximo_passo":"ação concreta agora"}`;

const P_OBJECAO=`Você é expert em fechamento de contratos. Responda à objeção com empatia e argumentação jurídica. Sem prometer resultados (EOAB).
RESPONDA SOMENTE com o JSON (sem markdown):
{"validacao":"frase empática sem concordar com desistência","resposta_whatsapp":"WhatsApp máx 4 linhas com pergunta","resposta_presencial":"para ligação/presencial 2-3 frases","argumento_juridico":"fundamento técnico específico","erro_comum":"o que o advogado NÃO deve dizer"}`;

const P_CONTRATO=`Você é especialista em contratos de honorários. Gere contrato profissional e completo baseado no Estatuto da OAB (Lei 8.906/94), EOAB e LGPD.
Inclua obrigatoriamente: 1.Qualificação das partes com CPF/OAB 2.Objeto com fundamentos jurídicos 3.Honorários e sucumbência (art.791-A CLT c/c art.85 CPC) 4.Obrigações das partes 5.Prazo e prescrição 6.Despesas processuais 7.Rescisão 8.LGPD (Lei 13.709/18) 9.Foro 10.Assinaturas
RESPONDA SOMENTE com o JSON (sem markdown):
{"contrato":"texto integral com \\n para quebras de linha"}`;

const P_DOSSIE=`Você é estrategista jurídico-comercial de elite. Gere DOSSIÊ EXECUTIVO para o advogado usar na consulta. Tom de briefing de CEO.
RESPONDA SOMENTE com o JSON (sem markdown):
{"resumo_caso":"2-3 frases precisas","pontos_fortes":["ponto forte"],"pontos_frageis":["ponto frágil"],"estrategia_abertura":"frase exata para abrir a consulta","argumento_central":"argumento mais poderoso em linguagem simples","valor_estimado_causa":"estimativa realista","probabilidade_exito":"Alta|Média|Baixa","justificativa_exito":"razão técnica em 1 linha","script_fechamento":"frase para pedir a assinatura — natural e dentro do EOAB","nao_diga":"o que NÃO dizer nessa consulta"}`;

const P_VERBAS_IA=`Você é contador especialista em direito trabalhista. Identifique verbas adicionais não óbvias.
RESPONDA SOMENTE com o JSON (sem markdown):
{"verbas_extras":["verba e fundamento"],"alertas":["alerta técnico"],"observacao":"nota sobre a estimativa"}`;

const P_CONTEUDO=`Você é especialista em comunicação jurídica. Crie conteúdo educativo dentro do EOAB (art.39 — sem mercantilização).
RESPONDA SOMENTE com o JSON (sem markdown):
{"titulo":"título chamativo","corpo":"texto completo com quebras de linha","hashtags":"5 hashtags","cta":"chamada sutil dentro do EOAB","melhor_horario":"quando postar"}`;

const P_ANUNCIO=`Você é especialista em tráfego pago para serviços jurídicos. Crie textos dentro do EOAB (sem prometer resultados).
RESPONDA SOMENTE com o JSON (sem markdown):
{"titulo_principal":"máx 30 chars","descricao":"máx 90 chars","texto_feed":"2-3 linhas informativas","headline":"máx 40 chars","palavras_chave":["kw1","kw2","kw3","kw4","kw5"],"segmentacao":"público e segmentação","orcamento_sugerido":"investimento mínimo"}`;

const P_INDICACAO=`Você é advogado criando mensagem para reativar ex-cliente e pedir indicação dentro do EOAB.
RESPONDA SOMENTE com o JSON (sem markdown):
{"mensagem_whatsapp":"mensagem natural WhatsApp","mensagem_email":"versão e-mail/LinkedIn formal","por_que_funciona":"razão psicológica"}`;

// ─── ABORDAGENS E FORMATOS ────────────────────────────────────────────────────
const ABORDAGENS=[
  {id:'urgencia',icon:'⚡',label:'Urgência',cor:T.red,desc:'Lead procrastinando — prescrição em risco'},
  {id:'empatia',icon:'🤝',label:'Empatia',cor:T.purple,desc:'Lead abalado, inseguro, com medo'},
  {id:'autoridade',icon:'⚖️',label:'Autoridade',cor:T.gold,desc:'Lead quer sentir que fala com expert'},
  {id:'racional',icon:'📊',label:'Racional',cor:T.blue,desc:'Lead quer entender antes de decidir'},
  {id:'exclusivo',icon:'🎯',label:'Exclusividade',cor:T.green,desc:'Lead precisa do empurrão final'},
];
const INSTRUCOES={
  urgencia:'Mencione DIRETAMENTE o prazo prescricional aplicável ao caso. Cada dia sem agir é risco real. Tom firme e respeitoso.',
  empatia:'Valide o sofrimento primeiro. O advogado é parceiro, não vendedor. Tom acolhedor e humano.',
  autoridade:'Demonstre domínio técnico imediato. Cite artigos e súmulas aplicáveis. Tom seguro, de referência.',
  racional:'Apresente os direitos de forma objetiva. O que ele tem a ganhar e o risco de não agir. Tom educativo.',
  exclusivo:'Crie senso de oportunidade — atenção personalizada, análise completa, janela aberta agora.',
};
const FORMATOS=[
  {id:'whatsapp',icon:'💬',label:'WhatsApp',desc:'Curto e direto, máx 5 linhas'},
  {id:'email',icon:'📧',label:'E-mail',desc:'Formal, completo, com saudação'},
  {id:'ligacao',icon:'📞',label:'Roteiro de Ligação',desc:'Script para falar ao telefone'},
  {id:'formal',icon:'📋',label:'Mensagem Formal',desc:'Para LinkedIn ou escritório'},
  {id:'parecer',icon:'📝',label:'Parecer Simplificado',desc:'Caso explicado em linguagem simples'},
];
const NC={forte:T.green,moderado:T.yellow,fraco:T.red};
const NB={forte:T.greenBg,moderado:T.yellowBg,fraco:T.redBg};

// ─── BLOCO APRESENTAÇÃO ───────────────────────────────────────────────────────
function BlocoApresentacao(){
  const [aberto,setAberto]=useState(false);
  const [modo,setModo]=useState('generica');
  const [nomeAdv,setNomeAdv]=useState('');
  const [escritorio,setEscritorio]=useState('');
  const [resultado,setResultado]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState('');
  const gerar=async()=>{
    setLoading(true);setErr('');
    try{const r=await callClaude(P_APRESENTACAO(nomeAdv,escritorio,modo==='personalizada'),'Gere a mensagem de primeiro contato.',800);setResultado(r);}
    catch(e){setErr(e.message);}finally{setLoading(false);}
  };
  return(
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,marginBottom:14,overflow:'hidden'}}>
      <button onClick={()=>setAberto(!aberto)} style={{width:'100%',background:'transparent',border:'none',padding:'14px 18px',display:'flex',alignItems:'center',gap:12,cursor:'pointer',textAlign:'left'}}>
        <span style={{fontSize:20}}>👋</span>
        <div style={{flex:1}}>
          <div style={{color:T.text,fontSize:14,fontWeight:700}}>Mensagem de Apresentação</div>
          <div style={{color:T.textMuted,fontSize:11,marginTop:2}}>Cliente mandou "Oi"? Gere aqui o primeiro contato do funil</div>
        </div>
        <span style={{color:T.textMuted,fontSize:18,transform:aberto?'rotate(90deg)':'none',transition:'transform 0.2s'}}>›</span>
      </button>
      {aberto&&(
        <div style={{padding:'0 18px 18px',borderTop:`1px solid ${T.border}`}}>
          {!resultado?(
            <>
              <div style={{paddingTop:14,marginBottom:14}}>
                <Lbl>Tipo de mensagem</Lbl>
                <div style={{display:'flex',gap:8}}>
                  {[['generica','🌐 Genérica','Pronto para usar'],['personalizada','✏️ Personalizada','Com seu nome e escritório']].map(([v,l,d])=>(
                    <button key={v} onClick={()=>setModo(v)} style={{flex:1,background:modo===v?T.goldDim:'transparent',border:`1px solid ${modo===v?T.gold:T.border}`,borderRadius:9,padding:'10px 12px',cursor:'pointer',textAlign:'left'}}>
                      <div style={{color:modo===v?T.gold:T.text,fontSize:12,fontWeight:700}}>{l}</div>
                      <div style={{color:T.textMuted,fontSize:10,marginTop:2}}>{d}</div>
                    </button>
                  ))}
                </div>
              </div>
              {modo==='personalizada'&&(
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
                  <div><Lbl>Seu nome</Lbl><input value={nomeAdv} onChange={e=>setNomeAdv(e.target.value)} placeholder="Dr(a). Seu Nome" style={inp}/></div>
                  <div><Lbl>Escritório</Lbl><input value={escritorio} onChange={e=>setEscritorio(e.target.value)} placeholder="Nome do Escritório" style={inp}/></div>
                </div>
              )}
              <Err msg={err}/>
              <Btn onClick={gerar} disabled={loading} style={{width:'100%',padding:12}}>{loading?'⏳ Gerando...':'→ Gerar Mensagem de Apresentação'}</Btn>
            </>
          ):(
            <div style={{paddingTop:14}}>
              {[['💬 WHATSAPP','whatsapp',T.green],['📧 E-MAIL / LINKEDIN','email',T.blue]].map(([lbl,key,cor])=>(
                <Card key={key} accent={cor} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                    <Tag color={cor}>{lbl}</Tag><CopyBtn text={resultado[key]}/>
                  </div>
                  <p style={{color:T.text,fontSize:13,lineHeight:1.8,margin:0,fontFamily:'Georgia, serif',whiteSpace:'pre-wrap'}}>{resultado[key]}</p>
                </Card>
              ))}
              <div style={{background:T.greenBg,borderRadius:9,padding:'10px 14px',marginBottom:10}}>
                <div style={{fontSize:10,color:T.green,fontFamily:'monospace',letterSpacing:'0.1em',marginBottom:4}}>◆ POR QUE FUNCIONA</div>
                <p style={{color:T.green,fontSize:12,margin:0,lineHeight:1.6,fontStyle:'italic'}}>{resultado.por_que_funciona}</p>
              </div>
              <Btn variant="ghost" onClick={()=>setResultado(null)} style={{width:'100%',fontSize:11}}>↺ Gerar novamente</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TOOL LEAD ────────────────────────────────────────────────────────────────
function ToolLead({onSaveCRM}){
  const [step,setStep]=useState(1);
  const [txt,setTxt]=useState('');
  const [analysis,setAnalysis]=useState(null);
  const [msgs,setMsgs]=useState(null);
  const [ab,setAb]=useState('urgencia');
  const [fmt,setFmt]=useState('whatsapp');
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState('');
  const [arquivo,setArquivo]=useState(null);
  const [nomeArquivo,setNomeArquivo]=useState('');
  const [savedCRM,setSavedCRM]=useState(false);
  const [histAuto,setHistAuto]=useState([]);
  const [dossie,setDossie]=useState(null);
  const [loadingDossie,setLoadingDossie]=useState(false);
  const [novaMsg,setNovaMsg]=useState('');
  const [novaResp,setNovaResp]=useState(null);
  const [loadingNova,setLoadingNova]=useState(false);
  const [showNovaMsg,setShowNovaMsg]=useState(false);
  // área
  const [area,setArea]=useState('trabalhista');
  const [subareaCivel,setSubareaCivel]=useState('consumidor');
  const [estadoPrev,setEstadoPrev]=useState('PR');
  // fechar agora
  const [fecharAgora,setFecharAgora]=useState(null);
  const [loadingFechar,setLoadingFechar]=useState(false);

  const novaEntrada=(icone,txt)=>({icone,txt,auto:true,data:new Date().toLocaleDateString('pt-BR'),hora:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})});

  const handleArquivo=async(e)=>{
    const file=e.target.files[0]; if(!file) return; setErr('');
    if(file.name.endsWith('.zip')||file.type==='application/zip'||file.type==='application/x-zip-compressed'){
      try{
        const JSZipMod=await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
        const JSZip=JSZipMod.default||JSZipMod;
        const zip=await JSZip.loadAsync(file);
        let textoConversa=''; const audios=[];
        for(const [nome,entry] of Object.entries(zip.files)){
          if(!entry.dir){if(nome.endsWith('.txt')) textoConversa=await entry.async('string');
          else if(nome.match(/\.(mp4|m4a|opus|ogg|aac|mp3)$/i)) audios.push(nome);}
        }
        if(textoConversa){setTxt(textoConversa.slice(0,8000));setNomeArquivo(file.name+' ✓ conversa extraída');setArquivo(null);if(audios.length>0) setErr('✓ Conversa extraída! '+audios.length+' áudio(s) no ZIP.');}
        else{setErr('Nenhum texto encontrado no ZIP.');}
      }catch(_){setErr('Erro ao abrir o ZIP. Extraia manualmente e cole o texto.');}
      return;
    }
    if(file.type==='text/plain'||file.name.endsWith('.txt')){const reader=new FileReader();reader.onload=()=>{setTxt(reader.result.slice(0,8000));setNomeArquivo(file.name);setArquivo(null);};reader.readAsText(file,'UTF-8');return;}
    if(file.type.startsWith('audio/')||file.name.match(/\.(mp4|m4a|opus|ogg|aac|mp3)$/i)){setNomeArquivo(file.name+' (áudio — cole a transcrição abaixo)');setArquivo(null);setErr('Áudio recebido! Cole a transcrição manualmente.');return;}
    const reader=new FileReader();
    reader.onload=()=>{
      const base64=reader.result.split(',')[1];
      if(file.type==='application/pdf'){setArquivo({type:'document',source:{type:'base64',media_type:'application/pdf',data:base64}});}
      else if(file.type.startsWith('image/')){setArquivo({type:'image',source:{type:'base64',media_type:file.type,data:base64}});}
      else{setErr('Formato não suportado.');return;}
      setNomeArquivo(file.name);
    };
    reader.readAsDataURL(file);
  };

  const resolverPrompt=()=>{
    if(area==='civel') return P_ANALISE_CIVEL(subareaCivel);
    if(area==='previdenciario') return P_ANALISE_PREV(estadoPrev);
    return P_ANALISE;
  };

  const analisar=async()=>{
    if(txt.trim().length<5&&!arquivo){setErr('Descreva o caso ou anexe um arquivo.');return;}
    setErr('');setLoading(true);
    try{
      const r=await callClaude(resolverPrompt(),txt||'Analise o documento anexado.',1500,arquivo);
      setAnalysis({...r,_area:area,_subarea:subareaCivel,_estado:estadoPrev});
      setHistAuto(prev=>[...prev,{icone:'⚡',txt:`Análise gerada — nível ${(r.nivel||'').toUpperCase()} — ${(r.violacoes||[]).slice(0,2).join(', ')}`,auto:true,data:new Date().toLocaleDateString('pt-BR'),hora:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}]);
      setStep(2);
    }catch(e){setErr(e.message);}finally{setLoading(false);}
  };

  const gerarMsgs=async(abId,fmtId)=>{
    const id=abId||ab; const fid=fmtId||fmt;
    setAb(id);setFmt(fid);setLoading(true);setErr('');
    try{
      const ctx=`Nome: ${analysis.nome}\nÁrea: ${analysis._area||analysis.area}\nSituação: ${analysis.situacao}\nBenefício: ${analysis.beneficio_identificado||'N/A'}\nTempo: ${analysis.tempo_empresa}\nViolações: ${(analysis.violacoes||[]).join('; ')}\nFundamentos: ${(analysis.fundamentos||[]).slice(0,3).join('; ')}`;
      const r=await callClaude(P_MENSAGEM_FORMATO(ABORDAGENS.find(a=>a.id===id)?.label,INSTRUCOES[id],fid),ctx);
      setMsgs({...r,abId:id,fmtId:fid});
      setHistAuto(prev=>[...prev,{icone:'📨',txt:`Mensagem gerada — tom ${ABORDAGENS.find(a=>a.id===id)?.label} · ${FORMATOS.find(f=>f.id===fid)?.label}`,auto:true,data:new Date().toLocaleDateString('pt-BR'),hora:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}]);
      setStep(3);
    }catch(e){setErr(e.message);}finally{setLoading(false);}
  };

  const executarFecharAgora=async()=>{
    if(!analysis) return;
    setLoadingFechar(true);setErr('');
    try{
      const [msgResult,contratoResult]=await Promise.all([
        callClaude(P_FECHAR_AGORA_MSG(analysis),`Caso: ${(analysis.violacoes||[]).join(', ')}`,800),
        callClaude(P_FECHAR_AGORA_CONTRATO(analysis),`Área: ${analysis._area} | Situação: ${analysis.situacao} | Pretensões: ${(analysis.violacoes||[]).join(', ')}`,2000),
      ]);
      setFecharAgora({msg:msgResult,contrato:contratoResult});
      setHistAuto(prev=>[...prev,{icone:'⚡',txt:'Fechar Agora executado — mensagem + contrato gerados',auto:true,data:new Date().toLocaleDateString('pt-BR'),hora:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}]);
      setStep(4);
    }catch(e){setErr(e.message);}finally{setLoadingFechar(false);}
  };

  const salvarCRM=()=>{
    if(!analysis||savedCRM) return;
    const novo={id:Date.now(),nome:analysis.nome!=='Não informado'?analysis.nome:'Lead sem nome',contato:'',caso:(analysis.violacoes||[]).slice(0,2).join(', '),stage:'novo',vinculo:analysis.situacao,tempo:analysis.tempo_empresa,salario:analysis.salario_estimado,violacoes:(analysis.violacoes||[]).join('; '),docs:[],hist:[...histAuto,{icone:'📥',txt:'Lead cadastrado no CRM',auto:true,data:new Date().toLocaleDateString('pt-BR'),hora:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}],createdAt:new Date().toLocaleDateString('pt-BR')};
    try{const existing=JSON.parse(localStorage.getItem('lf_leads')||'[]');localStorage.setItem('lf_leads',JSON.stringify([novo,...existing]));setSavedCRM(true);if(onSaveCRM) onSaveCRM();}catch(e){}
  };

  // ── STEP 1 ──────────────────────────────────────────────────────────────────
  if(step===1) return(
    <div>
      <Title sub="Cole o relato ou anexe um arquivo — PDF, print, foto do documento.">⚡ Analisar Lead</Title>
      <BlocoApresentacao/>

      {/* SELETOR DE ÁREA */}
      <div style={{marginBottom:16}}>
        <Lbl>Área de atuação</Lbl>
        <div style={{display:'flex',gap:8}}>
          {AREAS.map(a=>(
            <button key={a.id} onClick={()=>setArea(a.id)}
              style={{flex:1,background:area===a.id?`${a.cor}12`:T.card,border:`1px solid ${area===a.id?a.cor:T.border}`,borderRadius:10,padding:'10px 8px',cursor:'pointer',textAlign:'center',transition:'all 0.15s'}}>
              <div style={{fontSize:18,marginBottom:3}}>{a.icon}</div>
              <div style={{color:area===a.id?a.cor:T.text,fontSize:12,fontWeight:700}}>{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      {area==='civel'&&(
        <div style={{marginBottom:14}}>
          <Lbl>Subárea cível</Lbl>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {SUBAREAS_CIVEL.map(s=>(
              <button key={s.id} onClick={()=>setSubareaCivel(s.id)}
                style={{background:subareaCivel===s.id?`${T.blue}15`:T.card,border:`1px solid ${subareaCivel===s.id?T.blue:T.border}`,borderRadius:7,padding:'6px 12px',color:subareaCivel===s.id?T.blue:T.textMuted,fontSize:12,cursor:'pointer',transition:'all 0.12s'}}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {area==='previdenciario'&&(
        <div style={{marginBottom:14}}>
          <Lbl>Estado do cliente (define o TRF)</Lbl>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <select value={estadoPrev} onChange={e=>setEstadoPrev(e.target.value)} style={{...sel,maxWidth:120}}>
              {ESTADOS_BR.map(uf=><option key={uf} value={uf}>{uf}</option>)}
            </select>
            <div style={{background:T.greenBg,border:`1px solid ${T.green}25`,borderRadius:8,padding:'6px 12px',fontSize:12,color:T.green,fontFamily:'monospace'}}>
              {TRF_LABEL[identificarTRF(estadoPrev)]}
            </div>
          </div>
        </div>
      )}

      <textarea value={txt} onChange={e=>setTxt(e.target.value)} rows={7}
        placeholder={area==='trabalhista'?"Cole aqui o relato do lead trabalhista...\n\nEx: 'Fui demitido depois de 6 anos sem receber horas extras...'":area==='civel'?"Cole aqui o relato do lead cível...\n\nEx: 'O banco cobrou tarifa indevida e negativou meu nome...'":"Cole aqui o relato do lead previdenciário...\n\nEx: 'O INSS negou meu auxílio-doença mas o médico disse que não posso trabalhar...'"}
        style={{...inp,resize:'vertical',lineHeight:1.7,fontSize:14,padding:16}}
        onFocus={e=>e.target.style.borderColor=`${T.gold}55`}
        onBlur={e=>e.target.style.borderColor=T.border}/>
      <div style={{textAlign:'right',fontSize:11,color:T.textDim,fontFamily:'monospace',margin:'4px 0 12px'}}>{txt.length} caracteres</div>

      <label style={{display:'flex',alignItems:'center',gap:10,background:nomeArquivo?T.greenBg:T.surface,border:`1px solid ${nomeArquivo?T.green:T.border}`,borderRadius:10,padding:'12px 16px',cursor:'pointer',marginBottom:14,transition:'all 0.2s'}}>
        <input type="file" accept=".pdf,.zip,.txt,.mp4,.m4a,.opus,.ogg,.aac,.mp3,image/*" onChange={handleArquivo} style={{display:'none'}}/>
        <span style={{fontSize:18}}>{nomeArquivo?'✓':'📎'}</span>
        <div>
          <div style={{color:nomeArquivo?T.green:T.text,fontSize:13,fontWeight:600}}>{nomeArquivo||'Anexar arquivo — PDF, imagem ou ZIP do WhatsApp'}</div>
          <div style={{color:T.textMuted,fontSize:11,marginTop:2}}>{nomeArquivo?'Arquivo pronto para análise':'ZIP do WhatsApp, PDF, print, áudio (.mp4/.opus/.m4a)...'}</div>
        </div>
        {nomeArquivo&&<button onClick={e=>{e.preventDefault();setArquivo(null);setNomeArquivo('');}} style={{marginLeft:'auto',background:'transparent',border:'none',color:T.red,fontSize:16,cursor:'pointer'}}>✕</button>}
      </label>

      <Err msg={err}/>
      <Btn onClick={analisar} disabled={loading} style={{width:'100%',padding:15}}>
        {loading?`⏳ Analisando com base ${area==='trabalhista'?'trabalhista':area==='civel'?'cível':'previdenciária'} completa...`:`→ Analisar Lead ${AREAS.find(a=>a.id===area)?.icon} ${AREAS.find(a=>a.id===area)?.label}`}
      </Btn>
    </div>
  );

  // ── STEP 2 ──────────────────────────────────────────────────────────────────
  if(step===2&&analysis){
    const nv=analysis.nivel?.toLowerCase();
    const areaObj=AREAS.find(a=>a.id===analysis._area)||AREAS[0];
    return(
      <div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <button onClick={()=>setStep(1)} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:7,padding:'6px 12px',color:T.textMuted,fontSize:12,cursor:'pointer'}}>← Voltar</button>
          <Title sub="Análise jurídica completa com base na legislação, súmulas e jurisprudência aplicáveis.">Análise do Caso</Title>
        </div>

        {/* BADGE ÁREA */}
        <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
          <Tag color={areaObj.cor}>{areaObj.icon} {areaObj.label.toUpperCase()}</Tag>
          {analysis.beneficio_identificado&&<Tag color={T.green}>{analysis.beneficio_identificado}</Tag>}
          {analysis.trf_aplicavel&&<Tag color={T.blue}>{analysis.trf_aplicavel}</Tag>}
          {analysis.area&&analysis._area==='civel'&&<Tag color={T.blue}>{analysis.area}</Tag>}
        </div>

        {/* ⚡ FECHAR AGORA — destaque máximo */}
        <div style={{background:`linear-gradient(135deg,${T.gold}18,${T.gold}08)`,border:`2px solid ${T.goldBorder}`,borderRadius:14,padding:'18px 20px',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.gold},#7a5810)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>⚡</div>
            <div style={{flex:1}}>
              <div style={{color:T.gold,fontSize:15,fontWeight:700,fontFamily:'Georgia,serif'}}>Fechar Agora</div>
              <div style={{color:T.textMuted,fontSize:11,marginTop:1}}>Mensagem de fechamento + contrato rascunho gerados simultaneamente em 1 clique</div>
            </div>
          </div>
          <Err msg={err}/>
          <Btn onClick={executarFecharAgora} disabled={loadingFechar} style={{width:'100%',padding:14,fontSize:14}}>
            {loadingFechar?'⏳ Gerando mensagem + contrato...':'⚡ Fechar Agora — Mensagem + Contrato'}
          </Btn>
        </div>

        <Card>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
            {[['Lead',analysis.nome],['Situação',analysis.situacao],['Tempo/Contribuição',analysis.tempo_empresa],['Valor estimado',analysis.salario_estimado]].map(([k,v])=>(
              <div key={k}><Lbl>{k}</Lbl><div style={{color:T.text,fontSize:13}}>{v||'Não informado'}</div></div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:NB[nv]||T.surface,borderRadius:8,marginBottom:14}}>
            <Tag color={NC[nv]||T.textMuted} bg={NB[nv]}>{(analysis.nivel||'').toUpperCase()}</Tag>
            <span style={{color:NC[nv]||T.textMuted,fontSize:13,fontStyle:'italic'}}>{analysis.justificativa}</span>
          </div>
          <Lbl>Direitos/Violações Identificados</Lbl>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:14}}>
            {(analysis.violacoes||[]).map((v,i)=><Tag key={i} color={T.gold}>{v}</Tag>)}
          </div>
          <Lbl>Fundamentos Jurídicos</Lbl>
          <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:14}}>
            {(analysis.fundamentos||[]).map((f,i)=>(
              <div key={i} style={{background:T.surface,borderRadius:6,padding:'6px 10px',color:T.textMuted,fontSize:12,fontFamily:'monospace'}}>{f}</div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div>
              <Lbl>Provas Mencionadas</Lbl>
              {(analysis.provas_mencionadas||[]).map((p,i)=><div key={i} style={{color:T.green,fontSize:12,padding:'2px 0'}}>✓ {p}</div>)}
              {!(analysis.provas_mencionadas||[]).length&&<div style={{color:T.textDim,fontSize:12}}>Nenhuma citada</div>}
            </div>
            <div>
              <Lbl>Provas a Levantar</Lbl>
              {(analysis.provas_sugeridas||[]).map((p,i)=><div key={i} style={{color:T.yellow,fontSize:12,padding:'2px 0'}}>→ {p}</div>)}
            </div>
          </div>
        </Card>

        {analysis.prescricao_alerta&&analysis.prescricao_alerta!=='null'&&(
          <InfoBox color={T.red}>⏰ <strong>Prescrição/Decadência:</strong> {analysis.prescricao_alerta}</InfoBox>
        )}
        {analysis.alerta_risco&&analysis.alerta_risco!=='null'&&(
          <InfoBox color={T.yellow}>⚠ <strong>Risco:</strong> {analysis.alerta_risco}</InfoBox>
        )}

        <Card style={{background:T.surface}}>
          <Lbl>🎯 Ou escolha a abordagem manualmente</Lbl>
          <p style={{color:T.textMuted,fontSize:12,margin:'0 0 12px',lineHeight:1.5}}>Para mensagem personalizada com tom específico e formato escolhido.</p>
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {ABORDAGENS.map(a=>(
              <button key={a.id} onClick={()=>setAb(a.id)}
                style={{background:ab===a.id?`${a.cor}12`:T.card,border:`1px solid ${ab===a.id?a.cor:T.border}`,borderRadius:9,padding:'11px 14px',cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:12,transition:'all 0.15s'}}>
                <span style={{fontSize:18}}>{a.icon}</span>
                <div style={{flex:1}}>
                  <span style={{color:ab===a.id?a.cor:T.text,fontSize:13,fontWeight:700}}>{a.label}</span>
                  <span style={{color:T.textMuted,fontSize:11,marginLeft:8}}>{a.desc}</span>
                </div>
                {ab===a.id&&<span style={{color:a.cor}}>✓</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card style={{background:T.surface}}>
          <Lbl>📄 Formato da mensagem</Lbl>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {FORMATOS.map(f=>(
              <button key={f.id} onClick={()=>setFmt(f.id)}
                style={{background:fmt===f.id?`${T.gold}12`:T.card,border:`1px solid ${fmt===f.id?T.gold:T.border}`,borderRadius:9,padding:'10px 12px',cursor:'pointer',textAlign:'left',transition:'all 0.15s',gridColumn:f.id==='parecer'?'1/-1':'auto'}}>
                <div style={{fontSize:16,marginBottom:3}}>{f.icon}</div>
                <div style={{color:fmt===f.id?T.gold:T.text,fontSize:12,fontWeight:700}}>{f.label}</div>
                <div style={{color:T.textMuted,fontSize:10,marginTop:2}}>{f.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        <button onClick={salvarCRM} disabled={savedCRM}
          style={{width:'100%',background:savedCRM?T.greenBg:T.surface,border:`1px solid ${savedCRM?T.green:T.border}`,borderRadius:10,padding:'10px 16px',cursor:savedCRM?'default':'pointer',display:'flex',alignItems:'center',gap:10,marginBottom:10,transition:'all 0.2s'}}>
          <span style={{fontSize:16}}>{savedCRM?'✓':'📋'}</span>
          <div style={{textAlign:'left'}}>
            <div style={{color:savedCRM?T.green:T.text,fontSize:13,fontWeight:600}}>{savedCRM?'Salvo no CRM!':'Salvar lead no CRM automaticamente'}</div>
            <div style={{color:T.textMuted,fontSize:11}}>{savedCRM?'Lead adicionado com dados da análise':'Preenche nome, caso, violações e situação'}</div>
          </div>
        </button>

        <Err msg={err}/>
        <Btn onClick={()=>gerarMsgs(ab,fmt)} disabled={loading} style={{width:'100%',padding:14}}>
          {loading?'⏳ Gerando mensagem...':`→ Gerar ${FORMATOS.find(f=>f.id===fmt)?.icon} ${FORMATOS.find(f=>f.id===fmt)?.label} com tom ${ABORDAGENS.find(a=>a.id===ab)?.icon} ${ABORDAGENS.find(a=>a.id===ab)?.label}`}
        </Btn>

        {/* RESPONDER MENSAGEM DO CLIENTE */}
        <div style={{marginTop:10}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <div style={{flex:1,height:1,background:T.border}}/>
            <span style={{color:T.textDim,fontSize:10,fontFamily:'monospace',letterSpacing:'0.08em',whiteSpace:'nowrap'}}>OU SE O CLIENTE JÁ RESPONDEU</span>
            <div style={{flex:1,height:1,background:T.border}}/>
          </div>
          <button onClick={()=>{setShowNovaMsg(!showNovaMsg);setNovaResp(null);setNovaMsg('');}}
            style={{width:'100%',background:showNovaMsg?T.goldDim:T.surface,border:`1.5px dashed ${showNovaMsg?T.gold:T.border}`,borderRadius:12,padding:'13px 16px',display:'flex',alignItems:'center',gap:12,cursor:'pointer',textAlign:'left',transition:'all 0.2s'}}>
            <div style={{width:36,height:36,borderRadius:10,background:showNovaMsg?T.gold:`${T.gold}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>💬</div>
            <div style={{flex:1}}>
              <div style={{color:showNovaMsg?T.gold:T.text,fontSize:13,fontWeight:700}}>Responder mensagem do cliente</div>
              <div style={{color:T.textMuted,fontSize:11,marginTop:2}}>Cole aqui o que o cliente escreveu — a IA gera a resposta ideal</div>
            </div>
            <span style={{color:showNovaMsg?T.gold:T.textDim,fontSize:18,transform:showNovaMsg?'rotate(90deg)':'none',transition:'transform 0.2s'}}>›</span>
          </button>
          {showNovaMsg&&(
            <div style={{background:T.surface,border:`1px solid ${T.goldBorder}`,borderRadius:'0 0 12px 12px',borderTop:'none',padding:'16px 18px 18px'}}>
              {!novaResp?(
                <>
                  <Lbl>O que o cliente escreveu?</Lbl>
                  <textarea value={novaMsg} onChange={e=>setNovaMsg(e.target.value)} rows={4}
                    placeholder={'Cole aqui a mensagem do cliente...\n\nEx: "Mas será que vale a pena mesmo?"'}
                    style={{...inp,resize:'none',lineHeight:1.7,fontSize:13,marginBottom:12,borderColor:`${T.gold}40`}}/>
                  <Btn onClick={async()=>{
                    if(!novaMsg.trim()) return;
                    setLoadingNova(true);setErr('');
                    try{
                      const ctx=`Lead: ${analysis.nome} | Área: ${analysis._area} | Situação: ${analysis.situacao} | Nível: ${analysis.nivel}\nViolações: ${(analysis.violacoes||[]).join(', ')}\nFundamentos: ${(analysis.fundamentos||[]).slice(0,3).join('; ')}`;
                      const r=await callClaude(P_NOVA_MSG(ctx),`Mensagem do cliente: "${novaMsg}"`,1000);
                      setNovaResp(r);
                      setHistAuto(prev=>[...prev,novaEntrada('💬',`Mensagem respondida: "${novaMsg.slice(0,50)}..."`)]);
                    }catch(e){setErr(e.message);}finally{setLoadingNova(false);}
                  }} disabled={loadingNova||!novaMsg.trim()} style={{width:'100%',padding:12}}>
                    {loadingNova?'⏳ Gerando resposta ideal...':'→ Gerar Resposta para Esta Mensagem'}
                  </Btn>
                </>
              ):(
                <>
                  <div style={{background:`${T.border}50`,borderRadius:8,padding:'10px 14px',marginBottom:14,display:'flex',gap:8}}>
                    <span style={{fontSize:14}}>👤</span>
                    <div>
                      <div style={{fontSize:10,color:T.textDim,fontFamily:'monospace',marginBottom:3}}>CLIENTE DISSE</div>
                      <div style={{color:T.textMuted,fontSize:13,fontStyle:'italic',lineHeight:1.6}}>"{novaMsg}"</div>
                    </div>
                  </div>
                  <div style={{background:T.purpleBg,border:`1px solid ${T.purple}20`,borderRadius:9,padding:'10px 14px',marginBottom:12}}>
                    <div style={{fontSize:10,color:T.purple,fontFamily:'monospace',marginBottom:4}}>🧠 O QUE ELE ESTÁ REALMENTE DIZENDO</div>
                    <div style={{color:T.purple,fontSize:12,lineHeight:1.6}}>{novaResp.analise_intencao}</div>
                  </div>
                  {[['💬 WHATSAPP','resposta_whatsapp',T.green],['📧 E-MAIL','resposta_email',T.blue]].map(([lbl,key,cor])=>(
                    <div key={key} style={{background:T.card,border:`1px solid ${cor}30`,borderRadius:10,padding:'12px 14px',marginBottom:10}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                        <Tag color={cor}>{lbl}</Tag><CopyBtn text={novaResp[key]}/>
                      </div>
                      <p style={{color:T.text,fontSize:13,lineHeight:1.8,margin:0,fontFamily:'Georgia, serif',whiteSpace:'pre-wrap'}}>{novaResp[key]}</p>
                    </div>
                  ))}
                  <div style={{background:T.yellowBg,border:`1px solid ${T.yellow}25`,borderRadius:9,padding:'10px 14px',marginBottom:12}}>
                    <div style={{fontSize:10,color:T.yellow,fontFamily:'monospace',marginBottom:4}}>⚡ PRÓXIMO PASSO</div>
                    <div style={{color:T.yellow,fontSize:12,fontWeight:600,lineHeight:1.5}}>{novaResp.proximo_passo}</div>
                  </div>
                  <Btn variant="ghost" onClick={()=>{setNovaResp(null);setNovaMsg('');}} style={{width:'100%',fontSize:11}}>↺ Responder outra mensagem</Btn>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── STEP 3 — MENSAGEM GERADA ─────────────────────────────────────────────────
  if(step===3&&msgs){
    const abObj=ABORDAGENS.find(a=>a.id===msgs.abId);
    const fmtObj=FORMATOS.find(f=>f.id===msgs.fmtId);
    const isParecer=msgs.fmtId==='parecer';
    return(
      <div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
          <button onClick={()=>setStep(2)} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:7,padding:'6px 12px',color:T.textMuted,fontSize:12,cursor:'pointer',flexShrink:0}}>← Voltar</button>
          <h2 style={{fontFamily:'Georgia, serif',fontSize:22,fontWeight:700,margin:0,color:T.text}}>{isParecer?'📝 Parecer Simplificado ✓':'Mensagem Pronta ✓'}</h2>
        </div>
        <p style={{color:T.textMuted,fontSize:13,marginBottom:24,lineHeight:1.5}}>Copie e cole no canal escolhido.</p>
        {abObj&&fmtObj&&(
          <InfoBox color={isParecer?T.blue:abObj.cor}>
            {fmtObj.icon} <strong>{fmtObj.label}</strong> · tom {abObj.icon} <strong>{abObj.label}</strong>
            {isParecer&&' — linguagem simples para o cliente entender o próprio caso'}
          </InfoBox>
        )}
        {[['MENSAGEM PRINCIPAL','mensagem_principal',isParecer?T.blue:T.gold],['ACOMPANHAMENTO 24H','followup_24h',T.purple]].map(([lbl,key,cor])=>(
          <Card key={key} accent={cor}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <Tag color={cor}>{lbl}</Tag><CopyBtn text={msgs[key]}/>
            </div>
            <p style={{color:T.text,fontSize:14,lineHeight:1.8,margin:0,fontFamily:'Georgia, serif',whiteSpace:'pre-wrap'}}>{msgs[key]}</p>
          </Card>
        ))}
        <Card style={{background:T.greenBg,borderColor:`${T.green}25`}}>
          <Lbl>◆ Por que essa combinação fecha</Lbl>
          <p style={{color:T.green,fontSize:13,margin:0,lineHeight:1.7,fontStyle:'italic'}}>{msgs.por_que_fecha}</p>
        </Card>
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:'16px 18px',marginBottom:12}}>
          <div style={{fontSize:11,color:T.textMuted,fontFamily:'monospace',letterSpacing:'0.1em',marginBottom:8}}>NÃO GOSTOU? GERAR OUTRA VERSÃO</div>
          <Btn onClick={()=>{const outrasAb=ABORDAGENS.filter(a=>a.id!==msgs.abId);const novaAb=outrasAb[Math.floor(Math.random()*outrasAb.length)];gerarMsgs(novaAb.id,msgs.fmtId);}} disabled={loading} variant="ghost" style={{width:'100%',padding:13,fontWeight:700}}>
            {loading?'⏳ Gerando outra versão...':'↺ Gerar outra opção de resposta'}
          </Btn>
        </div>

        {/* DOSSIÊ EXECUTIVO */}
        {!dossie?(
          <div style={{background:`${T.gold}10`,border:`1px solid ${T.goldBorder}`,borderRadius:12,padding:'16px 18px',marginBottom:8}}>
            <div style={{fontSize:11,color:T.gold,fontFamily:'monospace',letterSpacing:'0.1em',marginBottom:6}}>✦ RESUMO DO CASO</div>
            <p style={{color:T.textMuted,fontSize:12,margin:'0 0 12px',lineHeight:1.5}}>Chega na consulta sabendo tudo: pontos fortes, riscos, valor estimado, script de abertura e frase exata para fechar o contrato.</p>
            <Btn onClick={async()=>{
              if(!analysis) return;
              setLoadingDossie(true);
              try{
                const ctx=`Lead: ${analysis.nome} | Área: ${analysis._area} | Situação: ${analysis.situacao} | Tempo: ${analysis.tempo_empresa} | Salário: ${analysis.salario_estimado}\nViolações: ${(analysis.violacoes||[]).join(', ')}\nFundamentos: ${(analysis.fundamentos||[]).slice(0,4).join(' | ')}\nNível: ${analysis.nivel} — ${analysis.justificativa}\n${analysis.beneficio_identificado?`Benefício: ${analysis.beneficio_identificado}`:''}\n${analysis.trf_aplicavel?`TRF: ${analysis.trf_aplicavel}`:''}\n${analysis.prescricao_alerta?`PRESCRIÇÃO: ${analysis.prescricao_alerta}`:''}\n${analysis.alerta_risco?`RISCO: ${analysis.alerta_risco}`:''}`;
                const r=await callClaude(P_DOSSIE,ctx,2000);
                setDossie(r);
                setHistAuto(prev=>[...prev,{icone:'✦',txt:'Dossiê executivo gerado',auto:true,data:new Date().toLocaleDateString('pt-BR'),hora:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}]);
              }catch(e){}finally{setLoadingDossie(false);}
            }} disabled={loadingDossie} style={{width:'100%',padding:13}}>
              {loadingDossie?'⏳ Montando dossiê...':'✦ Gerar Dossiê Executivo do Lead'}
            </Btn>
          </div>
        ):(
          <div style={{background:T.surface,border:`2px solid ${T.goldBorder}`,borderRadius:14,padding:'20px 20px',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
              <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.gold},#7a5810)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>✦</div>
              <div>
                <div style={{color:T.gold,fontSize:14,fontWeight:700,fontFamily:'Georgia,serif'}}>Dossiê Executivo</div>
                <div style={{color:T.textMuted,fontSize:11,fontFamily:'monospace'}}>{analysis.nome}</div>
              </div>
              <div style={{marginLeft:'auto',background:dossie.probabilidade_exito==='Alta'?T.greenBg:dossie.probabilidade_exito==='Média'?T.yellowBg:T.redBg,border:`1px solid ${dossie.probabilidade_exito==='Alta'?T.green:dossie.probabilidade_exito==='Média'?T.yellow:T.red}30`,borderRadius:8,padding:'4px 12px'}}>
                <div style={{fontSize:9,color:T.textDim,fontFamily:'monospace'}}>ÊXITO</div>
                <div style={{color:dossie.probabilidade_exito==='Alta'?T.green:dossie.probabilidade_exito==='Média'?T.yellow:T.red,fontSize:12,fontWeight:700}}>{dossie.probabilidade_exito}</div>
              </div>
            </div>
            <div style={{background:T.bg,borderRadius:9,padding:'12px 14px',marginBottom:12}}>
              <div style={{fontSize:10,color:T.textDim,fontFamily:'monospace',marginBottom:4}}>RESUMO DO CASO</div>
              <p style={{color:T.text,fontSize:13,margin:0,lineHeight:1.7,fontFamily:'Georgia,serif'}}>{dossie.resumo_caso}</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
              <div style={{background:T.greenBg,border:`1px solid ${T.green}20`,borderRadius:9,padding:'12px 14px'}}>
                <div style={{fontSize:10,color:T.green,fontFamily:'monospace',marginBottom:6}}>✓ PONTOS FORTES</div>
                {(dossie.pontos_fortes||[]).map((p,i)=><div key={i} style={{color:T.green,fontSize:11,padding:'2px 0',lineHeight:1.4}}>• {p}</div>)}
              </div>
              <div style={{background:T.redBg,border:`1px solid ${T.red}20`,borderRadius:9,padding:'12px 14px'}}>
                <div style={{fontSize:10,color:T.red,fontFamily:'monospace',marginBottom:6}}>⚠ PONTOS FRÁGEIS</div>
                {(dossie.pontos_frageis||[]).map((p,i)=><div key={i} style={{color:T.red,fontSize:11,padding:'2px 0',lineHeight:1.4}}>• {p}</div>)}
              </div>
            </div>
            <div style={{background:T.purpleBg,border:`1px solid ${T.purple}20`,borderRadius:9,padding:'12px 14px',marginBottom:10}}>
              <div style={{fontSize:10,color:T.purple,fontFamily:'monospace',marginBottom:5}}>🎙 COMO ABRIR A CONSULTA — DIGA EXATAMENTE ISSO</div>
              <p style={{color:T.purple,fontSize:13,margin:0,lineHeight:1.7,fontFamily:'Georgia,serif',fontStyle:'italic'}}>"{dossie.estrategia_abertura}"</p>
            </div>
            <div style={{background:T.blueBg,border:`1px solid ${T.blue}20`,borderRadius:9,padding:'12px 14px',marginBottom:10}}>
              <div style={{fontSize:10,color:T.blue,fontFamily:'monospace',marginBottom:5}}>⚖️ ARGUMENTO CENTRAL — LINGUAGEM DO CLIENTE</div>
              <p style={{color:T.blue,fontSize:13,margin:0,lineHeight:1.7}}>{dossie.argumento_central}</p>
            </div>
            <div style={{display:'flex',gap:10,marginBottom:10}}>
              <div style={{flex:1,background:T.goldDim,border:`1px solid ${T.goldBorder}`,borderRadius:9,padding:'12px 14px'}}>
                <div style={{fontSize:10,color:T.gold,fontFamily:'monospace',marginBottom:4}}>💰 VALOR ESTIMADO DA CAUSA</div>
                <div style={{color:T.gold,fontSize:14,fontWeight:700}}>{dossie.valor_estimado_causa}</div>
              </div>
              <div style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,padding:'12px 14px'}}>
                <div style={{fontSize:10,color:T.textDim,fontFamily:'monospace',marginBottom:4}}>JUSTIFICATIVA</div>
                <div style={{color:T.textMuted,fontSize:11,lineHeight:1.4}}>{dossie.justificativa_exito}</div>
              </div>
            </div>
            <div style={{background:T.greenBg,border:`1px solid ${T.green}20`,borderRadius:9,padding:'12px 14px',marginBottom:10}}>
              <div style={{fontSize:10,color:T.green,fontFamily:'monospace',marginBottom:5}}>✍️ SCRIPT DE FECHAMENTO</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
                <p style={{color:T.green,fontSize:13,margin:0,lineHeight:1.7,fontFamily:'Georgia,serif',fontStyle:'italic',flex:1}}>"{dossie.script_fechamento}"</p>
                <CopyBtn text={dossie.script_fechamento}/>
              </div>
            </div>
            <div style={{background:T.redBg,border:`1px solid ${T.red}20`,borderRadius:9,padding:'12px 14px',marginBottom:12}}>
              <div style={{fontSize:10,color:T.red,fontFamily:'monospace',marginBottom:5}}>🚫 NÃO DIGA ISSO NA CONSULTA</div>
              <p style={{color:T.red,fontSize:13,margin:0,lineHeight:1.5}}>{dossie.nao_diga}</p>
            </div>
            <Btn variant="ghost" onClick={()=>setDossie(null)} style={{width:'100%',fontSize:11}}>↺ Regenerar dossiê</Btn>
          </div>
        )}

        <Btn variant="ghost" onClick={()=>{setStep(1);setTxt('');setAnalysis(null);setMsgs(null);setArquivo(null);setNomeArquivo('');setSavedCRM(false);setHistAuto([]);setDossie(null);setFecharAgora(null);}} style={{width:'100%',marginTop:4}}>
          + Analisar novo lead
        </Btn>
      </div>
    );
  }

  // ── STEP 4 — FECHAR AGORA ────────────────────────────────────────────────────
  if(step===4&&fecharAgora){
    const contratoTxt=(fecharAgora.contrato?.contrato||'').replace(/\\n/g,'\n');
    return(
      <div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <button onClick={()=>setStep(2)} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:7,padding:'6px 12px',color:T.textMuted,fontSize:12,cursor:'pointer'}}>← Voltar</button>
          <div>
            <h2 style={{fontFamily:'Georgia, serif',fontSize:22,fontWeight:700,margin:0,color:T.gold}}>⚡ Fechar Agora ✓</h2>
            <p style={{color:T.textMuted,fontSize:12,margin:'4px 0 0'}}>Mensagem de fechamento + contrato rascunho prontos</p>
          </div>
        </div>

        {/* PONTOS PRINCIPAIS DO CASO */}
        {fecharAgora.contrato?.resumo&&(
          <Card accent={T.gold} style={{marginBottom:14}}>
            <Lbl>📋 Revise antes de enviar</Lbl>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {fecharAgora.contrato.resumo.split(/\n|•/).filter(Boolean).map((item,i)=>(
                <div key={i} style={{color:T.text,fontSize:12,padding:'3px 0',lineHeight:1.5}}>• {item.replace(/^[-•]\s*/,'')}</div>
              ))}
            </div>
          </Card>
        )}

        {/* MENSAGEM DE FECHAMENTO */}
        <Card accent={T.green}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:18}}>💬</span>
              <Tag color={T.green}>MENSAGEM DE FECHAMENTO — WHATSAPP</Tag>
            </div>
            <CopyBtn text={fecharAgora.msg?.mensagem||''}/>
          </div>
          <p style={{color:T.text,fontSize:14,lineHeight:1.9,margin:'0 0 14px',fontFamily:'Georgia, serif',whiteSpace:'pre-wrap'}}>{fecharAgora.msg?.mensagem}</p>
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:12}}>
            <div style={{fontSize:10,color:T.textDim,fontFamily:'monospace',marginBottom:6}}>ACOMPANHAMENTO 24H — SE NÃO RESPONDER</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
              <p style={{color:T.textMuted,fontSize:13,margin:0,lineHeight:1.7,fontFamily:'Georgia,serif',fontStyle:'italic',flex:1}}>{fecharAgora.msg?.followup}</p>
              <CopyBtn text={fecharAgora.msg?.followup||''}/>
            </div>
          </div>
        </Card>

        <div style={{background:T.greenBg,border:`1px solid ${T.green}20`,borderRadius:9,padding:'10px 14px',marginBottom:16}}>
          <div style={{fontSize:10,color:T.green,fontFamily:'monospace',marginBottom:4}}>◆ POR QUE ESSA MENSAGEM FECHA</div>
          <p style={{color:T.green,fontSize:12,margin:0,lineHeight:1.6,fontStyle:'italic'}}>{fecharAgora.msg?.por_que_fecha}</p>
        </div>

        {/* CONTRATO RASCUNHO */}
        <Card accent={T.gold}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:18}}>📄</span>
              <Tag color={T.gold}>CONTRATO — RASCUNHO PARA PERSONALIZAR</Tag>
            </div>
            <CopyBtn text={contratoTxt}/>
          </div>
          <InfoBox color={T.yellow}>⚠ Campos entre [colchetes] devem ser preenchidos antes de enviar ao cliente.</InfoBox>
          <div style={{background:T.bg,borderRadius:9,padding:'14px 16px',maxHeight:400,overflowY:'auto'}}>
            <pre style={{color:T.text,fontSize:12,lineHeight:1.9,margin:0,whiteSpace:'pre-wrap',fontFamily:'Georgia, serif'}}>{contratoTxt}</pre>
          </div>
        </Card>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
          <Btn onClick={()=>setStep(2)} variant="ghost" style={{padding:13}}>← Voltar para análise</Btn>
          <Btn onClick={()=>{setStep(1);setTxt('');setAnalysis(null);setMsgs(null);setArquivo(null);setNomeArquivo('');setSavedCRM(false);setHistAuto([]);setDossie(null);setFecharAgora(null);}} variant="ghost" style={{padding:13}}>+ Novo lead</Btn>
        </div>
      </div>
    );
  }

  return null;
}

// ─── CRM ─────────────────────────────────────────────────────────────────────
const STAGES=[
  {id:'novo',label:'Novo Lead',cor:T.textMuted},
  {id:'contato',label:'Contato Feito',cor:T.blue},
  {id:'consulta',label:'Consulta Agendada',cor:T.yellow},
  {id:'fechado',label:'Fechado ✓',cor:T.green},
  {id:'perdido',label:'Perdido',cor:T.red},
];
const DOCS=['CTPS','Contracheques (últimos 12m)','Extrato FGTS','Termo de Rescisão / TRCT','Contrato de Trabalho','Holerites','Espelho de Ponto','Atestados Médicos','E-mails / Mensagens','RG e CPF','Comprovante de Residência','PPP (se acidente/doença)'];

function Ficha({lead,onBack,onSave,onDel}){
  const [f,setF]=useState({cpf:'',endereco:'',vinculo:'',tempo:'',salario:'',violacoes:'',provas:'',honorarios:'',percentual:'',docs:[],hist:[],...lead});
  const [nota,setNota]=useState('');
  const up=(k,v)=>setF(x=>({...x,[k]:v}));
  const addNota=()=>{if(!nota.trim()) return;const h=[{txt:nota,data:new Date().toLocaleDateString('pt-BR'),hora:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})},...(f.hist||[])];setF(x=>({...x,hist:h}));setNota('');};
  const toggleDoc=(d)=>up('docs',(f.docs||[]).includes(d)?f.docs.filter(x=>x!==d):[...(f.docs||[]),d]);
  const st=STAGES.find(s=>s.id===f.stage)||STAGES[0];
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <button onClick={onBack} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:7,padding:'6px 12px',color:T.textMuted,fontSize:12,cursor:'pointer'}}>← CRM</button>
        <div style={{flex:1}}>
          <div style={{fontFamily:'Georgia, serif',fontSize:20,fontWeight:700,color:T.text}}>{f.nome}</div>
          <div style={{display:'flex',gap:8,marginTop:3}}>
            <Tag color={st.cor}>{st.label}</Tag>
            <span style={{color:T.textDim,fontSize:11,fontFamily:'monospace'}}>desde {f.createdAt}</span>
          </div>
        </div>
        <Btn onClick={()=>onSave(f)} style={{padding:'7px 14px',fontSize:12}}>💾 Salvar</Btn>
        <Btn variant="danger" onClick={()=>onDel(f.id)} style={{padding:'7px 10px'}}>✕</Btn>
      </div>
      <Card>
        <Lbl>Etapa do pipeline</Lbl>
        <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
          {STAGES.map(s=>(
            <button key={s.id} onClick={()=>up('stage',s.id)}
              style={{background:f.stage===s.id?`${s.cor}18`:'transparent',border:`1px solid ${f.stage===s.id?s.cor:T.border}`,borderRadius:7,padding:'5px 12px',color:f.stage===s.id?s.cor:T.textMuted,fontSize:12,cursor:'pointer',transition:'all 0.15s'}}>
              {s.label}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <Lbl>📋 Dados Pessoais</Lbl>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {[['nome','Nome'],['cpf','CPF'],['contato','WhatsApp'],['salario','Salário (R$)'],['endereco','Endereço']].map(([k,ph])=>(
            <div key={k} style={{gridColumn:k==='endereco'?'1/-1':'auto'}}>
              <Lbl>{ph}</Lbl><input value={f[k]||''} onChange={e=>up(k,e.target.value)} placeholder={ph} style={inp}/>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Lbl>⚖️ Dados do Caso</Lbl>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {[['vinculo','Tipo de vínculo'],['tempo','Tempo na empresa']].map(([k,ph])=>(
            <div key={k}><Lbl>{ph}</Lbl><input value={f[k]||''} onChange={e=>up(k,e.target.value)} placeholder={ph} style={inp}/></div>
          ))}
          {[['violacoes','Violações identificadas'],['provas','Provas disponíveis']].map(([k,ph])=>(
            <div key={k} style={{gridColumn:'1/-1'}}><Lbl>{ph}</Lbl><textarea value={f[k]||''} onChange={e=>up(k,e.target.value)} placeholder={ph} rows={2} style={{...inp,resize:'none'}}/></div>
          ))}
        </div>
      </Card>
      <Card>
        <Lbl>💰 Honorários Combinados</Lbl>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div><Lbl>Valor fixo (R$)</Lbl><input value={f.honorarios||''} onChange={e=>up('honorarios',e.target.value)} placeholder="ex: 2000" type="number" style={inp}/></div>
          <div><Lbl>Êxito (%)</Lbl><input value={f.percentual||''} onChange={e=>up('percentual',e.target.value)} placeholder="ex: 30" type="number" style={inp}/></div>
        </div>
      </Card>
      <Card>
        <Lbl>📎 Checklist de Documentos</Lbl>
        <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
          {DOCS.map(d=>{const ok=(f.docs||[]).includes(d);return<button key={d} onClick={()=>toggleDoc(d)} style={{background:ok?T.greenBg:T.surface,border:`1px solid ${ok?T.green:T.border}`,borderRadius:7,padding:'5px 11px',color:ok?T.green:T.textMuted,fontSize:11,cursor:'pointer',transition:'all 0.15s'}}>{ok?'✓ ':''}{d}</button>;})}
        </div>
        <div style={{marginTop:10,color:T.textDim,fontSize:11,fontFamily:'monospace'}}>{(f.docs||[]).length}/{DOCS.length} documentos recebidos</div>
      </Card>
      <Card>
        <Lbl>💬 Histórico de Contatos</Lbl>
        <div style={{display:'flex',gap:8,marginBottom:12}}>
          <input value={nota} onChange={e=>setNota(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addNota()} placeholder="Anotação... (Enter para salvar)" style={{...inp,flex:1}}/>
          <Btn onClick={addNota} style={{padding:'8px 14px',whiteSpace:'nowrap',fontSize:12}}>+ Anotar</Btn>
        </div>
        {!(f.hist||[]).length&&<div style={{color:T.textDim,fontSize:12,fontFamily:'monospace'}}>Nenhum contato registrado.</div>}
        {(f.hist||[]).map((h,i)=>(
          <div key={i} style={{borderLeft:`2px solid ${T.goldBorder}`,paddingLeft:12,marginBottom:10}}>
            <div style={{color:T.text,fontSize:13}}>{h.txt}</div>
            <div style={{color:T.textDim,fontSize:11,fontFamily:'monospace',marginTop:2}}>{h.data} às {h.hora}</div>
          </div>
        ))}
      </Card>
      <Btn onClick={()=>onSave(f)} style={{width:'100%',padding:13}}>💾 Salvar Ficha</Btn>
    </div>
  );
}

function ToolCRM(){
  const [leads,setLeads]=useState([]);
  const [form,setForm]=useState({nome:'',contato:'',caso:'',stage:'novo'});
  const [showForm,setShowForm]=useState(false);
  const [ficha,setFicha]=useState(null);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{try{const d=localStorage.getItem('lf_leads');if(d) setLeads(JSON.parse(d));}catch(e){}setLoaded(true);},[]);
  const save=(nl)=>{setLeads(nl);try{localStorage.setItem('lf_leads',JSON.stringify(nl));}catch(e){}};
  const addLead=()=>{if(!form.nome.trim()) return;save([{id:Date.now(),...form,docs:[],hist:[],createdAt:new Date().toLocaleDateString('pt-BR')},...leads]);setForm({nome:'',contato:'',caso:'',stage:'novo'});setShowForm(false);};
  const saveFicha=(f)=>{save(leads.map(l=>l.id===f.id?f:l));setFicha(f);};
  const delLead=(id)=>{save(leads.filter(l=>l.id!==id));setFicha(null);};
  if(!loaded) return <div style={{color:T.textMuted,padding:40,textAlign:'center',fontFamily:'monospace'}}>Carregando...</div>;
  if(ficha) return <Ficha lead={ficha} onBack={()=>setFicha(null)} onSave={saveFicha} onDel={delLead}/>;
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
        <Title sub="Pipeline completo do primeiro contato ao contrato assinado.">📋 CRM de Leads</Title>
        <Btn onClick={()=>setShowForm(!showForm)} style={{padding:'9px 14px',fontSize:12,whiteSpace:'nowrap'}}>+ Cadastrar Lead</Btn>
      </div>
      {!leads.length&&!showForm&&(
        <div style={{textAlign:'center',padding:'40px 20px',border:`1px dashed ${T.goldBorder}`,borderRadius:14,marginBottom:20}}>
          <div style={{fontSize:32,marginBottom:10}}>📋</div>
          <div style={{color:T.text,fontSize:16,fontWeight:600,fontFamily:'Georgia, serif',marginBottom:8}}>Nenhum lead cadastrado</div>
          <div style={{color:T.textMuted,fontSize:13,marginBottom:18,lineHeight:1.6}}>Cadastre o primeiro lead para iniciar o pipeline.</div>
          <Btn onClick={()=>setShowForm(true)} style={{display:'inline-flex'}}>+ Cadastrar primeiro lead</Btn>
        </div>
      )}
      {leads.length>0&&<InfoBox color={T.gold}>💡 Clique em qualquer lead para abrir a ficha completa com documentos, histórico e honorários.</InfoBox>}
      {showForm&&(
        <Card accent={T.gold}>
          <Lbl>Novo Lead</Lbl>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
            {[['nome','Nome do cliente'],['contato','WhatsApp'],['caso','Resumo do caso']].map(([k,ph])=>(
              <input key={k} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={ph} style={{...inp,gridColumn:k==='caso'?'1/-1':'auto'}}/>
            ))}
          </div>
          <div style={{display:'flex',gap:8}}>
            <Btn onClick={addLead} style={{flex:1}}>Adicionar</Btn>
            <Btn variant="ghost" onClick={()=>setShowForm(false)}>Cancelar</Btn>
          </div>
        </Card>
      )}
      {STAGES.map(st=>{
        const sl=leads.filter(l=>l.stage===st.id);
        return(
          <div key={st.id} style={{marginBottom:22}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:st.cor}}/>
              <span style={{color:st.cor,fontSize:11,fontFamily:'monospace',fontWeight:700,letterSpacing:'0.06em'}}>{st.label.toUpperCase()}</span>
              <span style={{color:T.textDim,fontSize:11,fontFamily:'monospace'}}>({sl.length})</span>
            </div>
            {!sl.length&&<div style={{border:`1px dashed ${T.border}`,borderRadius:9,padding:'12px 16px',color:T.textDim,fontSize:12,fontFamily:'monospace'}}>Vazio</div>}
            {sl.map(l=>(
              <div key={l.id} onClick={()=>setFicha(l)}
                style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:11,padding:'14px 18px',marginBottom:7,display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',transition:'border-color 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.gold}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:T.text,fontSize:14,fontWeight:600,marginBottom:2}}>{l.nome}</div>
                  {l.caso&&<div style={{color:T.textMuted,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:3}}>{l.caso}</div>}
                  <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                    <span style={{color:T.textDim,fontSize:11,fontFamily:'monospace'}}>{l.contato} · {l.createdAt}</span>
                    {(l.hist||[]).length>0&&<Tag color={T.purple}>{l.hist.length} nota{l.hist.length!==1?'s':''}</Tag>}
                    {(l.docs||[]).length>0&&<Tag color={T.green}>{l.docs.length} doc{l.docs.length!==1?'s':''}</Tag>}
                  </div>
                </div>
                <span style={{color:T.textDim,fontSize:16,marginLeft:10}}>→</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── QUEBRADOR DE OBJEÇÕES ────────────────────────────────────────────────────
const OBJECOES=[
  {id:'pensar',label:'"Vou pensar e te aviso"'},
  {id:'dinheiro',label:'"Não tenho dinheiro agora"'},
  {id:'medo',label:'"Tenho medo de perder o emprego"'},
  {id:'vale',label:'"Será que vale a pena processar?"'},
  {id:'tempo',label:'"Não tenho tempo pra isso"'},
  {id:'empresa',label:'"A empresa é boa, não quero problemas"'},
  {id:'outro',label:'Outra objeção...'},
];

function ToolObjecoes(){
  const [obId,setObId]=useState('');
  const [custom,setCustom]=useState('');
  const [ctx,setCtx]=useState('');
  const [res,setRes]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState('');
  const obTxt=obId==='outro'?custom:OBJECOES.find(o=>o.id===obId)?.label||'';
  const gerar=async()=>{
    if(!obId){setErr('Selecione uma objeção.');return;}
    if(obId==='outro'&&!custom.trim()){setErr('Digite a objeção.');return;}
    setErr('');setLoading(true);
    try{const r=await callClaude(P_OBJECAO,`Objeção: ${obTxt}\n${ctx?`Contexto: ${ctx}`:''}`);setRes(r);}
    catch(e){setErr(e.message);}finally{setLoading(false);}
  };
  return(
    <div>
      <Title sub="O cliente travou? Selecione a objeção e receba a resposta ideal — empática, jurídica e dentro do EOAB.">🛡️ Quebrador de Objeções</Title>
      {!res?(
        <>
          <Lbl>O que o cliente disse?</Lbl>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
            {OBJECOES.map(ob=>(
              <button key={ob.id} onClick={()=>setObId(ob.id)}
                style={{background:obId===ob.id?T.goldDim:T.card,border:`1px solid ${obId===ob.id?T.gold:T.border}`,borderRadius:9,padding:'11px 13px',color:obId===ob.id?T.gold:T.textMuted,fontSize:12,cursor:'pointer',textAlign:'left',fontFamily:'Georgia,serif',lineHeight:1.4,transition:'all 0.15s'}}>
                {ob.label}
              </button>
            ))}
          </div>
          {obId==='outro'&&<input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Digite o que o cliente disse..." style={{...inp,marginBottom:14}}/>}
          <Lbl>Contexto do caso — opcional</Lbl>
          <textarea value={ctx} onChange={e=>setCtx(e.target.value)} rows={3} placeholder="Ex: cliente demitido após 5 anos, tem medo de represália..." style={{...inp,resize:'none',lineHeight:1.6,marginBottom:14}}/>
          <Err msg={err}/>
          <Btn onClick={gerar} disabled={loading} style={{width:'100%',padding:14}}>{loading?'⏳ Gerando resposta...':'→ Quebrar Objeção'}</Btn>
        </>
      ):(
        <>
          <InfoBox color={T.gold}>"{obTxt}"</InfoBox>
          <Card accent={T.gold}><Lbl>🤝 Valide primeiro — diga isso</Lbl><p style={{color:T.text,fontSize:14,margin:0,lineHeight:1.7,fontStyle:'italic'}}>"{res.validacao}"</p></Card>
          <Card accent={T.green}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}><Tag color={T.green}>WHATSAPP</Tag><CopyBtn text={res.resposta_whatsapp}/></div>
            <p style={{color:T.text,fontSize:14,margin:0,lineHeight:1.8,fontFamily:'Georgia,serif',whiteSpace:'pre-wrap'}}>{res.resposta_whatsapp}</p>
          </Card>
          <Card accent={T.purple}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}><Tag color={T.purple}>PRESENCIAL / LIGAÇÃO</Tag><CopyBtn text={res.resposta_presencial}/></div>
            <p style={{color:T.text,fontSize:14,margin:0,lineHeight:1.8,fontFamily:'Georgia,serif'}}>{res.resposta_presencial}</p>
          </Card>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
            <Card style={{margin:0,background:T.purpleBg,borderColor:`${T.purple}25`}}><Lbl>⚡ Argumento jurídico</Lbl><p style={{color:T.purple,fontSize:12,margin:0,lineHeight:1.6}}>{res.argumento_juridico}</p></Card>
            <Card style={{margin:0,background:T.redBg,borderColor:`${T.red}25`}}><Lbl>🚫 Não diga isso</Lbl><p style={{color:T.red,fontSize:12,margin:0,lineHeight:1.6}}>{res.erro_comum}</p></Card>
          </div>
          <Btn variant="ghost" onClick={()=>{setRes(null);setObId('');setCustom('');setCtx('');}} style={{width:'100%'}}>+ Nova objeção</Btn>
        </>
      )}
    </div>
  );
}

// ─── CALCULADORA DE VERBAS ────────────────────────────────────────────────────
function ToolCalc(){
  const [f,setF]=useState({sal:'',entrada:'',saida:'',dias_ultimo_mes:'30',aviso:'indenizado',tipo:'sjc',fgts:''});
  const [res,setRes]=useState(null);
  const [alerta,setAlerta]=useState(null);
  const [loadingAI,setLoadingAI]=useState(false);
  const up=(k,v)=>setF(x=>({...x,[k]:v}));
  const n=(v)=>parseFloat(v)||0;
  const calcularMeses=()=>{
    if(!f.entrada||!f.saida) return 0;
    const [de,me,ae]=f.entrada.split('/').map(Number);
    const [ds,ms,as_]=f.saida.split('/').map(Number);
    if(!de||!me||!ae||!ds||!ms||!as_) return 0;
    const dtE=new Date(ae,me-1,de);const dtS=new Date(as_,ms-1,ds);
    if(dtS<=dtE) return 0;
    return(dtS.getFullYear()-dtE.getFullYear())*12+(dtS.getMonth()-dtE.getMonth());
  };
  const calcular=()=>{
    const sal=n(f.sal),meses=calcularMeses(),dias=n(f.dias_ultimo_mes),fgts=n(f.fgts);
    if(sal<=0||meses<=0) return;
    const items=[];let total=0;
    const add=(nome,valor,desc,lei)=>{items.push({nome,valor,desc,lei});total+=valor;};
    add('Saldo de Salário',(sal/30)*dias,`${dias} dias trabalhados no último mês`,'Art. 477 CLT');
    const avosRef=Math.ceil(meses%12===0?12:meses%12);
    add('13º Salário Proporcional',(sal/12)*avosRef,`${avosRef}/12 avos`,'Art. 7º VIII CF/88 + Lei 4.090/62');
    add('Férias Proporcionais + 1/3',(sal/12)*avosRef*(4/3),`${avosRef}/12 avos + 1/3 constitucional`,'Arts. 129 e 146 CLT + art. 7º XVII CF/88');
    if(f.tipo==='sjc'){
      if(f.aviso==='indenizado'){const anosC=Math.floor(meses/12);const dA=Math.min(30+anosC*3,90);add('Aviso Prévio Indenizado',(sal/30)*dA,`${dA} dias (30 base + ${anosC*3} proporcionais)`,'Lei 12.506/11 + Súmula 441 TST');}
      const fs=fgts>0?fgts:sal*0.08*meses;add('Multa FGTS 40%',fs*0.4,`40% sobre R$ ${fs.toLocaleString('pt-BR',{minimumFractionDigits:2})}`,'Art. 18 §1º Lei 8.036/90');
    }
    if(f.tipo==='ri'){const anosC=Math.floor(meses/12);const dA=Math.min(30+anosC*3,90);add('Aviso Prévio (Rescisão Indireta)',(sal/30)*dA,`${dA} dias — culpa do empregador`,'Art. 483 CLT + Lei 12.506/11');const fs=fgts>0?fgts:sal*0.08*meses;add('Multa FGTS 40%',fs*0.4,'Rescisão indireta = mesmas verbas da SJC','Art. 18 §1º Lei 8.036/90 + Súmula 246 TST');}
    if(f.tipo==='acordo'){const anosC=Math.floor(meses/12);const dA=Math.min(30+anosC*3,90);add('Aviso Prévio (50% proporcional)',(sal/30)*dA*0.5,`${Math.round(dA/2)} dias efetivos`,'Art. 484-A I CLT');const fs=fgts>0?fgts:sal*0.08*meses;add('Multa FGTS 20%',fs*0.2,`20% sobre R$ ${fs.toLocaleString('pt-BR',{minimumFractionDigits:2})}`,'Art. 484-A II CLT');add('⚠ Saque FGTS (80% do saldo)',fs*0.8,'Empregado pode sacar 80% — não soma ao rescisório','Art. 484-A §1º CLT');items.push({nome:'✕ Seguro-desemprego',valor:0,desc:'NÃO gerado no acordo — exige dispensa unilateral',lei:'Art. 484-A §2º CLT'});}
    setRes({items,total});
  };
  const verificarAI=async()=>{
    if(!res) return;setLoadingAI(true);
    try{const ctx=`Salário: R$${f.sal}\nTempo: ${calcularMeses()} meses\nTipo: ${f.tipo}\nVerbas: ${res.items.map(i=>i.nome+': R$'+i.valor.toFixed(2)).join(', ')}`;const r=await callClaude(P_VERBAS_IA,ctx,800);setAlerta(r);}
    catch(e){}finally{setLoadingAI(false);}
  };
  const tipos=[{id:'sjc',label:'Sem justa causa'},{id:'cjc',label:'Com justa causa'},{id:'ri',label:'Rescisão indireta (art. 483 CLT)'},{id:'pe',label:'Pedido de demissão'},{id:'acordo',label:'Acordo (art. 484-A CLT)'}];
  return(
    <div>
      <Title sub="Estimativa das verbas rescisórias com fundamentos legais. Base: CLT, CF/88 e Lei 12.506/11.">🧮 Calculadora de Verbas</Title>
      <Card>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
          <div style={{gridColumn:'1/-1'}}>
            <Lbl>Salário bruto (R$)</Lbl>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <input value={f.sal} onChange={e=>up('sal',e.target.value)} placeholder="ex: 3500" type="number" style={{...inp,flex:1}}/>
              {calcularMeses()>0&&(
                <div style={{background:T.goldDim,border:`1px solid ${T.goldBorder}`,borderRadius:8,padding:'8px 14px',whiteSpace:'nowrap',flexShrink:0}}>
                  <div style={{fontSize:9,color:T.gold,fontFamily:'monospace'}}>TEMPO APURADO</div>
                  <div style={{color:T.gold,fontSize:13,fontWeight:700}}>{Math.floor(calcularMeses()/12)>0?`${Math.floor(calcularMeses()/12)}a `:''}{calcularMeses()%12>0?`${calcularMeses()%12}m`:''} ({calcularMeses()} meses)</div>
                </div>
              )}
            </div>
          </div>
          <div><Lbl>Data de entrada (dd/mm/aaaa)</Lbl><input value={f.entrada} onChange={e=>{let v=e.target.value.replace(/\D/g,'');if(v.length>2) v=v.slice(0,2)+'/'+v.slice(2);if(v.length>5) v=v.slice(0,5)+'/'+v.slice(5);up('entrada',v.slice(0,10));}} placeholder="ex: 15/03/2019" style={inp} maxLength={10}/></div>
          <div><Lbl>Data de saída (dd/mm/aaaa)</Lbl><input value={f.saida} onChange={e=>{let v=e.target.value.replace(/\D/g,'');if(v.length>2) v=v.slice(0,2)+'/'+v.slice(2);if(v.length>5) v=v.slice(0,5)+'/'+v.slice(5);up('saida',v.slice(0,10));}} placeholder="ex: 30/04/2025" style={inp} maxLength={10}/></div>
          <div><Lbl>Dias trabalhados no último mês</Lbl><input value={f.dias_ultimo_mes} onChange={e=>up('dias_ultimo_mes',e.target.value)} placeholder="1-30" type="number" style={inp}/></div>
          <div><Lbl>Saldo FGTS (R$) — opcional</Lbl><input value={f.fgts} onChange={e=>up('fgts',e.target.value)} placeholder="se souber" type="number" style={inp}/></div>
          <div style={{gridColumn:'1/-1'}}>
            <Lbl>Tipo de desligamento</Lbl>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {tipos.map(t=><button key={t.id} onClick={()=>up('tipo',t.id)} style={{background:f.tipo===t.id?T.goldDim:'transparent',border:`1px solid ${f.tipo===t.id?T.gold:T.border}`,borderRadius:7,padding:'7px 12px',color:f.tipo===t.id?T.gold:T.textMuted,fontSize:12,cursor:'pointer',transition:'all 0.15s'}}>{t.label}</button>)}
            </div>
          </div>
          {(f.tipo==='sjc'||f.tipo==='ri'||f.tipo==='acordo')&&(
            <div style={{gridColumn:'1/-1'}}>
              <Lbl>Aviso prévio</Lbl>
              <div style={{display:'flex',gap:7}}>
                {[['indenizado','Indenizado'],['trabalhado','Trabalhado']].map(([v,l])=><button key={v} onClick={()=>up('aviso',v)} style={{background:f.aviso===v?T.goldDim:'transparent',border:`1px solid ${f.aviso===v?T.gold:T.border}`,borderRadius:7,padding:'7px 14px',color:f.aviso===v?T.gold:T.textMuted,fontSize:12,cursor:'pointer'}}>{l}</button>)}
              </div>
            </div>
          )}
        </div>
        <Btn onClick={calcular} style={{width:'100%',padding:13}}>→ Calcular Verbas Rescisórias</Btn>
      </Card>
      {res&&(
        <>
          {res.items.map((item,i)=>(
            <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:'12px 16px',marginBottom:7,display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
              <div style={{flex:1}}>
                <div style={{color:T.text,fontSize:13,fontWeight:600,marginBottom:2}}>{item.nome}</div>
                <div style={{color:T.textMuted,fontSize:11}}>{item.desc}</div>
                <div style={{color:T.textDim,fontSize:10,fontFamily:'monospace',marginTop:2}}>{item.lei}</div>
              </div>
              <div style={{color:T.gold,fontSize:14,fontWeight:700,fontFamily:'monospace',whiteSpace:'nowrap'}}>R$ {item.valor.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
            </div>
          ))}
          <div style={{background:`${T.gold}12`,border:`1px solid ${T.goldBorder}`,borderRadius:11,padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',margin:'10px 0 8px'}}>
            <span style={{color:T.gold,fontSize:13,fontWeight:700,fontFamily:'monospace'}}>TOTAL ESTIMADO</span>
            <span style={{color:T.gold,fontSize:20,fontWeight:700,fontFamily:'monospace'}}>R$ {res.total.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
          </div>
          <div style={{color:T.textDim,fontSize:11,textAlign:'center',fontStyle:'italic',marginBottom:12}}>* Estimativa de referência. Valores reais dependem de acordos coletivos, horas extras e outras particularidades.</div>
          <Btn onClick={verificarAI} disabled={loadingAI} variant="ghost" style={{width:'100%',marginBottom:12}}>{loadingAI?'⏳ Verificando com IA...':'🤖 IA: Verificar verbas esquecidas'}</Btn>
          {alerta&&(
            <Card accent={T.purple}>
              <Lbl>🤖 Análise da IA — Verbas Adicionais</Lbl>
              {(alerta.verbas_extras||[]).map((v,i)=><div key={i} style={{color:T.yellow,fontSize:12,padding:'3px 0'}}>→ {v}</div>)}
              {(alerta.alertas||[]).map((a,i)=><div key={i} style={{color:T.red,fontSize:12,padding:'3px 0'}}>⚠ {a}</div>)}
              {alerta.observacao&&<div style={{color:T.textMuted,fontSize:12,marginTop:8,fontStyle:'italic'}}>{alerta.observacao}</div>}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── CONTRATO DE HONORÁRIOS ───────────────────────────────────────────────────
function ToolContrato(){
  const [f,setF]=useState({cliente:'',cpf:'',rg:'',endereco:'',advogado:'',oab:'',caso:'',tipo:'exito',honorarios:'',percentual:'',cidade:''});
  const [contrato,setContrato]=useState('');
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState('');
  const [modeloProprio,setModeloProprio]=useState('');
  const [nomeModelo,setNomeModelo]=useState('');
  const up=(k,v)=>setF(x=>({...x,[k]:v}));
  const handleModelo=e=>{const file=e.target.files[0];if(!file) return;const reader=new FileReader();reader.onload=()=>{if(file.type==='text/plain'||file.name.endsWith('.txt')){setModeloProprio(reader.result.slice(0,6000));setNomeModelo(file.name);}else{setNomeModelo(file.name+' — use .txt para melhor resultado');}};reader.readAsText(file);};
  const gerar=async()=>{
    if(!f.cliente||!f.caso){setErr('Preencha nome do cliente e descrição do caso.');return;}
    setErr('');setLoading(true);
    try{
      const ctx=`CONTRATANTE: ${f.cliente}, CPF: ${f.cpf}, RG: ${f.rg}, Endereço: ${f.endereco}\nADVOGADO: ${f.advogado||'[Nome do Advogado]'}, OAB: ${f.oab||'[OAB/XX 000000]'}\nCIDADE: ${f.cidade||'[Cidade]'}\nOBJETO/CASO: ${f.caso}\nHONORÁRIOS: ${f.tipo==='exito'?`${f.percentual||30}% sobre o valor da condenação`:f.tipo==='fixo'?`R$ ${f.honorarios} fixo`:f.tipo==='misto'?`R$ ${f.honorarios} entrada + ${f.percentual||20}% êxito`:'a combinar'}\nDATA: ${new Date().toLocaleDateString('pt-BR')}`;
      const promptBase=modeloProprio?`Use o MODELO abaixo como base, substituindo variáveis. Respeite EOAB e OAB Lei 8.906/94.\nMODELO:\n${modeloProprio}\nRetorne SOMENTE JSON: {"contrato":"texto com \\n"}`:P_CONTRATO;
      const r=await callClaude(promptBase,ctx,2500);
      setContrato((r.contrato||'').replace(/\\n/g,'\n'));
    }catch(e){setErr(e.message);}finally{setLoading(false);}
  };
  const campos=[{k:'cliente',ph:'Nome completo do cliente'},{k:'cpf',ph:'CPF: 000.000.000-00'},{k:'rg',ph:'RG: 00.000.000-0'},{k:'advogado',ph:'Dr(a). Nome Completo'},{k:'oab',ph:'OAB/XX 000000'},{k:'cidade',ph:'Cidade - UF'},{k:'endereco',ph:'Endereço completo do cliente',full:true},{k:'caso',ph:'Descreva as pretensões...',full:true}];
  return(
    <div>
      <Title sub="Contrato completo e personalizado com base no Estatuto da OAB (Lei 8.906/94), EOAB e LGPD.">📄 Contrato de Honorários</Title>
      {!contrato?(
        <Card>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
            {campos.map(({k,ph,full})=>(
              <div key={k} style={{gridColumn:full?'1/-1':'auto'}}><Lbl>{ph.split(':')[0]}</Lbl><input value={f[k]} onChange={e=>up(k,e.target.value)} placeholder={ph} style={inp}/></div>
            ))}
            <div><Lbl>Tipo de honorários</Lbl><select value={f.tipo} onChange={e=>up('tipo',e.target.value)} style={sel}><option value="exito">Êxito (%)</option><option value="fixo">Fixo (R$)</option><option value="misto">Misto (entrada + êxito)</option></select></div>
            <div><Lbl>{f.tipo==='fixo'?'Valor (R$)':'Percentual (%)'}</Lbl><input value={f.tipo==='fixo'?f.honorarios:f.percentual} onChange={e=>up(f.tipo==='fixo'?'honorarios':'percentual',e.target.value)} placeholder={f.tipo==='fixo'?'ex: 2000':'ex: 30'} type="number" style={inp}/></div>
            {f.tipo==='misto'&&<div><Lbl>Valor entrada (R$)</Lbl><input value={f.honorarios} onChange={e=>up('honorarios',e.target.value)} placeholder="ex: 500" type="number" style={inp}/></div>}
          </div>
          <label style={{display:'flex',alignItems:'center',gap:10,background:nomeModelo?T.greenBg:T.surface,border:`1px solid ${nomeModelo?T.green:T.border}`,borderRadius:9,padding:'11px 14px',cursor:'pointer',marginBottom:14,transition:'all 0.2s'}}>
            <input type="file" accept=".txt,.docx,.doc" onChange={handleModelo} style={{display:'none'}}/>
            <span style={{fontSize:16}}>{nomeModelo?'✓':'📋'}</span>
            <div style={{flex:1}}>
              <div style={{color:nomeModelo?T.green:T.text,fontSize:12,fontWeight:600}}>{nomeModelo||'Usar meu modelo de contrato (.txt)'}</div>
              <div style={{color:T.textMuted,fontSize:11,marginTop:2}}>{nomeModelo?'IA vai preencher com os dados acima':'Opcional — sem envio usa o modelo padrão'}</div>
            </div>
            {nomeModelo&&<button onClick={e=>{e.preventDefault();setModeloProprio('');setNomeModelo('');}} style={{background:'transparent',border:'none',color:T.red,fontSize:14,cursor:'pointer'}}>✕</button>}
          </label>
          <Err msg={err}/>
          <Btn onClick={gerar} disabled={loading} style={{width:'100%',padding:13}}>{loading?'⏳ Gerando contrato...':nomeModelo?'→ Gerar com Meu Modelo':'→ Gerar Contrato de Honorários'}</Btn>
        </Card>
      ):(
        <>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <Tag color={T.green}>CONTRATO GERADO</Tag>
            <div style={{display:'flex',gap:8}}><CopyBtn text={contrato}/><Btn variant="ghost" onClick={()=>setContrato('')} style={{padding:'4px 12px',fontSize:11}}>Novo</Btn></div>
          </div>
          <Card><pre style={{color:T.text,fontSize:12.5,lineHeight:1.9,margin:0,whiteSpace:'pre-wrap',fontFamily:'Georgia, serif'}}>{contrato}</pre></Card>
        </>
      )}
    </div>
  );
}

// ─── PRESENÇA DIGITAL ─────────────────────────────────────────────────────────
const TEMAS=['Demissão sem justa causa','Horas extras não pagas','Assédio moral no trabalho','FGTS não depositado','Demissão durante doença/acidente','Trabalho sem carteira assinada','Equiparação salarial','Adicional de insalubridade/periculosidade','Acidente de trabalho','Desvio de função','Intervalo intrajornada suprimido','Rescisão indireta (art. 483 CLT)','Outro tema...'];
const ESTILOS_IMG=[{id:'educativo',label:'📚 Educativo',desc:'Explica um direito'},{id:'alerta',label:'⚠️ Alerta',desc:'Chama atenção para um risco'},{id:'motivacional',label:'💪 Motivacional',desc:'Encoraja a buscar direitos'},{id:'pergunta',label:'❓ Pergunta',desc:'Engaja com uma dúvida'}];

function ToolPresenca(){
  const [mod,setMod]=useState('conteudo');
  const [res,setRes]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState('');
  const [canal,setCanal]=useState('instagram');
  const [tema,setTema]=useState('');
  const [temaCustom,setTemaCustom]=useState('');
  const [cidade,setCidade]=useState('');
  const [plataforma,setPlataforma]=useState('google');
  const [orcamento,setOrcamento]=useState('');
  const [cidadeAnuncio,setCidadeAnuncio]=useState('');
  const [nomeEx,setNomeEx]=useState('');
  const [casoEx,setCasoEx]=useState('');
  const [imgTema,setImgTema]=useState('');
  const [imgTemaCustom,setImgTemaCustom]=useState('');
  const [imgEstilo,setImgEstilo]=useState('educativo');
  const [imgNome,setImgNome]=useState('');
  const [imgFormato,setImgFormato]=useState('feed');
  const [imgPost,setImgPost]=useState(null);
  const reset=()=>{setRes(null);setErr('');};

  const gerarConteudo=async()=>{const t=tema==='Outro tema...'?temaCustom:tema;if(!t){setErr('Escolha um tema.');return;}setErr('');setLoading(true);try{const r=await callClaude(P_CONTEUDO,`Canal: ${canal}\nTema: ${t}\nCidade: ${cidade||'não informada'}`,1000);setRes({tipo:'conteudo',...r});}catch(e){setErr(e.message);}finally{setLoading(false);}};
  const gerarAnuncio=async()=>{if(!cidadeAnuncio){setErr('Informe a cidade.');return;}setErr('');setLoading(true);try{const r=await callClaude(P_ANUNCIO,`Plataforma: ${plataforma}\nCidade: ${cidadeAnuncio}\nOrçamento: ${orcamento?'R$'+orcamento:'não informado'}`,800);setRes({tipo:'anuncio',...r});}catch(e){setErr(e.message);}finally{setLoading(false);}};
  const gerarIndicacao=async()=>{if(!nomeEx){setErr('Informe o nome do ex-cliente.');return;}setErr('');setLoading(true);try{const r=await callClaude(P_INDICACAO,`Ex-cliente: ${nomeEx}\nCaso: ${casoEx||'não informado'}`,800);setRes({tipo:'indicacao',...r});}catch(e){setErr(e.message);}finally{setLoading(false);}};

  const wrapText=(ctx,text,x,y,maxWidth,lineHeight)=>{const words=(text||'').split(' ');let line='',cy=y;for(let n=0;n<words.length;n++){const test=line+words[n]+' ';if(ctx.measureText(test).width>maxWidth&&n>0){ctx.fillText(line,x,cy);line=words[n]+' ';cy+=lineHeight;}else{line=test;}}ctx.fillText(line,x,cy);};
  const desenharCanvas=(p,fmt,nome)=>{const canvas=document.getElementById('imgCanvas');if(!canvas||!p) return;const w=600,h=fmt==='feed'?600:1067;canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,p.cor_fundo||'#0a1628');bg.addColorStop(1,'#060d1a');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);const bar=ctx.createLinearGradient(0,0,w,0);bar.addColorStop(0,'transparent');bar.addColorStop(0.5,p.cor_destaque||'#c9a84c');bar.addColorStop(1,'transparent');ctx.fillStyle=bar;ctx.fillRect(0,0,w,4);ctx.font=`${fmt==='feed'?'80px':'100px'} serif`;ctx.textAlign='center';ctx.fillText(p.emoji_principal||'⚖️',w/2,fmt==='feed'?120:160);ctx.fillStyle=p.cor_destaque||'#c9a84c';ctx.font=`bold ${fmt==='feed'?'34px':'40px'} Arial`;wrapText(ctx,(p.titulo||'').toUpperCase(),w/2,fmt==='feed'?190:285,w-80,fmt==='feed'?42:50);ctx.fillStyle='#fff';ctx.font=`${fmt==='feed'?'17px':'21px'} Arial`;wrapText(ctx,p.subtitulo||'',w/2,fmt==='feed'?255:380,w-100,fmt==='feed'?25:30);ctx.strokeStyle=(p.cor_destaque||'#c9a84c')+'66';ctx.lineWidth=1;const ly=fmt==='feed'?288:432;ctx.beginPath();ctx.moveTo(60,ly);ctx.lineTo(w-60,ly);ctx.stroke();ctx.fillStyle='#c8d8ee';ctx.font=`${fmt==='feed'?'14px':'17px'} Arial`;wrapText(ctx,p.corpo||'',w/2,fmt==='feed'?325:480,w-80,fmt==='feed'?21:27);ctx.fillStyle='#fff';ctx.font=`bold ${fmt==='feed'?'13px':'16px'} Arial`;ctx.fillText('👉 '+(p.cta||''),w/2,fmt==='feed'?430:690);ctx.fillStyle=p.cor_destaque||'#c9a84c';ctx.font=`bold ${fmt==='feed'?'12px':'15px'} Arial`;ctx.fillText(nome||'Dr. Advogado',w/2,fmt==='feed'?480:790);ctx.fillStyle='#3a5a7a';ctx.font=`${fmt==='feed'?'10px':'13px'} Arial`;ctx.fillText((p.hashtags||[]).map(h=>'#'+h).join(' '),w/2,fmt==='feed'?508:848);ctx.fillStyle=bar;ctx.fillRect(0,h-4,w,4);};

  const mods=[{id:'conteudo',icon:'✍️',label:'Conteúdo',desc:'Post educativo'},{id:'anuncio',icon:'📢',label:'Anúncio',desc:'Google/Meta Ads'},{id:'indicacao',icon:'🤝',label:'Indicação',desc:'Reativar ex-clientes'},{id:'imagem',icon:'🖼️',label:'Imagem IA',desc:'Posts e stories'}];

  return(
    <div>
      <Title sub="Apareça onde seu cliente está. Conteúdo, anúncio e indicação — tudo dentro do EOAB.">📣 Presença Digital</Title>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8,marginBottom:22}}>
        {mods.map(m=>(
          <button key={m.id} onClick={()=>{setMod(m.id);reset();}}
            style={{background:mod===m.id?T.goldDim:T.card,border:`1px solid ${mod===m.id?T.gold:T.border}`,borderRadius:11,padding:'13px 8px',cursor:'pointer',textAlign:'center',transition:'all 0.15s'}}>
            <div style={{fontSize:20,marginBottom:5}}>{m.icon}</div>
            <div style={{color:mod===m.id?T.gold:T.text,fontSize:12,fontWeight:700}}>{m.label}</div>
            <div style={{color:T.textMuted,fontSize:10,marginTop:2,lineHeight:1.4}}>{m.desc}</div>
          </button>
        ))}
      </div>
      {mod==='conteudo'&&!res&&(
        <Card>
          <Lbl>Canal</Lbl>
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            {[['instagram','📸 Instagram'],['linkedin','💼 LinkedIn'],['whatsapp','💬 WhatsApp']].map(([v,l])=><button key={v} onClick={()=>setCanal(v)} style={{flex:1,background:canal===v?T.goldDim:'transparent',border:`1px solid ${canal===v?T.gold:T.border}`,borderRadius:7,padding:'8px 6px',color:canal===v?T.gold:T.textMuted,fontSize:11,cursor:'pointer'}}>{l}</button>)}
          </div>
          <Lbl>Tema jurídico</Lbl>
          <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:14}}>
            {TEMAS.map(t=><button key={t} onClick={()=>setTema(t)} style={{background:tema===t?T.goldDim:T.surface,border:`1px solid ${tema===t?T.gold:T.border}`,borderRadius:7,padding:'6px 11px',color:tema===t?T.gold:T.textMuted,fontSize:11,cursor:'pointer',transition:'all 0.12s'}}>{t}</button>)}
          </div>
          {tema==='Outro tema...'&&<input value={temaCustom} onChange={e=>setTemaCustom(e.target.value)} placeholder="Digite o tema..." style={{...inp,marginBottom:14}}/>}
          <Lbl>Sua cidade — opcional</Lbl>
          <input value={cidade} onChange={e=>setCidade(e.target.value)} placeholder="ex: São Paulo" style={{...inp,marginBottom:14}}/>
          <Err msg={err}/><Btn onClick={gerarConteudo} disabled={loading} style={{width:'100%',padding:13}}>{loading?'⏳ Gerando conteúdo...':'→ Gerar Post Pronto'}</Btn>
        </Card>
      )}
      {mod==='anuncio'&&!res&&(
        <Card>
          <Lbl>Plataforma</Lbl>
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            {[['google','🔍 Google Ads'],['meta','📘 Meta Ads']].map(([v,l])=><button key={v} onClick={()=>setPlataforma(v)} style={{flex:1,background:plataforma===v?T.goldDim:'transparent',border:`1px solid ${plataforma===v?T.gold:T.border}`,borderRadius:7,padding:'9px',color:plataforma===v?T.gold:T.textMuted,fontSize:12,cursor:'pointer'}}>{l}</button>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
            <div><Lbl>Cidade alvo</Lbl><input value={cidadeAnuncio} onChange={e=>setCidadeAnuncio(e.target.value)} placeholder="ex: Curitiba" style={inp}/></div>
            <div><Lbl>Orçamento/mês (R$) — opcional</Lbl><input value={orcamento} onChange={e=>setOrcamento(e.target.value)} placeholder="ex: 500" type="number" style={inp}/></div>
          </div>
          <Err msg={err}/><Btn onClick={gerarAnuncio} disabled={loading} style={{width:'100%',padding:13}}>{loading?'⏳ Gerando anúncio...':'→ Gerar Texto de Anúncio'}</Btn>
        </Card>
      )}
      {mod==='indicacao'&&!res&&(
        <Card>
          <InfoBox>💡 A melhor fonte de novos clientes é quem você já atendeu bem. Esta mensagem pede indicação de forma natural, dentro do EOAB.</InfoBox>
          <Lbl>Nome do ex-cliente</Lbl><input value={nomeEx} onChange={e=>setNomeEx(e.target.value)} placeholder="ex: João Silva" style={{...inp,marginBottom:12}}/>
          <Lbl>Caso que foi atendido — opcional</Lbl><input value={casoEx} onChange={e=>setCasoEx(e.target.value)} placeholder="ex: ganhou horas extras e FGTS após 5 anos" style={{...inp,marginBottom:14}}/>
          <Err msg={err}/><Btn onClick={gerarIndicacao} disabled={loading} style={{width:'100%',padding:13}}>{loading?'⏳ Gerando mensagem...':'→ Gerar Mensagem de Indicação'}</Btn>
        </Card>
      )}
      {res?.tipo==='conteudo'&&(
        <>
          <Card accent={T.gold}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}><Tag color={T.gold}>POST PRONTO</Tag><CopyBtn text={`${res.titulo}\n\n${res.corpo}\n\n${res.hashtags}`}/></div>
            <div style={{color:T.gold,fontSize:15,fontWeight:700,marginBottom:10,fontFamily:'Georgia,serif'}}>{res.titulo}</div>
            <p style={{color:T.text,fontSize:14,lineHeight:1.8,margin:'0 0 12px',whiteSpace:'pre-wrap'}}>{res.corpo}</p>
            <div style={{color:T.textMuted,fontSize:12}}>{res.hashtags}</div>
          </Card>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
            <Card style={{margin:0,background:T.purpleBg,borderColor:`${T.purple}25`}}><Lbl>📣 CTA</Lbl><p style={{color:T.purple,fontSize:13,margin:0,lineHeight:1.5}}>{res.cta}</p></Card>
            <Card style={{margin:0}}><Lbl>⏰ Melhor horário</Lbl><p style={{color:T.textMuted,fontSize:13,margin:0,lineHeight:1.5}}>{res.melhor_horario}</p></Card>
          </div>
          <Btn variant="ghost" onClick={reset} style={{width:'100%'}}>+ Gerar outro</Btn>
        </>
      )}
      {res?.tipo==='anuncio'&&(
        <>
          <Card accent={T.gold}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><Tag color={T.gold}>{plataforma==='google'?'🔍 GOOGLE ADS':'📘 META ADS'}</Tag><CopyBtn text={plataforma==='google'?`${res.titulo_principal}\n${res.descricao}`:`${res.texto_feed}\n${res.headline}`}/></div>
            {plataforma==='google'?(<><div style={{marginBottom:8}}><Lbl>Título (30 chars)</Lbl><div style={{color:T.gold,fontSize:15,fontWeight:700}}>{res.titulo_principal}</div></div><div><Lbl>Descrição (90 chars)</Lbl><div style={{color:T.text,fontSize:13}}>{res.descricao}</div></div></>):(<><div style={{marginBottom:8}}><Lbl>Texto do feed</Lbl><p style={{color:T.text,fontSize:14,margin:0,lineHeight:1.7}}>{res.texto_feed}</p></div><div><Lbl>Headline</Lbl><div style={{color:T.gold,fontSize:15,fontWeight:700}}>{res.headline}</div></div></>)}
          </Card>
          <Card><Lbl>🔑 Palavras-chave</Lbl><div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:12}}>{(res.palavras_chave||[]).map((p,i)=><Tag key={i} color={T.textMuted} bg={T.surface}>{p}</Tag>)}</div><Lbl>🎯 Segmentação</Lbl><p style={{color:T.textMuted,fontSize:13,margin:'0 0 10px'}}>{res.segmentacao}</p><Lbl>💰 Orçamento mínimo</Lbl><p style={{color:T.yellow,fontSize:13,margin:0}}>{res.orcamento_sugerido}</p></Card>
          <Btn variant="ghost" onClick={reset} style={{width:'100%'}}>+ Gerar outro</Btn>
        </>
      )}
      {res?.tipo==='indicacao'&&(
        <>
          <Card accent={T.green}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}><Tag color={T.green}>WHATSAPP</Tag><CopyBtn text={res.mensagem_whatsapp}/></div><p style={{color:T.text,fontSize:14,lineHeight:1.8,margin:0,fontFamily:'Georgia,serif',whiteSpace:'pre-wrap'}}>{res.mensagem_whatsapp}</p></Card>
          <Card accent={T.purple}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}><Tag color={T.purple}>E-MAIL / LINKEDIN</Tag><CopyBtn text={res.mensagem_email}/></div><p style={{color:T.text,fontSize:14,lineHeight:1.8,margin:0,fontFamily:'Georgia,serif'}}>{res.mensagem_email}</p></Card>
          <Card style={{background:T.greenBg,borderColor:`${T.green}22`}}><Lbl>◆ Por que funciona</Lbl><p style={{color:'#8ecfa0',fontSize:13,margin:0,lineHeight:1.6,fontStyle:'italic'}}>{res.por_que_funciona}</p></Card>
          <Btn variant="ghost" onClick={reset} style={{width:'100%'}}>+ Outro cliente</Btn>
        </>
      )}
      {mod==='imagem'&&!imgPost&&(
        <Card>
          <Lbl>Tema do post</Lbl>
          <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:14}}>
            {TEMAS.map(t=><button key={t} onClick={()=>setImgTema(t)} style={{background:imgTema===t?T.goldDim:T.surface,border:`1px solid ${imgTema===t?T.gold:T.border}`,borderRadius:7,padding:'6px 11px',color:imgTema===t?T.gold:T.textMuted,fontSize:11,cursor:'pointer'}}>{t}</button>)}
          </div>
          <input value={imgTemaCustom} onChange={e=>setImgTemaCustom(e.target.value)} placeholder="Ou digite um tema personalizado..." style={{...inp,marginBottom:14}}/>
          <Lbl>Estilo</Lbl>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
            {ESTILOS_IMG.map(e=><button key={e.id} onClick={()=>setImgEstilo(e.id)} style={{background:imgEstilo===e.id?T.goldDim:T.card,border:`1px solid ${imgEstilo===e.id?T.gold:T.border}`,borderRadius:9,padding:'10px 12px',cursor:'pointer',textAlign:'left'}}><div style={{color:imgEstilo===e.id?T.gold:T.text,fontSize:12,fontWeight:700}}>{e.label}</div><div style={{color:T.textMuted,fontSize:10,marginTop:2}}>{e.desc}</div></button>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
            <div><Lbl>Seu nome</Lbl><input value={imgNome} onChange={e=>setImgNome(e.target.value)} placeholder="Dr(a). Seu Nome" style={inp}/></div>
            <div><Lbl>Formato</Lbl><select value={imgFormato} onChange={e=>setImgFormato(e.target.value)} style={sel}><option value="feed">📷 Feed (1:1)</option><option value="story">📱 Story (9:16)</option></select></div>
          </div>
          <Err msg={err}/>
          <Btn onClick={async()=>{
            const t=imgTemaCustom.trim()||imgTema;if(!t){setErr('Escolha ou digite um tema.');return;}setErr('');setLoading(true);
            try{const eObj=ESTILOS_IMG.find(e=>e.id===imgEstilo);const prompt=`Você é especialista em comunicação jurídica para redes sociais. Crie post para advogado. Siga EOAB: sem prometer resultados, tom educativo.\nTema: ${t}\nEstilo: ${eObj.label} — ${eObj.desc}\nNome: ${imgNome||'Dr. Advogado'}\nFormato: ${imgFormato==='feed'?'Feed 1:1':'Story 9:16'}\nRetorne SOMENTE JSON (sem markdown):\n{"titulo":"max 6 palavras","subtitulo":"max 10 palavras","corpo":"2-3 linhas educativas","cta":"max 8 palavras","hashtags":["t1","t2","t3","t4","t5"],"cor_fundo":"hex escuro","cor_destaque":"hex","emoji_principal":"1 emoji"}`;
              const r=await callClaude(prompt,t,1000);setImgPost(r);}catch(e){setErr(e.message);}finally{setLoading(false);}
          }} disabled={loading} style={{width:'100%',padding:14}}>{loading?'⏳ Gerando post...':'→ Gerar Imagem do Post'}</Btn>
        </Card>
      )}
      {mod==='imagem'&&imgPost&&(()=>{
        setTimeout(()=>desenharCanvas(imgPost,imgFormato,imgNome),80);
        const baixar=()=>{const c=document.getElementById('imgCanvas');if(!c) return;const a=document.createElement('a');a.download='post-instagram.png';a.href=c.toDataURL('image/png');a.click();};
        return(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <Tag color={T.green}>POST GERADO</Tag>
              <div style={{display:'flex',gap:8}}>
                <button onClick={baixar} style={{background:T.goldDim,border:`1px solid ${T.goldBorder}`,color:T.gold,borderRadius:7,padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'pointer'}}>⬇ Baixar PNG</button>
                <Btn variant="ghost" onClick={()=>setImgPost(null)} style={{padding:'6px 12px',fontSize:11}}>Novo</Btn>
              </div>
            </div>
            <div style={{textAlign:'center',marginBottom:16}}><canvas id="imgCanvas" style={{maxWidth:'100%',borderRadius:12,boxShadow:'0 4px 24px #00000040'}}/></div>
            <Card>
              <Lbl>Textos para copiar</Lbl>
              {[['Título',imgPost.titulo],['Subtítulo',imgPost.subtitulo],['Corpo',imgPost.corpo],['CTA',imgPost.cta]].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10,marginBottom:8}}>
                  <div><span style={{fontSize:10,color:T.textDim,fontFamily:'monospace'}}>{k}: </span><span style={{fontSize:12,color:T.text}}>{v}</span></div>
                  <CopyBtn text={v}/>
                </div>
              ))}
              <div><span style={{fontSize:10,color:T.textDim,fontFamily:'monospace'}}>Hashtags: </span><span style={{fontSize:12,color:T.blue}}>{(imgPost.hashtags||[]).map(h=>'#'+h).join(' ')}</span></div>
            </Card>
          </div>
        );
      })()}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const TOOLS=[
  {id:'lead',icon:'⚡',label:'1. Lead',sub:'Analisar + fechar'},
  {id:'contrato',icon:'📄',label:'2. Contrato',sub:'Honorários'},
  {id:'crm',icon:'📋',label:'3. CRM',sub:'Pipeline + fichas'},
  {id:'presenca',icon:'📣',label:'4. MKT',sub:'Presença digital'},
  {id:'calc',icon:'🧮',label:'5. Verbas',sub:'Calculadora'},
];

export default function App(){
  const [active,setActive]=useState('lead');
  const [crmKey,setCrmKey]=useState(0);
  return(
    <div style={{minHeight:'100vh',background:T.bg,color:T.text,fontFamily:'sans-serif',display:'flex',flexDirection:'column'}}>
      <div style={{borderBottom:`1px solid ${T.border}`,padding:'12px 18px',display:'flex',alignItems:'center',gap:10,background:T.surface,position:'sticky',top:0,zIndex:100}}>
        <div style={{width:32,height:32,background:`linear-gradient(135deg,${T.gold},#7a5810)`,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>⚖</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:'Georgia, serif',fontSize:16,fontWeight:700,lineHeight:1.2}}>FECHA CONTRATO</div>
          <div style={{fontSize:9,color:T.textDim,fontFamily:'monospace',letterSpacing:'0.1em'}}>INTELIGÊNCIA JURÍDICA · TRABALHISTA · CÍVEL · PREVIDENCIÁRIO</div>
        </div>
      </div>
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,display:'flex',overflowX:'auto',padding:'0 8px'}}>
        {TOOLS.map(t=>(
          <button key={t.id} onClick={()=>setActive(t.id)}
            style={{background:'transparent',border:'none',borderBottom:`2px solid ${active===t.id?T.gold:'transparent'}`,padding:'10px 12px',color:active===t.id?T.gold:T.textMuted,fontSize:11,cursor:'pointer',fontFamily:'monospace',whiteSpace:'nowrap',transition:'all 0.15s',display:'flex',alignItems:'center',gap:5}}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      <div style={{flex:1,maxWidth:700,width:'100%',margin:'0 auto',padding:'28px 18px 60px'}}>
        {active==='lead'&&<ToolLead onSaveCRM={()=>setCrmKey(k=>k+1)}/>}
        {active==='contrato'&&<ToolContrato/>}
        {active==='crm'&&<ToolCRM key={crmKey}/>}
        {active==='presenca'&&<ToolPresenca/>}
        {active==='calc'&&<ToolCalc/>}
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
