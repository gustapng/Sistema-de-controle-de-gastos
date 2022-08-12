class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados () {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0) //chave e valor
        }
    }

    getProximoId() {
        let proxId = localStorage.getItem('id') // null pq não tem o dado id
        return parseInt(proxId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    RecuperarTodosRegistros() {
        //array de despesas
        let despesas = []

        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradas em local storage
        for(let i = 1; i <= id; i++) {
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possibilidade de haver índices que foram pulados ou removidos
            //nesse caso nós vamos literalmente pular esses índices
            if(despesa === null) {
                continue
            }
            
            despesa.id = i
            despesas.push(despesa);
        }
        
       return despesas;
        
    }

    pesquisar(despesa) {
        let DespesasFiltradas = []
        DespesasFiltradas = this.RecuperarTodosRegistros()
        //ano
        if(despesa.ano != '') {
            DespesasFiltradas = DespesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != '') {
            DespesasFiltradas = DespesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != '') {

            DespesasFiltradas = DespesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != '') {

            DespesasFiltradas = DespesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if(despesa.descricao != '') {

            DespesasFiltradas = DespesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != '') {

            DespesasFiltradas = DespesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        
        return DespesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastraDespesa () {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {
        bd.gravar(despesa)

        // dialog de sucesso

        document.querySelector('.modal-title').innerHTML= 'Registro inserido com sucesso'
        document.querySelector('.modal-title').classList.add('text-success')
        document.querySelector('.modal-body').innerHTML= 'Despesa foi cadastrada com sucesso!'
        document.querySelector('.btn-registra').innerHTML= 'Voltar'
        document.querySelector('.btn-registra').classList.add('btn-success')
        
        $('#ModalRegistraDespesa').modal('show')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        // dialog de erro

        document.querySelector('.modal-title').innerHTML= 'Erro na gravação'
        document.querySelector('.modal-title').classList.add('text-danger')
        document.querySelector('.modal-body').innerHTML= 'Existem campos obrigatórios que não foram preenchidos'
        document.querySelector('.btn-registra').innerHTML= 'Fechar'
        document.querySelector('.btn-registra').classList.add('btn-danger')
        
        $('#ModalRegistraDespesa').modal('show')
    }
    
    
}

function CarregaListaDespesas (despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false) {
        despesas = bd.RecuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById('lista-despesas')
    listaDespesas.innerHTML = ''
    /*
    <tr>
        <th>Data</th>
        <th>Tipo</th>
        <th>Descrição</th>
        <th>Valor</th>
        <th></th>
    </tr>*/

    //percorrer o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d) {
        //criando o tr
        let linha = listaDespesas.insertRow()

        //criar colunas td
        linha.insertCell(0).innerHTML= `${d.dia}/${d.mes}/${d.ano}`
        
        // ajusta o tipo
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML= d.tipo

        linha.insertCell(2).innerHTML= d.descricao
        linha.insertCell(3).innerHTML= d.valor
        //criar botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function () {
            //remover despesa
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)

            //dar reload na página para exibir do dados atualizados
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}

function PesquisarDespesas () {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    CarregaListaDespesas(despesas, true)

    bd.pesquisar(despesa)
}