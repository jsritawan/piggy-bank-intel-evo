import { Box, List, ListItemButton, Stack } from "@mui/material";
import { useState } from "react";
import { SettingCategory, SettingWallet } from "../components/Settings";

const Settings = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <SettingWallet />;
      case 1:
        return <SettingCategory />;
      default:
        return null;
    }
  };

  const handleSelectTab = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: 1,
        p: 1,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Stack direction="row" py="16px">
        <Box
          px="16px"
          sx={{
            borderRight: "1px solid #e3e3e3",
          }}
        >
          <List disablePadding>
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={() => handleSelectTab(0)}
              sx={{
                borderRadius: 1,
              }}
            >
              ตั้งค่ากระเป๋าสตางค์
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 1}
              onClick={() => handleSelectTab(1)}
              sx={{
                borderRadius: 1,
              }}
            >
              ตั้งค่าหมวดหมู่
            </ListItemButton>
          </List>
        </Box>
        <Box px="16px" flex="1">
          {renderContent()}
        </Box>
      </Stack>
    </Box>
  );
};

export default Settings;
