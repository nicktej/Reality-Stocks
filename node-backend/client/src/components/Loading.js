import React from "react";
import { CircularProgress, LinearProgress } from "@material-ui/core";

export default props => (
    <div className={"loading" + (props.fullScreen ? " loading-fs" : "")}>
        {/* <LinearProgress variant="query" color="blue" /> */}
        <CircularProgress size={120} />
    </div>
);