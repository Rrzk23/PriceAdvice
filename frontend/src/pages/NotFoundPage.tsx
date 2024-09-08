import { Alert } from "@mui/material";
import React from "react";
const NotFoundPage = () => {
    return (
        <Alert variant="outlined" severity="info" onClose={() => {}}>
          Woops 404 not found
        </Alert>
    )
};
 export default NotFoundPage;
