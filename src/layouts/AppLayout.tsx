import { Box, Container } from "@mui/material";
import { getDocs, query, Timestamp, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Header from "../components/Header/Header";
import { fetchMasCatColors } from "../features/master/master-slice";
import { IWallet, setWallet } from "../features/wallets/wallets-slice";
import { walletRef } from "../firebase";

const AppLayout = () => {
  const { authenticated, uid } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMasCatColors());
    if (uid) {
      getDocs(query(walletRef, where("uid", "==", uid))).then((snapshot) => {
        const wallets: IWallet[] = snapshot.docs.map((d) => {
          const { balance, name, createAt, updateAt } = d.data();
          return {
            id: d.id,
            uid,
            balance,
            name,
            default: d.data().default,
            createAt: createAt ? (createAt as Timestamp).valueOf() : "",
            updateAt: updateAt ? (updateAt as Timestamp).valueOf() : "",
          };
        });
        dispatch(setWallet(wallets));
      });
    }
  }, [dispatch, uid]);

  if (!authenticated) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <Box>
      <Header />
      <Container maxWidth="md" sx={{ mt: "40px" }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default AppLayout;
