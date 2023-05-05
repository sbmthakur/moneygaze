import React from "react";
import MySideBar from "./MySideBar";
import MyTopBar from "./MyTopBar";
import { ScrollToTop } from "./ScrollToTop";
import { useRouter } from "next/router";

const Layout = (props) => {
  const router = useRouter();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {router.pathname !== "/login" &&
        router.pathname !== "/signup" &&
        router.pathname !== "/" && <MySideBar />}

      <div style={{ height: "100%", width: "100%" }}>
        <main>
          <MyTopBar />
          {props.children}
          <ScrollToTop />
        </main>
      </div>
    </div>
  );
};

export default Layout;
