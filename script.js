
const botao = document.querySelector('#botao')
botao.addEventListener('click', function clicar(){

    const nome = document.querySelector("#nome").value;
    const email = document.querySelector('#email').value;
    const zap = document.querySelector('#zap').value;


    let linha = document.createElement('tr')
    let coluna_nome = document.createElement('td')
    let coluna_email = document.createElement('td')
    let coluna_zap = document.createElement('td')

    coluna_nome.textContent=nome
    coluna_email.textContent=email
    coluna_zap.textContent=zap

    linha.appendChild(coluna_nome)
    linha.appendChild(coluna_email)
    linha.appendChild(coluna_zap)

    const tabela = document.querySelector('#tabela')
    tabela.appendChild(linha)

})
