let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;
let portfolioValue = 0;
let transactions = [];

function showForm(form) {
  document.getElementById("signup-form").style.display = form === 'signup' ? "block" : "none";
  document.getElementById("login-form").style.display = form === 'login' ? "block" : "none";
  document.getElementById("dashboard").style.display = "none";
}

function createAccount(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (users.find(u => u.email === email)) {
    alert("Email already registered.");
    return;
  }

  const newUser = { name, email, password, portfolio: 0, history: [] };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created. You can now log in.");
  showForm('login');
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    alert("Invalid login credentials.");
    return;
  }

  currentUser = user;
  transactions = user.history || [];
  portfolioValue = user.portfolio || 0;
  document.getElementById("user-name").innerText = currentUser.name;
  document.getElementById("portfolio-value").innerText = portfolioValue.toFixed(2);
  updateTransactionHistory();
  generatePortfolioChart();

  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

function handleInvestment(event) {
  event.preventDefault();

  const type = document.getElementById("investment-type").value;
  const amount = parseFloat(document.getElementById("investment-amount").value);

  if (!type || isNaN(amount) || amount <= 0) {
    alert("Please choose an investment type and enter a valid amount.");
    return;
  }

  invest(type, amount);
  document.getElementById("investment-type").value = "";
  document.getElementById("investment-amount").value = "";
}

function invest(type, amount) {
  portfolioValue += amount;
  transactions.push(`${type} - Invested $${amount}`);
  currentUser.portfolio = portfolioValue;
  currentUser.history = transactions;
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("portfolio-value").innerText = portfolioValue.toFixed(2);
  updateTransactionHistory();
  generatePortfolioChart();

  const feedback = document.getElementById("investment-feedback");
  feedback.innerText = `✅ You successfully invested $${amount} in ${type}.`;
  setTimeout(() => {
    feedback.innerText = "";
  }, 4000);
}

function updateTransactionHistory() {
  const historyList = document.getElementById("transaction-history");
  historyList.innerHTML = "";
  transactions.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    historyList.appendChild(li);
  });
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    currentUser = null;
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "none";
  }
}

function generatePortfolioChart() {
  const ctx = document.getElementById("portfolio-graph").getContext("2d");
  const values = transactions.map((_, i) => 100 + i * 20);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: transactions.map((_, i) => `Tx ${i + 1}`),
      datasets: [{
        label: 'Portfolio Growth',
        data: values,
        borderColor: '#00c9a7',
        backgroundColor: 'rgba(0, 201, 167, 0.1)',
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
