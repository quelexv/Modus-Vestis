/* --- ДАННЫЕ ТОВАРОВ --- */
const products = [
  {
    id: 1,
    name: "Белая футболка Oversize",
    price: 8500,
    sizes: ["S", "M", "L", "XL"],
    color: "white",
    image: "img/belaya-futbolka.webp",
    description: "Базовая футболка свободного кроя. Плотная ткань, которая держит форму после стирки. Состав: 100% хлопок."
  },
  {
    id: 2,
    name: "Джинсовая куртка Vintage",
    price: 24000,
    sizes: ["M", "L"],
    color: "blue",
    image: "img/jeans-kurtka.webp",
    description: "Классическая джинсовая куртка с эффектом потертости. Металлические пуговицы и удобные карманы."
  },
  {
    id: 3,
    name: "Бежевый тренч Classic",
    price: 45000,
    sizes: ["XS", "S", "M"],
    color: "beige",
    image: "img/trench.webp",
    description: "Элегантный двубортный тренч с поясом. Защищает от ветра и легкого дождя. Подкладка из вискозы."
  },
  {
    id: 4,
    name: "Кроссовки Urban Run",
    price: 32000,
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    color: "multicolor",
    image: "img/krossovki.webp",
    description: "Легкие и удобные кроссовки для города. Амортизирующая подошва и дышащий верх."
  },
  {
    id: 5,
    name: "Черная футболка",
    price: 7900,
    sizes: ["S", "M", "L"],
    color: "black",
    image: "img/chernaya-futbolka.webp",
    description: "Классическая черная футболка. Идеально сидит по фигуре, не выцветает."
  },
  {
    id: 6,
    name: "Брюки Чинос",
    price: 15000,
    sizes: ["30", "32", "34"],
    color: "brown",
    image: "img/bryuki.webp",
    description: "Стильные брюки чинос коричневого цвета. Отличный выбор для офиса и прогулок."
  },
  {
    id: 7,
    name: "Кожаная сумка",
    price: 28000,
    sizes: ["OneSize"],
    color: "brown",
    image: "img/sumka.webp",
    description: "Вместительная сумка из натуральной кожи. Прочная фурнитура."
  },
  {
    id: 8,
    name: "Рубашка в клетку",
    price: 12500,
    sizes: ["M", "L", "XL"],
    color: "red",
    image: "img/rubashka.webp",
    description: "Хлопковая рубашка в клетку. Мягкая фланелевая ткань."
  }
];

/* --- ИНИЦИАЛИЗАЦИЯ --- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  initMobileMenu();

  if (document.getElementById('catalog-grid')) {
    renderProducts(products);
  }

  if (document.getElementById('cart-container')) {
    renderCartPage();
  }
});

/* --- МОБИЛЬНОЕ МЕНЮ (НОВОЕ) --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  const body = document.body;

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      body.classList.toggle('no-scroll');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('no-scroll');
      });
    });
  }
}

/* --- КАТАЛОГ И ФИЛЬТРЫ --- */
function renderProducts(data) {
  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = '';

  if (data.length === 0) {
    grid.innerHTML = '<div class="no-results">По вашему запросу товаров не найдено. Попробуйте изменить фильтры.</div>';
    return;
  }

  data.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="card-body">
        <h3>${product.name}</h3>
        <p class="price">${product.price.toLocaleString()} ₸</p>
        <p class="card-meta">Размеры: ${product.sizes.join(', ')}</p>
        <button class="btn btn-secondary" onclick="openModal(${product.id})">Подробнее</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function applyFilters() {
  const minPrice = parseInt(document.getElementById('price-min').value) || 0;
  const maxPrice = parseInt(document.getElementById('price-max').value) || Infinity;
  const selectedColor = document.getElementById('color-filter').value;
  
  const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
  const selectedSizes = Array.from(sizeCheckboxes).map(cb => cb.value);

  const filtered = products.filter(p => {
    // 1. Фильтр по цене
    if (p.price < minPrice || p.price > maxPrice) return false;
    
    // 2. Фильтр по цвету
    if (selectedColor !== 'all') {
        if (!p.color.toLowerCase().includes(selectedColor) && p.color !== selectedColor) {
            return false;
        }
    }

    // 3. Фильтр по размеру
    if (selectedSizes.length > 0) {
      const hasSize = p.sizes.some(s => selectedSizes.includes(s));
      if (!hasSize) return false;
    }

    return true;
  });

  renderProducts(filtered);
  
  if (filtered.length > 0) {
      showToast(`Найдено товаров: ${filtered.length}`, 'success');
  } else {
      showToast('Товары не найдены', 'error');
  }
}

function resetFilters() {
  document.getElementById('price-min').value = '';
  document.getElementById('price-max').value = '';
  document.getElementById('color-filter').value = 'all';
  document.querySelectorAll('input[name="size"]').forEach(cb => cb.checked = false);
  renderProducts(products);
}

/* --- МОДАЛЬНОЕ ОКНО --- */
function openModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = `
    <div class="modal-img">
        <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="modal-info">
        <h2>${product.name}</h2>
        <p class="price" style="font-size: 1.5rem; margin: 10px 0;">${product.price.toLocaleString()} ₸</p>
        <p><strong>Цвет:</strong> ${translateColor(product.color)}</p>
        <p><strong>Описание:</strong> ${product.description}</p>
        <br>
        <label><strong>Выберите размер:</strong>
            <select id="modal-size-select" style="padding: 8px; margin-top: 5px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
                <option value="" disabled selected>-- Выберите --</option>
                ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
        </label>
        <br><br>
        <button class="btn btn-primary" onclick="addToCart(${product.id})">Добавить в корзину</button>
    </div>
  `;

  document.getElementById('product-modal').style.display = 'flex';
}

