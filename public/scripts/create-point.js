//######################## Dados da entidade ########################
function populatUFs() {
    const ufsSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json())
    .then(states => {
        for (const state of states) {
            ufsSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    })
}

populatUFs()

function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")
    
    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = '<option value="">Selecione a Cidade</option>'
    citySelect.disabled = true

    fetch(url)
    .then(res => res.json())
    .then(cities => {
        for (const city of cities) {
           citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
        citySelect.disabled = false
    })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

//######################## itens de coleta ########################

//pega todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click",handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target

    //adicionar ou remover uma class com JS
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    //verificar se existe itens selecionados. 
    //Se sim, pegar esses itens.
    const alreadySelected = selectedItems.findIndex(item => item == itemId) //isso será true ou false


    //Se já estiver selecionado, tirar da seleção.
    if (alreadySelected >= 0) {
        //tirar da seleção
        const filteredItems = selectedItems.filter(item => item != itemId)
        selectedItems = filteredItems
    }

    //Se não estiver na lista, adicionar à seleção.
    else{
        selectedItems.push(itemId)
    }
    //atualizar o campo escondido com os itens selecionados.
    collectedItems.value = selectedItems
}