window.onload = function onload() { };

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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function monitoraBotoesAdicionar(event) {
  const idSelecionado = event.target.parentNode.querySelector('.item__sku').innerHTML;
  const urlProduto = `https://api.mercadolibre.com/items/${idSelecionado}`;
  fetch(urlProduto).then(response => response.json()).then((data) => {
    console.log(data);
    console.log(data.title);
    console.log(data.price);
    const itemCarrinho = createCartItemElement({
      sku: idSelecionado,
      name: data.title,
      salePrice: data.price,
    });
    const pegaPosicaoCarrinho = document.querySelector('.cart__items');
    pegaPosicaoCarrinho.appendChild(itemCarrinho);
  });
}

const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=Computador';
fetch(URL).then(response => response.json()).then((data) => {
  const arrayResultados = data.results;
  console.log(arrayResultados);
  arrayResultados.forEach((item) => {
    const produto = createProductItemElement({
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    });
    const pegaPosicaoClassItems = document.getElementsByClassName('items')[0];
    pegaPosicaoClassItems.appendChild(produto);
  });
  const pegaBotoesAdd = document.querySelectorAll('.item__add');
  pegaBotoesAdd.forEach(botao => botao.addEventListener('click', monitoraBotoesAdicionar));
  const pegaPosItensNoCarrinho = document.querySelector('.cart__items');
  pegaPosItensNoCarrinho.addEventListener('click', cartItemClickListener);
});
