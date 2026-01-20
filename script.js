// Get income from storage, default to 0 if empty
const getIncome = () => parseFloat(localStorage.getItem('income')) || 0;
// Get expenses array from storage, default to empty list if none
const getExpenses = () => JSON.parse(localStorage.getItem('expenses')) || [];

function renderDashboard() {
    const totalUI = document.getElementById('totalSpending'); // The RM 0.00 span
    const listUI = document.getElementById('expenseList'); // The history container
    const remainingUI = document.getElementById('remainingBudget'); // The budget span

    if (!totalUI) return; // If these elements aren't on the page, stop here

    const expenses = getExpenses(); // Load current expenses
    const income = getIncome(); // Load current income
    let totalSpending = 0; // Start counter at zero

    listUI.innerHTML = ""; // Clear the list before redrawing

    expenses.forEach((exp, index) => {
        const amt = parseFloat(exp.amount) || 0; // Convert string to number
        totalSpending += amt; // Add to total sum
        
        // Create the HTML for each row
        const itemDiv = document.createElement('div');
        itemDiv.className = "flex justify-between items-center border-b pb-2";
        itemDiv.innerHTML = `
            <div class="flex items-center gap-3">
                <button onclick="deleteExpense(${index})" class="bg-white text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-xs font-bold">Delete</button>
                <span class="font-bold text-sm text-gray-800">${exp.name}</span>
            </div>
            <div class="text-red-500 font-bold text-sm">-RM${amt.toFixed(2)}</div>
        `;
        listUI.appendChild(itemDiv); // Add the row to the list
    });

    totalUI.innerText = totalSpending.toFixed(2); // Update Total UI
    remainingUI.innerText = (income - totalSpending).toFixed(2); // Update Remaining UI
}

function deleteExpense(index) {
    if (confirm("Are you sure you want to delete this expense?")) { // Ask user for confirmation
        let expenses = getExpenses(); // Get current list
        expenses.splice(index, 1); // Remove the item at this position
        localStorage.setItem('expenses', JSON.stringify(expenses)); // Save back to storage
        renderDashboard(); // Refresh the screen immediately
    }
}

const budgetForm = document.getElementById('budgetForm'); // Find the form
if (budgetForm) {
    // If income is already set, hide the income input section
    if (localStorage.getItem('income')) {
        document.getElementById('incomeSection').classList.add('hidden');
    }

    budgetForm.onsubmit = (e) => {
        e.preventDefault(); // Stop page from refreshing
        
        const incVal = document.getElementById('income').value; // Get income value
        const nameVal = document.getElementById('expCat').value; // Get category value
        const amtVal = document.getElementById('expAmount').value; // Get amount value

        if (incVal) localStorage.setItem('income', incVal); // Save income if typed
        
        const expenses = getExpenses(); // Get current expenses
        expenses.push({ name: nameVal, amount: amtVal }); // Add the new one
        localStorage.setItem('expenses', JSON.stringify(expenses)); // Save the list
        alert('Success! Your expense has been submitted.')

        window.location.href = 'dashboard.html'; // Go to dashboard
    };
}

// Run the dashboard update whenever a page loads
renderDashboard();