// app.js
// المنطق الرئيسي لتطبيق مكتبة الفيديوهات

document.addEventListener('DOMContentLoaded', function() {
  // عناصر DOM
  const trackFilter = document.getElementById('trackFilter');
  const courseFilter = document.getElementById('courseFilter');
  const searchInput = document.getElementById('searchInput');
  const videoGrid = document.getElementById('videoGrid');
  const loading = document.getElementById('loading');
  const noResults = document.getElementById('noResults');
  const videoCount = document.getElementById('videoCount');
  const resetFiltersBtn = document.getElementById('resetFilters');
  const filterTags = document.getElementById('filterTags');
  
  // حالة التطبيق
  let state = {
    selectedTrack: 'all',
    selectedCourse: 'all',
    searchQuery: '',
    activeFilters: []
  };
  
  // تهيئة التطبيق
  function init() {
    populateTrackFilter();
    populateCourseFilter();
    renderVideos();
    setupEventListeners();
    updateVideoCount();
  }
  
  // تعبئة فلتر المسارات
  function populateTrackFilter() {
    trackFilter.innerHTML = '<option value="all">جميع المسارات</option>';
    
    cyberPathVideos.tracks.forEach(track => {
      const option = document.createElement('option');
      option.value = track.id;
      option.textContent = `${track.icon} ${track.name}`;
      trackFilter.appendChild(option);
    });
  }
  
  // تعبئة فلتر المقررات بناءً على المسار المختار
  function populateCourseFilter() {
    courseFilter.innerHTML = '<option value="all">جميع المقررات</option>';
    
    // فلترة المقررات حسب المسار المختار
    let filteredCourses = cyberPathVideos.courses;
    
    if (state.selectedTrack !== 'all') {
      filteredCourses = cyberPathVideos.courses.filter(
        course => course.trackId === state.selectedTrack
      );
    }
    
    filteredCourses.forEach(course => {
      const option = document.createElement('option');
      option.value = course.id;
      option.textContent = course.name;
      courseFilter.appendChild(option);
    });
    
    // تفعيل/تعطيل فلتر المقررات
    courseFilter.disabled = filteredCourses.length === 0;
  }
  
  // عرض الفيديوهات
  function renderVideos() {
    // إخفاء شاشة التحميل
    loading.classList.add('hidden');
    videoGrid.classList.remove('hidden');
    
    // فلترة الفيديوهات بناءً على الحالة الحالية
    let filteredVideos = cyberPathVideos.videos;
    
    // فلترة حسب المسار
    if (state.selectedTrack !== 'all') {
      filteredVideos = filteredVideos.filter(
        video => video.trackId === state.selectedTrack
      );
    }
    
    // فلترة حسب المقرر
    if (state.selectedCourse !== 'all') {
      filteredVideos = filteredVideos.filter(
        video => video.courseId === state.selectedCourse
      );
    }
    
    // فلترة حسب البحث النصي
    if (state.searchQuery.trim() !== '') {
      const query = state.searchQuery.toLowerCase();
      filteredVideos = filteredVideos.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // تحديث عدد الفيديوهات
    videoCount.textContent = filteredVideos.length;
    
    // عرض أو إخفاء رسالة "لا توجد نتائج"
    if (filteredVideos.length === 0) {
      videoGrid.classList.add('hidden');
      noResults.classList.remove('hidden');
      return;
    } else {
      videoGrid.classList.remove('hidden');
      noResults.classList.add('hidden');
    }
    
    // عرض الفيديوهات
    videoGrid.innerHTML = '';
    
    filteredVideos.forEach(video => {
      // الحصول على معلومات المسار والمقرر
      const track = cyberPathVideos.tracks.find(t => t.id === video.trackId);
      const course = cyberPathVideos.courses.find(c => c.id === video.courseId);
      
      // إنشاء بطاقة الفيديو
      const videoCard = document.createElement('div');
      videoCard.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300';
      
      videoCard.innerHTML = `
        <div class="relative">
          <!-- صورة الفيديو -->
          <div class="h-48 bg-gray-200 relative overflow-hidden">
            <img 
              src="https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg" 
              alt="${video.title}"
              class="w-full h-full object-cover"
              onerror="this.src='https://via.placeholder.com/480x360/1e40af/ffffff?text=CyberPath'"
            >
            <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              ${video.duration}
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-red-600 text-white p-3 rounded-full bg-opacity-90 hover:bg-opacity-100 transition">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- معلومات الفيديو -->
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg text-gray-800 line-clamp-2">${video.title}</h3>
              <span class="text-xs bg-${track.color}-100 text-${track.color}-800 px-2 py-1 rounded-full whitespace-nowrap">
                ${track.icon}
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">${video.description}</p>
            
            <!-- معلومات إضافية -->
            <div class="text-xs text-gray-500 mb-3">
              <div class="flex justify-between">
                <span>${course ? course.name : 'غير مصنف'}</span>
                <span>${video.dateAdded}</span>
              </div>
              <div class="mt-1">المدرب: ${video.instructor}</div>
            </div>
            
            <!-- الوسوم -->
            <div class="flex flex-wrap gap-1 mb-3">
              ${video.tags.map(tag => `
                <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">${tag}</span>
              `).join('')}
            </div>
            
            <!-- أزرار -->
            <div class="flex justify-between">
              <button 
                class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition duration-300 flex items-center watch-btn"
                data-id="${video.youtubeId}"
              >
                <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                مشاهدة
              </button>
              <button 
                class="text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition duration-300 share-btn"
                data-title="${video.title}"
              >
                مشاركة
              </button>
            </div>
          </div>
        </div>
      `;
      
      videoGrid.appendChild(videoCard);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    document.querySelectorAll('.watch-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const videoId = this.getAttribute('data-id');
        openVideoModal(videoId);
      });
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const videoTitle = this.getAttribute('data-title');
        shareVideo(videoTitle);
      });
    });
  }
  
  // تحديث عد الفيديوهات
  function updateVideoCount() {
    const count = cyberPathVideos.videos.length;
    videoCount.textContent = count;
  }
  
  // تحديث وسم الفلاتر النشطة
  function updateFilterTags() {
    filterTags.innerHTML = '';
    state.activeFilters = [];
    
    if (state.selectedTrack !== 'all') {
      const track = cyberPathVideos.tracks.find(t => t.id === state.selectedTrack);
      if (track) {
        state.activeFilters.push({
          type: 'track',
          value: state.selectedTrack,
          label: `${track.icon} ${track.name}`
        });
      }
    }
    
    if (state.selectedCourse !== 'all') {
      const course = cyberPathVideos.courses.find(c => c.id === state.selectedCourse);
      if (course) {
        state.activeFilters.push({
          type: 'course',
          value: state.selectedCourse,
          label: course.name
        });
      }
    }
    
    if (state.searchQuery.trim() !== '') {
      state.activeFilters.push({
        type: 'search',
        value: state.searchQuery,
        label: `بحث: "${state.searchQuery}"`
      });
    }
    
    // عرض وسم الفلاتر النشطة
    state.activeFilters.forEach(filter => {
      const tag = document.createElement('span');
      tag.className = 'inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full';
      
      tag.innerHTML = `
        ${filter.label}
        <button class="mr-1 text-blue-600 hover:text-blue-800 remove-filter" data-type="${filter.type}">
          ×
        </button>
      `;
      
      filterTags.appendChild(tag);
    });
    
    // إضافة مستمعي الأحداث لأزرار إزالة الفلاتر
    document.querySelectorAll('.remove-filter').forEach(btn => {
      btn.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        removeFilter(type);
      });
    });
  }
  
  // إزالة فلتر معين
  function removeFilter(type) {
    if (type === 'track') {
      state.selectedTrack = 'all';
      trackFilter.value = 'all';
    } else if (type === 'course') {
      state.selectedCourse = 'all';
      courseFilter.value = 'all';
    } else if (type === 'search') {
      state.searchQuery = '';
      searchInput.value = '';
    }
    
    populateCourseFilter();
    renderVideos();
    updateFilterTags();
  }
  
  // فتح نافذة مشغل الفيديو
  function openVideoModal(videoId) {
    // في بيئة حقيقية، يمكن استخدام مكتبة مثل Fancybox أو إنشاء مودال مخصص
    // هنا نفتح الفيديو في نافذة جديدة
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    
    // بديل: عرض الفيديو في نافذة منبثقة داخل الموقع
    // يمكن تطوير هذه الوظيفة لاحقاً
  }
  
  // مشاركة الفيديو
  function shareVideo(videoTitle) {
    const url = window.location.href;
    const text = `شاهد "${videoTitle}" على CyberPath - منصة مسار الأمن السيبراني`;
    
    if (navigator.share) {
      navigator.share({
        title: videoTitle,
        text: text,
        url: url
      });
    } else {
      // نسخ الرابط إلى الحافظة
      navigator.clipboard.writeText(`${text} ${url}`)
        .then(() => {
          alert('تم نسخ رابط الفيديو إلى الحافظة');
        })
        .catch(err => {
          console.error('فشل في نسخ الرابط: ', err);
        });
    }
  }
  
  // إعداد مستمعي الأحداث
  function setupEventListeners() {
    // فلتر المسارات
    trackFilter.addEventListener('change', function() {
      state.selectedTrack = this.value;
      state.selectedCourse = 'all'; // إعادة تعيين فلتر المقررات
      populateCourseFilter();
      renderVideos();
      updateFilterTags();
    });
    
    // فلتر المقررات
    courseFilter.addEventListener('change', function() {
      state.selectedCourse = this.value;
      renderVideos();
      updateFilterTags();
    });
    
    // بحث نصي
    searchInput.addEventListener('input', debounce(function() {
      state.searchQuery = this.value;
      renderVideos();
      updateFilterTags();
    }, 300));
    
    // إعادة تعيين الفلاتر
    resetFiltersBtn.addEventListener('click', function() {
      state.selectedTrack = 'all';
      state.selectedCourse = 'all';
      state.searchQuery = '';
      
      trackFilter.value = 'all';
      courseFilter.value = 'all';
      searchInput.value = '';
      
      populateCourseFilter();
      renderVideos();
      updateFilterTags();
    });
  }
  
  // دالة للمساعدة: تأخير تنفيذ الدالة
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // بدء التطبيق
  setTimeout(() => {
    init();
  }, 800); // محاكاة تحميل البيانات
});
