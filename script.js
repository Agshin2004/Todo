const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');

let isEditMode = false;
let h3Counter = 0;
let isThereWarning = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach(item => {
    addItemToDOM(item);
  });

  checkUI();
}

function showWarning(warning) {
  const h3 = document.createElement('h3');
  if (h3Counter >= 1) {
    return;
  }
  h3.innerHTML = warning;
  h3.style.color = 'red';
  itemForm.insertAdjacentElement('afterend', h3);
  h3Counter++;
  isThereWarning = true;
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;


  if (newItem === '') {
    showWarning('Please add an item!');
    return;
  }

  const itemsFromStorage = getItemsFromStorage();
  const lowerCased = itemsFromStorage.map(i => i.toLowerCase());
  for (let i = 0; i < lowerCased.length; i++) {
    if (lowerCased[i] === newItem.toLowerCase()) {
      showWarning(`Item ${newItem} already exists`);
      alert(`Item ${newItem} already exists`);
      return;
    }
  }


  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
  } else {
    if (checkIfItemExists(newItem)) {
      showWarning(`Item ${newItem} already exists!`);
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);


  checkUI();

  itemInput.value = '';
}

function addItemToDOM(item) {
  const li = document.createElement('li');

  li.appendChild(document.createTextNode(item));
  const btn = createButton('remove-item btn-link text-red');

  li.appendChild(btn);
  itemList.appendChild(li);
}

function createButton(classes) {
  const btn = document.createElement('button');
  btn.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  btn.appendChild(icon);

  return btn;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.unshift(item); // I coulda use push as well

  // Convert to JSON string and set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
    itemInput.value = '';
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();

  // we coulda shortened it to return itemsFromStorage.includes(item) but; it is more explicit:
  if (itemsFromStorage.includes(item)) {
    return true;
  } else {
    return false
  }
}

function setItemToEdit(item) {
  if (item.tagName === 'LI') {
    isEditMode = true;
    itemList
      .querySelectorAll('li')
      .forEach(i => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');

    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = 'green';
    itemInput.value = item.textContent;
  } else {
    alert('to update, click onto todo');
  }
}

function removeItem(item) {
  console.log(item.textContent);
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => {
    console.log('i: ' + i);
    console.log('item: ' + item);
    return i !== item // Return item that DOES NOT equl to i, if it does then do not return it (it will be removed)
  });

  // Re-set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeAll() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from localStorage
  localStorage.removeItem('items')
  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function deleteWarning() {
  if (isThereWarning) {
    document.querySelector('h3').remove();
  }
  isThereWarning = false;
}

function checkUI() {
  /* Element method querySelectorAll() returns a static (not live) NodeList.
  So its not updating the list. 
  If you use getelementsbyclassname method you can see the difference. 
  Likewise, if you use the getelementsbyclassname method instead 
  of the queryselectorall method, you can see the difference. It returns htmlcollettion as value. this htmlcollettion updates itself expect the nodelist */
  const items = itemList.querySelectorAll('li'); // That's way we put it here

  if (items.length === 0) {
    clearButton.style.display = 'none';
    itemFilter.style.display = 'none'
  } else {
    clearButton.style.display = 'block';
    itemFilter.style.display = 'block'
  }


  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = 'black';
  isEditMode = false;

}


function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemInput.addEventListener('input', deleteWarning);
  itemList.addEventListener('click', onClickItem);
  clearButton.addEventListener('click', removeAll);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI(); // Run checkUI as soon as the page loads
}

init();
