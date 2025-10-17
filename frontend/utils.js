/**
 * Smart Inventory Management System - Utility Functions
 * Common utility functions used throughout the application
 */

// DOM Utilities
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Show/Hide elements
function show(element) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.style.display = '';
        element.classList.remove('hidden');
    }
}

function hide(element) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.style.display = 'none';
        element.classList.add('hidden');
    }
}

// Loading spinner utilities
function showLoading() {
    show('#loading-spinner');
}

function hideLoading() {
    hide('#loading-spinner');
}

// Notification system
function showNotification(message, type = 'info', title = '', duration = 5000) {
    const container = $('#notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    notification.innerHTML = `
        <i class="fas ${iconMap[type]} notification-icon ${type}"></i>
        <div class="notification-content">
            ${title ? `<div class="notification-title">${title}</div>` : ''}
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);

    // Auto-remove notification after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    return notification;
}

// Success notification
function showSuccess(message, title = 'Success') {
    return showNotification(message, 'success', title);
}

// Error notification
function showError(message, title = 'Error') {
    return showNotification(message, 'error', title);
}

// Warning notification
function showWarning(message, title = 'Warning') {
    return showNotification(message, 'warning', title);
}

// Info notification
function showInfo(message, title = 'Info') {
    return showNotification(message, 'info', title);
}

// Modal utilities
function showModal(modalId) {
    const modal = $(modalId);
    if (modal) {
        modal.classList.add('show');
        // Ensure modal is visible and accessible
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = $(modalId);
    if (modal) {
        modal.classList.remove('show');
        // Hide visually and for assistive tech
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Form utilities
function getFormData(formElement) {
    if (typeof formElement === 'string') {
        formElement = $(formElement);
    }
    
    const formData = new FormData(formElement);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

function resetForm(formElement) {
    if (typeof formElement === 'string') {
        formElement = $(formElement);
    }
    
    if (formElement) {
        formElement.reset();
    }
}

// Validation utilities
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRequired(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
}

function validateMinLength(value, minLength) {
    return value && value.length >= minLength;
}

// Date utilities
function formatDate(dateString, format = 'MM/DD/YYYY') {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'MM/DD/YYYY':
        default:
            return `${month}/${day}/${year}`;
    }
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString();
}

function isOverdue(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
}

// String utilities
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str, maxLength, suffix = '...') {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') str = String(str);
    if (!maxLength || str.length <= maxLength) return str;
    const safeMax = Math.max(0, maxLength - (suffix ? suffix.length : 0));
    return str.substr(0, safeMax) + (suffix || '');
}

function sanitizeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Search and filter utilities
function createSearchFilter(searchTerm, fields = []) {
    const term = (searchTerm || '').toString().toLowerCase().trim();

    return (item) => {
        if (!term) return true;

        // If no specific fields provided, search all string values
        if (fields.length === 0) {
            return Object.values(item).some(value => 
                String(value || '').toLowerCase().includes(term)
            );
        }

        // Search specific fields
        return fields.some(field => {
            const value = getNestedProperty(item, field) || '';
            return String(value).toLowerCase().includes(term);
        });
    };
}

function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Local storage utilities
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return defaultValue;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Failed to remove from localStorage:', error);
        return false;
    }
}

// Debounce utility for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Array utilities
function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const value = getNestedProperty(item, key);
        (groups[value] = groups[value] || []).push(item);
        return groups;
    }, {});
}

function sortBy(array, key, direction = 'asc') {
    return [...array].sort((a, b) => {
        const valueA = getNestedProperty(a, key);
        const valueB = getNestedProperty(b, key);
        
        if (valueA < valueB) {
            return direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
}

// Event utilities
function addGlobalClickListener(callback) {
    document.addEventListener('click', callback);
}

function addGlobalKeyListener(callback) {
    document.addEventListener('keydown', callback);
}

// Status utilities for inventory items
function getItemStatusClass(item) {
    if (item.quantity_available === 0) {
        return 'status-out-of-stock';
    } else if (item.quantity_available <= item.low_stock_threshold) {
        return 'status-low-stock';
    } else if (item.status === 'maintenance') {
        return 'status-maintenance';
    } else {
        return 'status-available';
    }
}

function getItemStatusText(item) {
    if (item.quantity_available === 0) {
        return 'Out of Stock';
    } else if (item.quantity_available <= item.low_stock_threshold) {
        return 'Low Stock';
    } else if (item.status === 'maintenance') {
        return 'Maintenance';
    } else {
        return 'Available';
    }
}

// Export utilities for potential module use
window.InventoryUtils = {
    show, hide, showLoading, hideLoading,
    showNotification, showSuccess, showError, showWarning, showInfo,
    showModal, hideModal,
    getFormData, resetForm,
    validateEmail, validateRequired, validateMinLength,
    formatDate, formatDateTime, isOverdue,
    capitalize, truncate, sanitizeHtml,
    createSearchFilter, getNestedProperty,
    saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage,
    debounce, groupBy, sortBy,
    getItemStatusClass, getItemStatusText
};