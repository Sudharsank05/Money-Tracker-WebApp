# Money Tracker Website

A mobile-responsive web application to track your daily expenses with voice input, detailed reports, monthly targets, savings goals, and daily reminders.

## Features

- **Voice Input**: Add expenses using voice commands (e.g., "Spent 500 rupees on food")
- **Daily & Monthly Reports**: Visual charts showing spending patterns by category and time
- **Monthly Target Limit**: Set and track monthly spending limits with progress indicators
- **Savings Goals**: Set savings goals with automatic calculation of daily/weekly savings needed
- **Daily Reminders**: Browser notifications to remind you to track expenses
- **Mobile Responsive**: Fully optimized for mobile devices with touch-friendly UI
- **Offline Support**: Works completely offline using browser localStorage
- **Data Export/Import**: Backup and restore your expense data
- **PWA Support**: Install as an app on Android and iOS devices

## Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Storage**: Browser localStorage
- **Charts**: Chart.js library
- **Voice Recognition**: Web Speech API
- **Notifications**: Browser Notifications API

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Edge, Firefox, Safari)
- For voice input: Chrome or Edge (best support for Web Speech API)
- For notifications: Browser with notification support
- For PWA: Web server (HTTPS or localhost) - see [PWA-SETUP.md](PWA-SETUP.md)

### Installation

#### Basic Usage (File System)
1. Clone or download this repository
2. Open `index.html` in your web browser
3. No server or build process required - it works directly from the file system!

#### PWA Installation (Recommended)
1. Set up a web server (see [PWA-SETUP.md](PWA-SETUP.md))
2. Generate icons using `generate-icons.html` or `generate-icons.js`
3. Install as PWA on your device for app-like experience
4. See [PWA-SETUP.md](PWA-SETUP.md) for detailed instructions

### Usage

1. **Add Expenses**:
   - Click the microphone button and speak your expense (e.g., "Spent 200 rupees on transport")
   - Or manually fill in the expense form
   - Select category, payment method, and date

2. **View Dashboard**:
   - See today's spending and monthly total
   - View monthly target progress
   - Check recent expenses

3. **Daily Report**:
   - Select a date to view spending for that day
   - See category breakdown (pie chart)
   - View spending by time of day (bar chart)

4. **Monthly Report**:
   - Select a month to view spending trends
   - See daily spending trend (line chart)
   - View category breakdown (doughnut chart)
   - Check top spending categories

5. **Goals & Targets**:
   - Set monthly spending limit
   - Set savings goal with target date
   - View calculated daily/weekly savings needed

6. **Settings**:
   - Set daily reminder time
   - Export data for backup
   - Import previously exported data
   - Clear all data (use with caution!)

## Voice Input Examples

- "Spent 500 rupees on food"
- "Add expense 200 for transport"
- "500 food delivery"
- "1000 shopping"
- "300 medicine"

The app will automatically extract:
- Amount (numbers in the speech)
- Category (based on keywords)
- Description (remaining text)

## Browser Compatibility

- **Chrome/Edge**: Full support (voice input, notifications, all features)
- **Firefox**: Most features work (voice input may have limited support)
- **Safari**: Basic features work (voice input and notifications have limited support)

## Data Storage

All data is stored locally in your browser's localStorage. This means:
- ✅ Works completely offline
- ✅ No server required
- ✅ Your data stays on your device
- ⚠️ Clearing browser data will delete your expenses
- ⚠️ Data is specific to each browser/device

**Important**: Regularly export your data for backup!

## Categories

Default expense categories:
- Food & Dining
- Transportation
- Shopping
- Bills & Utilities
- Entertainment
- Healthcare
- Others

## Payment Methods

Track expenses by payment method:
- Cash
- UPI (PhonePe, Google Pay, Paytm, etc.)
- Credit Card
- Debit Card
- Online Banking

## Tips

1. **Voice Input**: Works best in a quiet environment. Speak clearly and include the amount.
2. **Daily Reminders**: Enable browser notifications for daily reminders to track expenses.
3. **Monthly Targets**: Set realistic monthly targets to help control spending.
4. **Savings Goals**: Use the savings goal feature to plan for specific purchases or savings targets.
5. **Data Backup**: Export your data regularly to avoid data loss.

## Troubleshooting

### Voice input not working
- Make sure you're using Chrome or Edge browser
- Check microphone permissions in browser settings
- Ensure you're in a quiet environment

### Notifications not showing
- Check browser notification permissions
- Make sure you've set a reminder time in Settings
- Some browsers require the page to be open for notifications

### Charts not displaying
- Check browser console for errors
- Ensure Chart.js library is loaded (requires internet connection for CDN)

## License

This project is open source and available for personal use.

## Support

For issues or questions, please check the browser console for error messages.

