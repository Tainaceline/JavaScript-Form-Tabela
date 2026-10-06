const form = document.querySelector('#form-vaga');
const listaVagas = document.querySelector('#lista-vagas');
const contadorVagas = document.querySelector('#contador-vagas');
const feedback = document.querySelector('#form-feedback');
const chaveArmazenamento = 'estagio-aberto-vagas';

function criarCelula(texto) {
    const celula = document.createElement('td');
    celula.textContent = texto;
    return celula;
}

function criarLinha(vaga) {
    const linha = document.createElement('tr');
    const celulaVaga = criarCelula(vaga.vaga);
    const titulo = document.createElement('strong');
    titulo.textContent = vaga.vaga;
    const area = document.createElement('span');
    area.className = 'area-vaga';
    area.textContent = vaga.area;
    celulaVaga.replaceChildren(titulo, area);

    linha.append(
        celulaVaga,
        criarCelula(vaga.empresa),
        criarCelula(vaga.localizacao),
        criarCelula(vaga.modalidade)
    );

    const celulaContato = document.createElement('td');
    const link = document.createElement('a');
    const contato = vaga.contato.trim();
    link.href = contato.includes('@') ? `mailto:${contato}` : contato;
    link.textContent = 'Candidatar-se ↗';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    celulaContato.append(link);
    linha.append(celulaContato);
    return linha;
}

function atualizarTabela(vagas) {
    listaVagas.replaceChildren();
    contadorVagas.textContent = `${vagas.length} ${vagas.length === 1 ? 'vaga' : 'vagas'}`;

    if (vagas.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.className = 'empty-row';
        const mensagem = document.createElement('td');
        mensagem.colSpan = 5;
        mensagem.textContent = 'Ainda não há vagas divulgadas. Seja a primeira empresa a publicar!';
        linhaVazia.append(mensagem);
        listaVagas.append(linhaVazia);
        return;
    }

    vagas.forEach((vaga) => listaVagas.append(criarLinha(vaga)));
}

function contatoValido(contato) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato)) {
        return true;
    }

    try {
        const url = new URL(contato);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

let vagas = [];
try {
    const vagasSalvas = localStorage.getItem(chaveArmazenamento);
    if (vagasSalvas) {
        const dados = JSON.parse(vagasSalvas);
        if (!Array.isArray(dados)) {
            throw new Error('Os dados salvos não estão no formato esperado.');
        }
        vagas = dados;
    }
} catch {
    feedback.textContent = 'Não foi possível recuperar as vagas salvas neste navegador.';
}

atualizarTabela(vagas);

form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    feedback.textContent = '';

    if (!form.reportValidity()) {
        return;
    }

    const dadosForm = new FormData(form);
    const contato = dadosForm.get('contato').trim();
    if (!contatoValido(contato)) {
        feedback.textContent = 'Informe um e-mail válido ou um link iniciado por http:// ou https://.';
        form.elements.contato.focus();
        return;
    }

    const novaVaga = {
        empresa: dadosForm.get('empresa').trim(),
        vaga: dadosForm.get('vaga').trim(),
        area: dadosForm.get('area').trim(),
        localizacao: dadosForm.get('localizacao').trim(),
        modalidade: dadosForm.get('modalidade'),
        contato
    };

    vagas.unshift(novaVaga);
    atualizarTabela(vagas);

    try {
        localStorage.setItem(chaveArmazenamento, JSON.stringify(vagas));
        feedback.textContent = 'Vaga publicada com sucesso!';
    } catch {
        feedback.textContent = 'Vaga publicada, mas não foi possível salvá-la neste navegador.';
    }

    form.reset();
});
