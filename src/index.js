

// Form and UI elements
const noteForm = document.getElementById('note-form');
const inputTitle = document.getElementById('titel');
const textareaContent = document.getElementById('text-content');
const allNote = document.getElementById('all-note');
const fevItem = document.getElementById('fev-item');
const allNoteCount = document.getElementById('all-note-count');
const fevCount = document.getElementById('fev-count');
const noteList = document.getElementById('note-list');
const addButton = document.getElementById('addButton');

// Load data from localStorage or initialize
let noteData = JSON.parse(localStorage.getItem('Data')) || [];


// Load existing notes on page load
if (localStorage.getItem("Data")) {
  noteData.forEach((data) => showNote(data));
}

// Handle form submission
noteForm.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();
  const title = inputTitle.value.trim();
  const content = textareaContent.value.trim();

  // Validation: both title and content are required
  if (title === '' || content === '') {
    alert('Please fill all fields');
    return;
  }

  // Check if the form is in "Update Note" mode or "Create Note" mode
  if (addButton.textContent === 'Update Note') {
    const noteId = addButton.getAttribute('data-edit-id');
    updateNote(noteId);
  } else {
    createNote();
  }
}

// Create new note
function createNote() {
  const note = {
    id: new Date().getTime(),
    title: inputTitle.value,
    content: textareaContent.value,
    fev: false,
    date: new Date().toLocaleString()
  };
  // [...new Set(note)]
  noteData.push(note);
  addDataInLocalStorage(noteData);
  showNote(note);
  noteForm.reset();
  inputTitle.focus();
}

// Add data to localStorage
function addDataInLocalStorage(noteData) {
  localStorage.setItem('Data', JSON.stringify(noteData));
}

// Show all notes in the UI
function showNote(note) {
  const noteLi = document.createElement('li');
  noteLi.setAttribute('data-id', note.id);
  noteLi.classList.add("flex", "justify-center", "items-center", "bg-[#ECDFCC]", "rounded", "p-4", "my-6", "shadow-md");

  noteLi.innerHTML = `
    <div class="flex-col justify-center items-center w-[70%]">
      <div class="my-3">
        <h1 class="text-lg font-bold">${note.title}</h1>
      </div>
      <div>
        <p>${note.content}</p>
      </div>
      <div class="date my-3">
        <span class="text-[#6a6a6a]">${note.date}</span>
      </div>
    </div>
    <div class="flex justify-end items-center w-[30%] gap-4">
      <div>
        <button class="toggle-fav">
          <i class="${note.fev ? "fa-solid text-red-600" : "fa-regular"} fa-heart"></i>
        </button>
      </div>
      <div>
        <button class="edit-note">
          <i class="fa-solid fa-pen"></i>
        </button>
      </div>
      <div>
        <button class="delete-note">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  noteList.appendChild(noteLi);
  countNote();
}
// showFevItem(noteData)
function showFevItem (item){
  item.filter((item)=>{
    if(item.fev){
      showNote(item)
      
    }

  })
  
}
// Count notes and update note counts
function countNote() {
  const fevItems = noteData.filter((item) => item.fev === true);
  allNoteCount.textContent = noteData.length;
  fevCount.textContent = fevItems.length;
}

// Handle clicks on notes (favorite, edit, delete)
noteList.addEventListener('click', (e) => {
  const target = e.target.closest('button');
  if (!target) return;

  const noteId = target.closest('li').getAttribute('data-id');
  if (e.target.matches('.fa-heart')) {
    toggleFavorite(noteId);
  } else if (e.target.matches('.fa-trash')) {
    deleteItem(noteId);
  } else if (e.target.matches('.fa-pen')) {
    editItem(noteId);
  }
});

// Toggle favorite status
function toggleFavorite(id) {
  noteData = noteData.map((note) => {
    if (note.id == id) {
      note.fev = !note.fev;
    }
    return note;
  });
  addDataInLocalStorage(noteData);
  refreshNoteList();
}

// Delete a note
function deleteItem(id) {
  noteData = noteData.filter(item => item.id !== parseInt(id));
  addDataInLocalStorage(noteData);
  refreshNoteList();
  countNote();
}

// Edit a note
function editItem(id) {
  const note = noteData.find(item => item.id === parseInt(id));
  if (note) {
    inputTitle.value = note.title;
    textareaContent.value = note.content;
    addButton.textContent = 'Update Note';
    addButton.setAttribute('data-edit-id', id); // Store ID in button's data attribute
  }
}

// Update the existing note
function updateNote(id) {
  const title = inputTitle.value.trim();
  const content = textareaContent.value.trim();

  noteData = noteData.map((item) => {
    if (item.id === parseInt(id)) {
      return { ...item, title, content, date: new Date().toLocaleString() };
    }
    return item;
  });

  addDataInLocalStorage(noteData);
  refreshNoteList();

  // Reset the form
  noteForm.reset();
  inputTitle.focus();

  // Reset the button back to "Create Note"
  addButton.textContent = 'Create Note';
  addButton.removeAttribute('data-edit-id');
}

// Refresh the note list UI
function refreshNoteList() {
  noteList.innerHTML = ''; // Clear the list
  noteData.forEach(note => showNote(note)); // Show updated notes
  countNote();
}




