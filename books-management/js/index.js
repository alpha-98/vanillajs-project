const app = document.getElementById('app');

function initialBuild() {
  const inserBtn = document.getElementById('insert-book-btn');
  const insertBookDetail =
    document.getElementsByClassName('insert-book-detail')[0];
  inserBtn.addEventListener('click', () => {
    toggle(insertBookDetail);
  });
  const form = document.querySelector('form'),
    bookName = document.getElementById('book_name'),
    bookDetail = document.getElementById('book_detail'),
    authorName = document.getElementById('author_name'),
    publishDate = document.getElementById('publish_date'),
    price = document.getElementById('price');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (
      bookName.value === '' ||
      bookName.value === '' ||
      bookDetail.value === '' ||
      publishDate.value === '' ||
      authorName.value === '' ||
      price.value === ''
    ) {
      return alert('Please fill all the values');
    }
    const items = JSON.parse(localStorage.getItem('book_items') || '[]');
    const bookItem = {
      id: Math.floor(Math.random() * 100000),
      book_name: bookName.value,
      book_detail: bookDetail.value,
      author_name: authorName.value,
      publish_date: publishDate.value,
      price: price.value,
    };
    items.push(bookItem);
    localStorage.setItem('book_items', JSON.stringify(items));
    form.reset();
    list();
  });
  const conatiner = document.getElementsByClassName('book-container')[0];
  const bookList = document.createElement('div');
  bookList.classList.add('book-list');
  conatiner.appendChild(bookList);
}

function list() {
  const items = JSON.parse(localStorage.getItem('book_items') || '[]');
  const bookList = document.getElementsByClassName('book-list')[0];
  bookList.innerHTML = '';

  for (const [index, item] of items.entries()) {
    const book = document.createElement('div');
    book.classList.add('book');

    const bookToggle = document.createElement('button');
    bookToggle.classList.add('book-toggle');
    bookToggle.innerText = `${item.book_name}`;
    book.appendChild(bookToggle);

    const bookDescription = document.createElement('div');
    bookDescription.classList.add('book-description');
    showBookDetail(bookDescription, item, index);

    book.appendChild(bookDescription);
    bookToggle.addEventListener('click', () => {
      toggle(bookDescription);
    });

    bookList.appendChild(book);
  }
}

function toggle(element) {
  if (!element.classList.contains('active')) {
    element.classList.add('active');
  } else {
    element.classList.remove('active');
  }
}
function showBookDetail(bookDoc, item, index) {
  const btnDiv = document.createElement('div');
  btnDiv.classList.add('delete-btn-div');
  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', () => deleteBook(item.id));
  btnDiv.appendChild(deleteBtn);
  bookDoc.appendChild(btnDiv);
  for (const key in item) {
    const list = document.createElement('div');
    list.classList.add('flex');
    const name = document.createElement('span');
    const value = document.createElement('span');
    name.innerText = key.replace('_', ' ').toLocaleUpperCase();
    value.id = key;
    value.innerText = item[key];
    value.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      value.innerHTML = `<input type="text" id="${value.id}" value="${value.textContent}">`;
      value.firstChild.focus();
      value.firstChild.addEventListener('focusout', () => {
        const data = {
          key_name: value.firstChild.id,
          key_value: value.firstChild.value,
        };
        updateBook(item['id'], data, index);
        value.innerHTML = value.firstChild.value;
      });
    });
    list.appendChild(name);
    list.appendChild(value);
    bookDoc.appendChild(list);
  }
}

function updateBook(id, data, index) {
  const items = JSON.parse(localStorage.getItem('book_items'));
  const item = items.find((item) => item.id === id);
  item[data.key_name] = data.key_value;
  if (data.key_name === 'book_name') {
    const bookToggle = document.getElementsByClassName('book-toggle')[index];
    bookToggle.innerText = data.key_value;
  }
  localStorage.setItem('book_items', JSON.stringify(items));
}

function deleteBook(id) {
  const items = JSON.parse(localStorage.getItem('book_items'));
  const newItems = items.filter((item) => item.id !== id);
  localStorage.setItem('book_items', JSON.stringify(newItems));
  list();
}

initialBuild();
list();
