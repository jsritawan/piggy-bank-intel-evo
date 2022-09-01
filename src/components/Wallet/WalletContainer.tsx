import {
  AccountBalanceWallet,
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  Fade,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setDialog } from "../../features/dialog/dialog-slice";
import { IWallet, setWallets } from "../../features/wallets/wallets-slice";
import { db, walletRef } from "../../firebase";

const WalletContainer = () => {
  const wallets = useAppSelector((state) => state.walletState.wallets);
  const { uid } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [listWallet, setListWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null);

  const handleSelectWallet = async (
    newDefaultId: string,
    oldDefaultId?: string
  ) => {
    const batch = writeBatch(db);

    if (oldDefaultId) {
      batch.update(doc(walletRef, oldDefaultId), {
        isDefault: false,
        updateAt: serverTimestamp(),
      });
    }

    batch.update(doc(walletRef, newDefaultId), {
      isDefault: true,
      updateAt: serverTimestamp(),
    });

    await batch.commit();
    const snapshot = await getDocs(query(walletRef, where("uid", "==", uid)));
    const wallets: IWallet[] = snapshot.docs.map((d) => {
      const { balance, name, createAt, updateAt, isDefault } = d.data();
      return {
        id: d.id,
        uid,
        balance,
        name,
        isDefault: isDefault,
        createAt: createAt ? (createAt as Timestamp).toDate().toString() : "",
        updateAt: updateAt ? (updateAt as Timestamp).toDate().toString() : "",
      };
    });
    dispatch(setWallets(wallets));
    setListWallet(false);
  };

  useEffect(() => {
    const wallet = wallets.find((w) => w.isDefault);
    if (wallet) {
      setSelectedWallet(wallet);
    }
  }, [wallets]);

  return (
    <Stack spacing={2}>
      <Stack
        direction={"row"}
        justifyContent={selectedWallet ? "space-between" : "end"}
        alignItems={"center"}
      >
        {selectedWallet && (
          <Button
            variant="text"
            onClick={() => setListWallet(!listWallet)}
            sx={{
              textTransform: "none",
              maxWidth: "260px",
              bgcolor: "#fff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <AccountBalanceWallet
              sx={{
                color: "gray",
              }}
            />

            <Typography variant="body1" textOverflow={"ellipsis"} noWrap mx={1}>
              {selectedWallet.name}
            </Typography>

            {listWallet ? <ArrowDropUp /> : <ArrowDropDown />}
          </Button>
        )}

        {wallets.length < 6 && (
          <Button
            variant="contained"
            onClick={() =>
              dispatch(setDialog({ name: "openCreateWallet", open: true }))
            }
          >
            เพิ่มกระเป๋าสตางค์
          </Button>
        )}
      </Stack>

      <Fade unmountOnExit in={listWallet}>
        <Box>
          <Grid container spacing={4}>
            {wallets.map((w) => (
              <Fade key={w.id} in>
                <Grid item md={4} xs={6}>
                  <ButtonBase
                    sx={{
                      p: 0,
                      width: "100%",
                      borderRadius: 1,
                      overflow: "clip",
                      bgcolor: "#fff",
                      borderStyle: "solid",
                      borderWidth: "2px",
                      borderColor: w.isDefault
                        ? alpha("#0BA5E1", 0.4)
                        : "transparent",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
                      "&:hover": {
                        bgcolor: alpha("#fff", 0.4),
                      },
                    }}
                    onClick={() => handleSelectWallet(w.id, selectedWallet?.id)}
                  >
                    <Stack
                      sx={{
                        p: 2,
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="h5" textOverflow={"ellipsis"} noWrap>
                        {w.name}
                      </Typography>
                      <Typography variant="caption" color="grey">
                        balance
                      </Typography>
                      <Typography
                        variant="h4"
                        color={w.balance >= 0 ? "#4BBEEA" : "error"}
                        textOverflow={"ellipsis"}
                        noWrap
                      >
                        {w.balance.toFixed(2)}
                      </Typography>
                    </Stack>
                  </ButtonBase>
                </Grid>
              </Fade>
            ))}
          </Grid>
        </Box>
      </Fade>
    </Stack>
  );
};

export default WalletContainer;
