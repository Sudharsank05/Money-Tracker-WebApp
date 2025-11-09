// Main application logic

const App = {
    currentSection: 'dashboard',
    currentDate: new Date().toISOString().split('T')[0],

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupDateInputs();
        this.setupVoiceInput();
        this.setupNavigation();
        this.loadDashboard();
        this.loadSettings();
        Notifications.init();
    },

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Expense form submission
        const expenseForm = document.getElementById('expenseForm');
        if (expenseForm) {
            expenseForm.addEventListener('submit', (e) => this.handleExpenseSubmit(e));
        }

        // Monthly target form
        const setMonthlyTargetBtn = document.getElementById('setMonthlyTarget');
        if (setMonthlyTargetBtn) {
            setMonthlyTargetBtn.addEventListener('click', () => this.handleSetMonthlyTarget());
        }

        // Goal form submission
        const goalForm = document.getElementById('goalForm');
        if (goalForm) {
            goalForm.addEventListener('submit', (e) => this.handleGoalSubmit(e));
        }

        // Settings
        const saveReminderTimeBtn = document.getElementById('saveReminderTime');
        if (saveReminderTimeBtn) {
            saveReminderTimeBtn.addEventListener('click', () => this.handleSaveReminderTime());
        }

        const exportDataBtn = document.getElementById('exportData');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.handleExportData());
        }

        const importDataBtn = document.getElementById('importData');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => document.getElementById('importFile').click());
        }

        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => this.handleImportData(e));
        }

        const clearDataBtn = document.getElementById('clearData');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.handleClearData());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Daily report date change
        const dailyReportDate = document.getElementById('dailyReportDate');
        if (dailyReportDate) {
            dailyReportDate.addEventListener('change', () => this.loadDailyReport());
        }

        // Monthly report month change
        const monthlyReportMonth = document.getElementById('monthlyReportMonth');
        if (monthlyReportMonth) {
            monthlyReportMonth.addEventListener('change', () => this.loadMonthlyReport());
        }
    },

    /**
     * Setup navigation
     */
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.showSection(section);
            });
        });
    },

    /**
     * Show a specific section
     * @param {string} sectionId - Section ID to show
     */
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });

        this.currentSection = sectionId;

        // Load section-specific data
        switch (sectionId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'dailyReport':
                this.loadDailyReport();
                break;
            case 'monthlyReport':
                this.loadMonthlyReport();
                break;
            case 'goalsTargets':
                this.loadGoalsTargets();
                break;
        }
    },

    /**
     * Setup theme
     */
    setupTheme() {
        const theme = Storage.getTheme();
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    },

    /**
     * Toggle theme
     */
    toggleTheme() {
        const currentTheme = Storage.getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        Storage.setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
    },

    /**
     * Setup date inputs with today's date as default
     */
    setupDateInputs() {
        const expenseDate = document.getElementById('expenseDate');
        if (expenseDate) {
            expenseDate.value = this.currentDate;
            expenseDate.max = this.currentDate; // Don't allow future dates
        }

        const dailyReportDate = document.getElementById('dailyReportDate');
        if (dailyReportDate) {
            dailyReportDate.value = this.currentDate;
        }

        const monthlyReportMonth = document.getElementById('monthlyReportMonth');
        if (monthlyReportMonth) {
            const now = new Date();
            monthlyReportMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }

        // Update current date display
        const currentDateEl = document.getElementById('currentDate');
        if (currentDateEl) {
            const date = new Date();
            currentDateEl.textContent = date.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    },

    /**
     * Setup voice input callback
     */
    setupVoiceInput() {
        VoiceInput.setResultCallback((data) => {
            if (data.amount) {
                document.getElementById('amount').value = data.amount;
            }
            if (data.category) {
                document.getElementById('category').value = data.category;
            }
            if (data.description) {
                document.getElementById('description').value = data.description;
            }
        });
    },

    /**
     * Handle expense form submission
     */
    handleExpenseSubmit(e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const date = document.getElementById('expenseDate').value;

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!category) {
            alert('Please select a category');
            return;
        }

        const expense = {
            id: Date.now().toString(),
            amount: amount,
            category: category,
            description: description || category,
            paymentMethod: paymentMethod,
            date: date,
            timestamp: new Date().toISOString()
        };

        if (Storage.saveExpense(expense)) {
            // Reset form
            document.getElementById('expenseForm').reset();
            document.getElementById('expenseDate').value = this.currentDate;

            // Show success message
            Notifications.showNotification('Expense Added', `₹${amount.toFixed(2)} added successfully!`);

            // Reload dashboard if on it
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            }
        } else {
            alert('Error saving expense. Please try again.');
        }
    },

    /**
     * Load dashboard data
     */
    loadDashboard() {
        // Calculate today's total
        const todayExpenses = Storage.getExpensesByDate(this.currentDate);
        const todayTotal = todayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        // Calculate this month's total
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const monthExpenses = Storage.getExpensesByMonth(month);
        const monthTotal = monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        // Update stats
        document.getElementById('todayTotal').textContent = `₹${todayTotal.toFixed(2)}`;
        document.getElementById('monthTotal').textContent = `₹${monthTotal.toFixed(2)}`;

        // Update monthly target progress
        this.updateMonthlyTargetProgress();

        // Show recent expenses
        this.displayRecentExpenses(todayExpenses.slice(-5).reverse());
    },

    /**
     * Update monthly target progress
     */
    updateMonthlyTargetProgress() {
        const monthlyTarget = Storage.getMonthlyTarget();
        const progressContainer = document.getElementById('targetProgressContainer');
        const progressText = document.getElementById('targetProgressText');
        const progressFill = document.getElementById('targetProgressFill');

        if (!monthlyTarget) {
            if (progressContainer) progressContainer.style.display = 'none';
            return;
        }

        if (progressContainer) progressContainer.style.display = 'block';

        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const monthExpenses = Storage.getExpensesByMonth(month);
        const monthTotal = monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        const percentage = Math.min((monthTotal / monthlyTarget) * 100, 100);
        const remaining = monthlyTarget - monthTotal;

        if (progressText) {
            progressText.textContent = `₹${monthTotal.toFixed(2)} / ₹${monthlyTarget.toFixed(2)} (${percentage.toFixed(1)}%)`;
        }

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
            if (percentage > 100) {
                progressFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
            }
        }
    },

    /**
     * Display recent expenses
     */
    displayRecentExpenses(expenses) {
        const listEl = document.getElementById('recentExpensesList');
        if (!listEl) return;

        if (expenses.length === 0) {
            listEl.innerHTML = '<p class="empty-state">No expenses yet. Add your first expense!</p>';
            return;
        }

        listEl.innerHTML = expenses.map(exp => `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-category">${exp.category}</div>
                    <div class="expense-description">${exp.description}</div>
                    <div class="expense-meta">${exp.paymentMethod} • ${this.formatDate(exp.date)}</div>
                </div>
                <div class="expense-amount">₹${parseFloat(exp.amount).toFixed(2)}</div>
            </div>
        `).join('');
    },

    /**
     * Load daily report
     */
    loadDailyReport() {
        const dateInput = document.getElementById('dailyReportDate');
        const date = dateInput ? dateInput.value : this.currentDate;

        const expenses = Storage.getExpensesByDate(date);
        const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        // Update summary
        document.getElementById('dailyTotal').textContent = `₹${total.toFixed(2)}`;
        document.getElementById('dailyCount').textContent = expenses.length;

        // Render charts
        if (expenses.length > 0) {
            Charts.renderDailyCategoryChart('dailyCategoryChart', expenses);
            Charts.renderDailyTimeChart('dailyTimeChart', expenses);
        } else {
            Charts.destroyChart('dailyCategoryChart');
            Charts.destroyChart('dailyTimeChart');
        }

        // Display expenses
        this.displayExpenseList('dailyExpensesList', expenses);
    },

    /**
     * Load monthly report
     */
    loadMonthlyReport() {
        const monthInput = document.getElementById('monthlyReportMonth');
        const month = monthInput ? monthInput.value : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

        const expenses = Storage.getExpensesByMonth(month);
        const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        const monthlyTarget = Storage.getMonthlyTarget();
        const remaining = monthlyTarget ? monthlyTarget - total : null;

        // Update summary
        document.getElementById('monthlyTotal').textContent = `₹${total.toFixed(2)}`;
        document.getElementById('monthlyTargetDisplay').textContent = monthlyTarget ? `₹${monthlyTarget.toFixed(2)}` : 'Not Set';
        document.getElementById('monthlyRemaining').textContent = remaining !== null ? `₹${remaining.toFixed(2)}` : '-';
        if (remaining !== null && remaining < 0) {
            document.getElementById('monthlyRemaining').style.color = 'var(--danger-color)';
        }

        // Render charts
        if (expenses.length > 0) {
            Charts.renderMonthlyTrendChart('monthlyTrendChart', expenses);
            Charts.renderMonthlyCategoryChart('monthlyCategoryChart', expenses);
            this.displayTopCategories(expenses);
        } else {
            Charts.destroyChart('monthlyTrendChart');
            Charts.destroyChart('monthlyCategoryChart');
            document.getElementById('topCategoriesList').innerHTML = '<p class="empty-state">No expenses this month</p>';
        }
    },

    /**
     * Display top categories
     */
    displayTopCategories(expenses) {
        const categoryTotals = {};
        expenses.forEach(exp => {
            const category = exp.category || 'Others';
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(exp.amount);
        });

        const sorted = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const listEl = document.getElementById('topCategoriesList');
        if (!listEl) return;

        if (sorted.length === 0) {
            listEl.innerHTML = '<p class="empty-state">No categories</p>';
            return;
        }

        listEl.innerHTML = sorted.map(([category, amount]) => `
            <div class="category-item">
                <span class="category-name">${category}</span>
                <span class="category-amount">₹${amount.toFixed(2)}</span>
            </div>
        `).join('');
    },

    /**
     * Display expense list
     */
    displayExpenseList(listId, expenses) {
        const listEl = document.getElementById(listId);
        if (!listEl) return;

        if (expenses.length === 0) {
            listEl.innerHTML = '<p class="empty-state">No expenses found</p>';
            return;
        }

        listEl.innerHTML = expenses.map(exp => `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-category">${exp.category}</div>
                    <div class="expense-description">${exp.description}</div>
                    <div class="expense-meta">${exp.paymentMethod} • ${this.formatDate(exp.date)}</div>
                </div>
                <div class="expense-amount">₹${parseFloat(exp.amount).toFixed(2)}</div>
            </div>
        `).join('');
    },

    /**
     * Load goals and targets
     */
    loadGoalsTargets() {
        // Load monthly target
        const monthlyTarget = Storage.getMonthlyTarget();
        const targetDisplay = document.getElementById('monthlyTargetDisplayCard');
        if (targetDisplay) {
            if (monthlyTarget) {
                targetDisplay.innerHTML = `
                    <p><strong>Current Target:</strong> ₹${monthlyTarget.toFixed(2)}</p>
                    <button class="btn btn-danger" onclick="App.clearMonthlyTarget()" style="margin-top: 0.5rem;">Clear Target</button>
                `;
            } else {
                targetDisplay.innerHTML = '<p>No monthly target set</p>';
            }
        }

        // Load goal
        const goal = Storage.getGoal();
        const goalDisplay = document.getElementById('goalDisplay');
        if (goalDisplay) {
            if (goal) {
                this.displayGoal(goal, goalDisplay);
            } else {
                goalDisplay.innerHTML = '<p>No savings goal set</p>';
            }
        }
    },

    /**
     * Display goal with calculations
     */
    displayGoal(goal, container) {
        const targetDate = new Date(goal.targetDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
        const goalAmount = goal.amount;

        // Calculate current savings (assuming expenses are negative, we'd need income tracking for real savings)
        // For now, we'll just show the goal and required savings
        const dailySavingsNeeded = daysRemaining > 0 ? goalAmount / daysRemaining : goalAmount;
        const weeklySavingsNeeded = dailySavingsNeeded * 7;

        container.innerHTML = `
            <div class="goal-info">
                <p><strong>Target Amount:</strong> ₹${goalAmount.toFixed(2)}</p>
                <p><strong>Target Date:</strong> ${this.formatDate(goal.targetDate)}</p>
                <p><strong>Days Remaining:</strong> ${daysRemaining} days</p>
            </div>
            <div class="goal-savings-needed">
                <p><strong>To achieve this goal, you need to save:</strong></p>
                <p>₹${dailySavingsNeeded.toFixed(2)} per day</p>
                <p>₹${weeklySavingsNeeded.toFixed(2)} per week</p>
            </div>
            <button class="btn btn-danger" onclick="App.clearGoal()" style="margin-top: 1rem;">Clear Goal</button>
        `;
    },

    /**
     * Handle set monthly target
     */
    handleSetMonthlyTarget() {
        const input = document.getElementById('monthlyTargetInput');
        const amount = parseFloat(input.value);

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (Storage.setMonthlyTarget(amount)) {
            input.value = '';
            this.loadGoalsTargets();
            this.loadDashboard();
            Notifications.showNotification('Target Set', `Monthly target of ₹${amount.toFixed(2)} has been set!`);
        }
    },

    /**
     * Clear monthly target
     */
    clearMonthlyTarget() {
        if (confirm('Are you sure you want to clear the monthly target?')) {
            Storage.setMonthlyTarget(null);
            this.loadGoalsTargets();
            this.loadDashboard();
        }
    },

    /**
     * Handle goal form submission
     */
    handleGoalSubmit(e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('goalAmount').value);
        const targetDate = document.getElementById('goalDate').value;

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const date = new Date(targetDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date <= today) {
            alert('Target date must be in the future');
            return;
        }

        if (Storage.setGoal(amount, targetDate)) {
            document.getElementById('goalForm').reset();
            this.loadGoalsTargets();
            Notifications.showNotification('Goal Set', `Savings goal of ₹${amount.toFixed(2)} has been set!`);
        }
    },

    /**
     * Clear goal
     */
    clearGoal() {
        if (confirm('Are you sure you want to clear the savings goal?')) {
            Storage.clearGoal();
            this.loadGoalsTargets();
        }
    },

    /**
     * Handle save reminder time
     */
    handleSaveReminderTime() {
        const timeInput = document.getElementById('reminderTime');
        const time = timeInput.value;

        if (!time) {
            alert('Please select a reminder time');
            return;
        }

        if (Storage.setReminderTime(time)) {
            // Request notification permission if not already granted
            if (Notifications.getPermissionStatus() !== 'granted') {
                Notifications.requestPermission();
            }
            alert('Reminder time saved!');
        }
    },

    /**
     * Load settings
     */
    loadSettings() {
        const reminderTime = Storage.getReminderTime();
        const reminderTimeInput = document.getElementById('reminderTime');
        if (reminderTimeInput && reminderTime) {
            reminderTimeInput.value = reminderTime;
        }
    },

    /**
     * Handle export data
     */
    handleExportData() {
        const data = Storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `money-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Handle import data
     */
    handleImportData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                if (confirm('Importing data will replace your current data. Continue?')) {
                    if (Storage.importData(event.target.result)) {
                        alert('Data imported successfully!');
                        location.reload();
                    } else {
                        alert('Error importing data. Please check the file format.');
                    }
                }
            } catch (error) {
                alert('Error reading file: ' + error.message);
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset file input
    },

    /**
     * Handle clear all data
     */
    handleClearData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
            if (confirm('This will delete all expenses, targets, and goals. Are you absolutely sure?')) {
                Storage.clearAllData();
                alert('All data has been cleared.');
                location.reload();
            }
        }
    },

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

