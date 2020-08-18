import { useRouter } from 'next/router';
import { Fab, Typography, Divider, Button, Icon } from '@material-ui/core';
import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
} from '@material-ui/icons';
import { StyledFab, EditorButtonGroupWrapper, EditorButton, EditorButtonOutlined } from '../../../../../../components/Editor/EditorStyled';
import Layout from '../../../../../../../../components/DashboardLayout/dashboardLayout';

const Index = ({ auth, dispatch }) => {

    const router = useRouter();
    const { year, month, slug } = router.query;

    const fetchPost = async() => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${year}/${month}/${slug}`)
        .then(res => res.json())
        .then(async(json) => {
            if(json.success) {
                setShowError(false);
                setMsg("Found post!");
                setOpen(true);
            } else {
                setErrMsg(json.message);
                setShowError(true);
            }
        })
        .catch(error => {
            setErrMsg("Failed to get post");
            setShowError(true);
            console.log(error);
        });
    }

    return (
        <Layout selectedCategory={"None"}>
            <EditorButtonGroupWrapper>
                <EditorButtonOutlined
                    variant="outlined"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    type="danger"
                >
                    Delete
                </EditorButtonOutlined>
                <EditorButton
                    variant="contained"
                    color="secondary"
                    startIcon={<SaveIcon />}
                >
                    Save
                </EditorButton>
                <EditorButton
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUploadIcon />}
                    type="publish"
                >
                    Publish
                </EditorButton>
            </EditorButtonGroupWrapper>
            <h1>Post</h1>
        </Layout>
    );
};

export default Index;
