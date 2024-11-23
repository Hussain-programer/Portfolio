const apiBase = 'https://www.themealdb.com/api/json/v1/1';
        const searchInput = document.getElementById('searchInput');
        const recipesGrid = document.getElementById('recipesGrid');
        const loading = document.getElementById('loading');
        const modal = document.getElementById('recipeModal');

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchRecipes();
        });

        async function searchRecipes() {
            const ingredient = searchInput.value.trim();
            if (!ingredient) return;

            loading.style.display = 'block';
            recipesGrid.innerHTML = '';

            try {
                const response = await fetch(`${apiBase}/search.php?s=${ingredient}`);
                const data = await response.json();

                if (data.meals) {
                    data.meals.forEach(meal => {
                        const card = document.createElement('div');
                        card.className = 'recipe-card';
                        card.onclick = () => showRecipeDetails(meal);

                        card.innerHTML = `
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-image">
                            <div class="recipe-info">
                                <h3 class="recipe-title">${meal.strMeal}</h3>
                                <p>Category: ${meal.strCategory}</p>
                                <p>Origin: ${meal.strArea}</p>
                            </div>
                        `;

                        recipesGrid.appendChild(card);
                    });
                } else {
                    recipesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No recipes found. Try another ingredient.</p>';
                }
            } catch (error) {
                recipesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Error fetching recipes. Please try again.</p>';
            }

            loading.style.display = 'none';
        }

        function showRecipeDetails(meal) {
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`]) {
                    ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
                }
            }

            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = `
                <h2 class="recipe-title">${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 100%; max-width: 400px; border-radius: 10px; margin: 1rem 0;">
                <h3 style="color: var(--neon-orange); margin-top: 1rem;">Ingredients:</h3>
                <ul class="ingredients-list">
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                <h3 style="color: var(--neon-orange);">Instructions:</h3>
                <p class="instructions">${meal.strInstructions}</p>
            `;

            modal.style.display = 'block';
        }

        function closeModal() {
            modal.style.display = 'none';
        }

        window.onclick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };
        // Add new functionality for favorites
        let favorites = JSON.parse(localStorage.getItem('favorites')) || {};
        let currentView = 'all';

        function toggleFavorite(mealId, event) {
            event.stopPropagation();
            favorites[mealId] = !favorites[mealId];
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateUI();
        }

        function updateUI() {
            const favoriteBtns = document.querySelectorAll('.favorite-btn');
            favoriteBtns.forEach(btn => {
                const mealId = btn.dataset.mealId;
                btn.textContent = favorites[mealId] ? '★' : '☆';
                btn.classList.toggle('active', favorites[mealId]);
            });
        }

        function toggleView(view) {
            currentView = view;
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => btn.classList.toggle('active', btn.textContent.toLowerCase().includes(view)));
            
            if (view === 'favorites') {
                showFavorites();
            } else {
                searchRecipes();
            }
        }

        async function showFavorites() {
            loading.style.display = 'block';
            recipesGrid.innerHTML = '';

            const favoriteIds = Object.keys(favorites).filter(id => favorites[id]);
            
            if (favoriteIds.length === 0) {
                recipesGrid.innerHTML = '<p class="error-message">No favorite recipes saved yet.</p>';
                loading.style.display = 'none';
                return;
            }

            try {
                for (const id of favoriteIds) {
                    const response = await fetch(`${apiBase}/lookup.php?i=${id}`);
                    const data = await response.json();
                    if (data.meals && data.meals[0]) {
                        displayRecipe(data.meals[0]);
                    }
                }
            } catch (error) {
                showError('Error loading favorites. Please try again.');
            }

            loading.style.display = 'none';
        }

        function displayRecipe(meal) {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.onclick = () => showRecipeDetails(meal);

            card.innerHTML = `
                <button class="favorite-btn ${favorites[meal.idMeal] ? 'active' : ''}" 
                        data-meal-id="${meal.idMeal}"
                        onclick="toggleFavorite('${meal.idMeal}', event)">
                    ${favorites[meal.idMeal] ? '★' : '☆'}
                </button>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-image">
                <div class="recipe-info">
                    <h3 class="recipe-title">${meal.strMeal}</h3>
                    <p>Category: ${meal.strCategory}</p>
                    <p>Origin: ${meal.strArea}</p>
                </div>
            `;

            recipesGrid.appendChild(card);
        }

        function showError(message) {
            recipesGrid.innerHTML = `<p class="error-message">${message}</p>`;
        }

        // Override the original searchRecipes function
        async function searchRecipes() {
            const ingredient = searchInput.value.trim();
            if (!ingredient && currentView === 'all') {
                showError('Please enter an ingredient to search.');
                return;
            }

            loading.style.display = 'block';
            recipesGrid.innerHTML = '';

            try {
                const response = await fetch(`${apiBase}/search.php?s=${ingredient}`);
                const data = await response.json();

                if (data.meals) {
                    data.meals.forEach(meal => displayRecipe(meal));
                } else {
                    showError('No recipes found. Try another ingredient.');
                }
            } catch (error) {
                showError('Error fetching recipes. Please check your connection and try again.');
            }

            loading.style.display = 'none';
        }
        const API_BASE = 'https://www.themealdb.com/api/json/v1/1';
        let currentSearchType = 'ingredient';
        let searchTimeout;

        // Set up search type buttons
        document.querySelectorAll('.search-type-btn').forEach(btn => {
            if (btn.classList.contains('random-btn')) return;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.search-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSearchType = btn.dataset.type;
                updatePlaceholder();
            });
        });

        function updatePlaceholder() {
            const placeholders = {
                ingredient: 'Enter an ingredient (e.g., chicken)',
                name: 'Enter recipe name (e.g., Arrabiata)',
                id: 'Enter recipe ID (e.g., 52772)'
            };
            searchInput.placeholder = placeholders[currentSearchType];
        }

        async function performSearch() {
            const searchTerm = searchInput.value.trim();
            if (!searchTerm) {
                showError('Please enter a search term');
                return;
            }

            loading.style.display = 'block';
            recipesGrid.innerHTML = '';

            try {
                let endpoint;
                switch (currentSearchType) {
                    case 'name':
                        endpoint = `${API_BASE}/search.php?s=${searchTerm}`;
                        break;
                    case 'id':
                        endpoint = `${API_BASE}/lookup.php?i=${searchTerm}`;
                        break;
                    case 'ingredient':
                    default:
                        endpoint = `${API_BASE}/filter.php?i=${searchTerm}`;
                }

                const response = await fetch(endpoint);
                const data = await response.json();

                if (data.meals) {
                    if (currentSearchType === 'ingredient') {
                        // For ingredient search, we need to fetch full details for each meal
                        await Promise.all(data.meals.map(async (meal) => {
                            const detailResponse = await fetch(`${API_BASE}/lookup.php?i=${meal.idMeal}`);
                            const detailData = await detailResponse.json();
                            if (detailData.meals && detailData.meals[0]) {
                                displayRecipe(detailData.meals[0]);
                            }
                        }));
                    } else {
                        data.meals.forEach(meal => displayRecipe(meal));
                    }
                } else {
                    showError('No recipes found. Try another search term.');
                }
            } catch (error) {
                showError('Error fetching recipes. Please try again.');
            }

            loading.style.display = 'none';
        }

        async function getRandomRecipe() {
            loading.style.display = 'block';
            recipesGrid.innerHTML = '';

            try {
                const response = await fetch(`${API_BASE}/random.php`);
                const data = await response.json();

                if (data.meals && data.meals[0]) {
                    displayRecipe(data.meals[0]);
                } else {
                    showError('Error fetching random recipe. Please try again.');
                }
            } catch (error) {
                showError('Error fetching random recipe. Please try again.');
            }

            loading.style.display = 'none';
        }

        // Enhanced displayRecipe function
        function displayRecipe(meal) {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.onclick = () => showRecipeDetails(meal);

            card.innerHTML = `
                <button class="favorite-btn ${favorites[meal.idMeal] ? 'active' : ''}" 
                        data-meal-id="${meal.idMeal}"
                        onclick="toggleFavorite('${meal.idMeal}', event)">
                    ${favorites[meal.idMeal] ? '★' : '☆'}
                </button>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-image">
                <div class="recipe-info">
                    <h3 class="recipe-title">${meal.strMeal}</h3>
                    <p>Category: ${meal.strCategory || 'N/A'}</p>
                    <p>Origin: ${meal.strArea || 'N/A'}</p>
                    <p>ID: ${meal.idMeal}</p>
                </div>
            `;

            recipesGrid.appendChild(card);
        }

        // Add keyboard event listener for search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Initialize placeholder
        updatePlaceholder();
        // Initialize the UI
        updateUI();
