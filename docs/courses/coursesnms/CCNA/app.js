// app.js - معدل لدعم تشغيل الفيديو داخل الموقع
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
  
  // عناصر المودال
  const videoModal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  
  // حالة التطبيق
  let state = {
    selectedTrack: 'all',
    selectedCourse: 'all',
    searchQuery: '',
    activeFilters: [],
    currentVideo: null
  };
  
  // تهيئة التطبيق
  function init() {
    populateTrackFilter();
    populateCourseFilter();
    renderVideos();
    setupEventListeners();
    updateVideoCount();
    setupModalEvents();
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
      videoCard.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 hover-scale';
      
      videoCard.innerHTML = `
        <div class="relative">
          <!-- صورة الفيديو -->
          <div class="h-48 bg-gray-200 relative overflow-hidden cursor-pointer video-thumbnail" data-id="${video.id}">
            <img 
              src="https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg" 
              alt="${video.title}"
              class="w-full h-full object-cover"
              onerror="this.src='https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg'; this.onerror=function(){this.src='https://via.placeholder.com/480x360/1e40af/ffffff?text=CyberPath'}"
            >
            <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              ${video.duration}
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-red-600 text-white p-4 rounded-full bg-opacity-90 hover:bg-opacity-100 transition transform hover:scale-110">
                <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                data-title="${video.title}"
              >
                <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                تشغيل الفيديو
              </button>
              <button 
                class="text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition duration-300 share-btn"
                data-title="${video.title}"
                data-id="${video.youtubeId}"
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
        const videoTitle = this.getAttribute('data-title');
        openVideoModal(videoId, videoTitle);
      });
    });
    
    // إضافة مستمعي الأحداث لصورة الفيديو
    document.querySelectorAll('.video-thumbnail').forEach(thumb => {
      thumb.addEventListener('click', function() {
        const videoId = this.getAttribute('data-id');
        const video = cyberPathVideos.videos.find(v => v.id === videoId);
        if (video) {
          openVideoModal(video.youtubeId, video.title);
        }
      });
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const videoTitle = this.getAttribute('data-title');
        const videoId = this.getAttribute('data-id');
        shareVideo(videoTitle, videoId);
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
  
  // فتح نافذة مشغل الفيديو (مودال)
  function openVideoModal(videoId, videoTitle) {
    // حفظ الفيديو الحالي في الحالة
    state.currentVideo = { id: videoId, title: videoTitle };
    
    // تحديث عنوان الصفحة بشكل مؤقت
    document.title = `${videoTitle} | CyberPath`;
    
    // تعيين رابط الفيديو في الإطار
    // نستخدم embed مع autoplay=1 وسمات إضافية
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
    modalIframe.src = embedUrl;
    
    // عرض المودال
    videoModal.classList.remove('hidden');
    videoModal.classList.add('flex');
    
    // منع التمرير في الخلفية
    document.body.style.overflow = 'hidden';
    
    // إضافة سجل للمشاهدة (يمكن حفظها في localStorage)
    addToWatchHistory(videoId, videoTitle);
  }
  
  // إغلاق نافذة الفيديو
  function closeVideoModal() {
    // إيقاف الفيديو عن طريق إزالة مصدر الإطار
    modalIframe.src = '';
    
    // إخفاء المودال
    videoModal.classList.add('hidden');
    videoModal.classList.remove('flex');
    
    // استعادة التمرير في الخلفية
    document.body.style.overflow = 'auto';
    
    // استعادة عنوان الصفحة الأصلي
    document.title = 'CyberPath | مكتبة الفيديوهات التعليمية';
    
    // مسح الفيديو الحالي من الحالة
    state.currentVideo = null;
  }
  
  // إعداد أحداث المودال
  function setupModalEvents() {
    // زر الإغلاق الموجود في المودال
    const closeBtn = videoModal.querySelector('button[onclick="closeVideo()"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeVideoModal);
    }
    
    // إغلاق المودال عند النقر خارج محتواه
    videoModal.addEventListener('click', function(e) {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
    
    // إغلاق المودال بمفتاح ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
        closeVideoModal();
      }
    });
  }
  
  // إضافة فيديو إلى سجل المشاهدة
  function addToWatchHistory(videoId, videoTitle) {
    try {
      // الحصول على السجل الحالي من localStorage
      let history = JSON.parse(localStorage.getItem('cyberpath_watch_history') || '[]');
      
      // إزالة الفيديو إذا كان موجوداً مسبقاً (لتجنب التكرار)
      history = history.filter(item => item.id !== videoId);
      
      // إضافة الفيديو الجديد في البداية
      history.unshift({
        id: videoId,
        title: videoTitle,
        watchedAt: new Date().toISOString()
      });
      
      // حفظ فقط آخر 50 فيديو
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
      
      // حفظ السجل في localStorage
      localStorage.setItem('cyberpath_watch_history', JSON.stringify(history));
    } catch (error) {
      console.error('حدث خطأ في حفظ سجل المشاهدة:', error);
    }
  }
  
  // مشاركة الفيديو
  function shareVideo(videoTitle, videoId) {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const pageUrl = window.location.href;
    const text = `شاهد "${videoTitle}" على CyberPath - منصة مسار الأمن السيبراني`;
    
    if (navigator.share) {
      navigator.share({
        title: videoTitle,
        text: text,
        url: pageUrl
      });
    } else {
      // عرض خيارات المشاركة
      const shareOptions = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 class="text-xl font-bold mb-4">مشاركة الفيديو</h3>
            <p class="mb-4">اختر طريقة للمشاركة:</p>
            <div class="flex flex-col gap-2">
              <button class="share-option bg-blue-100 text-blue-700 p-3 rounded-lg hover:bg-blue-200" data-type="link">
                نسخ رابط الفيديو على YouTube
              </button>
              <button class="share-option bg-green-100 text-green-700 p-3 rounded-lg hover:bg-green-200" data-type="page">
                نسخ رابط صفحة المكتبة
              </button>
              <button class="share-option bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200" data-type="cancel">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      `;
      
      const shareModal = document.createElement('div');
      shareModal.innerHTML = shareOptions;
      document.body.appendChild(shareModal);
      
      // إضافة مستمعي الأحداث لأزرار المشاركة
      shareModal.querySelectorAll('.share-option').forEach(btn => {
        btn.addEventListener('click', function() {
          const type = this.getAttribute('data-type');
          
          if (type === 'link') {
            navigator.clipboard.writeText(videoUrl)
              .then(() => alert('تم نسخ رابط الفيديو على YouTube إلى الحافظة'))
              .catch(err => console.error('فشل في نسخ الرابط: ', err));
          } else if (type === 'page') {
            navigator.clipboard.writeText(pageUrl)
              .then(() => alert('تم نسخ رابط صفحة المكتبة إلى الحافظة'))
              .catch(err => console.error('فشل في نسخ الرابط: ', err));
          }
          
          // إزالة نافذة المشاركة
          document.body.removeChild(shareModal);
        });
      });
      
      // إغلاق النافذة عند النقر خارجها
      shareModal.addEventListener('click', function(e) {
        if (e.target === shareModal) {
          document.body.removeChild(shareModal);
        }
      });
    }
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
  
  // جعل دالة closeVideoModal متاحة عالمياً لاستخدامها في الزر الموجود في HTML
  window.closeVideo = closeVideoModal;
  
  // بدء التطبيق
  setTimeout(() => {
    init();
  }, 800); // محاكاة تحميل البيانات
});
