document.addEventListener("DOMContentLoaded", () => {
  let sections = document.querySelectorAll("section");
  let navLinks = document.querySelectorAll("header nav a");
  let menuIcon = document.querySelector("#menu-icon");
  let navbar = document.querySelector(".navbar");

  // Toggle navbar and menu icon on click
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
    menuIcon.classList.toggle("bx-menu");
    menuIcon.classList.toggle("bx-x");
  });

  // Close navbar and reset icon when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("active");
      menuIcon.classList.add("bx-menu");
      menuIcon.classList.remove("bx-x");
    });
  });

  // Handle scroll to update active class
  window.onscroll = () => {
    sections.forEach((sec) => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 150;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href").substring(1) === id) {
            link.classList.add("active");
          }
        });
      }
    });

    // Sticky header
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 100);
  };

  // Handle click to update active class and scroll
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      const href = link.getAttribute("href");
      const targetSection = document.querySelector(href);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, null, href);
      }
    });
  });

  // Form submission handler for Formspree
  window.handleSubmit = function (event) {
    event.preventDefault();
    const form = document.getElementById("contactForm");
    const thankYouMessage = document.getElementById("thankYouMessage");

    if (form.checkValidity()) {
      console.log("Form is valid, sending data to:", form.action);
      const formData = new FormData(form);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          console.log("Response status:", response.status, response.statusText);
          console.log("Response headers:", [...response.headers.entries()]);
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(
                `HTTP error! Status: ${response.status} ${response.statusText}, Body: ${text}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Server response:", data);
          if (data.success) {
            thankYouMessage.style.display = "block";
            form.reset();
            setTimeout(() => {
              thankYouMessage.style.display = "none";
            }, 3000);
          } else {
            alert("Error: " + (data.error || "Form submission failed."));
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          alert(
            "An error occurred while submitting the form: " + error.message
          );
        });
    } else {
      console.log("Form validation failed");
      alert("Please fill out all required fields correctly.");
    }
  };
});
