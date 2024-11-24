import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
  products: [],
  customers: [],
  loading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Product actions
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const { oldName, newProduct } = action.payload;
      // Update product in products array
      const productIndex = state.products.findIndex(p => p.name === oldName);
      if (productIndex !== -1) {
        state.products[productIndex] = newProduct;
      }
      
      // Update product references in invoices
      state.invoices = state.invoices.map(invoice => {
        if (invoice.productName === oldName) {
          const newTotal = calculateTotal(newProduct.unitPrice, invoice.quantity, newProduct.tax);
          return {
            ...invoice,
            productName: newProduct.name,
            unitPrice: newProduct.unitPrice,
            tax: newProduct.tax,
            totalAmount: newTotal,
          };
        }
        return invoice;
      });
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.name !== action.payload);
    },

    // Customer actions
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const { oldName, newCustomer } = action.payload;
      // Update customer in customers array
      const customerIndex = state.customers.findIndex(c => c.customerName === oldName);
      if (customerIndex !== -1) {
        state.customers[customerIndex] = newCustomer;
      }

      // Update customer references in invoices
      state.invoices = state.invoices.map(invoice => {
        if (invoice.customerName === oldName) {
          return {
            ...invoice,
            customerName: newCustomer.customerName,
            phoneNumber: newCustomer.phoneNumber,
          };
        }
        return invoice;
      });
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(c => c.customerName !== action.payload);
    },

    // Invoice actions
    addInvoice: (state, action) => {
      const invoice = action.payload;
      state.invoices.push(invoice);

      // Update product quantity
      const product = state.products.find(p => p.name === invoice.productName);
      if (product) {
        product.quantity = Math.max(0, product.quantity - invoice.quantity);
      }

      // Update customer total purchase
      const customer = state.customers.find(c => c.customerName === invoice.customerName);
      if (customer) {
        customer.totalPurchaseAmount = (parseFloat(customer.totalPurchaseAmount || 0) + invoice.totalAmount).toFixed(2);
        customer.lastPurchase = new Date().toISOString();
      }
    },
    updateInvoice: (state, action) => {
      const index = state.invoices.findIndex(i => i.serialNumber === action.payload.serialNumber);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    deleteInvoice: (state, action) => {
      state.invoices = state.invoices.filter(i => i.serialNumber !== action.payload);
    },

    // Bulk actions
    setInitialData: (state, action) => {
      const { invoices, products, customers } = action.payload;
      state.invoices = invoices || [];
      state.products = products || [];
      state.customers = customers || [];
    },
  },
});

const calculateTotal = (unitPrice, quantity, tax) => {
  const subtotal = unitPrice * quantity;
  return parseFloat((subtotal + (subtotal * tax / 100)).toFixed(2));
};

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  setInitialData,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
