import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { th } from "date-fns/locale";
import { getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { isEmpty } from "lodash";
import {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppSelector } from "../../app/hooks";
import { transactionRef } from "../../firebase";

const SettingExportCSV = () => {
  const wallets = useAppSelector((state) => state.walletState.wallets);
  const categories = useAppSelector((state) => state.categories.categories);
  const { uid } = useAppSelector((state) => state.auth.user);

  const headers = useMemo(
    () => ["วันที่", "หมวดหมู่", "รายละเอียด", "รายรับ/รายจ่าย", "จำนวน"],
    []
  );
  const [walletId, setWalletId] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const [selectDate, setSelectDate] = useState(format(new Date(), "yyyy/M"));
  const [isLoading, setLoading] = useState(false);
  const categoryMapRef = useRef<Map<string, string>>(new Map());

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isEmpty(value)) {
      return;
    }
    setSelectDate(value);
  };

  const handleWalletChange = (event: ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;
    if (isEmpty(id)) {
      return;
    }
    const wallet = wallets.find((w) => w.id === id);
    setWalletName(wallet?.name ?? "");
    setWalletId(id);
  };

  const fetchData = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      if (!uid) {
        return;
      }

      setLoading(true);

      const [year, month] = selectDate.split("/").map(Number);
      const date = new Date(year, month - 1);
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

      const txnData: string[][] = snapshot.docs
        .reverse()
        .map((doc): string[] => {
          const data = doc.data();
          const { amount, note, categoryId, type, displayDate } = data;
          const convertToDate = (date: any) => {
            return (date as Timestamp).toDate();
          };

          let n: number = amount;
          if (type === 2) {
            n *= -1;
          }
          return [
            format(convertToDate(displayDate), "dd/MM/yyyy"),
            categoryMapRef.current.get(categoryId) ?? "",
            note,
            type === 1 ? "รายรับ" : "รายจ่าย",
            n.toString(),
          ];
        });

      const rows = [headers].concat(txnData);
      const csvContent = rows.map((e) => e.join(",")).join("\n");
      const universalBOM = "\uFEFF";
      const encodedUri = encodeURI(universalBOM + csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
      link.setAttribute(
        "download",
        `รายรับรายจ่าย${walletName}เดือน${format(date, "MMMMyyyy", {
          locale: th,
        })}.csv`
      );
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categories.forEach((c) => {
      categoryMapRef.current.set(c.id, c.name);
    });
  }, [categories]);

  return (
    <div>
      <Typography>Export to CSV</Typography>
      <Divider sx={{ my: 2 }} />
      <FormControl>
        <FormLabel>เลือกกระเป๋า</FormLabel>
        <RadioGroup row value={walletId} onChange={handleWalletChange}>
          {wallets.map(({ id, name }) => (
            <FormControlLabel
              key={id}
              value={id}
              control={<Radio />}
              label={name}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {isEmpty(wallets) && (
        <Typography variant="body2" my={1}>
          ไม่มีกระเป๋า กรุณาเพิ่มกระเป๋า
        </Typography>
      )}
      <FormControl>
        <FormLabel>เลือกเดือน</FormLabel>
        <RadioGroup row value={selectDate} onChange={handleChange}>
          {eachMonthOfInterval({
            start: subMonths(new Date(), 5),
            end: new Date(),
          })
            .reverse()
            .map((date) => (
              <FormControlLabel
                key={date.toString()}
                value={format(date, "yyyy/M")}
                control={<Radio />}
                label={format(date, "MMMM", { locale: th })}
              />
            ))}
        </RadioGroup>
      </FormControl>
      <Divider sx={{ my: 2 }} />
      <Button
        variant="contained"
        onClick={fetchData}
        disabled={isEmpty(wallets) || isEmpty(walletId) || isLoading}
      >
        Export
      </Button>
    </div>
  );
};

export default SettingExportCSV;
