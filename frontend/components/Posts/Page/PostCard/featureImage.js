import fetch from 'isomorphic-unfetch'
import React, { Component, Children, useEffect, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import styled from 'styled-components'
import API from '../../../../api'

function FeatureImage({featureImgUrl}) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {

    }, [loading]);

    return (
        <>
            <img
                src={API.url + featureImgUrl}
                onLoad={() => setLoading(false)}
            />
            {loading && <LinearProgress />}
        </>
    )

}

export default FeatureImage;
