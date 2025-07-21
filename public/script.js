const note_form = document.getElementById("note_form");
const notes_list = document.getElementById("notes_list");

const fetchNotes = async () =>{
    const res = await fetch("/notes");
    const notes = await res.json();
    notes_list.innerHTML = "";

    notes.forEach(({id, title , content })=>{
        const li = document.createElement("li");
        li.id = `note-${id}`;
        li.innerHTML = ` <input id="title-${id}" value="${title}" />
            <textarea id="content-${id}">${content}</textarea><br>
            <button class="update" onclick="updateNote('${id}')">✅ Update</button>
            <button class="delete" onclick="deleteNote('${id}')">🗑️ Delete</button>
        `;
        notes_list.appendChild(li);
    });
};

const deleteNote = async (id) => {
  await fetch(`/notes/${id}`, { method: "DELETE" });
  fetchNotes();
};

const updateNote = async (id) => {
  const title = document.getElementById(`title-${id}`).value.trim();
  const content = document.getElementById(`content-${id}`).value.trim();

  if (!title || !content) return alert("Title and content required");

  const res = await fetch(`/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  if (res.ok) {
    alert("✅ Note updated successfully!");
    await fetchNotes();
    const updatedItem = document.getElementById(`note-${id}`);
    updatedItem.classList.add("highlight");
    setTimeout(() => updatedItem.classList.remove("highlight"), 1500);
  }
};

note_form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !content) return alert("Title and content required");

  await fetch("/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  note_form.reset();
  fetchNotes();
});

fetchNotes();
