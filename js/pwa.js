// PWA Installation and Service Worker Registration

const PWA = {
    deferredPrompt: null,
    installBtn: null,
    installStatus: null,

    /**
     * Initialize PWA functionality
     */
    init() {
        this.installBtn = document.getElementById('installBtn');
        this.installStatus = document.getElementById('installStatus');

        // Register service worker
        this.registerServiceWorker();

        // Handle install prompt
        this.setupInstallPrompt();

        // Check if already installed
        this.checkIfInstalled();
    },

    /**
     * Register service worker
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js', {
                    scope: './'
                });
                console.log('Service Worker registered successfully:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    },

    /**
     * Setup install prompt
     */
    setupInstallPrompt() {
        // Listen for beforeinstallprompt event (Android)
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Show install button
            if (this.installBtn) {
                this.installBtn.style.display = 'block';
            }
            if (this.installStatus) {
                this.installStatus.textContent = 'Install this app on your device for a better experience';
            }
        });

        // Handle install button click
        if (this.installBtn) {
            this.installBtn.addEventListener('click', () => {
                this.installPWA();
            });
        }

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.deferredPrompt = null;
            if (this.installBtn) {
                this.installBtn.style.display = 'none';
            }
            if (this.installStatus) {
                this.installStatus.textContent = 'App installed successfully!';
            }
        });
    },

    /**
     * Install PWA
     */
    async installPWA() {
        if (!this.deferredPrompt) {
            // Show iOS installation instructions
            this.showIOSInstructions();
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            if (this.installStatus) {
                this.installStatus.textContent = 'Installing...';
            }
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        this.deferredPrompt = null;
        if (this.installBtn) {
            this.installBtn.style.display = 'none';
        }
    },

    /**
     * Check if app is already installed
     */
    checkIfInstalled() {
        // Check if running as standalone (installed)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            if (this.installBtn) {
                this.installBtn.style.display = 'none';
            }
            if (this.installStatus) {
                this.installStatus.textContent = 'App is installed ✓';
            }
            return true;
        }

        // Check if running on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
            if (this.installStatus) {
                this.installStatus.innerHTML = `
                    <strong>iOS Installation:</strong><br>
                    1. Tap the Share button <span style="font-size: 1.2em;">📤</span><br>
                    2. Select "Add to Home Screen"<br>
                    3. Tap "Add"
                `;
            }
        }

        return false;
    },

    /**
     * Show iOS installation instructions
     */
    showIOSInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
            alert('To install this app on iOS:\n\n1. Tap the Share button\n2. Select "Add to Home Screen"\n3. Tap "Add"');
        } else {
            alert('Installation is not available. Please use Chrome or Edge browser on Android, or follow iOS instructions if on iPhone/iPad.');
        }
    },

    /**
     * Show update notification
     */
    showUpdateNotification() {
        if (confirm('A new version of the app is available. Reload to update?')) {
            window.location.reload();
        }
    }
};

// Initialize PWA when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PWA.init();
});

