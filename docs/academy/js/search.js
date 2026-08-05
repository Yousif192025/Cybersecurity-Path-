/**
 * CyberPath Academy - Global Search
 */

const searchData = {
    certifications: [],
    careerPaths: [],
    platforms: [],
    jobs: [],
    articles: []
};

// Load all searchable data
async function loadSearchData() {
    try {
        const [certs, paths, platforms, jobs, articles] = await Promise.all([
            fetch('../data/certifications.json').then(r => r.json()),
            fetch('../data/career-paths.json').then(r => r.json()),
            fetch('../data/platforms.json').then(r => r.json()),
            fetch('../data/jobs.json').then(r => r.json()),
            fetch('../data/articles.json').then(r => r.json())
        ]);

        searchData.certifications = certs.featured || certs;
        searchData.careerPaths = paths;
        searchData.platforms = platforms.featured || platforms;
        searchData.jobs = jobs;
        searchData.articles = articles;
    } catch {
        // Use fallback data
        searchData.certifications = getFallbackCertifications();
        searchData.careerPaths = getFallbackCareerPaths();
        searchData.platforms = getFallbackPlatforms();
        searchData.jobs = getFallbackJobs();
        searchData.articles = getFallbackArticles();
    }
}

function performSearch() {
    const input = document.getElementById('globalSearch');
    const query = input.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');

    if (query.length < 2) {
        resultsContainer.classList.remove('active');
        return;
    }

    const results = {
        certifications: searchData.certifications.filter(c => 
            c.name.toLowerCase().includes(query) || 
            c.provider.toLowerCase().includes(query)
        ),
        careerPaths: searchData.careerPaths.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        ),
        platforms: searchData.platforms.filter(p => 
            p.name.toLowerCase().includes(query)
        ),
        jobs: searchData.jobs.filter(j => 
            j.title.toLowerCase().includes(query) ||
            (j.skills && j.skills.some(s => s.toLowerCase().includes(query)))
        ),
        articles: searchData.articles.filter(a => 
            a.title.toLowerCase().includes(query) ||
            a.excerpt.toLowerCase().includes(query)
        )
    };

    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

    if (totalResults === 0) {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <i class="fa-regular fa-face-frown"></i>
                <p>لا توجد نتائج لبحثك عن "${query}"</p>
                <small>حاول استخدام كلمات مختلفة</small>
            </div>
        `;
    } else {
        let html = `<div class="search-stats">${totalResults} نتيجة</div>`;
        
        if (results.certifications.length) {
            html += `<div class="search-category">شهادات (${results.certifications.length})</div>`;
            results.certifications.forEach(c => {
                html += `<a href="${c.url || '#'}" class="search-item">${c.name} - ${c.provider}</a>`;
            });
        }
        
        if (results.careerPaths.length) {
            html += `<div class="search-category">مسارات مهنية (${results.careerPaths.length})</div>`;
            results.careerPaths.forEach(p => {
                html += `<a href="${p.url || '#'}" class="search-item">${p.name}</a>`;
            });
        }
        
        if (results.platforms.length) {
            html += `<div class="search-category">منصات تعلم (${results.platforms.length})</div>`;
            results.platforms.forEach(p => {
                html += `<a href="${p.url || '#'}" class="search-item">${p.name}</a>`;
            });
        }
        
        if (results.jobs.length) {
            html += `<div class="search-category">وظائف (${results.jobs.length})</div>`;
            results.jobs.forEach(j => {
                html += `<a href="${j.url || '#'}" class="search-item">${j.title}</a>`;
            });
        }
        
        if (results.articles.length) {
            html += `<div class="search-category">مقالات (${results.articles.length})</div>`;
            results.articles.forEach(a => {
                html += `<a href="${a.url || '#'}" class="search-item">${a.title}</a>`;
            });
        }
        
        resultsContainer.innerHTML = html;
    }

    resultsContainer.classList.add('active');
}

// Search with Enter key
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('globalSearch');
    if (input) {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.length < 2) {
                document.getElementById('searchResults').classList.remove('active');
            } else {
                performSearch();
            }
        });
    }

    // Close search on click outside
    document.addEventListener('click', function(e) {
        const wrapper = document.querySelector('.search-box-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            document.getElementById('searchResults').classList.remove('active');
        }
    });

    // Load data for search
    loadSearchData();
});
