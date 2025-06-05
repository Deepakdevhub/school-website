/**
 * script.js
 * Handles dynamic content loading, language switching, slideshow, admission button, and more for GSSS Budhwali website.
 */

// Default language (load from localStorage if available)
let currentLang = localStorage.getItem('language') || 'en';
let slideInterval;

// Fetch content from content.json
fetch('content.json')
  .then(response => response.json())
  .then(data => {
    window.contentData = data;

    // Initial render
    renderContent(currentLang);

    // Set up header background (commented out since background is now set in CSS)
    /*
    const header = document.querySelector('header');
    if (data.headerBackground) {
      header.style.backgroundImage = `url('${data.headerBackground}')`;
    } else {
      console.warn('Header background image not set in content.json');
    }
    */

    // Set up admission button
    const admissionButton = document.getElementById('admission-open');
    const contactNumberDiv = document.getElementById('contact-number');
    if (data.contactNumber) {
      contactNumberDiv.textContent = `Contact: ${data.contactNumber}`;
      admissionButton.addEventListener('click', () => {
        contactNumberDiv.classList.toggle('visible');
      });
    } else {
      console.warn('Contact number not set in content.json');
      admissionButton.style.display = 'none';
    }

    // Set up slideshow with manual navigation
    if (data.slideshow && data.slideshow.length > 0) {
      const slideshow = document.getElementById('slideshow');
      let currentSlide = 0;

      function showSlide(index) {
        if (index < 0) index = data.slideshow.length - 1;
        if (index >= data.slideshow.length) index = 0;
        currentSlide = index;
        slideshow.innerHTML = data.slideshow.map((slide, i) => `
          <img src="${slide.image}" alt="Slide ${i + 1}" class="${i === currentSlide ? 'active' : ''}" loading="lazy">
        `).join('');
      }

      showSlide(currentSlide);

      function startSlideShow() {
        slideInterval = setInterval(() => {
          currentSlide = (currentSlide + 1) % data.slideshow.length;
          showSlide(currentSlide);
        }, 5000);
      }
      startSlideShow();

      document.getElementById('prev-slide').addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(currentSlide - 1);
        startSlideShow();
      });

      document.getElementById('next-slide').addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(currentSlide + 1);
        startSlideShow();
      });
    } else {
      document.querySelector('.slideshow-container').innerHTML = '<p>No slideshow images available.</p>';
    }
  })
  .catch(error => {
    console.error('Error loading content:', error);
    document.body.innerHTML += '<p style="text-align: center; color: red;">Error loading content. Please try again later.</p>';
  });

// Function to render content based on language
function renderContent(lang) {
  const data = window.contentData;
  document.documentElement.lang = lang;

  // Update school name
  document.getElementById('school-name').textContent = lang === 'en' ? data.en_schoolName : data.hi_schoolName;

  // Update bio
  document.getElementById('bio-title').textContent = data[lang].bioTitle;
  document.getElementById('bio-content').textContent = data[lang].bioContent;

  // Update faculty
  const facultyGrid = document.getElementById('faculty-grid');
  facultyGrid.innerHTML = '';
  document.getElementById('faculty-title').textContent = data[lang].facultyTitle;
  if (data[lang].faculty && Array.isArray(data[lang].faculty)) {
    data[lang].faculty.forEach(member => {
      const div = document.createElement('div');
      div.innerHTML = `
        <img src="${member.photo}" alt="${member.name}, ${member.role}" loading="lazy">
        <h3>${member.name}</h3>
        <p>${member.role}</p>
        <p>${member.bio}</p>
      `;
      facultyGrid.appendChild(div);
    });
  } else {
    facultyGrid.innerHTML = '<p>No faculty data available.</p>';
  }

  // Update toppers
  const toppersGrid = document.getElementById('toppers-grid');
  toppersGrid.innerHTML = '';
  document.getElementById('toppers-title').textContent = data[lang].toppersTitle;
  if (data[lang].toppers && Array.isArray(data[lang].toppers)) {
    data[lang].toppers.forEach(student => {
      const div = document.createElement('div');
      div.innerHTML = `
        <img src="${student.photo}" alt="${student.name}, ${student.position}" loading="lazy">
        <h3>${student.name}</h3>
        <p>${student.position}</p>
        <p>${student.percentage}%</p>
      `;
      toppersGrid.appendChild(div);
    });
  } else {
    toppersGrid.innerHTML = '<p>No toppers data available.</p>';
  }

  // Update results
  document.getElementById('results-title').textContent = data[lang].resultsTitle;
  document.getElementById('total-students').textContent = data.results.totalStudents || 'N/A';
  document.getElementById('above-80').textContent = data.results.above80 || 'N/A';
  document.getElementById('above-60').textContent = data.results.above60 || 'N/A';
  document.getElementById('pass-percentage').textContent = data.results.passPercentage || 'N/A';

  // Update notices
  const noticeList = document.getElementById('notice-list');
  noticeList.innerHTML = '';
  document.getElementById('notice-title').textContent = data[lang].noticeTitle;
  if (data[lang].notices && Array.isArray(data[lang].notices)) {
    data[lang].notices.forEach(notice => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${notice.title} - ${notice.date}
        ${notice.attachment ? `<a href="${notice.attachment}" target="_blank">Download</a>` : ''}
      `;
      noticeList.appendChild(li);
    });
  } else {
    noticeList.innerHTML = '<p>No notices available.</p>';
  }

  // Update contact
  document.getElementById('contact-title').textContent = data[lang].contactTitle;
  document.getElementById('contact-address').textContent = data[lang].contactAddress;
  document.getElementById('map-link').href = data.mapLink;

  // Update social links (not language-dependent)
  const socialLinks = document.getElementById('social-links');
  socialLinks.innerHTML = `
    <a href="${data.socialLinks.facebook}" target="_blank">Facebook</a>
    <a href="${data.socialLinks.twitter}" target="_blank">Twitter</a>
    <a href="${data.socialLinks.instagram}" target="_blank">Instagram</a>
    <a href="${data.socialLinks.youtube}" target="_blank">YouTube</a>
  `;
}

// Language toggle event listener
document.getElementById('language-toggle').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  localStorage.setItem('language', currentLang);
  renderContent(currentLang);
  document.getElementById('language-toggle').textContent = currentLang === 'en' ? 'हिन्दी' : 'English';
});
