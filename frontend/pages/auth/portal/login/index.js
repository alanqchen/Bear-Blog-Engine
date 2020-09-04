import Router from "next/router";
import { useState, useEffect } from "react";
import Particles from "react-particles-js";
import Layout from "../../../../components/PublicLayout/publicLayout";
import {
  StyledLoginPaper,
  LoginPaperWrapper,
} from "../../../../components/Login/loginStyled";
import fetch from "isomorphic-unfetch";
import LoginForm from "../../../../components/Login/loginForm";
import SetupForm from "../../../../components/Login/setupForm";
import StarParticles from "../../../../components/Theme/particles.json";

const Index = ({ data }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("bearpost.JWT");
    const refresh = localStorage.getItem("bearpost.REFRESH");
    if (token && refresh && !data.setup) {
      Router.push("/auth/portal/dashboard");
    } else {
      setLoaded(true);
    }
  }, []);

  return (
    <>
      {loaded && (
        <Particles
          params={StarParticles}
          style={{ position: "absolute", top: 0 }}
        />
      )}
      <Layout>
        <LoginPaperWrapper>
          <StyledLoginPaper>
            {data.setup ? <SetupForm /> : <LoginForm />}
          </StyledLoginPaper>
        </LoginPaperWrapper>
      </Layout>
    </>
  );
};

async function getSetup() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`);
  const users = await res.json();
  const errorCode = users.status > 200 ? users.status : false;
  if (errorCode || (users.data && users.data.length !== 0)) {
    return {
      data: {
        errorCode: errorCode,
        setup: false,
      },
    };
  }

  return {
    data: {
      errorCode: errorCode,
      setup: true,
    },
  };
}

export async function getServerSideProps() {
  return {
    props: {
      ...(await getSetup()),
    },
  };
}

export default Index;
