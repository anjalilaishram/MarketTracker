
// frontend/src/pages/_app.tsx

import "../styles/global.css";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => (
    <Provider store={store}>
        <Component {...pageProps} />
    </Provider>
);

export default MyApp;

