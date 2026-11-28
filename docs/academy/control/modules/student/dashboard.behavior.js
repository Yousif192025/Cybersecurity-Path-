/** سلوك لوحة الطالب — من المرجع المعتمد (P0.5) */
export function bindStudentDashboard() {

      const navButtons = [...document.querySelectorAll('.nav-item[data-view]')];
      const views = [...document.querySelectorAll('[data-view-panel]')];
      const crumb = document.getElementById('crumb-title');
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('mobile-overlay');
      const menuButton = document.getElementById('mobile-menu');
      const notificationButton = document.getElementById('notification-button');
      const notificationPanel = document.getElementById('notification-panel');
      const toast = document.getElementById('toast');
      let toastTimer;

      function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
      }

      function closeMobileMenu() {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'فتح القائمة');
      }

      function openView(name) {
        let target = views.find(view => view.dataset.viewPanel === name);
        if (!target) return;
        views.forEach(view => { view.hidden = view !== target; });
        navButtons.forEach(button => {
          const selected = button.dataset.view === name;
          button.classList.toggle('active', selected);
          if (selected) button.setAttribute('aria-current', 'page');
          else button.removeAttribute('aria-current');
        });
        crumb.textContent = target.dataset.heading || 'مساحة الطالب';
        document.title = `${target.dataset.heading || 'مساحة الطالب'} | CyberPath Academy`;
        closeMobileMenu();
        notificationPanel.hidden = true;
        notificationButton.setAttribute('aria-expanded', 'false');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      navButtons.forEach(button => button.addEventListener('click', () => openView(button.dataset.view)));
      document.querySelectorAll('[data-open-view]').forEach(button => button.addEventListener('click', () => openView(button.dataset.openView)));

      menuButton.addEventListener('click', () => {
        const opening = !sidebar.classList.contains('open');
        sidebar.classList.toggle('open', opening);
        overlay.classList.toggle('show', opening);
        menuButton.setAttribute('aria-expanded', String(opening));
        menuButton.setAttribute('aria-label', opening ? 'إغلاق القائمة' : 'فتح القائمة');
      });
      overlay.addEventListener('click', closeMobileMenu);
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          closeMobileMenu();
          notificationPanel.hidden = true;
          notificationButton.setAttribute('aria-expanded', 'false');
        }
      });
      window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMobileMenu(); });

      notificationButton.addEventListener('click', () => {
        const opening = notificationPanel.hidden;
        notificationPanel.hidden = !opening;
        notificationButton.setAttribute('aria-expanded', String(opening));
      });
      document.addEventListener('click', event => {
        if (!notificationPanel.hidden && !notificationPanel.contains(event.target) && !notificationButton.contains(event.target)) {
          notificationPanel.hidden = true;
          notificationButton.setAttribute('aria-expanded', 'false');
        }
      });

      // تقويم توضيحي بلا أحداث أو مواعيد مزعومة.
      const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
      let calendarCursor = new Date();
      const monthName = document.getElementById('month-name');
      const calendarDays = document.getElementById('calendar-days');
      const secondaryLabels = [...document.querySelectorAll('[data-month-label]')];
      const secondaryDays = [...document.querySelectorAll('[data-calendar-days]')];
      function renderCalendar(label, target) {
        const year = calendarCursor.getFullYear();
        const month = calendarCursor.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const count = new Date(year, month + 1, 0).getDate();
        label.textContent = `${months[month]} ${year}`;
        target.replaceChildren();
        for (let blank = 0; blank < firstDay; blank++) {
          const cell = document.createElement('span');
          cell.className = 'day empty';
          cell.setAttribute('aria-hidden', 'true');
          target.appendChild(cell);
        }
        for (let day = 1; day <= count; day++) {
          const cell = document.createElement('span');
          cell.className = 'day';
          cell.textContent = String(day);
          cell.setAttribute('aria-label', `${day} ${months[month]} ${year}`);
          if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            cell.classList.add('today');
            cell.setAttribute('aria-current', 'date');
          } else if (new Date(year, month, day) > new Date()) {
            cell.classList.add('future-hint');
          }
          target.appendChild(cell);
        }
      }
      function renderAllCalendars() {
        renderCalendar(monthName, calendarDays);
        secondaryLabels.forEach((label, index) => renderCalendar(label, secondaryDays[index]));
      }
      document.getElementById('prev-month').addEventListener('click', () => { calendarCursor.setMonth(calendarCursor.getMonth() - 1); renderAllCalendars(); });
      document.getElementById('next-month').addEventListener('click', () => { calendarCursor.setMonth(calendarCursor.getMonth() + 1); renderAllCalendars(); });
      document.querySelectorAll('[data-calendar-prev]').forEach(button => button.addEventListener('click', () => { calendarCursor.setMonth(calendarCursor.getMonth() - 1); renderAllCalendars(); }));
      document.querySelectorAll('[data-calendar-next]').forEach(button => button.addEventListener('click', () => { calendarCursor.setMonth(calendarCursor.getMonth() + 1); renderAllCalendars(); }));
      renderAllCalendars();

      // البحث يعمل على بطاقات الموارد المرئية في قسم المكتبة فقط.
      const search = document.getElementById('global-search');
      const resourceCards = [...document.querySelectorAll('.resource-card.searchable')];
      const noResults = document.getElementById('no-results');
      function searchResources() {
        const query = search.value.trim().toLocaleLowerCase('ar');
        let visible = 0;
        resourceCards.forEach(card => {
          const text = `${card.dataset.search || ''} ${card.textContent || ''}`.toLocaleLowerCase('ar');
          const match = !query || text.includes(query);
          card.hidden = !match;
          if (match) visible++;
        });
        noResults.hidden = visible !== 0;
        if (query) {
          openView('resources');
          search.focus({ preventScroll: true });
        }
      }
      search.addEventListener('input', searchResources);
      search.addEventListener('search', searchResources);
      search.addEventListener('keydown', event => { if (event.key === 'Escape') { search.value = ''; searchResources(); } });

      function bindSwitch(id, className, message) {
        const control = document.getElementById(id);
        control.addEventListener('click', () => {
          const on = control.getAttribute('aria-checked') !== 'true';
          control.setAttribute('aria-checked', String(on));
          control.classList.toggle('on', on);
          document.body.classList.toggle(className, on);
          showToast(message);
        });
      }
      bindSwitch('large-text-toggle', 'large-text', 'تم تحديث حجم النص في هذه الصفحة فقط.');
      bindSwitch('contrast-toggle', 'high-contrast', 'تم تحديث التباين في هذه الصفحة فقط.');

      const todayLabel = document.getElementById('today-label');
      todayLabel.textContent = new Intl.DateTimeFormat('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    
}
