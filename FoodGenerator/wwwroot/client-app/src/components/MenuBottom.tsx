import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import FeedIcon from "@mui/icons-material/Feed";
import EggIcon from "@mui/icons-material/Egg";

export function MeunBottom({
  generate,
  setIsFoodGridopen,
  setIsIngredientsGridOpen,
  handleCreateList,
}: {
  generate: () => void;
  setIsFoodGridopen: (value: boolean) => void;
  setIsIngredientsGridOpen: (value: boolean) => void;
  handleCreateList: () => void;
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <BottomNavigation showLabels>
        <BottomNavigationAction
          label="Generuj"
          onClick={generate}
          icon={<LoopIcon />}
        />
        <BottomNavigationAction
          onClick={() => setIsFoodGridopen(true)}
          label="Posiłki"
          icon={<DinnerDiningIcon />}
        />
        <BottomNavigationAction
          onClick={() => setIsIngredientsGridOpen(true)}
          label="Składniki"
          icon={<EggIcon />}
        />
        <BottomNavigationAction
          onClick={handleCreateList}
          label="Lista zakupów"
          icon={<FeedIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
