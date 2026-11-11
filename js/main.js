// Мобильное меню. Без JS навигация остаётся раскрытой.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-nav');
const desktopMenu = window.matchMedia('(min-width: 768px)');
function setMenu(open) {
  navigation.classList.toggle('site-nav--open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Закрыть меню' : 'Меню';
}
if (menuButton && navigation) {
  menuButton.hidden = false;
  navigation.classList.add('site-nav--enhanced');
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !desktopMenu.matches) { setMenu(false); menuButton.focus(); }
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && !desktopMenu.matches) setMenu(false);
  });
  desktopMenu.addEventListener('change', () => {
    if (!desktopMenu.matches && navigation.contains(document.activeElement)) menuButton.focus();
    setMenu(false);
  });
}

// Нативный dialog удерживает фокус и поддерживает Escape.
const orderDialog = document.getElementById('order-dialog');
let dialogOpener = null;
if (orderDialog) {
  document.querySelectorAll('[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      dialogOpener = button;
      const courseName = button.dataset.product;
      const values = { 'Гитара': 'guitar', 'Фортепиано': 'piano', 'Вокал': 'vocal' };
      document.getElementById('selected-product').value = courseName;
      document.getElementById('order-topic').value = values[courseName];
      document.getElementById('selected-course-text').textContent = 'Вы выбрали: ' + courseName;
      orderDialog.showModal();
      orderDialog.querySelector('.dialog-close').focus();
    });
  });
  orderDialog.querySelectorAll('.dialog-close, #close-order-dialog').forEach((button) => {
    button.addEventListener('click', () => orderDialog.close());
  });
  orderDialog.addEventListener('close', () => dialogOpener?.focus());
  // Явно замыкаем Tab, включая обратный обход через Shift+Tab.
  orderDialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const fields = orderDialog.querySelectorAll('button, input:not([type="hidden"]), select, textarea, a[href]');
    const first = fields[0];
    const last = fields[fields.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
}

// Учебные формы: встроенная проверка браузера, без отправки данных.
function connectForm(formId, resultId, dialog = null) {
  const form = document.getElementById(formId);
  const result = document.getElementById(resultId);
  if (!form || !result) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    result.hidden = false;
    form.reset();
    if (dialog) dialog.close();
    else result.focus();
  });
}
connectForm('order-form', 'success-message', orderDialog);
connectForm('page-order-form', 'page-success-message');
connectForm('feedback-form', 'feedback-success');

// Простые фильтры: карточки остаются обычным HTML, неподходящие скрываются.
const filterForm = document.querySelector('.catalog-filters__form');
const filterPanel = document.querySelector('.filter-panel');
if (filterForm) {
  const wideCatalog = window.matchMedia('(min-width: 1100px)');
  filterPanel.open = wideCatalog.matches;
  wideCatalog.addEventListener('change', () => { filterPanel.open = wideCatalog.matches; });
  const from = document.getElementById('price-from');
  const to = document.getElementById('price-to');
  const all = filterForm.querySelector('[value="all"]');
  filterForm.addEventListener('change', (event) => {
    to.setCustomValidity('');
    if (event.target === all && all.checked) {
      filterForm.querySelectorAll('[name="category"]:not([value="all"])').forEach(input => { input.checked = false; });
    } else if (event.target.name === 'category') all.checked = false;
  });
  function applyFilters() {
    const selected = Array.from(filterForm.querySelectorAll('[name="category"]:checked')).map(input => input.value);
    const minimum = from.value === '' ? 0 : Number(from.value);
    const maximum = to.value === '' ? Infinity : Number(to.value);
    to.setCustomValidity(minimum > maximum ? 'Максимальная цена должна быть не меньше минимальной.' : '');
    if (!filterForm.reportValidity()) return;
    let count = 0;
    document.querySelectorAll('.catalog-layout .product-card').forEach(card => {
      const categoryMatches = !selected.length || selected.includes('all') || selected.includes(card.dataset.category);
      const price = Number(card.dataset.price);
      card.hidden = !(categoryMatches && price >= minimum && price <= maximum);
      if (!card.hidden) count++;
    });
    document.getElementById('filter-result').textContent = 'Показано направлений: ' + count;
    document.getElementById('filter-empty').hidden = count !== 0;
  }
  filterForm.addEventListener('submit', (event) => { event.preventDefault(); applyFilters(); });
  filterForm.addEventListener('reset', () => { to.setCustomValidity(''); setTimeout(applyFilters, 0); });
}
