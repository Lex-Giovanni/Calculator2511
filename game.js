// 🎮 ALEATÓRIO - Jogo do Número Secreto
// Vamos criar um jogo simples e divertido!

// === VARIÁVEIS GLOBAIS ===
// São como "caixas" que guardam informações importantes
let numeroSecreto = 0;          // O número que o Aleatório escolheu
let tentativas = 0;             // Quantas vezes o jogador tentou
let tentativasMaximas = 10;     // Limite de tentativas
let jogoTerminado = false;      // Se o jogo acabou ou não
let palpitesFeitos = [];        // Lista de todos os palpites

// === CONFIGURAÇÕES DO JOGO ===
const CONFIGURACOES = {
    numeroMinimo: 1,           // Menor número possível
    numeroMaximo: 100,         // Maior número possível
    maxTentativas: 10          // Quantas chances o jogador tem
};

// === INICIALIZAÇÃO DO JOGO ===
// Esta função roda quando a página carrega
function inicializarJogo() {
    console.log('🤖 Iniciando o jogo Aleatório...');
    
    // Configurar as variáveis iniciais
    numeroSecreto = gerarNumeroSecreto();
    tentativas = 0;
    jogoTerminado = false;
    palpitesFeitos = [];
    
    // Atualizar a interface
    atualizarInterface();
    mostrarMensagemAleatorio('Oi! Eu sou o Aleatório! Escolhi um número de 1 a 100. Consegue adivinhar qual é?');
    
    console.log('🎯 Número secreto gerado:', numeroSecreto);
}

// === GERAR NÚMERO SECRETO ===
// Cria um número aleatório entre 1 e 100
function gerarNumeroSecreto() {
    // Math.random() gera um número entre 0 e 1
    // Math.floor() arredonda para baixo
    // O +1 faz começar do 1 em vez do 0
    return Math.floor(Math.random() * 100) + 1;
}

// === ATUALIZAR INTERFACE ===
// atualiza todos os elementos da tela
function atualizarInterface() {
    // Atualizar contador de tentativas
    document.getElementById('currentAttempt').textContent = tentativas + 1;
    document.getElementById('maxAttempts').textContent = tentativasMaximas;
    
    // Atualizar campo de entrada
    const campo = document.getElementById('guessInput');
    campo.value = '';
    campo.placeholder = tentativas === 0 ? '?' : 'próximo?';
    campo.disabled = jogoTerminado;
    
    // Atualizar botão
    const botao = document.getElementById('guessButton');
    botao.disabled = jogoTerminado;
    botao.textContent = jogoTerminado ? '🎮 Jogo Finalizado' : '🔍 Adivinhar!';
    
    // Atualizar histórico
    mostrarHistorico();
}

// === FAZER PALPITE ===
// Esta função é chamada quando o jogador aperta o botão "Adivinhar"
function fazerPalpite() {
    // Verificar se o jogo já terminou
    if (jogoTerminado) {
        alert('🤖 O jogo já terminou! Clique em "Novo Jogo" para jogar novamente.');
        return;
    }
    
    // Pegar o número que o jogador digitou
    const palpite = parseInt(document.getElementById('guessInput').value);
    
    // Verificar se é um número válido
    if (!palpite || palpite < CONFIGURACOES.numeroMinimo || palpite > CONFIGURACOES.numeroMaximo) {
        mostrarMensagemAleatorio(`🤖 Ei! Digite um número válido entre ${CONFIGURACOES.numeroMinimo} e ${CONFIGURACOES.numeroMaximo}!`);
        document.getElementById('guessInput').focus();
        return;
    }
    
    // Verificar se já tentou esse número
    if (palpitesFeitos.includes(palpite)) {
        mostrarMensagemAleatorio('🤖 Hey! Você já tentou esse número antes! Tente outro!');
        document.getElementById('guessInput').focus();
        return;
    }
    
    // Adicionar à lista de palpites
    palpitesFeitos.push(palpite);
    tentativas++;
    
    // Analisar o palpite
    analizarPalpite(palpite);
}

