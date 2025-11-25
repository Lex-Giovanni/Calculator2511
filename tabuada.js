class Tabuada {
  constructor() {
    this.currentNumber = 5;
    this.initializeElements();
    this.generateQuickButtons();
    this.bindEvents();
    this.generateTable();
  }

  initializeElements() {
    this.numberInput = document.getElementById("numberInput");
    this.tabuadaTitle = document.getElementById("tabuadaTitle");
    this.tabuadaList = document.getElementById("tabuadaList");
    this.numberButtons = document.getElementById("numberButtons");
  }

  generateQuickButtons() {
    const buttonsHTML = [];
    for (let i = 1; i <= 10; i++) {
      const isActive = i === this.currentNumber ? "active" : "";
      buttonsHTML.push(`
                <button class="number-btn ${isActive}" onclick="tabuada.selectNumber(${i})">
                    ${i}
                </button>
            `);
    }
    this.numberButtons.innerHTML = buttonsHTML.join("");
  }

  bindEvents() {
    this.numberInput.addEventListener("input", (e) => {
      let value = parseInt(e.target.value);

      if (isNaN(value) || value < 1) {
        value = 1;
      } else if (value > 99999) {
        value = 99999;
      }

      this.currentNumber = value;
      this.updateActiveButton();
      this.generateTable();
    });

    this.numberInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.target.blur();
      }
    });

    // Prevenir caracteres não numéricos
    this.numberInput.addEventListener("keypress", (e) => {
      if (
        !/[0-9]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight"
      ) {
        e.preventDefault();
      }
    });
  }

  selectNumber(number) {
    this.currentNumber = number;
    this.numberInput.value = number;
    this.updateActiveButton();
    this.generateTable();
  }

  updateActiveButton() {
    document.querySelectorAll(".number-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    const activeBtn = document.querySelector(
      `[onclick="tabuada.selectNumber(${this.currentNumber})"]`
    );
    if (activeBtn) {
      activeBtn.classList.add("active");
    }
  }

  generateTable() {
    this.tabuadaTitle.textContent = `Tabuada do ${this.currentNumber}`;

    const tableHTML = [];
    for (let i = 1; i <= 10; i++) {
      const result = this.currentNumber * i;
      const isEven = i % 2 === 0;
      tableHTML.push(`
                <div class="tabuada-item" style="background-color: ${
                  isEven ? "#F3F4F6" : "#F9FAFB"
                }">
                    ${this.currentNumber} × ${i} = <strong>${result}</strong>
                </div>
            `);
    }

    this.tabuadaList.style.opacity = "0";
    setTimeout(() => {
      this.tabuadaList.innerHTML = tableHTML.join("");
      this.tabuadaList.style.opacity = "1";
    }, 150);
  }

  generateCustomTable(min = 1, max = 10) {
    const tableHTML = [];
    for (let i = min; i <= max; i++) {
      const result = this.currentNumber * i;
      tableHTML.push(`
                <div class="tabuada-item">
                    ${this.currentNumber} × ${i} = <strong>${result}</strong>
                </div>
            `);
    }
    return tableHTML.join("");
  }

  saveFavorite() {
    try {
      const favorites = JSON.parse(
        localStorage.getItem("tabuadaFavorites") || "[]"
      );
      if (!favorites.includes(this.currentNumber)) {
        favorites.push(this.currentNumber);
        localStorage.setItem("tabuadaFavorites", JSON.stringify(favorites));
      }
    } catch (e) {
      console.warn("Não foi possível salvar nos favoritos:", e);
    }
  }

  exportTable() {
    const table = [];
    table.push(`Tabuada do ${this.currentNumber}`);
    table.push("========================");

    for (let i = 1; i <= 10; i++) {
      const result = this.currentNumber * i;
      table.push(`${this.currentNumber} × ${i} = ${result}`);
    }

    const text = table.join("\n");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showExportMessage("Tabuada copiada para a área de transferência!");
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      this.showExportMessage("Tabuada copiada para a área de transferência!");
    }
  }

  showExportMessage(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .tabuada-list {
        transition: opacity 0.15s ease-in-out;
    }
`;
document.head.appendChild(style);

let tabuada;
document.addEventListener("DOMContentLoaded", () => {
  tabuada = new Tabuada();
});

document.addEventListener(
  "touchstart",
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);
