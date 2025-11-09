// Browser notifications for daily reminders

const Notifications = {
    permission: null,
    reminderInterval: null,
    lastReminderDate: null,

    /**
     * Initialize notifications
     */
    async init() {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        // Request permission if not already granted/denied
        if (Notification.permission === 'default') {
            this.permission = await Notification.requestPermission();
        } else {
            this.permission = Notification.permission;
        }

        // Start checking for reminders
        this.startReminderCheck();

        return this.permission === 'granted';
    },

    /**
     * Start checking for reminder time
     */
    startReminderCheck() {
        // Check every minute if it's time for reminder
        this.reminderInterval = setInterval(() => {
            this.checkReminderTime();
        }, 60000); // Check every minute

        // Also check immediately
        this.checkReminderTime();
    },

    /**
     * Stop reminder checking
     */
    stopReminderCheck() {
        if (this.reminderInterval) {
            clearInterval(this.reminderInterval);
            this.reminderInterval = null;
        }
    },

    /**
     * Check if it's time to show reminder
     */
    checkReminderTime() {
        if (this.permission !== 'granted') {
            return;
        }

        const reminderTime = Storage.getReminderTime();
        if (!reminderTime) {
            return; // No reminder time set
        }

        const now = new Date();
        const [hours, minutes] = reminderTime.split(':').map(Number);
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        // Check if current time matches reminder time (within 1 minute)
        const timeDiff = Math.abs(now - reminderDate);
        const oneMinute = 60 * 1000;

        // Check if we already sent reminder today
        const today = now.toDateString();
        if (this.lastReminderDate === today) {
            return; // Already reminded today
        }

        if (timeDiff < oneMinute && now >= reminderDate) {
            this.showDailyReminder();
            this.lastReminderDate = today;
        }
    },

    /**
     * Show daily reminder notification
     */
    showDailyReminder() {
        if (this.permission !== 'granted') {
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const todayExpenses = Storage.getExpensesByDate(today);
        const todayTotal = todayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        let message = `Don't forget to track your expenses today!`;
        
        if (todayExpenses.length > 0) {
            message = `You've spent ₹${todayTotal.toFixed(2)} today. Add any missing expenses!`;
        }

        const notification = new Notification('💰 Money Tracker Reminder', {
            body: message,
            icon: '💰',
            badge: '💰',
            tag: 'daily-reminder',
            requireInteraction: false
        });

        // Close notification after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);

        // Handle click on notification
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    },

    /**
     * Show custom notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    showNotification(title, message) {
        if (this.permission !== 'granted') {
            return;
        }

        const notification = new Notification(title, {
            body: message,
            icon: '💰',
            badge: '💰',
            requireInteraction: false
        });

        setTimeout(() => {
            notification.close();
        }, 3000);

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    },

    /**
     * Request notification permission
     * @returns {Promise<boolean>} Whether permission was granted
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            return false;
        }

        if (Notification.permission === 'granted') {
            this.permission = 'granted';
            return true;
        }

        if (Notification.permission === 'denied') {
            this.permission = 'denied';
            alert('Notification permission was denied. Please enable it in your browser settings.');
            return false;
        }

        this.permission = await Notification.requestPermission();
        
        if (this.permission === 'granted') {
            this.showNotification('Notifications Enabled', 'You will receive daily reminders to track your expenses.');
            return true;
        }

        return false;
    },

    /**
     * Get current permission status
     * @returns {string} Permission status
     */
    getPermissionStatus() {
        if (!('Notification' in window)) {
            return 'not-supported';
        }
        return Notification.permission;
    }
};

// Initialize notifications when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Request permission on first load (will be handled by user interaction)
    // We'll request it when user goes to settings or tries to set reminder time
});