// === ANALISAR PALPITE ===
// Compara o palpite com o número secreto e dá feedback
function analizarPalpite(palpite) {
    let feedback = '';
    let tipo = '';
    
    // Comparar com o número secreto
    if (palpite === numeroSecreto) {
        // ACERTOU!
        feedback = `🎉 PERFEITO! Você descobriu meu número secreto!`;
        tipo = 'perfeito';
        mostrarModalVitoria();
        jogoTerminado = true;
        
    } else if (Math.abs(palpite - numeroSecreto) <= 3) {
        // Muito quente
        feedback = `🔥 MUITO QUENTE! Estás super perto!`;
        tipo = 'hot';
        
    } else if (Math.abs(palpite - numeroSecreto) <= 5) {
        // Quente
        feedback = `🌡️ QUENTE! Cada vez mais perto!`;
        tipo = 'warm';
        
    } else if (Math.abs(palpite - numeroSecreto) <= 10) {
        // Morno
        feedback = `🌤️ MORNO... Está heating up!`;
        tipo = 'warm';
        
    } else if (Math.abs(palpite - numeroSecreto) <= 20) {
        // Frio
        feedback = `❄️ FRIO! Tá longe, mas tentando!`;
        tipo = 'cold';
        
    } else {
        // Muito frio
        feedback = `🧊 MUITO FRIO! Estou riindo aqui!`;
        tipo = 'cold';
    }
    
    // Mostrar a resposta do Aleatório
    mostrarMensagemAleatorio(feedback);
    
    // Adicionar ao histórico
    adicionarAoHistorico(palpite, feedback, tipo);
    
    // Verificar se as tentativas acabaram
    if (tentativas >= tentativasMaximas && !jogoTerminado) {
        mostrarModalDerrota();
        jogoTerminado = true;
    }
    
    // Atualizar a interface
    atualizarInterface();
}

// === MOSTRAR MENSAGEM DO ALEATÓRIO ===
// Mostra as mensagens do personagem Aleatório
function mostrarMensagemAleatorio(mensagem) {
    const elemento = document.getElementById('aleatorioMessage');
    elemento.textContent = mensagem;
}

// === ADICIONAR AO HISTÓRICO ===
// Adiciona um palpite ao histórico visual
function adicionarAoHistorico(numero, feedback, tipo) {
    // Esta função é bem simples - só vai adicionar uma linha no histórico
    console.log(`📝 Palpite ${numero}: ${feedback}`);
}

// === MOSTRAR HISTÓRICO ===
// Atualiza a lista visual de palpites
function mostrarHistorico() {
    const lista = document.getElementById('historyList');
    
    if (palpitesFeitos.length === 0) {
        lista.innerHTML = '<div class="history-empty">Nenhum palpite ainda... Vamos começar!</div>';
        return;
    }
    
    // Criar HTML para cada palpite
    let html = '';
    for (let i = palpitesFeitos.length - 1; i >= 0; i--) {
        const palpite = palpitesFeitos[i];
        const distancia = Math.abs(palpite - numeroSecreto);
        let tipo = 'cold';
        let feedback = '';
        
        if (palpite === numeroSecreto) {
            tipo = 'perfeito';
            feedback = '🎯 PERFEITO!';
        } else if (distancia <= 3) {
            tipo = 'hot';
            feedback = '🔥 MUITO QUENTE!';
        } else if (distancia <= 5) {
            tipo = 'warm';
            feedback = '🌡️ QUENTE!';
        } else if (distancia <= 10) {
            tipo = 'warm';
            feedback = '🌤️ MORNO...';
        } else if (distancia <= 20) {
            tipo = 'cold';
            feedback = '❄️ FRIO!';
        } else {
            tipo = 'cold';
            feedback = '🧊 MUITO FRIO!';
        }
        
        html += `
            <div class="guess-item ${tipo}">
                <span class="guess-number">${palpite}</span>
                <span class="guess-feedback">${feedback}</span>
            </div>
        `;
    }
    
    lista.innerHTML = html;
}

// === NOVO JOGO ===
// Reinicia o jogo com um novo número
function novoJogo() {
    console.log('🎮 Iniciando novo jogo...');
    
    // Fechar modal se estiver aberto
    fecharModal();
    
    // Reiniciar jogo
    inicializarJogo();
}

