import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  activeFlag: false,
  cartFlag: false,
  orderBulkIds: [],
  orderSteadFastBulkOrders: [],
  commonFlag: "",
  commonData: null,
  query: "",
  sidebarFlag: false,
  sidebarOpen: false,
};

export const Slice = createSlice({
  name: "Slice",
  initialState,
  reducers: {
    addActiveFlag: (state, action) => {
      state.activeFlag = action.payload;
    },
    addCartFlag: (state, action) => {
      state.cartFlag = action.payload;
    },
    // -----------------------------------------------------
    addBulkOrders: (state, action) => {
      if (!state.orderBulkIds.includes(action.payload)) {
        state.orderBulkIds.push(action.payload);
      }
    },
    removeBulkOrders: (state, action) => {
      state.orderBulkIds = state.orderBulkIds.filter(
        (id) => id !== action.payload
      );
    },
    addSteadFastBulkOrders: (state, action) => {
      const exists = state.orderSteadFastBulkOrders.some(
        (itm) => itm?._id === action.payload._id
      );

      if (!exists) {
        state.orderSteadFastBulkOrders.push(action.payload);
      }
    },

    removeSteadFastBulkOrders: (state, action) => {
      state.orderSteadFastBulkOrders = state.orderSteadFastBulkOrders.filter(
        (itm) => itm?._id !== action.payload
      );
    },

    // -------------------------------------------
    addCommonFlag: (state, action) => {
      state.commonFlag = action.payload;
    },
    addCommonData: (state, action) => {
      state.commonData = action.payload;
    },
    addQuery: (state, action) => {
      state.query = action.payload;
    },
    addSidebarFlag: (state, action) => {
      state.sidebarFlag = action.payload;
    },
    addSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    }
  },
});

export const {
  addActiveFlag,
  addCartFlag,
  addBulkOrders,
  removeBulkOrders,
  addSteadFastBulkOrders,
  removeSteadFastBulkOrders,
  addCommonFlag,
  addCommonData,
  addSidebarFlag,
  addQuery,
  addSidebarOpen,
} = Slice.actions;

export default Slice.reducer;
