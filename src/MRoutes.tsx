import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { useAccount } from 'wagmi';
import { NavbarDesktop, NavbarMobile } from '@components/Navigation';
import { useNavigate } from 'react-router-dom';

const Burn = React.lazy(() => import('@pages/Main/Burn'));
const Claim = React.lazy(() => import('@pages/Main/Claim'));
const CoinInventory = React.lazy(
    () => import('@pages/Administrative/Chive/CoinInventory')
);
const Collect = React.lazy(() => import('@pages/Collect/Collect'));
const Gleam = React.lazy(() => import('@pages/Main/Gleam'));
const Listings = React.lazy(() => import('@pages/Main/Listing'));
const Trades = React.lazy(() => import('@pages/Main/Trades'));
const Merch = React.lazy(() => import('@pages/Main/Merch'));
const Login = React.lazy(() => import('@pages/Main/Login'));
const Media = React.lazy(() => import('@pages/Main/Media'));
const OpenEdition = React.lazy(() => import('@pages/Drops/OpenEdition'));
const Home = React.lazy(() => import('@pages/Main/Home'));
const Transfer = React.lazy(() => import('@pages/Main/Transfer'));
const Unclaimed = React.lazy(() => import('@pages/Main/Unclaimed'));
const ViewContracts = React.lazy(
    () => import('@pages/Administrative/Venkman/ViewContracts')
);

const MRoutes = () => {
    const navigate = useNavigate();
    const project = useSelector((state: RootState) => state.project.name);
    const messageSigned = useSelector(
        (state: RootState) => state.project.messageSigned
    );
    const { isConnected, isDisconnected, address, status } = useAccount();

    return (
        <div className={'h-full'}>
            {isConnected && messageSigned && window.innerWidth > 768 ? (
                <NavbarDesktop />
            ) : (
                <NavbarMobile />
            )}
            <Routes>
                <Route
                    path={'/'}
                    element={
                        <Suspense>
                            <Login />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Login'}
                    element={
                        <Suspense>
                            <Login />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Transfer'}
                    element={
                        <Suspense>
                            <Transfer />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Home'}
                    element={
                        <Suspense>
                            <Home />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Media'}
                    element={
                        <Suspense>
                            <Media />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Claim'}
                    element={
                        <Suspense>
                            <Claim />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Burn'}
                    element={
                        <Suspense>
                            <Burn />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Collect'}
                    element={
                        <Suspense>
                            <Collect />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Collect/:dropSymbol'}
                    element={
                        <Suspense>
                            <Collect />
                        </Suspense>
                    }
                />
                <Route
                    path={'/CoinInventory'}
                    element={
                        <Suspense>
                            <CoinInventory />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Unclaimed'}
                    element={
                        <Suspense>
                            <Unclaimed />
                        </Suspense>
                    }
                />
                <Route
                    path={'/ViewContracts'}
                    element={
                        <Suspense>
                            <ViewContracts />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Giveaway'}
                    element={
                        <Suspense>
                            <Gleam isOpen={true} />
                        </Suspense>
                    }
                />
                {/*<Route path={'/ProfilePage'} element={<ProfilePage />} />*/}
                <Route
                    path={'/OpenEdition'}
                    element={
                        <Suspense>
                            <OpenEdition />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Listing'}
                    element={
                        <Suspense>
                            <Listings />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Trades'}
                    element={
                        <Suspense>
                            <Trades />
                        </Suspense>
                    }
                />
                <Route
                    path={'/Merch'}
                    element={
                        <Suspense>
                            <Merch />
                        </Suspense>
                    }
                />
            </Routes>
        </div>
    );
};

export default MRoutes;