function closeModal(e) {
  if(e) e.preventDefault();
  document.getElementById('product-modal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('product-modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

function translateColor(color) {
    const map = {
        'white': 'Белый', 'black': 'Черный', 'blue': 'Синий',
        'beige': 'Бежевый', 'brown': 'Коричневый', 'red': 'Красный',
        'multicolor': 'Мультиколор'
    };
    return map[color] || color;
}

/* --- КОРЗИНА (LocalStorage) --- */
function getCart() {
  return JSON.parse(localStorage.getItem('trendStoreCart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('trendStoreCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = `(${count})`);
}

function addToCart(productId) {
  try {
    const sizeSelect = document.getElementById('modal-size-select');
    const size = sizeSelect ? sizeSelect.value : null;

    if (!size) {
        showToast('Пожалуйста, выберите размер!', 'error');
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ id: productId, size: size, quantity: 1 });
    }

    saveCart(cart);
    closeModal();
    showToast('Товар успешно добавлен в корзину!', 'success');
  } catch (e) {
    console.error(e);
    showToast('Произошла ошибка при добавлении.', 'error');
  }
}

function renderCartPage() {
  const container = document.getElementById('cart-container');
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart"><p>Ваша корзина пуста.</p><a href="catalog.html" class="btn btn-primary" style="margin-top:20px;">Перейти в каталог</a></div>';
    return;
  }

  let totalSum = 0;
  let html = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Товар</th>
          <th>Размер</th>
          <th>Кол-во</th>
          <th>Цена</th>
          <th>Сумма</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((item, index) => {
    const productInfo = products.find(p => p.id === item.id);
    if (!productInfo) return; 

    const itemTotal = productInfo.price * item.quantity;
    totalSum += itemTotal;

    html += `
      <tr>
        <td data-label="Товар">
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${productInfo.image}" width="50" height="66" style="object-fit:cover; border-radius:4px;">
                <span>${productInfo.name}</span>
            </div>
        </td>
        <td data-label="Размер">${item.size}</td>
        <td data-label="Кол-во">${item.quantity}</td>
        <td data-label="Цена">${productInfo.price.toLocaleString()} ₸</td>
        <td data-label="Сумма"><strong>${itemTotal.toLocaleString()} ₸</strong></td>
        <td style="text-align: right;">
            <button class="remove-btn" onclick="removeFromCart(${index})" title="Удалить">✕</button>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <div class="cart-summary">
        <div class="cart-total">Итого к оплате: ${totalSum.toLocaleString()} ₸</div>
        <div class="cart-actions">
            <a href="catalog.html" class="btn btn-secondary">Продолжить покупки</a>
            <button class="btn btn-primary" onclick="alert('Спасибо за заказ! Менеджер свяжется с вами.')">Оформить заказ</button>
        </div>
    </div>
  `;

  container.innerHTML = html;
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1); 
  saveCart(cart);
  renderCartPage(); 
  showToast('Товар удален из корзины', 'success');
}

/* --- УВЕДОМЛЕНИЯ (TOASTS) --- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}