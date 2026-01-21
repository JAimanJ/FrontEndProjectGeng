// Get income from storage, default to 0 if empty
const getIncome = () => parseFloat(localStorage.getItem("income")) || 0;

// Get expenses array from storage, default to empty list if none
const getExpenses = () => JSON.parse(localStorage.getItem("expenses")) || [];

// Current filter state
let currentFilter = 'all';
let dropdownOpen = false;

// Toggle dropdown
function toggleFilterDropdown() {
  const dropdown = document.getElementById('filterDropdown');
  const arrow = document.getElementById('dropdownArrow');
  
  if (!dropdown || !arrow) return;
  
  dropdownOpen = !dropdownOpen;
  
  if (dropdownOpen) {
    dropdown.classList.remove('hidden');
    arrow.style.transform = 'rotate(180deg)';
  } else {
    dropdown.classList.add('hidden');
    arrow.style.transform = 'rotate(0deg)';
  }
}

// Filter expenses based on date range
function filterExpensesByDate(expenses, filter) {
  if (filter === 'all') return expenses;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return expenses.filter(exp => {
    if (!exp.timestamp) return true; // Include old entries without timestamp
    
    const expDate = new Date(exp.timestamp);
    
    switch(filter) {
      case 'today':
        const expDay = new Date(expDate.getFullYear(), expDate.getMonth(), expDate.getDate());
        return expDay.getTime() === today.getTime();
        
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return expDate >= weekAgo;
        
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        return expDate >= monthAgo;
        
      default:
        return true;
    }
  });
}

function renderDashboard() {
  const totalUI = document.getElementById("totalSpending");
  const listUI = document.getElementById("expenseList");
  const remainingUI = document.getElementById("remainingBudget");

  if (!totalUI || !listUI || !remainingUI) return;

  const allExpenses = getExpenses();
  const expenses = filterExpensesByDate(allExpenses, currentFilter);
  const income = getIncome();
  let totalSpending = 0;

  listUI.innerHTML = "";

  if (expenses.length === 0) {
    listUI.innerHTML = '<p class="text-gray-500 text-center py-4">No expenses found for this period.</p>';
  } else {
    expenses.forEach((exp) => {
      const amt = parseFloat(exp.amount) || 0;

      // Find the actual index in the full array for deletion
      const actualIndex = allExpenses.findIndex(e => 
        e.amount === exp.amount && 
        e.name === exp.name && 
        e.type === exp.type && 
        e.timestamp === exp.timestamp
      );

      if (exp.type !== "income") {
        totalSpending += amt;
      }

      const isIncome = exp.type === "income";
      
      // Format date if available
      let dateStr = "";
      if (exp.timestamp) {
        const date = new Date(exp.timestamp);
        dateStr = date.toLocaleDateString('en-MY', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        });
      }

      const itemDiv = document.createElement("div");
      itemDiv.className = "flex justify-between items-center border-b pb-2";
      itemDiv.innerHTML = `
        <div class="flex items-center gap-3">
          <button onclick="deleteExpense(${actualIndex})"
            class="bg-white text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-xs font-bold">
            Delete
          </button>
          <div>
            <span class="font-bold text-sm text-gray-800">${isIncome ? "Income" : exp.name}</span>
            ${dateStr ? `<div class="text-xs text-gray-500">${dateStr}</div>` : ''}
          </div>
        </div>
        <div class="${isIncome ? "text-green-600" : "text-red-500"} font-bold text-sm">
          ${isIncome ? "+RM" : "-RM"}${amt.toFixed(2)}
        </div>
      `;

      listUI.appendChild(itemDiv);
    });
  }

  totalUI.innerText = totalSpending.toFixed(2);
  remainingUI.innerText = (income - totalSpending).toFixed(2);
  
  // Update dropdown display
  updateDropdownDisplay();
}

function updateDropdownDisplay() {
  const dropdownBtn = document.getElementById('filterDropdownBtn');
  if (!dropdownBtn) return;
  
  const filterNames = {
    'all': 'All Time',
    'today': 'Today',
    'week': 'This Week',
    'month': 'This Month'
  };
  
  dropdownBtn.innerHTML = `
    <span>${filterNames[currentFilter]}</span>
    <svg id="dropdownArrow" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  `;
}

function updateFilterButtons() {
  const buttons = document.querySelectorAll('[onclick^="setFilter"]');
  buttons.forEach(btn => {
    const filter = btn.getAttribute('onclick').match(/'(\w+)'/)[1];
    if (filter === currentFilter) {
      btn.className = 'px-4 py-2 border-2 border-blue-600 bg-blue-50 rounded-lg font-semibold text-blue-600';
    } else {
      btn.className = 'px-4 py-2 border rounded-lg hover:bg-gray-50';
    }
  });
}

function setFilter(filter) {
  currentFilter = filter;
  dropdownOpen = false;
  const dropdown = document.getElementById('filterDropdown');
  if (dropdown) dropdown.classList.add('hidden');
  const arrow = document.getElementById('dropdownArrow');
  if (arrow) arrow.style.transform = 'rotate(0deg)';
  renderDashboard();
}

// Delete expenses / income
function deleteExpense(index) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  const expenses = getExpenses();
  const item = expenses[index];

  if (item.type === "income") {
    const currentIncome = getIncome();
    const incomeToRemove = parseFloat(item.amount) || 0;
    const newIncome = currentIncome - incomeToRemove;

    localStorage.setItem(
      "income",
      Math.max(newIncome, 0).toFixed(2)
    );
  }

  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  renderDashboard();
}

// Handling the form
const budgetForm = document.getElementById("budgetForm");

if (budgetForm) {
  budgetForm.onsubmit = (e) => {
    e.preventDefault();

    const incomeInput = document.getElementById("income");
    const expCat = document.getElementById("expCat");
    const expAmount = document.getElementById("expAmount");

    const incVal = incomeInput ? incomeInput.value.trim() : "";
    const nameVal = expCat ? expCat.value : "";
    const amtVal = expAmount ? expAmount.value.trim() : "";

    const expenses = getExpenses();
    const timestamp = new Date().toISOString();

    // Income handling
    if (incVal !== "") {
      const currentIncome = getIncome();
      const addedIncome = parseFloat(incVal);

      if (!isNaN(addedIncome) && addedIncome >= 0) {
        const newTotal = currentIncome + addedIncome;
        localStorage.setItem("income", newTotal.toFixed(2));

        expenses.push({
          type: "income",
          name: "Income",
          amount: addedIncome.toFixed(2),
          timestamp: timestamp
        });
      } else {
        alert("Income must be a valid non-negative number.");
        return;
      }
    }

    // Expenses
    const expenseNumber = parseFloat(amtVal);

    if (isNaN(expenseNumber) || expenseNumber <= 0) {
      alert("Expense amount must be a valid number greater than 0.");
      return;
    }

    expenses.push({
      type: "expense",
      name: nameVal,
      amount: expenseNumber.toFixed(2),
      timestamp: timestamp
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    alert("Success! Your expense has been submitted.");
    window.location.href = "trackMoney.html";
  };
}

renderDashboard();