window.onload = function onload() {};

function salvarCompras() {
  localStorage.clear();
  const pegaTudo = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('conteudoCarrinho', pegaTudo);
}

function carregaListaCompras() {
  const pegaPosicaoListaCarrinhos = document.querySelector('.cart__items');
  pegaPosicaoListaCarrinhos.innerHTML = localStorage.getItem('conteudoCarrinho');
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  console.log('mostrando o event target', event.target);
  event.target.remove();
  salvarCompras();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  function calculaPrecoFinal() {
//  const arraydeItensNoCarrinho = document.querySelectorAll('.cart__item');
//  const separadoPeloSifrao = arraydeItensNoCarrinho[0].innerHTML.split('$');
//  console.log('o array', arraydeItensNoCarrinho[0].innerHTML);
//  console.log('separadoPeloSifrao', separadoPeloSifrao);
//  }

function monitoraBotoesAdicionar(event) {
  const idSelecionado = getSkuFromProductItem(event.target.parentNode);
  //  event.target.parentNode.querySelector('.item__sku').innerHTML;
  const urlProduto = `https://api.mercadolibre.com/items/${idSelecionado}`;
  fetch(urlProduto).then(response => response.json()).then((data) => {
    //  console.log(data);
    //  console.log(data.title);
    //  console.log(data.price);
    const itemCarrinho = createCartItemElement({
      sku: idSelecionado,
      name: data.title,
      salePrice: data.price,
    });
    const pegaPosicaoCarrinho = document.querySelector('.cart__items');
    pegaPosicaoCarrinho.appendChild(itemCarrinho);
    //  adiciona no final do carrinho o preço total:
    const pegaPosicaoPrecoFinal = document.querySelector('.total-price');
    const somaAnterior = parseInt(pegaPosicaoPrecoFinal.innerHTML, 10) || 0;
    const soma = somaAnterior + data.price;
    pegaPosicaoPrecoFinal.innerHTML = soma;
    //  calculaPrecoFinal();
  }).then(() => {
    salvarCompras();
  });
}

const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=Computador';
fetch(URL).then(response => response.json()).then((data) => {
  const arrayResultados = data.results;

  //  adiciona cada um dos produtos na página
  arrayResultados.forEach((item) => {
    const produto = createProductItemElement({
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    });
    const pegaPosicaoClassItems = document.getElementsByClassName('items')[0];
    pegaPosicaoClassItems.appendChild(produto);
  });

  //  se houver algo salvo no localStorage - recarrega o carrinho
  carregaListaCompras();
}).then(() => {
  const pegaBotoesAdd = document.querySelectorAll('.item__add');
  pegaBotoesAdd.forEach(botao => botao.addEventListener('click', monitoraBotoesAdicionar));
  const pegaPosItensNoCarrinho = document.querySelector('.cart__items');
  pegaPosItensNoCarrinho.addEventListener('click', cartItemClickListener);
});
