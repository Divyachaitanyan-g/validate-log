import React, { useContext } from "react";
import { Usercontext } from "./Usercontext";

function Dashboard(props) {
  let userContext = useContext(Usercontext);
  console.log(userContext);

  return (
    <div>
      <h5 style={{ color: "orange" }}>
        Welcome,{userContext.user.CurrentUsername}!
      </h5>
    </div>
  );
}
export default Dashboard;
