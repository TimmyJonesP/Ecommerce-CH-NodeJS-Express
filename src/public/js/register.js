const form = document.getElementById("signupForm");
const btn = document.getElementById("redirectLogin");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  const url = "/api/register";
  const headers = {
    "Content-Type": "application/json",
  };
  const method = "POST";
  const body = JSON.stringify(obj);

  fetch(url, {
    headers,
    method,
    body,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      window.location.href = "/api/login";
    })
    .catch((error) => console.log(error));
});

btn.addEventListener("click", () => {
  const url = "/api/register/redirect";
  const method = "GET";

  fetch(url, { method })
    .then((res) => {
      window.location.href = "/api/login";
    })
    .catch((err) => {
      console.log(err);
    });
});
