/**
 * Smart Inventory Management System - Main Application
 * Main application initialization and coordination
 */

class InventoryApp {
    constructor() {
        this.currentUser = null;
        this.currentView = 'login';
        this.sampleInventoryData = this.generateSampleData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkStoredAuth();
        this.setupSearch();
    }

    bindEvents() {
        // Login form handling
        const loginForm = $('#login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Header buttons
        const loginBtn = $('#login-btn');
        const logoutBtn = $('#logout-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLogin());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Action cards
        this.bindActionCards();

        // Modal handling
        this.bindModalEvents();

        // Global key handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    bindActionCards() {
        const actionCards = $$('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const cardId = e.currentTarget.id;
                this.handleActionCard(cardId);
            });
        });
    }

    bindModalEvents() {
        // Close modal buttons
        const closeButtons = $$('.close-btn, #modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Modal overlay click to close
        const modal = $('#item-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        }
    }

    setupSearch() {
        const searchInput = $('#search-input');
        if (searchInput) {
            const debouncedSearch = debounce((e) => {
                this.filterInventory(e.target.value);
            }, 300);

            searchInput.addEventListener('input', debouncedSearch);
        }
    }

    checkStoredAuth() {
        const storedUser = loadFromLocalStorage('currentUser');
        if (storedUser) {
            this.currentUser = storedUser;
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = getFormData('#login-form');
        const { 'user-id': userId, password } = formData;

        showLoading();

        // Simulate authentication delay
        setTimeout(() => {
            hideLoading();
            
            // Simple demo authentication
            const user = this.authenticateUser(userId, password);
            
            if (user) {
                this.currentUser = user;
                saveToLocalStorage('currentUser', user);
                this.showDashboard();
                showSuccess(`Welcome back, ${user.name}!`, 'Login Successful');
            } else {
                showError('Invalid user ID or password. Please check your credentials and try again.', 'Login Failed');
            }
        }, 1000);
    }

    authenticateUser(userId, password) {
        // Demo users for testing
        const demoUsers = {
            'admin001': { 
                user_id: 'admin001', 
                name: 'System Administrator', 
                role: 'admin', 
                department: 'IT',
                password: 'admin123'
            },
            'staff001': { 
                user_id: 'staff001', 
                name: 'Lab Technician', 
                role: 'staff', 
                department: 'Mechanical',
                password: 'staff123'
            },
            'student001': { 
                user_id: 'student001', 
                name: 'John Doe', 
                role: 'student', 
                department: 'Computer Science',
                password: 'student123'
            },
            'student002': { 
                user_id: 'student002', 
                name: 'Jane Smith', 
                role: 'student', 
                department: 'Electronics',
                password: 'student123'
            }
        };

        const user = demoUsers[userId];
        if (user && user.password === password) {
            // Don't return password in user object
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }

        return null;
    }

    handleLogout() {
        this.currentUser = null;
        removeFromLocalStorage('currentUser');
        this.showLogin();
        showInfo('You have been logged out successfully.', 'Logged Out');
    }

    showLogin() {
        this.currentView = 'login';
        show('#login-section');
        hide('#dashboard-section');
        show('#login-btn');
        hide('#user-info');
        
        // Remove role-specific body classes
        document.body.classList.remove('admin', 'staff', 'student');
    }

    showDashboard() {
        this.currentView = 'dashboard';
        hide('#login-section');
        show('#dashboard-section');
        hide('#login-btn');
        show('#user-info');

        // Update user info in header
        const usernameSpan = $('#username');
        if (usernameSpan && this.currentUser) {
            usernameSpan.textContent = this.currentUser.name;
        }

        // Add role-specific body class for styling
        if (this.currentUser) {
            document.body.classList.add(this.currentUser.role);
        }

        // Load and display inventory
        this.loadInventoryData();
    }

    handleActionCard(cardId) {
        if (!this.currentUser) {
            showWarning('Please log in to access this feature.');
            return;
        }

        switch (cardId) {
            case 'view-inventory-card':
                this.scrollToInventory();
                break;
            case 'checkout-card':
                this.showCheckoutDialog();
                break;
            case 'checkin-card':
                this.showCheckinDialog();
                break;
            case 'reports-card':
                if (this.currentUser.role === 'admin' || this.currentUser.role === 'staff') {
                    this.showReportsDialog();
                } else {
                    showWarning('Access denied. Admin or staff privileges required.');
                }
                break;
            default:
                showInfo('This feature is coming soon!');
        }
    }

    scrollToInventory() {
        const inventorySection = $('.inventory-section');
        if (inventorySection) {
            inventorySection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showCheckoutDialog() {
        showInfo('Check-out functionality will be implemented in the next phase.');
    }

    showCheckinDialog() {
        showInfo('Check-in functionality will be implemented in the next phase.');
    }

    showReportsDialog() {
        showInfo('Reports functionality will be implemented in the next phase.');
    }

    loadInventoryData() {
        showLoading();

        // Simulate loading delay
        setTimeout(() => {
            hideLoading();
            this.displayInventory(this.sampleInventoryData);
        }, 800);
    }

    displayInventory(items) {
        const inventoryGrid = $('#inventory-grid');
        if (!inventoryGrid) return;

        if (items.length === 0) {
            inventoryGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No Items Found</h3>
                    <p>No inventory items match your search criteria.</p>
                </div>
            `;
            return;
        }

        inventoryGrid.innerHTML = items.map(item => this.createInventoryItemCard(item)).join('');

        // Bind click events to inventory items
        const itemCards = $$('.inventory-item');
        itemCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.itemId;
                this.showItemDetails(itemId);
            });
        });
    }

    createInventoryItemCard(item) {
        const statusClass = getItemStatusClass(item);
        const statusText = getItemStatusText(item);

        return `
            <div class="inventory-item" data-item-id="${item.item_id}">
                <div class="item-header">
                    <span class="item-id">${item.item_id}</span>
                    <span class="item-status ${statusClass}">${statusText}</span>
                </div>
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${truncate(item.description, 100)}</p>
                <div class="item-details">
                    <div class="detail-item">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">${item.category}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Available:</span>
                        <span class="detail-value">${item.quantity_available}/${item.quantity_total}</span>
                    </div>
                </div>
                <div class="item-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${item.location}
                </div>
                <div class="item-actions">
                    ${item.quantity_available > 0 ? 
                        '<button class="btn btn-primary btn-small">Check Out</button>' : 
                        '<button class="btn btn-secondary btn-small" disabled>Unavailable</button>'
                    }
                </div>
            </div>
        `;
    }

    showItemDetails(itemId) {
        const item = this.sampleInventoryData.find(i => i.item_id === itemId);
        if (!item) return;

        const modal = $('#item-modal');
        const modalTitle = $('#modal-title');
        const modalBody = $('#modal-body');

        if (modalTitle) {
            modalTitle.textContent = item.name;
        }

        if (modalBody) {
            modalBody.innerHTML = `
                <div class="item-detail-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Item ID</label>
                            <div class="detail-value">${item.item_id}</div>
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <div class="detail-value">
                                <span class="item-status ${getItemStatusClass(item)}">
                                    ${getItemStatusText(item)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <div class="detail-value">${item.description}</div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Category</label>
                            <div class="detail-value">${item.category}</div>
                        </div>
                        <div class="form-group">
                            <label>Availability</label>
                            <div class="detail-value">${item.quantity_available} of ${item.quantity_total} available</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <div class="detail-value">${item.location}</div>
                    </div>
                </div>
            `;
        }

        showModal('#item-modal');
    }

    filterInventory(searchTerm) {
        const filter = createSearchFilter(searchTerm, ['name', 'description', 'category', 'item_id']);
        const filteredItems = this.sampleInventoryData.filter(filter);
        this.displayInventory(filteredItems);
    }

    closeAllModals() {
        hideModal('#item-modal');
    }

    generateSampleData() {
        return [
            {
                item_id: 'TOOL001',
                name: 'Digital Multimeter',
                description: 'Fluke 87V Digital Multimeter - High precision measurement device for electrical testing',
                category: 'Electronics',
                quantity_total: 10,
                quantity_available: 8,
                location: 'Electronics Lab - Shelf A1',
                status: 'available',
                low_stock_threshold: 3
            },
            {
                item_id: 'TOOL002',
                name: 'Oscilloscope',
                description: 'Tektronix TDS2012C Digital Storage Oscilloscope - 2-channel, 100MHz bandwidth',
                category: 'Electronics',
                quantity_total: 5,
                quantity_available: 4,
                location: 'Electronics Lab - Bench 1',
                status: 'available',
                low_stock_threshold: 2
            },
            {
                item_id: 'TOOL003',
                name: 'Soldering Iron',
                description: 'Weller WE1010NA Digital Soldering Station - Temperature controlled with stand',
                category: 'Electronics',
                quantity_total: 15,
                quantity_available: 2,
                location: 'Electronics Lab - Shelf B2',
                status: 'available',
                low_stock_threshold: 5
            },
            {
                item_id: 'MECH001',
                name: 'Vernier Caliper',
                description: 'Digital Vernier Caliper 150mm - High precision measurement tool with LCD display',
                category: 'Mechanical',
                quantity_total: 20,
                quantity_available: 18,
                location: 'Mechanical Lab - Cabinet 1',
                status: 'available',
                low_stock_threshold: 5
            },
            {
                item_id: 'MECH002',
                name: 'Micrometer',
                description: 'External Micrometer 0-25mm - Precision measurement instrument for mechanical parts',
                category: 'Mechanical',
                quantity_total: 12,
                quantity_available: 0,
                location: 'Mechanical Lab - Cabinet 1',
                status: 'available',
                low_stock_threshold: 3
            },
            {
                item_id: 'COMP001',
                name: 'Arduino Uno',
                description: 'Arduino Uno R3 Development Board - Microcontroller board with USB connectivity',
                category: 'Computing',
                quantity_total: 25,
                quantity_available: 20,
                location: 'Computer Lab - Storage A',
                status: 'available',
                low_stock_threshold: 8
            },
            {
                item_id: 'COMP002',
                name: 'Raspberry Pi',
                description: 'Raspberry Pi 4 Model B - Single board computer with 4GB RAM',
                category: 'Computing',
                quantity_total: 15,
                quantity_available: 12,
                location: 'Computer Lab - Storage A',
                status: 'available',
                low_stock_threshold: 5
            }
        ];
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.inventoryApp = new InventoryApp();
    
    // Show welcome message
    setTimeout(() => {
        showInfo('Welcome to Smart Inventory Management System! Please log in to access the system.', 'Welcome');
    }, 1000);
});