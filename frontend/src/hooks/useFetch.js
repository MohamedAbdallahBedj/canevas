import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';

const useFetch = (url, method = 'GET', searchParams = {}) => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            let fetchUrl = url;

            if (method === 'GET' && Object.keys(searchParams).length > 0) {
                const searchParamsString = new URLSearchParams(searchParams).toString();
                fetchUrl = `${url}?${searchParamsString}`;
            }

            const response = await axios({
                method,
                url: fetchUrl,
                withCredentials: true,
                data: method !== 'GET' ? searchParams : {},
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'json', // default

            });

            const responseData = await response.data;
            setData(responseData);
        } catch (error) {
            setError(error);
            toast.error(error.response.statusText, {
                autoClose: 2000,
                hideProgressBar: true,
            });
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetchData(signal);
        const reason = new DOMException('cleaning up', 'AbortError');
        return () => controller.abort(reason);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, method, JSON.stringify(searchParams)]);

    const refetch = () => {
        fetchData();
    };

    return { data, loading, error, refetch };
};

export default useFetch;
