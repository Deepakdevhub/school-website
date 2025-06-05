/**
 * script.js
 * Handles dynamic content loading, language switching, slideshow, admission button, and more for GSS Budhwali website.
 */

// Default language (load from localStorage if available)
let currentLang = localStorage.getItem('language') || 'en';
let slideInterval;

// Add a loading spinner
document.body.innerHTML += '<div id="loading" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 18px;">Loading...</div>';

// Fetch content from content.json
fetch('content.json')
  .then(response => response.json())
  .then(data => {
    // Store the content globally
    window.contentData = data;

    // Initial render
    renderContent(currentLang);

    // Set up header background
    const header = document.querySelector('header');
    if (data.headerBackground) {
      header.style.backgroundImage = `url('${data.headerBackground}')`;
    } else {
      console.warn('Header background image not set in content.json');
    }

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
      admissionButton.style.display = 'none'; // Hide button if no contact number
    }

    // Set up slideshow with manual navigation
    if (data.slideshow && data.slideshow.length > 0) {
      const slideshow = document.getElementById('slideshow');
      let currentSlide = 0;

      function showSlide(index) {
        if (index < 0) {
          index = data.slideshow.length - 1;
        } else if (index >= data.slideshow.length) {
          index = 0;
        }
        currentSlide = index;
        slideshow.innerHTML = `<img src="${data.slideshow[currentSlide].image}" alt="Slide ${currentSlide + 1}">`;
      }

      // Initial slide
      showSlide(currentSlide);

      // Automatic slideshow
      function startSlideShow() {
        slideInterval = setInterval(() => {
          currentSlide = (currentSlide + 1) % data.slideshow.length;
          showSlide(currentSlide);
        }, 5000);
      }
      startSlideShow();

      // Manual navigation
      document.getElementById('prev-slide').addEventListener('click', () => {
        clearInterval(slideInterval); // Stop auto slideshow
        showSlide(currentSlide - 1);
        startSlideShow(); // Restart auto slideshow
      });

      document.getElementById('next-slide').addEventListener('click', () => {
        clearInterval(slideInterval); // Stop auto slideshow
        showSlide(currentSlide + 1);
        startSlideShow(); // Restart auto slideshow
      });
    } else {
      console.warn('No slideshow images found in content.json');
      document.querySelector('.slideshow-container').innerHTML = '<p>No slideshow images available.</p>';
    }

    // Remove loading spinner
    document.getElementById('loading').remove();
  })
  .catch(error => {
    console.error('Error loading content:', error);
    document.getElementById('loading').textContent = 'Error loading content. Please try again later.';
  });

// Function to render content based on language with error handling
function renderContent(lang) {
  const data = window.contentData;

  // Fallback if language data is missing
  if (!data || !data[lang]) {
    console.error(`Content for language "${lang}" is missing in content.json`);
    const fallbackLang = lang === 'en' ? 'hi' : 'en';
    if (data[fallbackLang]) {
      console.warn(`Falling back to language "${fallbackLang}"`);
      lang = fallbackLang;
      currentLang = fallbackLang;
      localStorage.setItem('language', currentLang);
    } else {
      console.error('No content available for either language');
      document.querySelectorAll('.content-section').forEach(section => {
        section.innerHTML = '<p>Error: Content not available. Please contact the administrator.</p>';
      });
      return;
    }
  }

  // Update school name
  const schoolName = document.getElementById('school-name');
  schoolName.textContent = lang === 'en' ? data.en_schoolName : data.hi_schoolName;

  // Update bio
  const bioTitle = document.getElementById('bio-title');
  const bioContent = document.getElementById('bio-content');
  bioTitle.textContent = data[lang].bioTitle || 'Bio Title Missing';
  bioContent.textContent = data[lang].bioContent || 'Bio Content Missing';

  // Update faculty
  const facultyTitle = document.getElementById('faculty-title');
  const facultyGrid = document.getElementById('faculty-grid');
  facultyTitle.textContent = data[lang].facultyTitle || 'Faculty Title Missing';
  facultyGrid.innerHTML = '';
  if (data[lang].faculty && Array.isArray(data[lang].faculty)) {
    data[lang].faculty.forEach(member => {
      const div = document.createElement('div');
      div.innerHTML = `
        <img src="${member.photo}" alt="Photo of ${member.name}, ${member.role} at GSSS Budhwali">
        <h3>${member.name || 'Name Missing'}</h3>
        <p>${member.role || 'Role Missing'}</p>
        <p>${member.bio || 'Bio Missing'}</p>
      `;
      facultyGrid.appendChild(div);
    });
  } else {
    facultyGrid.innerHTML = '<p>No faculty data available.</p>';
  }

  // Update results
  const resultsTitle = document.getElementById('results-title');
  resultsTitle.textContent = data[lang].resultsTitle || 'Results Title Missing';
  document.getElementById('total-students').textContent = data[lang].results?.total || 'N/A';
  document.getElementById('above-90').textContent = data[lang].results?.above90 || 'N/A';
  document.getElementById('above-80').textContent = data[lang].results?.above80 || 'N/A';
  document.getElementById('above-60').textContent = data[lang].results?.above60 || 'N/A';

  // Update notices
  const noticeTitle = document.getElementById('notice-title');
  const noticeList = document.getElementById('notice-list');
  noticeTitle.textContent = data[lang].noticeTitle || 'Notices Title Missing';
  noticeList.innerHTML = '';
  if (data[lang].notices && Array.isArray(data[lang].notices)) {
    data[lang].notices.forEach(notice => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${notice.title || 'Title Missing'} - ${notice.date || 'Date Missing'}
        ${notice.attachment ? `<a href="${notice.attachment}" target="_blank">Download</a>` : ''}
      `;
      noticeList.appendChild(li);
    });
  } else {
    noticeList.innerHTML = '<p>No notices available.</p>';
  }

  // Update address
  const addressTitle = document.getElementById('address-title');
  const addressContent = document.getElementById('address-content');
  addressTitle.textContent = data[lang].addressTitle || 'Address Title Missing';
  addressContent.textContent = data[lang].addressContent || 'Address Content Missing';

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
