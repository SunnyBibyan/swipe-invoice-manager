import { createSelector } from '@reduxjs/toolkit';

// Base selector
const selectDashboard = state => state.dashboard;

// Memoized selectors
export const selectDashboardState = createSelector(
  [selectDashboard],
  (dashboard) => ({
    invoices: dashboard.invoices || [],
    products: dashboard.products || [],
    customers: dashboard.customers || []
  })
);

// Individual selectors for specific data
export const selectInvoices = createSelector(
  [selectDashboard],
  (dashboard) => dashboard.invoices || []
);

export const selectProducts = createSelector(
  [selectDashboard],
  (dashboard) => dashboard.products || []
);

export const selectCustomers = createSelector(
  [selectDashboard],
  (dashboard) => dashboard.customers || []
);

// FileUpload specific selector
export const selectFileUploadState = createSelector(
  [selectDashboard],
  (dashboard) => ({
    loading: dashboard.loading || false,
    error: dashboard.error || null
  })
);
