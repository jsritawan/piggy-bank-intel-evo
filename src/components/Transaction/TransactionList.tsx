import { format } from "date-fns";
import { th } from "date-fns/locale";
import React, { useEffect, useState } from "react";

interface ITxn {
  date: string;
  type: number;
  note: string;
  amount: number;
}
const TransactionList = () => {
  const [txnList, setTxnList] = useState<ITxn[]>([
    {
      date: "Thu Aug 04 2022 16:40:26 GMT+0700 (Indochina Time)",
      type: 2,
      note: "adsdsdds",
      amount: 100,
    },
    {
      date: "Thu Aug 04 2022 16:40:26 GMT+0700 (Indochina Time)",
      type: 2,
      note: "ddd",
      amount: 300,
    },
    {
      date: "Thu Aug 01 2022 16:40:26 GMT+0700 (Indochina Time)",
      type: 1,
      note: "adsdsdds",
      amount: 100,
    },
  ]);

  const [txnMap, setTxnMap] = useState<Map<string, ITxn[]>>(new Map());

  useEffect(() => {
    if (!Array.isArray(txnList)) {
      return;
    }
    const map = new Map<string, ITxn[]>();
    for (let i = 0; i < txnList.length; i++) {
      const t = txnList[i];
      const date = format(new Date(t.date), "dd MMM yyyy", { locale: th });
      const list = map.get(date) || [];
      list.push(t);
      map.set(date, list);
    }

    setTxnMap(map);
  }, [txnList]);

  return <div>TransactionList</div>;
};

export default TransactionList;
