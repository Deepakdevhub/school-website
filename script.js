let currentLang = 'en';
let currentSlide = 0;

function loadContent() {
  fetch('/content.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('schoolName').textContent = data[currentLang].schoolName;
      document.getElementById('bioTitle').textContent = data[currentLang].bioTitle;
      document.getElementById('bioContent').textContent = data[currentLang].bioContent || 'School bio not available.';
      document.getElementById('facultyTitle').textContent = data[currentLang].facultyTitle;
      document.getElementById('resultsTitle').textContent = data[currentLang].resultsTitle;
      document.getElementById('noticeTitle').textContent = data[currentLang].noticeTitle;
      document.getElementById('addressTitle').textContent = data[currentLang].addressTitle;
      document.getElementById('addressContent').textContent = data[currentLang].addressContent;

      const slideshowContainer = document.querySelector('.slideshow-container');
      slideshowContainer.innerHTML = '';
      if (data.slideshow && data.slideshow.length > 0) {
        data.slideshow.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.className = 'slide';
          slideshowContainer.appendChild(img);
        });
      } else {
        slideshowContainer.innerHTML = '<p class="text-center text-gray-600">No slideshow images available.</p>';
      }

      const facultyList = document.getElementById('facultyList');
      facultyList.innerHTML = '';
      if (data[currentLang].faculty && data[currentLang].faculty.length > 0) {
        data[currentLang].faculty.forEach(member => {
          const div = document.createElement('div');
          div.className = 'text-center';
          div.innerHTML = `
            <img src="${member.photo}" alt="${member.name}" class="w-32 h-32 rounded-full mx-auto mb-2 object-cover" onerror="this.src='https://via.placeholder.com/128'">
            <h3 class="text-lg font-semibold">${member.name}</h3>
            <p class="text-gray-600">${member.role}</p>
            <p class="text-sm text-gray-500">${member.bio}</p>
          `;
          facultyList.appendChild(div);
        });
      } else {
        facultyList.innerHTML = '<p class="text-center text-red-600">Unable to load faculty list.</p>';
      }

      const resultsContent = document.getElementById('resultsContent');
      if (data[currentLang].results) {
        resultsContent.innerHTML = `
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-200">
                <th class="border border-gray-300 p-2">Total Students</th>
                <th class="border border-gray-300 p-2">Above 90%</th>
                <th class="border border-gray-300 p-2">Above 80%</th>
                <th class="border border-gray-300 p-2">Above 60%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 p-2 text-center">${data[currentLang].results.total}</td>
                <td class="border border-gray-300 p-2 text-center">${data[currentLang].results.above90}</td>
                <td class="border border-gray-300 p-2 text-center">${data[currentLang].results.above80}</td>
                <td class="border border-gray-300 p-2 text-center">${data[currentLang].results.above60}</td>
              </tr>
            </tbody>
          </table>
        `;
      } else {
        resultsContent.innerHTML = '<p class="text-center text-red-600">Unable to load results.</p>';
      }

      const noticeBoard = document.getElementById('noticeBoard');
      noticeBoard.innerHTML = '';
      if (data[currentLang].notices && data[currentLang].notices.length > 0) {
        data[currentLang].notices.forEach(notice => {
          const div = document.createElement('div');
          div.className = 'notice-card';
          div.innerHTML = `
            <h3 class="text-lg font-semibold">${notice.title}</h3>
            <p class="text-gray-600">${notice.date}</p>
            ${notice.attachment ? `<a href="${notice.attachment}" class="text-blue-600 hover:underline" target="_blank">Download Attachment</a>` : ''}
          `;
          noticeBoard.appendChild(div);
        });
      } else {
        noticeBoard.innerHTML = '<p class="text-center text-red-600">No notices available.</p>';
      }

      document.getElementById('facebookLink').href = data.socialLinks.facebook;
      document.getElementById('twitterLink').href = data.socialLinks.twitter;
      document.getElementById('instagramLink').href = data.socialLinks.instagram;
      document.getElementById('youtubeLink').href = data.socialLinks.youtube;
    })
    .catch(error => {
      console.error('Error loading content:', error);
      document.getElementById('bioContent').textContent = 'Unable to load school bio. Please try again later.';
      document.getElementById('facultyList').innerHTML = '<p class="text-center text-red-600">Unable to load faculty list. Please try again later.</p>';
    });
}

function changeLanguage(lang) {
  currentLang = lang;
  loadContent();
}

function showSlide(index) {
  const slides = document.querySelector('.slideshow-container');
  const totalSlides = slides.children.length;
  if (totalSlides === 0) return;
  if (index >= totalSlides) currentSlide = 0;
  else if (index < 0) currentSlide = totalSlides - 1;
  else currentSlide = index;
  slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

setInterval(() => showSlide(currentSlide + 1), 5000);

document.addEventListener('DOMContentLoaded', () => {
  loadContent();

  const sections = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));
});