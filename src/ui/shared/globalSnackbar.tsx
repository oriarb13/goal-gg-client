import { Alert, Snackbar } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { hideSnackBar } from "@/store/slices/snackBarSlice";

const GlobalSnackBar = () => {
  const dispatch = useAppDispatch();
  const { show, message, severity } = useAppSelector((state) => state.snackBar);

  const handleClose = () => {
    dispatch(hideSnackBar());
  };

  return (
    <Snackbar
      open={show}
      onClick={handleClose}
      onClose={handleClose}
      style={{
        boxShadow: "0px 4px 25px 0px rgba(0, 0, 0, 0.25)",
      }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      autoHideDuration={8000}
    >
      <Alert severity={severity}>
        <div
          style={{
            font:
              severity === "error"
                ? "normal bold normal 20px/22px Rubik"
                : "normal normal normal 16px/20px Rubik",
          }}
        >
          {message}
        </div>
      </Alert>
    </Snackbar>
  );
};

export { GlobalSnackBar };
