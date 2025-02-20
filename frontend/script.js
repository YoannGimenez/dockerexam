document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const genreFilter = document.getElementById('genre-filter');
    const bookForm = document.getElementById('book-form');
    const bookNameInput = document.getElementById('book-name');
    const bookGenreSelect = document.getElementById('book-genre');

    // Fonction pour récupérer et afficher les livres
    function fetchBooks(genre = '') {
        let url = '/api/books';
        if (genre) {
            url += `?genre=${encodeURIComponent(genre)}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                bookList.innerHTML = ''; // Efface la liste actuelle
                if (data.length === 0) {
                    bookList.innerHTML = '<li>Aucun livre trouvé</li>';
                    return;
                }
                data.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = `${book.name} (Genre : ${book.genre}) `;

                    // Bouton de suppression
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '❌';
                    deleteButton.addEventListener('click', () => deleteBook(book.id));

                    li.appendChild(deleteButton);
                    bookList.appendChild(li);
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des livres', error));
    }

    // Fonction pour supprimer un livre
    function deleteBook(bookId) {
        fetch(`/api/books/${bookId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) throw new Error('Erreur lors de la suppression');
                return response.text();
            })
            .then(() => {
                fetchBooks(genreFilter.value); // Rafraîchir la liste des livres
                fetchGenres(); // Rafraîchir les genres
            })
            .catch(error => console.error(error));
    }

    // Fonction pour récupérer les genres uniques et mettre à jour les selects
    function fetchGenres() {
        fetch('/api/books')
            .then(response => response.json())
            .then(data => {
                const genres = [...new Set(data.map(book => book.genre))].sort();

                genreFilter.innerHTML = '<option value="">Tous</option>';
                bookGenreSelect.innerHTML = '<option value="">Sélectionnez un genre</option>';

                genres.forEach(genre => {
                    const option1 = document.createElement('option');
                    option1.value = genre;
                    option1.textContent = genre;
                    genreFilter.appendChild(option1);

                    const option2 = document.createElement('option');
                    option2.value = genre;
                    option2.textContent = genre;
                    bookGenreSelect.appendChild(option2);
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des genres', error));
    }

    // Événement pour filtrer les livres par genre
    genreFilter.addEventListener('change', () => {
        const selectedGenre = genreFilter.value;
        fetchBooks(selectedGenre);
    });

    // Événement pour ajouter un livre
    bookForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêcher le rechargement de la page

        const name = bookNameInput.value.trim();
        const genre = bookGenreSelect.value;

        if (!name || !genre) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, genre }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Erreur lors de l’ajout du livre');
                return response.text();
            })
            .then(() => {
                bookNameInput.value = ''; // Réinitialiser le champ nom
                bookGenreSelect.value = ''; // Réinitialiser la sélection du genre
                fetchBooks(); // Rafraîchir la liste des livres
                fetchGenres(); // Rafraîchir les genres si un nouveau a été ajouté
            })
            .catch(error => console.error(error));
    });

    // Chargement initial des genres et des livres
    fetchGenres();
    fetchBooks();
});