// === DICA ===
// Dá uma ajuda para o jogador
function darDica() {
    if (jogoTerminado) {
        mostrarMensagemAleatorio('🤖 O jogo já acabou! Clique em "Novo Jogo" para uma nova partida!');
        return;
    }
    
    // Dar uma dica baseada na tentativa
    if (tentativas === 0) {
        mostrarMensagemAleatorio('💡 Dica: Tente começar pelo meio! Que tal 50?');
    } else if (tentativas <= 2) {
        mostrarMensagemAleatorio('💡 Dica: Seu número está entre 1 e 100. Use a lógica dos palpites anteriores!');
    } else if (tentativas <= 5) {
        const ultimoPalpite = palpitesFeitos[palpitesFeitos.length - 1];
        const distancia = Math.abs(ultimoPalpite - numeroSecreto);
        if (distancia > 10) {
            mostrarMensagemAleatorio('💡 Dica: Se o último palpite estava frio, tente ir para o outro lado!');
        } else {
            mostrarMensagemAleatorio('💡 Dica: Você está perto! Tente números próximos ao seu último palpite!');
        }
    } else {
        mostrarMensagemAleatorio('💡 Dica: Restam poucas tentativas! Pense bem antes de escolher!');
    }
}

// === MOSTRAR MODAL DE VITÓRIA ===
function mostrarModalVitoria() {
    const modal = document.getElementById('gameModal');
    const titulo = document.getElementById('modalTitle');
    const mensagem = document.getElementById('modalMessage');
    const numero = document.getElementById('secretNumber');
    const tentativasUsadas = document.getElementById('attemptsUsed');
    
    titulo.textContent = '🎉 PARABÉNS!';
    numero.textContent = numeroSecreto;
    tentativasUsadas.textContent = tentativas;
    
    if (tentativas <= 3) {
        mensagem.innerHTML = '🚀 <strong>MAGNÍFICO!</strong> Você é um verdadeiro caçador de números!';
    } else if (tentativas <= 6) {
        mensagem.innerHTML = '⭐ <strong>EXCELENTE!</strong> Você descobriu rápido demais!';
    } else {
        mensagem.innerHTML = '🎯 <strong>BEM FEITO!</strong> Conseguiu descobrir o número secreto!';
    }
    
    modal.style.display = 'block';
}

// === MOSTRAR MODAL DE DERROTA ===
function mostrarModalDerrota() {
    const modal = document.getElementById('gameModal');
    const titulo = document.getElementById('modalTitle');
    const mensagem = document.getElementById('modalMessage');
    const numero = document.getElementById('secretNumber');
    const tentativasUsadas = document.getElementById('attemptsUsed');
    
    titulo.textContent = '😵 GAME OVER';
    numero.textContent = numeroSecreto;
    tentativasUsadas.textContent = tentativas;
    mensagem.innerHTML = `😅 <strong>Quase lá!</strong> O número secreto era <strong>${numeroSecreto}</strong>. Tente novamente!`;
    
    modal.style.display = 'block';
}

// === FECHAR MODAL ===
function fecharModal() {
    const modal = document.getElementById('gameModal');
    modal.style.display = 'none';
}

// === CONFIGURAR EVENTOS ===
// Conecta os botões às suas funções
function configurarEventos() {
    // Botão de adivinhar
    const botaoAdivinhar = document.getElementById('guessButton');
    botaoAdivinhar.addEventListener('click', fazerPalpite);
    
    // Campo de entrada - aperte Enter para adivinhar
    const campo = document.getElementById('guessInput');
    campo.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            fazerPalpite();
        }
    });
    
    // Botão de novo jogo
    const botaoNovoJogo = document.getElementById('newGameButton');
    botaoNovoJogo.addEventListener('click', novoJogo);
    
    // Botão de dica
    const botaoDica = document.getElementById('hintButton');
    botaoDica.addEventListener('click', darDica);
    
    // Fechar modal clicando fora
    const modal = document.getElementById('gameModal');
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            fecharModal();
        }
    });
}

// === INICIAR JOGO QUANDO A PÁGINA CARREGAR ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página carregada! Iniciando Aleatório...');
    
    // Configurar eventos
    configurarEventos();
    
    // Iniciar o jogo
    inicializarJogo();
    
    console.log('✅ Jogo pronto para começar!');
});

// === FUNÇÕES EXTRAS PARA DEBUG ===
// Estas funções ajudam a testar o jogo
function mostrarNumeroSecreto() {
    alert(`🤫 O número secreto é: ${numeroSecreto}`);
}

function forcarVitoria() {
    palpitesFeitos.push(numeroSecreto);
    analisarPalpite(numeroSecreto);
}

// Você pode usar essas funções no console do navegador para testar!
// Ctrl+F12 → Console → Digite: mostrarNumeroSecreto()