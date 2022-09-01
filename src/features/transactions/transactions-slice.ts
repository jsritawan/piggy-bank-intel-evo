import { endOfMonth } from "date-fns";
import { startOfMonth } from "date-fns";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { RootState } from "../../app/store";
import { db, transactionRef, walletRef } from "../../firebase";
import { IWallet } from "../wallets/wallets-slice";

export interface ITransaction {
  id: string;
  uid: string;
  walletId: string;
  amount: number;
  note?: string;
  categoryId: string;
  type: number;
  displayDate: number;
  createAt: number;
  updateAt: number;
}

export interface ICreateTransaction {
  amount: number;
  note?: string;
  categoryId: string;
  type: number;
  date: Date;
}

interface ITransactionState {
  transactions: ITransaction[];
  isLoading: boolean;
}

const initialState: ITransactionState = {
  transactions: [],
  isLoading: true,
};

export const fetchTransaction = createAsyncThunk<
  ITransaction[],
  { date: Date; walletId: string; uid: string },
  { state: RootState }
>("transactions/fetchTransaction", async ({ date, walletId, uid }) => {
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);

  const q = query(
    transactionRef,
    where("uid", "==", uid),
    where("walletId", "==", walletId),
    where("displayDate", ">=", startDate),
    where("displayDate", "<=", endDate),
    orderBy("displayDate", "desc"),
    orderBy("updateAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc): ITransaction => {
    const data = doc.data();
    const {
      amount,
      note,
      categoryId,
      type,
      walletId,
      displayDate,
      createAt,
      updateAt,
    } = data;

    const convertToTimestamp = (date: any) => {
      return (date as Timestamp).toDate().getTime();
    };

    return {
      id: doc.id,
      uid,
      amount,
      note,
      categoryId,
      type,
      walletId,
      displayDate: convertToTimestamp(displayDate),
      createAt: convertToTimestamp(createAt),
      updateAt: convertToTimestamp(updateAt),
    };
  });
});

export const createTransaction = createAsyncThunk<
  void,
  ICreateTransaction & { uid: string; wallet: IWallet }
>("transactions/createTransaction", async (transaction) => {
  const {
    amount,
    note = "",
    categoryId,
    type,
    date,
    uid,
    wallet,
  } = transaction;

  const batch = writeBatch(db);
  batch.set(doc(transactionRef), {
    uid,
    walletId: wallet.id,
    amount,
    note,
    categoryId,
    type,
    displayDate: Timestamp.fromDate(date),
    createAt: serverTimestamp(),
    updateAt: serverTimestamp(),
  });

  let balance = wallet.balance;

  if (type === 1) {
    balance += amount;
  } else {
    balance -= amount;
  }

  batch.update(doc(walletRef, wallet.id), {
    balance,
    updateAt: serverTimestamp(),
  });

  await batch.commit();
});

interface IUpdateTransaction {
  id: string;
  amount: number;
  note: string;
  categoryId: string;
  type: number;
  date: Date;
  wallet: IWallet;
  changed: number;
}
export const updateTransaction = createAsyncThunk<void, IUpdateTransaction>(
  "transactions/updateTransaction",
  async (args) => {
    const { id, amount, note, categoryId, type, date, wallet, changed } = args;
    const batch = writeBatch(db);
    batch.update(doc(transactionRef, id), {
      amount,
      note,
      categoryId,
      type,
      displayDate: Timestamp.fromDate(date),
      updateAt: serverTimestamp(),
    });
    batch.update(doc(walletRef, wallet.id), {
      balance: changed,
      updateAt: serverTimestamp(),
    });
    await batch.commit();
  }
);

export const deleteTransaction = createAsyncThunk<
  void,
  { txnId: string; balance: number; wallet: IWallet }
>("transactions/deleteTransaction", async ({ txnId, balance, wallet }) => {
  const batch = writeBatch(db);
  batch.update(doc(walletRef, wallet.id), {
    balance: balance,
    updateAt: serverTimestamp(),
  });
  batch.delete(doc(transactionRef, txnId));
  await batch.commit();
});

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<ITransaction[]>) => {
      state.transactions = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.transactions = [];
        state.isLoading = false;
        console.error(action.error.message);
      })
      .addCase(createTransaction.rejected, (_state, action) => {
        console.error(action.error.message);
      })
      .addCase(updateTransaction.rejected, (_state, action) => {
        console.error(action.error.message);
      })
      .addCase(deleteTransaction.rejected, (_state, action) => {
        console.error(action.error.message);
      });
  },
});

export const { setTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
