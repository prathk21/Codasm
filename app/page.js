// pages/home.js

import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('@/app/home/page'), { ssr: false });

export default HomePage;
