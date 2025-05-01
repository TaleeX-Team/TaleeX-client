import React from 'react';
import Spline from '@splinetool/react-spline';

export default function SplineComponent() {
    return (
        <div style={{ width: '100%', height: '35vh' }}>
            <Spline
                scene="https://prod.spline.design/D3dEy7pp5EzFTt0E/scene.splinecode"
            />
        </div>
    );
}