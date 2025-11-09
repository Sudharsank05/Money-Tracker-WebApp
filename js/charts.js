// Chart rendering using Chart.js

const Charts = {
    chartInstances: {},

    /**
     * Destroy existing chart instance
     * @param {string} chartId - Canvas element ID
     */
    destroyChart(chartId) {
        if (this.chartInstances[chartId]) {
            this.chartInstances[chartId].destroy();
            delete this.chartInstances[chartId];
        }
    },

    /**
     * Render daily category pie chart
     * @param {string} canvasId - Canvas element ID
     * @param {Array} expenses - Array of expense objects
     */
    renderDailyCategoryChart(canvasId, expenses) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        this.destroyChart(canvasId);

        // Group expenses by category
        const categoryTotals = {};
        expenses.forEach(exp => {
            const category = exp.category || 'Others';
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(exp.amount);
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        // Generate colors
        const colors = this.generateColors(labels.length);

        const ctx = canvas.getContext('2d');
        this.chartInstances[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Render daily time-based bar chart
     * @param {string} canvasId - Canvas element ID
     * @param {Array} expenses - Array of expense objects
     */
    renderDailyTimeChart(canvasId, expenses) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        this.destroyChart(canvasId);

        // Group expenses by time of day (morning, afternoon, evening, night)
        const timeSlots = {
            'Morning (6-12)': 0,
            'Afternoon (12-17)': 0,
            'Evening (17-21)': 0,
            'Night (21-6)': 0
        };

        expenses.forEach(exp => {
            if (exp.timestamp) {
                const date = new Date(exp.timestamp);
                const hour = date.getHours();
                
                if (hour >= 6 && hour < 12) {
                    timeSlots['Morning (6-12)'] += parseFloat(exp.amount);
                } else if (hour >= 12 && hour < 17) {
                    timeSlots['Afternoon (12-17)'] += parseFloat(exp.amount);
                } else if (hour >= 17 && hour < 21) {
                    timeSlots['Evening (17-21)'] += parseFloat(exp.amount);
                } else {
                    timeSlots['Night (21-6)'] += parseFloat(exp.amount);
                }
            }
        });

        const labels = Object.keys(timeSlots);
        const data = Object.values(timeSlots);

        const ctx = canvas.getContext('2d');
        this.chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Amount (₹)',
                    data: data,
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `₹${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Render monthly trend line chart
     * @param {string} canvasId - Canvas element ID
     * @param {Array} expenses - Array of expense objects
     */
    renderMonthlyTrendChart(canvasId, expenses) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        this.destroyChart(canvasId);

        // Group expenses by date
        const dailyTotals = {};
        expenses.forEach(exp => {
            const date = exp.date;
            dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(exp.amount);
        });

        // Sort dates
        const sortedDates = Object.keys(dailyTotals).sort();
        const labels = sortedDates.map(date => {
            const d = new Date(date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        });
        const data = sortedDates.map(date => dailyTotals[date]);

        const ctx = canvas.getContext('2d');
        this.chartInstances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Spending (₹)',
                    data: data,
                    borderColor: 'rgba(99, 102, 241, 1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `₹${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Render monthly category pie chart
     * @param {string} canvasId - Canvas element ID
     * @param {Array} expenses - Array of expense objects
     */
    renderMonthlyCategoryChart(canvasId, expenses) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        this.destroyChart(canvasId);

        // Group expenses by category
        const categoryTotals = {};
        expenses.forEach(exp => {
            const category = exp.category || 'Others';
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(exp.amount);
        });

        // Sort by amount (descending) and take top 6
        const sortedCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        const labels = sortedCategories.map(([cat]) => cat);
        const data = sortedCategories.map(([, amount]) => amount);

        // If there are more categories, add "Others"
        if (Object.keys(categoryTotals).length > 6) {
            const otherTotal = Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .slice(6)
                .reduce((sum, [, amount]) => sum + amount, 0);
            if (otherTotal > 0) {
                labels.push('Others');
                data.push(otherTotal);
            }
        }

        const colors = this.generateColors(labels.length);

        const ctx = canvas.getContext('2d');
        this.chartInstances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Generate color palette for charts
     * @param {number} count - Number of colors needed
     * @returns {Array} Array of color strings
     */
    generateColors(count) {
        const baseColors = [
            'rgba(99, 102, 241, 0.8)',   // Indigo
            'rgba(139, 92, 246, 0.8)',  // Purple
            'rgba(236, 72, 153, 0.8)',  // Pink
            'rgba(251, 146, 60, 0.8)',  // Orange
            'rgba(34, 197, 94, 0.8)',   // Green
            'rgba(59, 130, 246, 0.8)',  // Blue
            'rgba(168, 85, 247, 0.8)',  // Violet
            'rgba(245, 158, 11, 0.8)',  // Amber
            'rgba(239, 68, 68, 0.8)',   // Red
            'rgba(20, 184, 166, 0.8)'    // Teal
        ];

        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
    },

    /**
     * Clear all charts
     */
    clearAll() {
        Object.keys(this.chartInstances).forEach(chartId => {
            this.destroyChart(chartId);
        });
    }
};

