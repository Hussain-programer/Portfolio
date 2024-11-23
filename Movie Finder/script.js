const apiKey = "cf007fdd"; // Your correct API key
      const searchInput = document.getElementById("searchInput");
      const searchBtn = document.getElementById("searchBtn");
      const movieGrid = document.getElementById("movieGrid");
      const loading = document.getElementById("loading");
      const eraFilters = document.querySelectorAll(".era-filter");

      let currentEra = "2021-2027";

      function getEraYears(era) {
        const [start, end] = era.split("-").map(Number);
        return { start, end };
      }

      function isInEra(movieYear, era) {
        const year = parseInt(movieYear);
        const { start, end } = getEraYears(era);
        return year >= start && year <= end;
      }

      async function validateApiKey() {
        try {
          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=test`
          );
          const data = await response.json();
          return (
            data.Response !== "False" ||
            !data.Error?.includes("Invalid API key")
          );
        } catch (error) {
          return false;
        }
      }

      async function searchMovies(query) {
        try {
          loading.style.display = "block";
          movieGrid.innerHTML = "";

          // Validate API key first
          const isValidKey = await validateApiKey();
          if (!isValidKey) {
            throw new Error("API key validation failed");
          }

          // Using year parameter to filter initial results
          const yearStart = getEraYears(currentEra).start;
          const yearEnd = getEraYears(currentEra).end;

          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&type=movie`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          if (data.Response === "True") {
            // Filter movies by year first
            const validMovies = data.Search.filter((movie) => {
              const year = parseInt(movie.Year);
              return !isNaN(year) && year >= 2000 && year <= 2027;
            });

            if (validMovies.length === 0) {
              movieGrid.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                            <p style="color: var(--neon-pink); margin-bottom: 1rem;">No movies found in the specified time period.</p>
                            <p style="color: var(--neon-green);">Try adjusting your search or selecting a different era.</p>
                        </div>`;
              return;
            }

            // Get detailed information for each movie
            const movies = await Promise.all(
              validMovies.map(async (movie) => {
                try {
                  const detailResponse = await fetch(
                    `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`
                  );
                  if (!detailResponse.ok) return null;
                  return await detailResponse.json();
                } catch (error) {
                  console.error(
                    `Error fetching details for ${movie.Title}:`,
                    error
                  );
                  return null;
                }
              })
            );

            // Filter out any failed requests and movies not in current era
            const filteredMovies = movies
              .filter((movie) => movie && isInEra(movie.Year, currentEra))
              .sort((a, b) => parseInt(b.Year) - parseInt(a.Year)); // Sort by year, newest first

            if (filteredMovies.length > 0) {
              displayMovies(filteredMovies);
            } else {
              movieGrid.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                            <p style="color: var(--neon-pink); margin-bottom: 1rem;">No movies found in the ${currentEra} era.</p>
                            <p style="color: var(--neon-green);">Try searching in a different time period.</p>
                        </div>`;
            }
          } else {
            movieGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                        <p style="color: var(--neon-pink); margin-bottom: 1rem;">Searching through temporal archives...</p>
                        <p style="color: var(--neon-green);">Try a different search term or check your quantum connection.</p>
                    </div>`;
          }
        } catch (error) {
          console.error("Search error:", error);
          movieGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <p style="color: var(--neon-pink); margin-bottom: 1rem;">Temporal Database Error</p>
                    <p style="color: var(--neon-green);">Please verify your connection and try again.</p>
                    <p style="color: #666; margin-top: 1rem; font-size: 0.9rem;">Error Code: ${error.message}</p>
                </div>`;
        } finally {
          loading.style.display = "none";
        }
      }

      function getHistoricalContext(year) {
        const currentYear = 2050;
        const age = currentYear - parseInt(year);
        if (age > 40) return "Historical Classic";
        if (age > 30) return "Vintage Cinema";
        return "Early Century Film";
      }

      function displayMovies(movies) {
        movieGrid.innerHTML = movies
          .map(
            (movie) => `
            <div class="movie-card">
                <div class="vintage-tag">${getHistoricalContext(
                  movie.Year
                )}</div>
                <img src="${
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "/api/placeholder/300/400"
                }" alt="${
              movie.Title
            }" class="movie-poster" onerror="this.src='/api/placeholder/300/400'">
                <div class="movie-info">
                    <h2 class="movie-title">${movie.Title}</h2>
                    <p class="movie-year">${movie.Year} CE</p>
                    <p class="movie-rating">⭐ ${
                      movie.imdbRating !== "N/A" ? movie.imdbRating : "??"
                    }/10</p>
                    <p class="movie-plot">${
                      movie.Plot !== "N/A"
                        ? movie.Plot
                        : "Plot details lost in temporal archives."
                    }</p>
                </div>
            </div>
        `
          )
          .join("");
      }

      // Event Listeners
      eraFilters.forEach((filter) => {
        filter.addEventListener("click", () => {
          eraFilters.forEach((f) => f.classList.remove("active"));
          filter.classList.add("active");
          currentEra = filter.dataset.era;
          const query = searchInput.value.trim();
          if (query) {
            searchMovies(query);
          }
        });
      });

      searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
          searchMovies(query);
        }
      });

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = searchInput.value.trim();
          if (query) {
            searchMovies(query);
          }
        }
      });

      // Initialize with popular recent movies
      window.addEventListener("load", () => {
        searchMovies("avengers");
      });

      // Add this to your existing JavaScript
      const helpBtn = document.getElementById("helpBtn");
      const instructionsModal = document.getElementById("instructionsModal");
      const closeModal = document.getElementById("closeModal");
      const modal = instructionsModal.querySelector(".modal");

      function showInstructions() {
        instructionsModal.style.display = "flex";
        document.body.style.overflow = "hidden";
      }

      function hideInstructions() {
        instructionsModal.style.display = "none";
        document.body.style.overflow = "auto";
      }

      helpBtn.addEventListener("click", showInstructions);
      closeModal.addEventListener("click", hideInstructions);

      instructionsModal.addEventListener("click", (e) => {
        if (e.target === instructionsModal) {
          hideInstructions();
        }
      });

      // Touch events for mobile
      let touchStart = null;
      modal.addEventListener("touchstart", (e) => {
        touchStart = e.touches[0].clientY;
      });

      modal.addEventListener("touchmove", (e) => {
        if (!touchStart) return;

        const touchEnd = e.touches[0].clientY;
        const modalScrollTop = modal.scrollTop;
        const modalScrollHeight = modal.scrollHeight;
        const modalHeight = modal.clientHeight;

        // Allow scrolling if not at top or bottom
        if (
          modalScrollTop > 0 &&
          modalScrollTop < modalScrollHeight - modalHeight
        ) {
          return;
        }

        // Prevent pull-to-refresh when at top of modal
        if (modalScrollTop <= 0 && touchEnd > touchStart) {
          e.preventDefault();
        }

        // Prevent overscroll when at bottom of modal
        if (
          modalScrollTop >= modalScrollHeight - modalHeight &&
          touchEnd < touchStart
        ) {
          e.preventDefault();
        }
      });

      // Show instructions on first visit
      if (!localStorage.getItem("returnVisitor")) {
        showInstructions();
        localStorage.setItem("returnVisitor", "true");
      }

      // Keyboard support
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && instructionsModal.style.display === "flex") {
          hideInstructions();
        }
      });
      // Initialize with recent movies
      searchMovies("2023");