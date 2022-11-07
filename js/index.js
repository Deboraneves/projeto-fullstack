// MÉTODO POST
const adicionarCarrinho = (produto) => {
    const item = produto.parentNode.parentNode.parentNode

    //Informações do produto
    let nome = item.querySelector('.title').innerText
    let imagem = item.querySelector('img').getAttribute('src')
    let valor = item.querySelector('.value').innerText
    valor = valor.split(' ')[1]
    let quantidade = 1

    $.ajax({
        method: "POST",
        url: `http://localhost:9000/carrinho`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        cache: false,
        dataType: "json",
        data: JSON.stringify({
            produto: nome,
            preco: parseFloat(valor),
            quantidade: quantidade,
            imagem: imagem
        }),
        complete: () => {
            location.reload()
        }
    })
}

const excluiProdutoCarrinho = (produto) => {
    const elemento = produto.parentNode.parentNode
    let id = parseInt(elemento.id)

    $.ajax({
        method: "DELETE",
        url: `http://localhost:9000/carrinho/${id}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        cache: false,
        complete: () => {
            elemento.remove();
            $('#produtoExcluido').removeClass('.d-none')
        }
    })

}

// MÉTODO PUT
const atualizaQuantidade = (item) => {
    const e = item.parentNode.parentNode

    const id = parseInt(e.id)
    const imagem = e.querySelector('img').getAttribute('src')
    const quantidade = parseInt(item.value)
    const nome = e.querySelector('.nome').innerText

    const valor = parseFloat(e.querySelector('.total').innerText.split(' ')[1].split('.').join(''))
    const total = valor * quantidade
    e.querySelector('.total').innerText = total

    $.ajax({
        method: "PUT",
        url: `http://localhost:9000/carrinho`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        cache: false,
        dataType: "json",
        data: JSON.stringify({
            id: id,
            produto: nome,
            preco: total,
            quantidade: quantidade,
            imagem: imagem
        }),
        complete: () => {

        }
    })

}

jQuery(function () {

    // MÉTODO GET
    $.get("http://localhost:9000/carrinho", function (data) {
        var dados = data

        if(dados == 0){

            var carrinhoVazio = `
            <div class="d-flex justify-content-center">
                CARRINHO VAZIO
            </div>
            `
            $('table').remove()
            $('#carrinhoVazio').append(carrinhoVazio)

        }else{

            for (i = 0; i <= dados.length; i++) {

                var tabelaProdutos = `
                <tr id="${data[i].id}">
                    <td class="w-25">
                      <img src="${data[i].imagem}" class="img-fluid img-thumbnail" alt="Sheep">
                    </td>
                    <td class='nome'>${data[i].produto}</td>
                    <td>R$ ${data[i].preco}</td>
                    <td class="qty">
                        <input type="text" class="form-control" onfocusout="atualizaQuantidade(this)" value="${data[i].quantidade}">
                    </td>
                    <td class="total">R$ ${data[i].preco}</td>
                    <td>
                      <a href="#" class="btn btn-danger btn-sm" onclick="excluiProdutoCarrinho(this)">
                        <i class="fa fa-times"></i>
                      </a>
                    </td>
                  </tr>
            `
                $('#carrinho').append(tabelaProdutos)
            }            

        }

    })

})