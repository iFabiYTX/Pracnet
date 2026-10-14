document.addEventListener('DOMContentLoaded', () => {
    // 1. Auto-formato de RUT chileno en inputs con id="rut"
    const rutInput = document.getElementById('rut');
    if (rutInput) {
        rutInput.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
            if (valor.length > 1) {
                let cuerpo = valor.slice(0, -1);
                let dv = valor.slice(-1);
                // Invertir para agregar puntos
                let rev = cuerpo.split('').reverse().join('');
                let partes = [];
                for (let i = 0; i < rev.length; i += 3) {
                    partes.push(rev.slice(i, i + 3));
                }
                let formateado = partes.join('.').split('').reverse().join('');
                e.target.value = `${formateado}-${dv}`;
            } else {
                e.target.value = valor;
            }
        });
    }

    // 2. Chatbot Asistente AI en módulo Estudiante
    const aiBtn = document.getElementById('btn-open-ai');
    const aiModal = document.getElementById('ai-modal');
    const aiClose = document.getElementById('btn-close-ai');
    const aiForm = document.getElementById('ai-form');
    const aiInput = document.getElementById('ai-input');
    const aiChatBox = document.getElementById('ai-chat-box');

    if (aiBtn && aiModal) {
        aiBtn.addEventListener('click', () => {
            aiModal.classList.add('active');
        });
    }
    if (aiClose && aiModal) {
        aiClose.addEventListener('click', () => {
            aiModal.classList.remove('active');
        });
    }

    if (aiForm && aiInput && aiChatBox) {
        aiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pregunta = aiInput.value.trim();
            if (!pregunta) return;

            // Agregar mensaje del usuario
            const userMsg = document.createElement('div');
            userMsg.style.cssText = 'background: #e0f2fe; padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; align-self: flex-end; max-width: 80%; font-size: 0.85rem;';
            userMsg.textContent = pregunta;
            aiChatBox.appendChild(userMsg);
            aiInput.value = '';
            aiChatBox.scrollTop = aiChatBox.scrollHeight;

            // Enviar a backend
            try {
                const res = await fetch('/estudiante/asistente-ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pregunta })
                });
                const data = await res.json();

                const botMsg = document.createElement('div');
                botMsg.style.cssText = 'background: #f1f5f9; padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; align-self: flex-start; max-width: 80%; font-size: 0.85rem; border-left: 3px solid #1e5bb0;';
                botMsg.textContent = data.respuesta;
                aiChatBox.appendChild(botMsg);
                aiChatBox.scrollTop = aiChatBox.scrollHeight;
            } catch (err) {
                console.error(err);
            }
        });
    }
});

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}
