// Получаем модальное окно на главной странице.
const orderDialog = document.getElementById('order-dialog');

// Получаем кнопки записи в карточках направлений.
const orderButtons = document.querySelectorAll('.product-card__button');

// Получаем кнопку закрытия модального окна.
const closeDialogButton = document.getElementById('close-order-dialog');

// Получаем скрытое поле с выбранным направлением.
const selectedProductInput = document.getElementById('selected-product');

// Получаем форму из модального окна.
const orderForm = document.getElementById('order-form');

// Получаем сообщение об успешной отправке на главной странице.
const successMessage = document.getElementById('success-message');


// Проверяем, что модальное окно существует на текущей странице.
if (orderDialog && selectedProductInput) {
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Получаем название направления из data-атрибута.
      const productName = button.dataset.product;

      // Записываем выбранное направление в скрытое поле.
      selectedProductInput.value = productName;

      // Открываем модальное окно.
      orderDialog.showModal();
    });
  });
}


// Закрываем модальное окно.
if (orderDialog && closeDialogButton) {
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });
}


// Обрабатываем форму в модальном окне.
if (orderForm && orderDialog && successMessage) {
  orderForm.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку формы,
    // потому что backend пока не подключён.
    event.preventDefault();

    // Проверяем встроенную HTML-валидацию.
    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }

    // Показываем сообщение об успешной отправке.
    successMessage.hidden = false;

    // Очищаем форму.
    orderForm.reset();

    // Закрываем модальное окно.
    orderDialog.close();
  });
}


// Получаем форму со страницы записи.
const pageOrderForm = document.getElementById('page-order-form');

// Получаем сообщение об успешной записи.
const pageSuccessMessage = document.getElementById('page-success-message');


// Обрабатываем форму на отдельной странице записи.
if (pageOrderForm && pageSuccessMessage) {
  pageOrderForm.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку формы,
    // потому что backend пока не подключён.
    event.preventDefault();

    // Проверяем встроенную HTML-валидацию.
    if (!pageOrderForm.checkValidity()) {
      pageOrderForm.reportValidity();
      return;
    }

    // Показываем подтверждение успешной записи.
    pageSuccessMessage.hidden = false;

    // Очищаем форму.
    pageOrderForm.reset();
  });
}