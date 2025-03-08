let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let totalIncome = 0;
let totalExpenses = 0;
let currentBalance = 0;

const transactionTypeSelect = document.getElementById('transaction-type-select');
const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const descriptionInput = document.getElementById('description-input');
const addBtn = document.getElementById('add-btn');
const resetBtn = document.getElementById('reset-btn');
const transactionTableBody = document.getElementById('transaction-table-body');
const currentBalanceSpan = document.getElementById('current-balance');
const totalIncomeSpan = document.getElementById('total-income');
const totalExpensesSpan = document.getElementById('total-expenses');
const incomeBar = document.getElementById('income-bar');
const expenseBar = document.getElementById('expense-bar');

function updateUI() {
    transactionTableBody.innerHTML = '';
    totalIncome = 0;
    totalExpenses = 0;
    
    transactions.forEach(transaction => {
        const row = transactionTableBody.insertRow();
        row.innerHTML = `
            <td>${transaction.type}</td>
            <td>${transaction.category}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.description}</td>
            <td><button class="edit-btn">Edit</button></td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        row.querySelector('.edit-btn').addEventListener('click', () => editTransaction(transaction));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteTransaction(transaction));

        if (transaction.type === 'Income') {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });

    currentBalance = totalIncome - totalExpenses;
    currentBalanceSpan.textContent = currentBalance.toFixed(2);
    totalIncomeSpan.textContent = totalIncome.toFixed(2);
    totalExpensesSpan.textContent = totalExpenses.toFixed(2);
    
    const total = totalIncome + totalExpenses;
    incomeBar.style.width = total > 0 ? (totalIncome / total) * 100 + '%' : '0%';
    expenseBar.style.width = total > 0 ? (totalExpenses / total) * 100 + '%' : '0%';

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction() {
    const type = transactionTypeSelect.value;
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value;

    if (!amount || !description) {
        alert('Please provide valid amount and description.');
        return;
    }

    const transaction = { type, category, amount, description };
    transactions.push(transaction);

    amountInput.value = '';
    descriptionInput.value = '';

    updateUI();
}

function editTransaction(transaction) {
    transactionTypeSelect.value = transaction.type;
    categorySelect.value = transaction.category;
    amountInput.value = transaction.amount;
    descriptionInput.value = transaction.description;

    deleteTransaction(transaction);
}

function deleteTransaction(transaction) {
    transactions = transactions.filter(t => t !== transaction);
    updateUI();
}

function resetData() {
    localStorage.removeItem('transactions');
    transactions = [];
    updateUI();
}

addBtn.addEventListener('click', addTransaction);
resetBtn.addEventListener('click', resetData);

// Initial load
updateUI();