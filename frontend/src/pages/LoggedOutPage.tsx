import { Alert } from "@mui/material";
import React from "react";

const LoggedOutPage = () => {

    return (
        <Alert variant="outlined" severity="info" onClose={() => {}}>
        Logged Out
      </Alert>
    )
}

export default LoggedOutPage;