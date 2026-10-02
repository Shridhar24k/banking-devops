const API = "http://localhost:5050/api";

let token = localStorage.getItem("token");
let selectedAccount = null;


// REGISTER

async function register() {

    const name =
        document.getElementById("registerName").value;

    const email =
        document.getElementById("registerEmail").value;

    const password =
        document.getElementById("registerPassword").value;

    const response = await fetch(`${API}/auth/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    const data = await response.json();

    document.getElementById("registerMessage").innerText =
        data.message;
}


// LOGIN

async function login() {

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    const response = await fetch(`${API}/auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (response.ok) {

        token = data.token;

        localStorage.setItem("token", token);

        document
            .getElementById("loginSection")
            .classList.add("hidden");

        document
            .getElementById("registerSection")
            .classList.add("hidden");

        document
            .getElementById("dashboard")
            .classList.remove("hidden");

        loadAccounts();

    } else {

        document.getElementById("loginMessage").innerText =
            data.message;
    }
}


// CREATE BANK ACCOUNT

async function createBankAccount() {

    const response = await fetch(`${API}/accounts`, {

        method: "POST",

        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    alert(data.message);

    loadAccounts();
}


// LOAD ACCOUNTS

async function loadAccounts() {

    const response = await fetch(`${API}/accounts`, {

        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const accounts = await response.json();

    const container =
        document.getElementById("accounts");

    container.innerHTML = "";

    accounts.forEach(account => {

        const div = document.createElement("div");

        div.className = "account";

        div.innerHTML = `
            <h3>Account</h3>

            <p>
                Account Number:
                ${account.accountNumber}
            </p>

            <p>
                Balance:
                ₹${account.balance}
            </p>
        `;

        div.onclick = function () {
            selectedAccount = account;
            alert("Account selected");
        };

        container.appendChild(div);
    });
}


// DEPOSIT

async function deposit() {

    if (!selectedAccount) {
        alert("Select an account first");
        return;
    }

    const amount =
        Number(document.getElementById("depositAmount").value);

    const response = await fetch(
        `${API}/transactions/deposit`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                accountId: selectedAccount._id,
                amount
            })
        }
    );

    const data = await response.json();

    alert(data.message);

    loadAccounts();
}


// WITHDRAW

async function withdraw() {

    if (!selectedAccount) {
        alert("Select an account first");
        return;
    }

    const amount =
        Number(document.getElementById("withdrawAmount").value);

    const response = await fetch(
        `${API}/transactions/withdraw`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                accountId: selectedAccount._id,
                amount
            })
        }
    );

    const data = await response.json();

    alert(data.message);

    loadAccounts();
}


// TRANSACTIONS

async function loadTransactions() {

    if (!selectedAccount) {
        alert("Select an account first");
        return;
    }

    const response = await fetch(
        `${API}/transactions/${selectedAccount._id}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const transactions = await response.json();

    const container =
        document.getElementById("transactions");

    container.innerHTML = "";

    transactions.forEach(transaction => {

        const div = document.createElement("div");

        div.className = "transaction";

        div.innerHTML = `
            <strong>${transaction.type}</strong>
            <br>
            Amount: ₹${transaction.amount}
            <br>
            ${transaction.description}
        `;

        container.appendChild(div);
    });
}


// LOGOUT

function logout() {

    localStorage.removeItem("token");

    token = null;

    location.reload();
}