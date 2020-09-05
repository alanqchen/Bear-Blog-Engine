import { useEffect, useState } from "react";
import { Divider } from "@material-ui/core";
import { Visibility as VisibilityIcon } from "@material-ui/icons";
import Layout from "../../../../../components/DashboardLayout/dashboardLayout";
import { WidthWrapper } from "../../../../../components/DashboardLayout/dashboardLayoutStyled";
import Editor from "../../../../../components/Editor/Editor";
import { StyledFab } from "../../../../../components/Editor/EditorStyled";
import MetaForm from "../../../../../components/Editor/MetaForm";

const Index = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedPath = localStorage.getItem("bearpost.savePath");
    if (savedPath && savedPath === "/") {
      const savedText = localStorage.getItem("bearpost.saved");
      console.log(savedText);
      if (savedText) {
        setEditorValue(savedText);
      }
      console.log("setting");
    }
    localStorage.setItem("bearpost.savePath", "/");
    setLoaded(true);
  }, []);

  return (
    <Layout>
      <StyledFab
        aria-label="preview"
        onClick={() => {
          setIsPreview(!isPreview);
        }}
      >
        <VisibilityIcon color="action" />
      </StyledFab>
      <MetaForm />
      <WidthWrapper>
        <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
        {loaded && (
          <Editor defaultValue={editorValue} isPreview={isPreview} isNew />
        )}
        <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      </WidthWrapper>
    </Layout>
  );
};

export default Index;
