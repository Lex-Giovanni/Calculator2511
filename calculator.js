// Calculadora Simples - JavaScript
class Calculator {
    constructor() {
        console.log('Inicializando calculadora...');
        
        this.currentNumber = '0';
        this.previousNumber = '';
        this.operator = '';
        this.shouldResetDisplay = false;
        this.history = this.loadHistory();
        
        if (!this.initializeElements()) {
            console.error('Falha ao encontrar elementos da calculadora');
            return;
        }
        
        console.log('Elementos da calculadora encontrados');
        this.bindEvents();
        this.renderHistory();
        console.log('Calculadora inicializada com sucesso');
    }

    initializeElements() {
        this.expressionEl = document.getElementById('expression');
        this.resultEl = document.getElementById('result');
        this.historyListEl = document.getElementById('historyList');
        
        if (!this.expressionEl || !this.resultEl || !this.historyListEl) {
            console.error('Elementos da calculadora não encontrados!');
            return false;
        }
        return true;
    }

    bindEvents() {
        const buttons = document.querySelectorAll('.btn');
        console.log(`Configurando ${buttons.length} botões da calculadora`);
        
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = e.target.getAttribute('data-value');
                const action = e.target.getAttribute('data-action');
                
                if (value) {
                    console.log('Digitando número:', value);
                    this.inputNumber(value);
                } else if (action) {
                    console.log('Executando ação:', action);
                    this.handleAction(action);
                }
            });
        });

        console.log('Configurando listener de teclado');
        document.addEventListener('keydown', (e) => {
            console.log('Tecla pressionada:', e.key);
            this.handleKeyboard(e);
        });
    }

    handleKeyboard(e) {
        const key = e.key;
        
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Números e vírgula
        if (/[0-9]/.test(key)) {
            e.preventDefault();
            this.inputNumber(key);
        } else if (key === ',' || key === '.') {
            e.preventDefault();
            this.inputNumber(',');
        } 
        // Operadores
        else if (key === '+') {
            e.preventDefault();
            this.inputOperator('+');
        } else if (key === '-') {
            e.preventDefault();
            this.inputOperator('-');
        } else if (key === '*') {
            e.preventDefault();
            this.inputOperator('×');
        } else if (key === '/') {
            e.preventDefault();
            this.inputOperator('÷');
        }
        // Ações especiais
        else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            this.calculate();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            e.preventDefault();
            this.clear();
        } else if (key === 'Backspace') {
            e.preventDefault();
            this.backspace();
        }
    }

    inputNumber(number) {
        if (number === ',' && this.currentNumber.includes(',')) {
            return;
        }
        
        if (this.shouldResetDisplay) {
            this.currentNumber = this.currentNumber === '0' && number !== ',' ? number : this.currentNumber + number;
            this.shouldResetDisplay = false;
        } else {
            if (this.currentNumber === '0' && number !== ',') {
                this.currentNumber = number;
            } else {
                this.currentNumber = this.currentNumber + number;
            }
        }
        this.updateDisplay();
    }

    inputOperator(operator) {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }
        
        this.previousNumber = this.currentNumber;
        this.operator = operator;
        this.shouldResetDisplay = true;
        this.updateExpression();
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'sqrt':
                this.squareRoot();
                break;
            case 'percent':
                this.percentage();
                break;
            case 'equals':
                this.calculate();
                break;
        }
    }

    clear() {
        this.currentNumber = '0';
        this.previousNumber = '';
        this.operator = '';
        this.shouldResetDisplay = false;
        this.updateDisplay();
        this.updateExpression();
        this.resultEl.style.color = '#111827'; 
    }

    backspace() {
        if (this.currentNumber.length > 1) {
            this.currentNumber = this.currentNumber.slice(0, -1);
        } else {
            this.currentNumber = '0';
        }
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    calculate() {
        if (!this.operator || this.shouldResetDisplay) return;

        const prev = parseFloat(this.previousNumber.replace(',', '.'));
        const current = parseFloat(this.currentNumber.replace(',', '.'));
        
        if (isNaN(prev) || isNaN(current)) return;

        let result;
        const expression = `${this.previousNumber} ${this.operator} ${this.currentNumber}`;

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError('Divisão por zero');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        const formattedResult = this.formatResult(result);
        
        this.addToHistory(expression, formattedResult);
        
        this.currentNumber = formattedResult;
        this.operator = '';
        this.previousNumber = '';
        this.shouldResetDisplay = true;
        
        this.updateDisplay();
        this.updateExpression();
    }

    squareRoot() {
        const current = parseFloat(this.currentNumber.replace(',', '.'));
        
        if (isNaN(current)) return;
        
        if (current < 0) {
            this.showError('Número negativo');
            return;
        }

        const result = Math.sqrt(current);
        const formattedResult = this.formatResult(result);
        
        this.addToHistory(`√${this.currentNumber}`, formattedResult);
        
        this.currentNumber = formattedResult;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    percentage() {
        const current = parseFloat(this.currentNumber.replace(',', '.'));
        
        if (isNaN(current)) return;

        const result = current / 100;
        const formattedResult = this.formatResult(result);
        
        this.addToHistory(`${this.currentNumber}%`, formattedResult);
        
        this.currentNumber = formattedResult;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    formatResult(result) {
        if (Math.abs(result) < 1e-10) {
            return '0';
        }
        
        if (Math.abs(result - Math.round(result)) < 1e-10) {
            return Math.round(result).toString();
        }
        
        let formatted = parseFloat(result.toFixed(10)).toString();
        
        return formatted.replace('.', ',');
    }

    addToHistory(expression, result) {
        const historyItem = {
            expression,
            result,
            timestamp: new Date().toLocaleString('pt-BR')
        };
        
        this.history.unshift(historyItem);
        
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('calculatorHistory');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        } catch (e) {
            console.warn('Não foi possível salvar o histórico:', e);
        }
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyListEl.innerHTML = '<div class="history-empty">Nenhum cálculo ainda</div>';
            return;
        }

        const historyHTML = this.history.map(item => `
            <div class="history-item" onclick="calculator.useHistoryResult('${item.result}')">
                <div class="history-expression">${item.expression} =</div>
                <div class="history-result">${item.result}</div>
            </div>
        `).join('');

        this.historyListEl.innerHTML = historyHTML;
    }

    useHistoryResult(result) {
        this.currentNumber = result;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
    }

    updateDisplay() {
        this.resultEl.textContent = this.currentNumber;
    }

    updateExpression() {
        if (this.operator) {
            this.expressionEl.textContent = `${this.previousNumber} ${this.operator}`;
        } else {
            this.expressionEl.textContent = '';
        }
    }

    showError(message) {
        this.resultEl.textContent = message;
        this.resultEl.style.color = '#EF4444';
        
        setTimeout(() => {
            this.resultEl.style.color = '#111827';
            this.clear();
        }, 2000);
    }
}
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new Calculator();
    
    const clearHistoryBtn = document.getElementById('clearHistory');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            calculator.clearHistory();
        });
    }
});

// Prevenir zoom em dispositivos móveis ao dar duplo toque
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);