import Router from "next/router";
import { useState, useEffect } from "react";
import { LoadingProgress } from "../Posts/Page/pageStyled";

export const RouteIndicator = () => {
  const [loading, setLoading] = useState(false);

  const onLoad = () => setLoading(true);
  const onDone = () => {
    setLoading(false);
  };

  useEffect(() => {
    Router.events.on("routeChangeStart", onLoad);
    Router.events.on("routeChangeComplete", onDone);
    Router.events.on("routeChangeError", onDone);

    return () => {
      Router.events.off("routeChangeStart", onLoad);
      Router.events.off("routeChangeComplete", onDone);
      Router.events.off("routeChangeError", onDone);
    };
  });

  useEffect(() => {}, [loading]);

  return <>{loading && <LoadingProgress />}</>;
};
