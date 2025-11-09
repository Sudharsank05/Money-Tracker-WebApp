// Storage utility for managing expenses, targets, and goals in localStorage

const Storage = {
    // Keys for localStorage
    KEYS: {
        EXPENSES: 'money_tracker_expenses',
        MONTHLY_TARGET: 'money_tracker_monthly_target',
        GOAL: 'money_tracker_goal',
        REMINDER_TIME: 'money_tracker_reminder_time',
        THEME: 'money_tracker_theme'
    },

    // ===== Expense Operations =====
    
    /**
     * Get all expenses
     * @returns {Array} Array of expense objects
     */
    getExpenses() {
        const expenses = localStorage.getItem(this.KEYS.EXPENSES);
        return expenses ? JSON.parse(expenses) : [];
    },

    /**
     * Save an expense
     * @param {Object} expense - Expense object with id, amount, category, description, date, paymentMethod, timestamp
     * @returns {boolean} Success status
     */
    saveExpense(expense) {
        try {
            const expenses = this.getExpenses();
            expenses.push(expense);
            localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify(expenses));
            return true;
        } catch (error) {
            console.error('Error saving expense:', error);
            return false;
        }
    },

    /**
     * Update an expense
     * @param {string} id - Expense ID
     * @param {Object} updatedExpense - Updated expense object
     * @returns {boolean} Success status
     */
    updateExpense(id, updatedExpense) {
        try {
            const expenses = this.getExpenses();
            const index = expenses.findIndex(exp => exp.id === id);
            if (index !== -1) {
                expenses[index] = { ...expenses[index], ...updatedExpense };
                localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify(expenses));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating expense:', error);
            return false;
        }
    },

    /**
     * Delete an expense
     * @param {string} id - Expense ID
     * @returns {boolean} Success status
     */
    deleteExpense(id) {
        try {
            const expenses = this.getExpenses();
            const filtered = expenses.filter(exp => exp.id !== id);
            localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting expense:', error);
            return false;
        }
    },

    /**
     * Get expenses for a specific date
     * @param {string} date - Date string in YYYY-MM-DD format
     * @returns {Array} Array of expenses for that date
     */
    getExpensesByDate(date) {
        const expenses = this.getExpenses();
        return expenses.filter(exp => exp.date === date);
    },

    /**
     * Get expenses for a specific month
     * @param {string} month - Month string in YYYY-MM format
     * @returns {Array} Array of expenses for that month
     */
    getExpensesByMonth(month) {
        const expenses = this.getExpenses();
        return expenses.filter(exp => exp.date.startsWith(month));
    },

    /**
     * Get expenses within a date range
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Array} Array of expenses in the range
     */
    getExpensesByDateRange(startDate, endDate) {
        const expenses = this.getExpenses();
        return expenses.filter(exp => {
            return exp.date >= startDate && exp.date <= endDate;
        });
    },

    // ===== Monthly Target Operations =====

    /**
     * Get monthly target
     * @returns {number|null} Monthly target amount or null if not set
     */
    getMonthlyTarget() {
        const target = localStorage.getItem(this.KEYS.MONTHLY_TARGET);
        return target ? parseFloat(target) : null;
    },

    /**
     * Set monthly target
     * @param {number|null} amount - Target amount, or null to clear
     * @returns {boolean} Success status
     */
    setMonthlyTarget(amount) {
        try {
            if (amount === null || amount === undefined) {
                localStorage.removeItem(this.KEYS.MONTHLY_TARGET);
            } else {
                localStorage.setItem(this.KEYS.MONTHLY_TARGET, amount.toString());
            }
            return true;
        } catch (error) {
            console.error('Error setting monthly target:', error);
            return false;
        }
    },

    // ===== Goal Operations =====

    /**
     * Get savings goal
     * @returns {Object|null} Goal object with amount and date, or null if not set
     */
    getGoal() {
        const goal = localStorage.getItem(this.KEYS.GOAL);
        return goal ? JSON.parse(goal) : null;
    },

    /**
     * Set savings goal
     * @param {number} amount - Target amount to save
     * @param {string} targetDate - Target date in YYYY-MM-DD format
     * @returns {boolean} Success status
     */
    setGoal(amount, targetDate) {
        try {
            const goal = {
                amount: amount,
                targetDate: targetDate,
                createdAt: new Date().toISOString()
            };
            localStorage.setItem(this.KEYS.GOAL, JSON.stringify(goal));
            return true;
        } catch (error) {
            console.error('Error setting goal:', error);
            return false;
        }
    },

    /**
     * Clear goal
     * @returns {boolean} Success status
     */
    clearGoal() {
        try {
            localStorage.removeItem(this.KEYS.GOAL);
            return true;
        } catch (error) {
            console.error('Error clearing goal:', error);
            return false;
        }
    },

    // ===== Reminder Time Operations =====

    /**
     * Get reminder time
     * @returns {string|null} Reminder time in HH:MM format or null if not set
     */
    getReminderTime() {
        return localStorage.getItem(this.KEYS.REMINDER_TIME);
    },

    /**
     * Set reminder time
     * @param {string} time - Time in HH:MM format
     * @returns {boolean} Success status
     */
    setReminderTime(time) {
        try {
            localStorage.setItem(this.KEYS.REMINDER_TIME, time);
            return true;
        } catch (error) {
            console.error('Error setting reminder time:', error);
            return false;
        }
    },

    // ===== Theme Operations =====

    /**
     * Get theme
     * @returns {string} Theme ('light' or 'dark')
     */
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    },

    /**
     * Set theme
     * @param {string} theme - Theme ('light' or 'dark')
     * @returns {boolean} Success status
     */
    setTheme(theme) {
        try {
            localStorage.setItem(this.KEYS.THEME, theme);
            return true;
        } catch (error) {
            console.error('Error setting theme:', error);
            return false;
        }
    },

    // ===== Data Export/Import =====

    /**
     * Export all data as JSON
     * @returns {string} JSON string of all data
     */
    exportData() {
        const data = {
            expenses: this.getExpenses(),
            monthlyTarget: this.getMonthlyTarget(),
            goal: this.getGoal(),
            reminderTime: this.getReminderTime(),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    },

    /**
     * Import data from JSON
     * @param {string} jsonData - JSON string of data to import
     * @returns {boolean} Success status
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.expenses && Array.isArray(data.expenses)) {
                localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify(data.expenses));
            }
            
            if (data.monthlyTarget !== undefined) {
                this.setMonthlyTarget(data.monthlyTarget);
            }
            
            if (data.goal) {
                localStorage.setItem(this.KEYS.GOAL, JSON.stringify(data.goal));
            }
            
            if (data.reminderTime) {
                this.setReminderTime(data.reminderTime);
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    /**
     * Clear all data
     * @returns {boolean} Success status
     */
    clearAllData() {
        try {
            localStorage.removeItem(this.KEYS.EXPENSES);
            localStorage.removeItem(this.KEYS.MONTHLY_TARGET);
            localStorage.removeItem(this.KEYS.GOAL);
            localStorage.removeItem(this.KEYS.REMINDER_TIME);
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }
};

