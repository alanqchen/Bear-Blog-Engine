import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/DashboardLayout/dashboardLayout';

const Index = ({ auth, dispatch }) => {
    return (
        <Layout disabledCategory={"Posts"}>
            <h1>You're logged in!</h1>
        </Layout>
    );
};

export default Index;
